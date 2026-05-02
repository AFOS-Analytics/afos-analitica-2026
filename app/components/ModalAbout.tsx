'use client';

import { useTranslation } from '../i18n/context';

interface ModalAboutProps {
  show: boolean;
  onClose: () => void;
}

export function ModalAbout({ show, onClose }: ModalAboutProps) {
  const { t } = useTranslation();
  if (!show) return null;

  const whoWeAreList = t('about.whoWeAreList').split(',');
  const whatForList = t('about.whatForList').split(',');
  const voterList = t('about.voterList').split(',');
  const investorList = t('about.investorList').split(',');
  const analystList = t('about.analystList').split(',');
  const dashboardItems = t('about.dashboardItems').split(',');
  const differentialList = t('about.differentialList').split(',');
  const globalCountries = t('about.globalCountries').split(',');
  const openSourceList = t('about.openSourceList').split(',');
  const footerLabels = t('about.footerLabels').split(',');

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-label={t('about.title')} onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="bg-primary text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-xl font-bold">{t('modal.aboutTitle')}</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none focus:outline-2 focus:outline-white" aria-label={t('common.close')}>✕</button>
        </div>
            <div className="p-6 sm:p-8 space-y-6 text-base text-dark leading-relaxed max-h-[75vh] overflow-y-auto">

              <div>
                <h3 className="font-bold text-lg text-primary mb-2">{t('about.whoWeAre')}</h3>
                <p className="mb-2">{t('about.whoWeAreDesc')}</p>
                <p className="mb-2">{t('about.whoWeAreDesc2')}</p>
                <p className="mb-2">{t('about.whoWeAreDesc3')}</p>
                <ul className="text-sm space-y-1.5 text-dark ml-4">
                  {whoWeAreList.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
                <p className="mt-3 text-sm text-dark-secondary">{t('about.whoWeAreFooter')}</p>
              </div>

              <div>
                <h3 className="font-bold text-primary mb-2">{t('about.whatFor')}</h3>
                <p className="mb-3 text-sm italic text-dark-secondary">{t('about.whatForIntro')}</p>
                <blockquote className="border-l-4 border-primary pl-4 mb-3 text-base font-semibold text-primary">{t('about.whatForQuestion')}</blockquote>
                <p className="mb-2 text-sm text-dark-secondary">{t('about.whatForDesc')}</p>
                <ul className="text-sm space-y-1.5 text-dark ml-4">
                  {whatForList.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-primary mb-3">{t('about.howToUse')}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-light-bg rounded-lg p-4 border border-light-border">
                    <h4 className="font-bold text-base text-primary mb-2">{t('about.voterTitle')}</h4>
                    <ul className="text-sm space-y-1.5 text-dark">
                      {voterList.map((item, i) => <li key={i}>• {item}</li>)}
                    </ul>
                  </div>
                  <div className="bg-light-bg rounded-lg p-4 border border-light-border">
                    <h4 className="font-bold text-base text-primary mb-2">{t('about.investorTitle')}</h4>
                    <ul className="text-sm space-y-1.5 text-dark">
                      {investorList.map((item, i) => <li key={i}>• {item}</li>)}
                    </ul>
                  </div>
                  <div className="bg-light-bg rounded-lg p-4 border border-light-border">
                    <h4 className="font-bold text-base text-primary mb-2">{t('about.analystTitle')}</h4>
                    <ul className="text-sm space-y-1.5 text-dark">
                      {analystList.map((item, i) => <li key={i}>• {item}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-primary mb-2">{t('about.updatesTitle')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-light-bg rounded-lg p-3 border border-light-border text-sm text-dark">
                    <span className="font-bold text-primary">📊 {t('about.updatesMarkets')}</span>, {t('about.updatesMarketsDesc')}
                  </div>
                  <div className="bg-light-bg rounded-lg p-3 border border-light-border text-sm text-dark">
                    <span className="font-bold text-primary">📰 {t('about.updatesNews')}</span>, {t('about.updatesNewsDesc')}
                  </div>
                  <div className="bg-light-bg rounded-lg p-3 border border-light-border text-sm text-dark">
                    <span className="font-bold text-primary">🔬 {t('about.updatesAnalysis')}</span>, {t('about.updatesAnalysisDesc')}
                  </div>
                  <div className="bg-light-bg rounded-lg p-3 border border-light-border text-sm text-dark">
                    <span className="font-bold text-primary">📋 {t('about.updatesPolls')}</span>, {t('about.updatesPollsDesc')}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-primary mb-2">{t('about.dashboardTitle')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-sm text-dark">
                  {dashboardItems.map((item, i) => (
                    <div key={i} className="bg-light-bg rounded p-3 border border-light-border">{item}</div>
                  ))}
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h3 className="font-bold text-primary mb-2">{t('about.differentialTitle')}</h3>
                <p className="text-sm mb-2 text-dark">{t('about.differentialDesc')}</p>
                <ul className="text-sm space-y-1 text-dark ml-4">
                  {differentialList.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
                <p className="text-sm mt-3 text-dark">{t('about.differentialFooter')}</p>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5">
                <h3 className="font-bold text-primary text-lg mb-2 text-center">{t('about.globalTitle')}</h3>
                <p className="text-sm text-dark-secondary mb-3 text-center">{t('about.globalIntro')}</p>
                <blockquote className="border-l-4 border-primary pl-4 mb-4 text-sm font-semibold text-primary">{t('about.globalQuote')}</blockquote>
                <p className="text-sm text-dark mb-2">{t('about.globalDesc')}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {globalCountries.map((c, i) => (
                    <div key={i} className="bg-white rounded-lg p-2 shadow-sm text-center text-sm font-semibold text-dark">{c}</div>
                  ))}
                </div>
                <p className="text-sm text-dark-secondary text-center italic">{t('about.globalFooter')}</p>
              </div>

              <div className="bg-light-bg border border-light-border rounded-lg p-4">
                <h3 className="font-bold text-primary mb-2">{t('about.openSourceTitle')}</h3>
                <p className="text-sm mb-2 text-dark">{t('about.openSourceDesc')}</p>
                <p className="text-sm mb-2 text-dark">{t('about.openSourceBelief')}</p>
                <ul className="text-sm space-y-1 text-dark ml-4">
                  {openSourceList.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
                <p className="text-sm mt-2 text-dark-secondary">{t('about.openSourceFooter')}</p>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5 text-center">
                <h3 className="font-bold text-primary text-lg mb-3">{t('about.afosTitle')}</h3>
                <p className="text-sm text-dark-secondary mb-4">{t('about.afosDesc')}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="font-bold text-primary text-xl">A</div>
                    <div className="text-sm text-dark font-semibold">{t('about.afosA')}</div>
                    <div className="text-xs text-dark-secondary mt-1">{t('about.afosADesc')}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="font-bold text-primary text-xl">F</div>
                    <div className="text-sm text-dark font-semibold">{t('about.afosF')}</div>
                    <div className="text-xs text-dark-secondary mt-1">{t('about.afosFDesc')}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="font-bold text-primary text-xl">O</div>
                    <div className="text-sm text-dark font-semibold">{t('about.afosO')}</div>
                    <div className="text-xs text-dark-secondary mt-1">{t('about.afosODesc')}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="font-bold text-primary text-xl">S</div>
                    <div className="text-sm text-dark font-semibold">{t('about.afosS')}</div>
                    <div className="text-xs text-dark-secondary mt-1">{t('about.afosSDesc')}</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-bold text-primary mb-2">{t('about.essenceTitle')}</h3>
                <p className="text-sm text-dark">{t('about.essenceText')}</p>
                <p className="text-base text-dark font-semibold mt-1">{t('about.essenceSubtext')}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 text-sm text-dark-secondary font-semibold">
                {footerLabels.map((label, i) => (
                  <span key={i}>{i > 0 && <span className="mr-3">•</span>}{label}</span>
                ))}
              </div>
            </div>
      </div>
    </div>
  );
}
