'use client';

import { useTranslation } from '../i18n/context';

interface ModalMetasProps {
  show: boolean;
  onClose: () => void;
}

export function ModalMetas({ show, onClose }: ModalMetasProps) {
  const { t } = useTranslation();
  if (!show) return null;

  const centralThesisLines = t('metas.centralThesisLines').split(',');
  const economicImpactList = t('metas.economicImpactList').split(',');
  const economicImpactAllowsList = t('metas.economicImpactAllowsList').split(',');
  const businessDecisionList = t('metas.businessDecisionList').split(',');
  const institutionalImpactList = t('metas.institutionalImpactList').split(',');
  const civicEducationList = t('metas.civicEducationList').split(',');
  const accountabilityList = t('metas.accountabilityList').split(',');
  const internationalImpactList = t('metas.internationalImpactList').split(',');
  const internationalImpactItems = t('metas.internationalImpactItems').split(',');
  const globalPositioningBridgeList = t('metas.globalPositioningBridgeList').split(',');
  const valueModelEducates = t('metas.valueModelEducates').split(',');
  const valueModelFeeds = t('metas.valueModelFeeds').split(',');
  const systemicEffectChains = t('metas.systemicEffectChains').split(',');
  const potentialImpactList = t('metas.potentialImpactList').split(',');
  const synthesisItems = t('metas.synthesisItems').split(',');
  const positioningList = t('metas.positioningList').split(',');

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-label={t('metas.title')} onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="bg-primary text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-xl font-bold">{t('modal.metasTitle')}</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none focus:outline-2 focus:outline-white" aria-label={t('common.close')}>✕</button>
        </div>
            <div className="p-6 sm:p-8 space-y-6 text-base text-dark leading-relaxed max-h-[75vh] overflow-y-auto">

              <div>
                <h3 className="font-bold text-lg text-primary mb-3">{t('metas.centralThesis')}</h3>
                <p className="mb-3">{t('metas.centralThesisDesc')}</p>
                {centralThesisLines.map((line, i) => (
                  <p key={i} className="mb-1 text-sm text-dark-secondary">{line}</p>
                ))}
                <p className="mb-3 mt-2">{t('metas.centralThesisResult')}</p>
                <p className="mb-3">{t('metas.centralThesisResolution')}</p>
                <blockquote className="border-l-4 border-primary pl-4 text-base font-semibold text-primary">{t('metas.centralThesisQuote')}</blockquote>
              </div>

              <div>
                <h3 className="font-bold text-primary mb-2">📈 {t('metas.economicImpact')}</h3>
                <p className="mb-3"><strong>{t('metas.economicImpactDesc')}</strong></p>
                <p className="mb-2">{t('metas.economicImpactIntro')}</p>
                <ul className="text-sm space-y-1.5 text-dark ml-4 mb-3">
                  {economicImpactList.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
                <p className="text-sm text-dark-secondary mb-3">→ {t('metas.economicImpactThermometer')}</p>
                <p className="mb-2 text-sm text-dark-secondary">{t('metas.economicImpactAllows')}</p>
                <ul className="text-sm space-y-1.5 text-dark ml-4">
                  {economicImpactAllowsList.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
              </div>

              <div className="bg-light-bg border border-light-border rounded-lg p-4">
                <p className="font-semibold mb-3">{t('metas.businessDecision')}</p>
                <p className="mb-2 text-sm text-dark-secondary">{t('metas.businessDecisionDesc')}</p>
                <ul className="text-sm space-y-1.5 text-dark ml-4 mb-3">
                  {businessDecisionList.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
                <blockquote className="border-l-4 border-primary pl-4 text-sm text-primary">
                  <p>{t('metas.businessDecisionQuote1')}</p>
                  <p>{t('metas.businessDecisionQuote2')}</p>
                </blockquote>
              </div>

              <div>
                <h3 className="font-bold text-primary mb-2">{t('metas.institutionalImpact')}</h3>
                <p className="mb-3"><strong>{t('metas.institutionalImpactDesc')}</strong></p>
                <p className="mb-2 text-sm text-dark-secondary">{t('metas.institutionalImpactIntro')}</p>
                <ul className="text-sm space-y-1.5 text-dark ml-4 mb-3">
                  {institutionalImpactList.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
                <p className="text-sm font-semibold text-dark-secondary">→ <strong>{t('metas.institutionalImpactFooter')}</strong></p>
              </div>

              <div className="bg-light-bg border border-light-border rounded-lg p-4">
                <p className="font-semibold mb-2">{t('metas.civicEducation')}</p>
                <p className="text-sm text-dark-secondary mb-2">{t('metas.civicEducationDesc')}</p>
                <p className="text-sm text-dark-secondary mb-2">{t('metas.civicEducationIntro')}</p>
                <ul className="text-sm space-y-1.5 text-dark ml-4 mb-3">
                  {civicEducationList.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
                <p className="text-sm text-dark-secondary">→ {t('metas.civicEducationFooter')}</p>
              </div>

              <div className="bg-light-bg border border-light-border rounded-lg p-4">
                <p className="font-semibold mb-2">{t('metas.accountability')}</p>
                <p className="text-sm text-dark-secondary mb-2">{t('metas.accountabilityIntro')}</p>
                <ul className="text-sm space-y-1.5 text-dark ml-4 mb-3">
                  {accountabilityList.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
                <p className="text-sm text-dark-secondary">{t('metas.accountabilityFooter')}</p>
              </div>

              <div>
                <h3 className="font-bold text-primary mb-2">🌍 {t('metas.internationalImpact')}</h3>
                <p className="mb-3"><strong>{t('metas.internationalImpactDesc')}</strong></p>
                <p className="mb-2 text-sm text-dark-secondary">{t('metas.internationalImpactIntro')}</p>
                <ul className="text-sm space-y-1.5 text-dark ml-4 mb-3">
                  {internationalImpactList.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
                <p className="mb-2 text-sm text-dark-secondary">{t('metas.internationalImpactNoExist')}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {internationalImpactItems.map((item, i) => (
                    <div key={i} className="bg-light-bg rounded-lg p-3 border border-light-border text-center text-sm font-semibold text-dark">{item}</div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-primary mb-2">🌎 {t('metas.globalPositioning')}</h3>
                <p className="mb-3"><strong>{t('metas.globalPositioningDesc')}</strong></p>
                <p className="mb-2 text-sm text-dark-secondary">{t('metas.globalPositioningIntro')}</p>
                <blockquote className="border-l-4 border-primary pl-4 mb-3 text-base font-semibold text-primary">{t('metas.globalPositioningQuote')}</blockquote>
                <p className="mb-2 text-sm text-dark-secondary">{t('metas.globalPositioningBridge')}</p>
                <ul className="text-sm space-y-1.5 text-dark ml-4">
                  {globalPositioningBridgeList.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
                <p className="mt-2 text-sm text-dark-secondary">{t('metas.globalPositioningFooter')}</p>
              </div>

              <div className="bg-light-bg border border-light-border rounded-lg p-4">
                <p className="font-semibold mb-2 text-sm text-dark-secondary">{t('metas.valueModel')}</p>
                <p className="text-sm text-dark-secondary mb-2">{t('metas.valueModelIntro')}</p>
                <ul className="text-sm space-y-1 text-dark ml-4 mb-3">
                  {valueModelEducates.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
                <p className="text-sm text-dark-secondary mb-2">→ {t('metas.valueModelAlso')}</p>
                <ul className="text-sm space-y-1 text-dark ml-4 mb-3">
                  {valueModelFeeds.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
                <p className="text-sm text-dark-secondary">{t('metas.valueModelFooter')}</p>
              </div>

              <div>
                <h3 className="font-bold text-primary mb-2">🔗 {t('metas.systemicEffect')}</h3>
                <div className="bg-light-bg rounded-lg p-4 text-sm space-y-3 text-dark">
                  {systemicEffectChains.map((chain, i) => <p key={i}>{chain}</p>)}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-primary mb-2">{t('metas.potentialImpact')}</h3>
                <ul className="space-y-2 text-sm text-dark">
                  {potentialImpactList.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-5">
                <h3 className="font-bold text-primary mb-3">{t('metas.synthesis')}</h3>
                <p className="mb-2 text-sm text-dark">{t('metas.synthesisIntro')}</p>
                <blockquote className="border-l-4 border-primary pl-4 mb-3 text-sm font-semibold text-primary">{t('metas.synthesisQuote')}</blockquote>
                <p className="mb-3 text-sm text-dark">{t('metas.synthesisResolves')}</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {synthesisItems.map((item, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 shadow-sm text-center">
                      <div className="text-sm text-dark font-semibold">{item}</div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-dark-secondary">{t('metas.synthesisFooter')}</p>
              </div>

              <div>
                <h3 className="font-bold text-primary mb-2">{t('metas.positioning')}</h3>
                <p className="mb-2 text-sm text-dark-secondary">{t('metas.positioningIntro')}</p>
                <ul className="text-sm space-y-1.5 text-dark ml-4 mb-3">
                  {positioningList.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
                <p className="text-sm font-semibold text-dark-secondary">→ <strong>{t('metas.positioningFooter')}</strong></p>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5 text-center">
                <p className="text-base italic text-primary font-semibold leading-relaxed">
                  &quot;{t('metas.tagline')}&quot;
                </p>
              </div>

            </div>
      </div>
    </div>
  );
}
