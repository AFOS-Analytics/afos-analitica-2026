'use client';

import { useTranslation } from '../i18n/context';

interface ModalAboutProps {
  show: boolean;
  onClose: () => void;
}

export function ModalAbout({ show, onClose }: ModalAboutProps) {
  const { t } = useTranslation();
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-label="Sobre o AFOS Analytics" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="bg-primary text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-xl font-bold">{t('modal.aboutTitle')}</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none focus:outline-2 focus:outline-white" aria-label={t('common.close')}>✕</button>
        </div>
            <div className="p-6 sm:p-8 space-y-6 text-base text-dark leading-relaxed max-h-[75vh] overflow-y-auto">

              <div>
                <h3 className="font-bold text-lg text-primary mb-2">{t('about.whoWeAre')}</h3>
                <p className="mb-2">O <strong>AFOS-Analytics</strong> é uma plataforma global de <strong>inteligência eleitoral em tempo real</strong>.</p>
                <p className="mb-2">Monitoramos eleições no mundo inteiro e transformamos dados complexos em informação clara, objetiva e acionável.</p>
                <p className="mb-2">Fazemos isso combinando, em um único ambiente:</p>
                <ul className="text-sm space-y-1.5 text-dark ml-4">
                  <li>• mercados internacionais de previsão com dinheiro real (como Polymarket)</li>
                  <li>• pesquisas de opinião eleitoral tradicionais</li>
                  <li>• notícias da grande imprensa</li>
                  <li>• sinais e sentimento das redes sociais</li>
                  <li>• análises estratégicas geradas com inteligência artificial</li>
                </ul>
                <p className="mt-3 text-sm text-dark-secondary">Tudo integrado em um painel simples, acessível e atualizado continuamente — no celular ou no computador.</p>
              </div>

              <div>
                <h3 className="font-bold text-primary mb-2">{t('about.whatFor')}</h3>
                <p className="mb-3 text-sm italic text-dark-secondary">O AFOS-Analytics existe para responder uma pergunta simples:</p>
                <blockquote className="border-l-4 border-primary pl-4 mb-3 text-base font-semibold text-primary">O que realmente está acontecendo na eleição?</blockquote>
                <p className="mb-2 text-sm text-dark-secondary">Com ele, você consegue:</p>
                <ul className="text-sm space-y-1.5 text-dark ml-4">
                  <li>• acompanhar a corrida eleitoral em tempo real — quem lidera, quem cresce, quem perde força</li>
                  <li>• ver onde o dinheiro está posicionado — não apenas opinião, mas apostas reais</li>
                  <li>• comparar pesquisas vs mercado — o que as pessoas dizem vs o que o mundo aposta</li>
                  <li>• monitorar eventos e escândalos — e seu impacto direto na eleição</li>
                  <li>• entender o sentimento popular — nas redes e na mídia</li>
                  <li>• tomar decisões mais informadas, com base em dados</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-primary mb-3">{t('about.howToUse')}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-light-bg rounded-lg p-4 border border-light-border">
                    <h4 className="font-bold text-base text-primary mb-2">{t('about.voterTitle')}</h4>
                    <ul className="text-sm space-y-1.5 text-dark">
                      <li>• veja todos os candidatos em um só lugar</li>
                      <li>• compare pesquisas tradicionais com mercados de previsão</li>
                      <li>• entenda forças, fraquezas e contexto de cada candidato</li>
                      <li>• acompanhe eventos relevantes e decida com mais clareza</li>
                    </ul>
                  </div>

                  <div className="bg-light-bg rounded-lg p-4 border border-light-border">
                    <h4 className="font-bold text-base text-primary mb-2">{t('about.investorTitle')}</h4>
                    <ul className="text-sm space-y-1.5 text-dark">
                      <li>• antecipe cenários políticos que impactam o mercado</li>
                      <li>• use mercados de previsão como indicador antecipado</li>
                      <li>• entenda como crises e eventos influenciam resultados eleitorais</li>
                      <li>• acompanhe sinais econômicos precificados pelo mercado</li>
                    </ul>
                  </div>

                  <div className="bg-light-bg rounded-lg p-4 border border-light-border">
                    <h4 className="font-bold text-base text-primary mb-2">{t('about.analystTitle')}</h4>
                    <ul className="text-sm space-y-1.5 text-dark">
                      <li>• acesse dados consolidados de múltiplas fontes</li>
                      <li>• acompanhe notícias em tempo real</li>
                      <li>• utilize um cruzamento único: pesquisas × mercados × narrativa</li>
                      <li>• produza análises com mais profundidade e precisão</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-primary mb-2">{t('about.updatesTitle')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-light-bg rounded-lg p-3 border border-light-border text-sm text-dark">
                    <span className="font-bold text-primary">📊 Mercados de previsão</span> — atualizados continuamente
                  </div>
                  <div className="bg-light-bg rounded-lg p-3 border border-light-border text-sm text-dark">
                    <span className="font-bold text-primary">📰 Notícias</span> — atualização constante de múltiplas fontes
                  </div>
                  <div className="bg-light-bg rounded-lg p-3 border border-light-border text-sm text-dark">
                    <span className="font-bold text-primary">🔬 Análises</span> — recalculadas automaticamente com novos dados
                  </div>
                  <div className="bg-light-bg rounded-lg p-3 border border-light-border text-sm text-dark">
                    <span className="font-bold text-primary">📋 Pesquisas</span> — atualizadas sempre que novos dados são publicados
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-primary mb-2">{t('about.dashboardTitle')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-sm text-dark">
                  <div className="bg-light-bg rounded p-3 border border-light-border">💰 <strong>Odds de mercados de previsão</strong> (dinheiro real)</div>
                  <div className="bg-light-bg rounded p-3 border border-light-border">📋 <strong>Pesquisas eleitorais</strong> de múltiplos institutos</div>
                  <div className="bg-light-bg rounded p-3 border border-light-border">🔬 <strong>Análises estratégicas</strong> — forças e fraquezas dos candidatos</div>
                  <div className="bg-light-bg rounded p-3 border border-light-border">👤 <strong>Perfil dos candidatos</strong> — visão completa</div>
                  <div className="bg-light-bg rounded p-3 border border-light-border">📰 <strong>Notícias ao vivo</strong> — organizadas por relevância</div>
                  <div className="bg-light-bg rounded p-3 border border-light-border">📡 <strong>Sentimento popular</strong> — redes sociais e opinião pública</div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h3 className="font-bold text-primary mb-2">{t('about.differentialTitle')}</h3>
                <p className="text-sm mb-2 text-dark">O AFOS-Analytics é uma plataforma única que conecta, no mesmo lugar:</p>
                <ul className="text-sm space-y-1 text-dark ml-4">
                  <li>• o que as pessoas dizem (pesquisas)</li>
                  <li>• o que o mercado acredita (apostas reais)</li>
                  <li>• o que está sendo narrado (mídia)</li>
                  <li>• o que está sendo sentido (redes sociais)</li>
                </ul>
                <p className="text-sm mt-3 text-dark">Isso permite enxergar a eleição por múltiplas perspectivas — e não depender de uma única fonte.</p>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5">
                <h3 className="font-bold text-primary text-lg mb-2 text-center">{t('about.globalTitle')}</h3>
                <p className="text-sm text-dark-secondary mb-3 text-center">Começamos com validação prática, mas o objetivo é maior:</p>
                <blockquote className="border-l-4 border-primary pl-4 mb-4 text-sm font-semibold text-primary">Acompanhar eleições no mundo inteiro e criar uma nova forma de entender risco político em escala global</blockquote>
                <p className="text-sm text-dark mb-2">Não é só uma eleição. É um sistema feito para:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  <div className="bg-white rounded-lg p-2 shadow-sm text-center text-sm font-semibold text-dark">Brasil</div>
                  <div className="bg-white rounded-lg p-2 shadow-sm text-center text-sm font-semibold text-dark">Estados Unidos</div>
                  <div className="bg-white rounded-lg p-2 shadow-sm text-center text-sm font-semibold text-dark">Europa</div>
                  <div className="bg-white rounded-lg p-2 shadow-sm text-center text-sm font-semibold text-dark">Qualquer país</div>
                </div>
                <p className="text-sm text-dark-secondary text-center italic">Onde houver eleição, existe sinal. Onde existe sinal, o AFOS-Analytics lê.</p>
              </div>

              <div className="bg-light-bg border border-light-border rounded-lg p-4">
                <h3 className="font-bold text-primary mb-2">{t('about.openSourceTitle')}</h3>
                <p className="text-sm mb-2 text-dark">O AFOS-Analytics é um projeto de <strong>código aberto</strong>.</p>
                <p className="text-sm mb-2 text-dark">Acreditamos que:</p>
                <ul className="text-sm space-y-1 text-dark ml-4">
                  <li>• informação deve ser transparente</li>
                  <li>• dados devem ser verificáveis</li>
                  <li>• inteligência deve ser acessível</li>
                </ul>
                <p className="text-sm mt-2 text-dark-secondary">Qualquer pessoa pode estudar, auditar e contribuir.</p>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5 text-center">
                <h3 className="font-bold text-primary text-lg mb-3">{t('about.afosTitle')}</h3>
                <p className="text-sm text-dark-secondary mb-4">AFOS é mais do que um nome — é o que guia tudo o que fazemos:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="font-bold text-primary text-xl">A</div>
                    <div className="text-sm text-dark font-semibold">Astuteness</div>
                    <div className="text-xs text-dark-secondary mt-1">Inteligência para cruzar dados e gerar clareza</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="font-bold text-primary text-xl">F</div>
                    <div className="text-sm text-dark font-semibold">Faith</div>
                    <div className="text-xs text-dark-secondary mt-1">Confiança em informações verdadeiras e imparciais</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="font-bold text-primary text-xl">O</div>
                    <div className="text-sm text-dark font-semibold">Optimism</div>
                    <div className="text-xs text-dark-secondary mt-1">Visão de futuro baseada em inovação e transparência</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="font-bold text-primary text-xl">S</div>
                    <div className="text-sm text-dark font-semibold">Synthesis</div>
                    <div className="text-xs text-dark-secondary mt-1">Transformar dados complexos em entendimento simples</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-bold text-primary mb-2">{t('about.essenceTitle')}</h3>
                <p className="text-sm text-dark">O AFOS-Analytics não é sobre opinião.</p>
                <p className="text-base text-dark font-semibold mt-1">É sobre entender a realidade com mais precisão.</p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 text-sm text-dark-secondary font-semibold">
                <span>Gratuito</span>
                <span>•</span>
                <span>Atualizado automaticamente</span>
                <span>•</span>
                <span>Mobile e desktop</span>
              </div>
            </div>
      </div>
    </div>
  );
}
