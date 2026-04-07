'use client';

interface ModalMetasProps {
  show: boolean;
  onClose: () => void;
}

export function ModalMetas({ show, onClose }: ModalMetasProps) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Metas do AFOS Analytics" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="bg-primary text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-xl font-bold">Metas — AFOS Analytics</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none focus:outline-2 focus:outline-white" aria-label="Fechar">✕</button>
        </div>
            <div className="p-6 sm:p-8 space-y-6 text-base text-[#1a1a1a] leading-relaxed max-h-[75vh] overflow-y-auto">

              <div>
                <h3 className="font-bold text-lg text-[#0F52BA] mb-3">A TESE CENTRAL</h3>
                <p className="mb-3">Governos, empresas e investidores perdem bilhões todos os anos por decisões baseadas em informação fragmentada, enviesada ou manipulada.</p>
                <p className="mb-1 text-sm text-[#333]">Quando o eleitor vota sem dados,</p>
                <p className="mb-1 text-sm text-[#333]">quando o empresário não antecipa cenários,</p>
                <p className="mb-3 text-sm text-[#333]">quando o investidor precifica risco no escuro —</p>
                <p className="mb-3">o resultado é o mesmo: <strong>ineficiência econômica e instabilidade.</strong></p>
                <p className="mb-3">O <strong>AFOS Analytics</strong> resolve isso na origem:</p>
                <blockquote className="border-l-4 border-[#0F52BA] pl-4 text-base font-semibold text-[#0F52BA]">Transformar informação política em inteligência acionável — como infraestrutura global.</blockquote>
              </div>

              <div>
                <h3 className="font-bold text-[#0F52BA] mb-2">📈 Impacto no Crescimento Econômico</h3>
                <p className="mb-3"><strong>Previsibilidade atrai capital.</strong></p>
                <p className="mb-2">O AFOS Analytics integra:</p>
                <ul className="text-sm space-y-1.5 text-[#1a1a1a] ml-4 mb-3">
                  <li>• mercados de previsão com dinheiro real</li>
                  <li>• pesquisas eleitorais</li>
                  <li>• análise de sentimento e eventos críticos</li>
                </ul>
                <p className="text-sm text-[#333] mb-3">→ criando um <strong>termômetro de risco político em tempo real</strong></p>
                <p className="mb-2 text-sm text-[#333]">Isso permite que:</p>
                <ul className="text-sm space-y-1.5 text-[#1a1a1a] ml-4">
                  <li>• investidores globais precifiquem risco com precisão</li>
                  <li>• capital flua com mais eficiência</li>
                  <li>• volatilidade política deixe de ser imprevisível</li>
                </ul>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                <p className="font-semibold mb-3">Decisão empresarial deixa de ser reativa.</p>
                <p className="mb-2 text-sm text-[#333]">Empresas passam a operar com antecipação:</p>
                <ul className="text-sm space-y-1.5 text-[#1a1a1a] ml-4 mb-3">
                  <li>• expansão ou retração</li>
                  <li>• alocação geográfica</li>
                  <li>• gestão de risco regulatório</li>
                </ul>
                <blockquote className="border-l-4 border-[#0F52BA] pl-4 text-sm text-[#0F52BA]">
                  <p>Quem antecipa, captura valor.</p>
                  <p>Quem reage, absorve custo.</p>
                </blockquote>
              </div>

              <div>
                <h3 className="font-bold text-[#0F52BA] mb-2">Impacto no Desenvolvimento Institucional</h3>
                <p className="mb-3"><strong>Democracias mais eficientes começam com informação melhor.</strong></p>
                <p className="mb-2 text-sm text-[#333]">O AFOS Analytics:</p>
                <ul className="text-sm space-y-1.5 text-[#1a1a1a] ml-4 mb-3">
                  <li>• consolida múltiplas fontes em um único painel</li>
                  <li>• traduz complexidade em visualização simples</li>
                  <li>• oferece acesso gratuito, global e multilíngue</li>
                </ul>
                <p className="text-sm font-semibold text-[#333]">→ <strong>eleva o nível do voto e do debate público</strong></p>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                <p className="font-semibold mb-2">Educação Cívica e Financeira</p>
                <p className="text-sm text-[#333] mb-2">O produto não apenas informa — <strong>forma usuários mais sofisticados</strong>.</p>
                <p className="text-sm text-[#333] mb-2">Introduz, de forma prática:</p>
                <ul className="text-sm space-y-1.5 text-[#1a1a1a] ml-4 mb-3">
                  <li>• leitura de probabilidades e risco</li>
                  <li>• interpretação de dados conflitantes</li>
                  <li>• entendimento do impacto político na economia</li>
                </ul>
                <p className="text-sm text-[#333]">→ criando uma nova geração de cidadãos e investidores mais racionais.</p>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                <p className="font-semibold mb-2">Accountability baseada em dados</p>
                <p className="text-sm text-[#333] mb-2">Ao expor:</p>
                <ul className="text-sm space-y-1.5 text-[#1a1a1a] ml-4 mb-3">
                  <li>• probabilidades reais de eventos</li>
                  <li>• impacto de escândalos</li>
                  <li>• divergência entre discurso e expectativa de mercado</li>
                </ul>
                <p className="text-sm text-[#333]">o AFOS cria <strong>pressão objetiva por transparência</strong>.</p>
              </div>

              <div>
                <h3 className="font-bold text-[#0F52BA] mb-2">🌍 Impacto na Imagem Internacional</h3>
                <p className="mb-3"><strong>Soft power tecnológico.</strong></p>
                <p className="mb-2 text-sm text-[#333]">O AFOS Analytics posiciona qualquer país que o adote como:</p>
                <ul className="text-sm space-y-1.5 text-[#1a1a1a] ml-4 mb-3">
                  <li>• líder em transparência democrática</li>
                  <li>• referência em data-driven governance</li>
                </ul>
                <p className="mb-2 text-sm text-[#333]">Não existe hoje uma plataforma que integre, em escala global:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0] text-center text-sm font-semibold text-[#1a1a1a]">Dados eleitorais</div>
                  <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0] text-center text-sm font-semibold text-[#1a1a1a]">Mercados preditivos</div>
                  <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0] text-center text-sm font-semibold text-[#1a1a1a]">Análise de eventos críticos</div>
                  <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0] text-center text-sm font-semibold text-[#1a1a1a]">Sentimento informacional</div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#0F52BA] mb-2">🌎 Posicionamento Global</h3>
                <p className="mb-3"><strong>Não é mídia. Não é ferramenta. É infraestrutura.</strong></p>
                <p className="mb-2 text-sm text-[#333]">O AFOS Analytics se posiciona como:</p>
                <blockquote className="border-l-4 border-[#0F52BA] pl-4 mb-3 text-base font-semibold text-[#0F52BA]">camada de inteligência política para mercados globais</blockquote>
                <p className="mb-2 text-sm text-[#333]">Uma ponte direta entre:</p>
                <ul className="text-sm space-y-1.5 text-[#1a1a1a] ml-4">
                  <li>• eleitor local</li>
                  <li>• capital internacional</li>
                </ul>
                <p className="mt-2 text-sm text-[#333]">Ambos analisando o mesmo conjunto de dados.</p>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4">
                <p className="font-semibold mb-2 text-sm text-[#333]">Modelo de Valor (implícito, sem poluir a mensagem)</p>
                <p className="text-sm text-[#333] mb-2">A mesma infraestrutura que:</p>
                <ul className="text-sm space-y-1 text-[#1a1a1a] ml-4 mb-3">
                  <li>• educa cidadãos</li>
                  <li>• informa eleitores</li>
                </ul>
                <p className="text-sm text-[#333] mb-2">→ também alimenta:</p>
                <ul className="text-sm space-y-1 text-[#1a1a1a] ml-4 mb-3">
                  <li>• fundos de investimento</li>
                  <li>• bancos</li>
                  <li>• governos</li>
                  <li>• consultorias estratégicas</li>
                </ul>
                <p className="text-sm text-[#333]">com <strong>dados estruturados e APIs de inteligência política</strong></p>
              </div>

              <div>
                <h3 className="font-bold text-[#0F52BA] mb-2">🔗 Efeito Sistêmico (Cascata)</h3>
                <div className="bg-[#F8FAFC] rounded-lg p-4 text-sm space-y-3 text-[#1a1a1a]">
                  <p>Transparência → Decisão informada → Melhor representação → Políticas mais eficientes → <strong>Crescimento sustentável</strong></p>
                  <p>Previsibilidade → Investimento → Emprego → Renda → Arrecadação → <strong>Serviços públicos melhores</strong></p>
                  <p>Accountability → Menos corrupção → Melhor uso de recursos → Infraestrutura → <strong>Qualidade de vida</strong></p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#0F52BA] mb-2">Impacto Potencial</h3>
                <ul className="space-y-2 text-sm text-[#1a1a1a]">
                  <li>📱 <strong>Milhões de usuários</strong> com acesso a inteligência política</li>
                  <li>🗳️ <strong>Voto baseado em dados</strong>, não em ruído</li>
                  <li>💰 <strong>Capital global</strong> alocado com mais precisão</li>
                  <li>⚖️ <strong>Pressão contínua</strong> por transparência</li>
                  <li>🎓 <strong>Educação cívica e financeira</strong> em escala</li>
                </ul>
              </div>

              <div className="bg-[#0F52BA]/5 border border-[#0F52BA]/20 rounded-lg p-5">
                <h3 className="font-bold text-[#0F52BA] mb-3">SÍNTESE</h3>
                <p className="mb-2 text-sm text-[#1a1a1a]">O AFOS Analytics.</p>
                <blockquote className="border-l-4 border-[#0F52BA] pl-4 mb-3 text-sm font-semibold text-[#0F52BA]">É uma infraestrutura de inteligência política global.</blockquote>
                <p className="mb-3 text-sm text-[#1a1a1a]">Resolve simultaneamente:</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                    <div className="text-sm text-[#1a1a1a] font-semibold">Assimetria de informação</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                    <div className="text-sm text-[#1a1a1a] font-semibold">Incerteza política</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm text-center">
                    <div className="text-sm text-[#1a1a1a] font-semibold">Déficit de accountability</div>
                  </div>
                </div>
                <p className="text-sm text-[#333]">Enquanto forma uma base de usuários mais educados e mercados mais eficientes.</p>
              </div>

              <div>
                <h3 className="font-bold text-[#0F52BA] mb-2">POSICIONAMENTO</h3>
                <p className="mb-2 text-sm text-[#333]">Um sistema onde:</p>
                <ul className="text-sm space-y-1.5 text-[#1a1a1a] ml-4 mb-3">
                  <li>• cidadãos entendem melhor</li>
                  <li>• empresas planejam melhor</li>
                  <li>• investidores alocam melhor</li>
                </ul>
                <p className="text-sm font-semibold text-[#333]">→ <strong>é um sistema que cresce mais rápido e com mais estabilidade.</strong></p>
              </div>

              <div className="bg-gradient-to-br from-[#0F52BA]/10 to-[#0F52BA]/5 border border-[#0F52BA]/20 rounded-xl p-5 text-center">
                <p className="text-base italic text-[#0F52BA] font-semibold leading-relaxed">
                  &quot;Democracy runs on information.<br/>
                  Information runs on transparency.<br/>
                  AFOS Analytics is programmable transparency.&quot;
                </p>
              </div>

            </div>
      </div>
    </div>
  );
}
