import type { CandidateProfile } from '../types';
import { partyColor } from '../lib/utils';
import { SectionTitle, Card } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';

const candidates: CandidateProfile[] = [
  { name: "Lula", party: "PT", age: 80, role: "Presidente da República", polymarket: "38.5%", poll: "Vox SP 2T Flávio 50.4% × 38.1% (Poder360 26/Abr) / Paraná RJ 2T 40.5% / Quaest 2T 40 mantido", position: "Centro-esquerda. Programas sociais, intervencionismo estatal. 3º mandato.", risk: "38.5% Poly (estável) — gap -0.3pp Flávio (encurta de -0.45pp). 2º lugar Poly Lula 16.5% estável. **PT LANÇA MANIFESTO 2026 com foco em soberania, AFASTA POLÊMICAS E ACENA AO CENTRO** (Correio Braziliense + Terra + G1 26/Abr) — Lula ausente do evento. **PT espera Trump declarar apoio a Flávio para fortalecer Lula** (Metrópoles 26/Abr 08:00) — narrativa estratégica. **Haddad chama Flávio 'Bolsonarinho'** (Folha 26/Abr 22:12). PT 90% infraestrutura campanha pronta (Blog Esmael 26/Abr 23:33). MAS: **VOX SP 2T ADVERSA: Flávio 50.4% × Lula 38.1% — gap 12.3pp** (Poder360 + Pleno.News + Revista Oeste 26/Abr 17:00). Pré-candidatos feira agro destacam ausência Lula (Gazeta Povo 26/Abr 23:53)." },
  { name: "Flávio Bolsonaro", party: "PL", age: 45, role: "Senador (RJ)", polymarket: "38.8%", poll: "**VOX SP 2T 50.4%** (Poder360 26/Abr) / Paraná RJ 1T 39.6% / 2T 47% / Quaest 2T 42% mantido", position: "Direita conservadora. Herdeiro político de Jair Bolsonaro. Apoia desregulamentação, redução do Estado.", risk: "38.8% Poly (↓0.15pp de 38.95%) — leve recuo, gap encurta para -0.3pp Flávio. 2º lugar 66% estável. **VOX BRASIL SP 2T ESPETACULAR: Flávio 50.4% × Lula 38.1% — gap 12.3pp** (Poder360 + Pleno.News + Sobral Online + Revista Oeste 26/Abr 17:00) — **2ª pesquisa estadual grande consecutiva favorável a Flávio** (após Paraná RJ 25/Abr). **Flávio: 'O Pix é nosso'** (Estado Minas 26/Abr 14:47) — disputa narrativa programa social. **Reforma tributária 'campo minado' para Flávio** (Folha 26/Abr 13:00) — vetor adverso. PL Senado 79.5% (↓0.5pp leve)." },
  { name: "Renan Santos", party: "Missão", age: 35, role: "Fundador do MBL", polymarket: "5.35%", poll: "4.4% 1T (AtlasIntel prev.) / N/A Quaest", position: "Direita liberal. Anti-establishment. Foco em jovens e redes sociais.", risk: "5.35% Poly (estável). 3º lugar Renan 28% × Zema 36% × **Caiado 26.5% (↓0.5pp leve devolve)** — 3 candidatos disputam mantido. STF impeach 15% (4º dia em patamar elevado). **'Empresa família Vorcaro movimentou R$1bi em possível tentativa de esconder dinheiro'** (Estado Minas 26/Abr 11:59) — escândalo escala. Comissão Senado cancela sessão Vorcaro terça (Arquivo SA 26/Abr). **'Líder oposição pede rejeição Messias no STF'** (Pleno.News 26/Abr 18:34) — narrativa anti-Corte ativa. 9º dia consecutivo sem peça pública." },
  { name: "Fernando Haddad", party: "PT", age: 63, role: "Pré-candidato Gov. SP", polymarket: "3.35%", poll: "Tarcísio lidera SP, abriria 20pp sobre Haddad em 2T (Exame 26/Abr 14:34)", position: "Centro-esquerda. Lula convenceu a disputar governo de SP. Fora da corrida presidencial.", risk: "3.35% Poly (estável). 2º lugar Poly Haddad 2.55% (↓0.05pp). 3º lugar 3.25% (↓0.15pp). PT Senado 3.6% (↓0.25pp leve). **HADDAD CHAMA FLÁVIO DE 'BOLSONARINHO'** (Folha 26/Abr 22:12) — confronto direto. **TARCÍSIO LIDERA SP, abriria 20pp sobre Haddad em 2T** (Exame 26/Abr 14:34) — adverso. **Marina + Derrite + Tebet + Do Prado empatados Senado SP** (Poder360 26/Abr 13:05) — disputa fragmentada. PT lança manifesto 2026 com 'aceno ao centro' (Terra 26/Abr 17:41)." },
  { name: "Ronaldo Caiado", party: "PSD", age: 76, role: "Ex-Gov. Goiás (renunciou 4/Abr)", polymarket: "1.8%", poll: "6% 1T (Quaest 15/Abr) / 5% (Datafolha)", position: "Centro-direita. Agronegócio, gestão fiscal. Pré-candidato oficial pelo PSD.", risk: "1.8% Poly (↓0.05pp leve). **3º lugar Poly mantém forte: 26.5% (↓0.5pp leve devolve de 27%)** — sustenta posição alta. PSD Senado RECUPERA 5.95% (↑0.2pp de 5.75%). **'Próxima Quaest gov Goiás e Senado'** (CartaCapital 26/Abr 17:52) — radar GO aquece. Caiado 'convergência' mantido (Estadão 25/Abr). 'Direita vê STF como trunfo' mantido (CartaCapital). Pré-candidatos visitam feira agro (Gazeta Povo) — Caiado naturalmente forte no setor." },
  { name: "Romeu Zema", party: "Novo", age: 56, role: "Ex-Gov. Minas Gerais (renunciou 4/Abr)", polymarket: "9.15%", poll: "3% 1T (Quaest) / 4% (Datafolha) / Primeira Quaest MG gov em digestão", position: "Direita liberal. Privatizações, estado mínimo. Gestão fiscal rigorosa em MG.", risk: "9.15% Poly (↑0.6pp de 8.55%) — recupera leve, ainda abaixo dos 10%. 3º lugar 36% (estável — mantém liderança). 2º lugar Zema 3.35% estável. STF impeach 15% estável (4º dia patamar elevado). **ZEMA PROMETE PRIVATIZAR PETROBRAS E BANCO DO BRASIL SE ELEITO** (Poder360 26/Abr 19:31) — **PROGRAMA CONCRETO INÉDITO** no ciclo, marca posição liberal forte. **'Terceira via acumula derrotas, ex-presidenciáveis se voltam para eleições estaduais'** (Folha 26/Abr 02:00 + Bahia Notícias 26/Abr 13:40) — análise estrutural pode pressionar Zema." },
  { name: "Tarcísio de Freitas", party: "Republicanos", age: 51, role: "Governador de São Paulo", polymarket: "0.25%", poll: "**TARCÍSIO LIDERA SP gov, abriria 20pp sobre Haddad em 2T (Exame 26/Abr)**", position: "Centro-direita. Infraestrutura, gestão. Ex-ministro de Bolsonaro.", risk: "0.25% Poly (estável). **TARCÍSIO LIDERA SP gov, abriria 20pp sobre Haddad em 2T** (Exame 26/Abr 14:34) — destaque do dia. **Tarcísio reforça crítica 'lideranças envelhecidas'** (GZH 26/Abr 10:42 mantido) — sem citar Lula. 'Chapa pura bolsonarismo' SP mantido. André do Prado Senado SP mantido. Marina + Derrite + Tebet + Do Prado empatados Senado SP (Poder360 26/Abr) — disputa entrando no radar nacional." },
];

export function CandidatesSection() {
  const { t } = useTranslation();
  return (
    <section>
      <SectionTitle icon="👤" rightSlot={<LogicLink anchor="perfil-candidatos" />}>{t('sections.candidates')}</SectionTitle>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map(c => (
          <Card key={c.name} className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div>
                <h4 className="font-bold text-dark">{c.name}</h4>
                <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: partyColor[c.party] || '#94A3B8' }}>{c.party}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-2">{c.role} · {c.age} {t('candidates.age')}</div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-500">Polymarket</div>
                <div className="font-bold text-primary">{c.polymarket}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-xs text-gray-500">{t('candidates.poll')}</div>
                <div className="font-bold text-dark">{c.poll}</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-2"><strong>{t('candidates.position')}:</strong> {c.position}</p>
            <p className="text-xs text-red-600"><strong>⚠️ {t('candidates.risk')}:</strong> {c.risk}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
