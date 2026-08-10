# Corrige o exit code do Git Bash criando o /etc/fstab que falta.
#
# PROBLEMA, medido em 10/Ago/2026:
#   Este Git Bash monta o C: em /cygdrive/c, e nao em /c. O invólucro que executa
#   os comandos grava um arquivo de controle num caminho /c/Users/..., que aqui
#   nao resolve. A escrita falha e TODO comando volta com exit 1, inclusive um
#   `true`. Consequencia: nenhum codigo de saida deste ambiente e confiavel, e a
#   trava de captura chegou a ser lida como bloqueio tendo aprovado.
#
# CAUSA:
#   C:\Program Files\Git\etc\fstab NAO EXISTE. E ele que, no Git para Windows,
#   move o prefixo dos discos de /cygdrive para /.
#
# PRECISA DE ADMINISTRADOR, porque escreve em C:\Program Files.
#
# ATENCAO, o efeito colateral e real:
#   Depois disto, /cygdrive/c DEIXA de resolver e /c passa a resolver.
#   Conferido em 10/Ago: nada no repositorio depende de /cygdrive. O que houver
#   FORA do repositorio (scripts pessoais, atalhos) precisa ser conferido.
#
# COMO RODAR, num PowerShell aberto como administrador:
#   powershell -ExecutionPolicy Bypass -File scripts\corrige-fstab-gitbash.ps1
#
# COMO DESFAZER:
#   Apagar C:\Program Files\Git\etc\fstab (ou restaurar o .bak que este script
#   cria, se ja existia um).

$ErrorActionPreference = 'Stop'

$fstab = 'C:\Program Files\Git\etc\fstab'
$linha = 'none / cygdrive binary,posix=0,noacl,user 0 0'

$ehAdmin = ([Security.Principal.WindowsPrincipal] `
  [Security.Principal.WindowsIdentity]::GetCurrent()
  ).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $ehAdmin) {
  Write-Host 'ERRO: rode este script num PowerShell ABERTO COMO ADMINISTRADOR.' -ForegroundColor Red
  Write-Host 'Sem isso nao da para escrever em C:\Program Files\Git\etc.'
  exit 1
}

if (Test-Path $fstab) {
  $atual = Get-Content $fstab -Raw
  if ($atual -match [regex]::Escape($linha)) {
    Write-Host 'Nada a fazer: o fstab ja tem a linha do cygdrive.' -ForegroundColor Green
    exit 0
  }
  $bak = "$fstab.bak"
  Copy-Item $fstab $bak -Force
  Write-Host "fstab ja existia. Copia de seguranca em: $bak" -ForegroundColor Yellow
  Add-Content -Path $fstab -Value $linha -Encoding ascii
} else {
  $conteudo = @"
# Configuration file for mounts
# Criado para por os discos em /c em vez de /cygdrive/c. Sem esta linha o
# invólucro do Claude Code grava em /c/... , falha, e todo comando volta exit 1.
$linha
"@
  Set-Content -Path $fstab -Value $conteudo -Encoding ascii
  Write-Host "Criado: $fstab" -ForegroundColor Green
}

Write-Host ''
Write-Host 'Feito. FECHE E REABRA o terminal, porque a tabela de montagem e lida' -ForegroundColor Cyan
Write-Host 'na abertura do shell.'
Write-Host ''
Write-Host 'COMO CONFERIR que funcionou, num Git Bash NOVO:' -ForegroundColor Cyan
Write-Host '  pwd                 # deve comecar com /c/ e nao com /cygdrive/c/'
Write-Host '  ls /c/Users >/dev/null && echo ok'
Write-Host '  true; echo $?       # deve imprimir 0, e a ferramenta deve parar'
Write-Host '                      # de reportar exit 1 em todo comando'
