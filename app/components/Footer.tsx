'use client';

import { useTranslation, useLocale } from '../i18n/context';
import { EMAIL_CONTACT, EMAIL_SUPPORT, EMAIL_SECURITY, EMAIL_FOUNDER } from '../lib/contacts';

const GITHUB_URL = 'https://github.com/AFOS-Analytics/afos-analitica-2026';

const NAV_LABELS: Record<string, { title: string; dashboard: string; global: string; latam: string; eu: string; howItWorks: string }> = {
  'pt-BR': { title: 'Navegação', dashboard: 'Dashboard', global: 'Mapa Global', latam: 'América Latina', eu: 'Europa', howItWorks: 'O Método' },
  en:      { title: 'Navigation', dashboard: 'Dashboard', global: 'Global Map',  latam: 'Latin America',  eu: 'Europe', howItWorks: 'The Method' },
  es:      { title: 'Navegación', dashboard: 'Dashboard', global: 'Mapa Global', latam: 'América Latina', eu: 'Europa', howItWorks: 'El Método' },
}

const OSS_LABELS: Record<string, { title: string; license: string; github: string; security: string; contributing: string; conduct: string; governance: string; trademark: string }> = {
  'pt-BR': { title: 'Open Source', license: 'Licença Apache 2.0',  github: 'GitHub', security: 'Segurança', contributing: 'Contribuir',   conduct: 'Código de Conduta', governance: 'Governança',  trademark: 'Trademark' },
  en:      { title: 'Open Source', license: 'Apache 2.0 License',  github: 'GitHub', security: 'Security',  contributing: 'Contributing', conduct: 'Code of Conduct',   governance: 'Governance',  trademark: 'Trademark' },
  es:      { title: 'Open Source', license: 'Licencia Apache 2.0', github: 'GitHub', security: 'Seguridad', contributing: 'Contribuir',   conduct: 'Código de Conducta', governance: 'Gobernanza', trademark: 'Trademark' },
}

type ContactKey = 'general' | 'support' | 'security' | 'founder'

const CONTACTS: Array<{ key: ContactKey; email: string; icon: string }> = [
  { key: 'general',  email: EMAIL_CONTACT,  icon: '📧' },
  { key: 'support',  email: EMAIL_SUPPORT,  icon: '💬' },
  { key: 'security', email: EMAIL_SECURITY, icon: '🔒' },
  { key: 'founder',  email: EMAIL_FOUNDER,  icon: '👤' },
]

const CONTACT_LABELS: Record<string, Record<ContactKey | 'title', string>> = {
  'pt-BR': { general: 'Contato',  support: 'Suporte', security: 'Segurança', founder: 'Founder', title: 'Fale Conosco' },
  en:      { general: 'Contact',  support: 'Support', security: 'Security',  founder: 'Founder', title: 'Get in Touch' },
  es:      { general: 'Contacto', support: 'Soporte', security: 'Seguridad', founder: 'Founder', title: 'Contáctenos' },
}

export function Footer() {
  const { t } = useTranslation();
  const locale = useLocale();
  const nav = NAV_LABELS[locale] || NAV_LABELS['en'];
  const oss = OSS_LABELS[locale] || OSS_LABELS['en'];
  const labels = CONTACT_LABELS[locale] || CONTACT_LABELS['en'];

  return (
    <footer className="bg-primary text-white py-6 px-4 sm:px-8" role="contentinfo">
      <div className="max-w-6xl mx-auto">
        {/* BLOCO 1 + 2 — Navegação + Open Source */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 text-xs">
          <div>
            <p className="font-semibold text-white/90 mb-2">{nav.title}</p>
            <a href={`/${locale}/dashboard`} className="block text-white/60 hover:text-white py-0.5">{nav.dashboard}</a>
            <a href={`/${locale}/global`} className="block text-white/60 hover:text-white py-0.5">{nav.global}</a>
            <a href={`/${locale}/latam`} className="block text-white/60 hover:text-white py-0.5">{nav.latam}</a>
            <a href={`/${locale}/eu`} className="block text-white/60 hover:text-white py-0.5">{nav.eu}</a>
            <a href={`/${locale}/how-it-works`} className="block text-white/60 hover:text-white py-0.5">{nav.howItWorks}</a>
          </div>
          <div>
            <p className="font-semibold text-white/90 mb-2">{oss.title}</p>
            <a href={`${GITHUB_URL}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer" className="block text-white/60 hover:text-white py-0.5">{oss.license}</a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="block text-white/60 hover:text-white py-0.5">⭐ {oss.github}</a>
            <a href={`${GITHUB_URL}/blob/main/SECURITY.md`} target="_blank" rel="noopener noreferrer" className="block text-white/60 hover:text-white py-0.5">{oss.security}</a>
            <a href={`${GITHUB_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer" className="block text-white/60 hover:text-white py-0.5">{oss.contributing}</a>
            <a href={`${GITHUB_URL}/blob/main/CODE_OF_CONDUCT.md`} target="_blank" rel="noopener noreferrer" className="block text-white/60 hover:text-white py-0.5">{oss.conduct}</a>
            <a href={`/${locale}/methodology/automated-governance`} className="block text-white/60 hover:text-white py-0.5">{oss.governance}</a>
            <a href={`${GITHUB_URL}/blob/main/TRADEMARK.md`} target="_blank" rel="noopener noreferrer" className="block text-white/60 hover:text-white py-0.5">{oss.trademark}</a>
          </div>
        </div>

        {/* BLOCO 3 — Fale Conosco */}
        <div className="border-t border-white/20 pt-4 pb-4 mb-4">
          <p className="text-[11px] uppercase tracking-widest text-white/50 mb-3 font-semibold">{labels.title}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {CONTACTS.map(({ key, email, icon }) => (
              <a key={key} href={`mailto:${email}`} className="group flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <span aria-hidden className="text-base leading-none mt-0.5">{icon}</span>
                <span className="flex flex-col">
                  <span className="font-semibold text-white/90">{labels[key]}</span>
                  <span className="text-white/60 group-hover:text-white break-all">{email}</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Rodapé — descrição + disclaimer + voltar ao topo */}
        <div className="text-center text-xs border-t border-white/20 pt-4">
          <p>{t('footer.description')}</p>
          <p className="mt-1 text-white/70">{t('footer.disclaimer')} <a href="https://polymarket.com/politics/brazil" target="_blank" rel="noopener noreferrer" className="underline hover:text-white" aria-label={t('footer.polymarketLink')}>{t('footer.polymarket')}</a> {t('footer.notAffiliated')}</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/30 text-white/80 hover:text-white hover:bg-white/10 transition-all text-xs font-medium"
            aria-label={t('footer.backToTop')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 12V2M7 2L2.5 6.5M7 2L11.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('footer.backToTop')}
          </button>
        </div>
      </div>
    </footer>
  );
}
