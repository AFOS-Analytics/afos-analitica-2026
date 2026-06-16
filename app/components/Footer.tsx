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

const LEGAL_LABELS: Record<string, { title: string; privacy: string; terms: string; sources: string; about: string }> = {
  'pt-BR': { title: 'Legal',          privacy: 'Política de Privacidade', terms: 'Termos de Uso', sources: 'Fontes de Dados', about: 'Sobre' },
  en:      { title: 'Legal',          privacy: 'Privacy Policy',           terms: 'Terms of Use',  sources: 'Data Sources',    about: 'About' },
  es:      { title: 'Legal',          privacy: 'Política de Privacidad',   terms: 'Términos de Uso', sources: 'Fuentes de Datos', about: 'Acerca de' },
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

const SOCIAL_LABELS: Record<string, { title: string }> = {
  'pt-BR': { title: 'Redes Sociais' },
  en:      { title: 'Follow Us' },
  es:      { title: 'Síguenos' },
}

type SocialIconKey = 'github' | 'linkedin' | 'x' | 'bluesky' | 'producthunt' | 'huggingface' | 'dataverse'

const SOCIAL_PATHS: Record<SocialIconKey, string> = {
  github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  bluesky: 'M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 01-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z',
  producthunt: 'M13.604 8.4h-3.405V12h3.405a1.8 1.8 0 0 0 0-3.6zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.804a4.2 4.2 0 0 1 0 8.4z',
  huggingface: 'M12.025 1.13c-5.77 0-10.449 4.647-10.449 10.378 0 1.112.178 2.181.503 3.185.064-.222.203-.444.416-.577a.96.96 0 0 1 .524-.15c.293 0 .584.124.84.284.278.173.48.408.71.694.226.282.458.611.684.951v-.014c.017-.324.106-.622.264-.874s.403-.487.762-.543c.3-.047.596.06.787.203s.31.313.4.467c.15.257.212.468.233.542.01.026.653 1.552 1.657 2.54.616.605 1.01 1.223 1.082 1.912.055.537-.096 1.059-.38 1.572.637.121 1.294.187 1.967.187.657 0 1.298-.063 1.921-.178-.287-.517-.44-1.041-.384-1.581.07-.69.465-1.307 1.081-1.913 1.004-.987 1.647-2.513 1.657-2.539.021-.074.083-.285.233-.542.09-.154.208-.323.4-.467a1.08 1.08 0 0 1 .787-.203c.359.056.604.29.762.543s.247.55.265.874v.015c.225-.34.457-.67.683-.952.23-.286.432-.52.71-.694.257-.16.547-.284.84-.285a.97.97 0 0 1 .524.151c.228.143.373.388.43.625l.006.04a10.3 10.3 0 0 0 .534-3.273c0-5.731-4.678-10.378-10.449-10.378M8.327 6.583a1.5 1.5 0 0 1 .713.174 1.487 1.487 0 0 1 .617 2.013c-.183.343-.762-.214-1.102-.094-.38.134-.532.914-.917.71a1.487 1.487 0 0 1 .69-2.803m7.486 0a1.487 1.487 0 0 1 .689 2.803c-.385.204-.536-.576-.916-.71-.34-.12-.92.437-1.103.094a1.487 1.487 0 0 1 .617-2.013 1.5 1.5 0 0 1 .713-.174m-10.68 1.55a.96.96 0 1 1 0 1.921.96.96 0 0 1 0-1.92m13.838 0a.96.96 0 1 1 0 1.92.96.96 0 0 1 0-1.92M8.489 11.458c.588.01 1.965 1.157 3.572 1.164 1.607-.007 2.984-1.155 3.572-1.164.196-.003.305.12.305.454 0 .886-.424 2.328-1.563 3.202-.22-.756-1.396-1.366-1.63-1.32q-.011.001-.02.006l-.044.026-.01.008-.03.024q-.018.017-.035.036l-.032.04a1 1 0 0 0-.058.09l-.014.025q-.049.088-.11.19a1 1 0 0 1-.083.116 1.2 1.2 0 0 1-.173.18q-.035.029-.075.058a1.3 1.3 0 0 1-.251-.243 1 1 0 0 1-.076-.107c-.124-.193-.177-.363-.337-.444-.034-.016-.104-.008-.2.022q-.094.03-.216.087-.06.028-.125.063l-.13.074q-.067.04-.136.086a3 3 0 0 0-.135.096 3 3 0 0 0-.26.219 2 2 0 0 0-.12.121 2 2 0 0 0-.106.128l-.002.002a2 2 0 0 0-.09.132l-.001.001a1.2 1.2 0 0 0-.105.212q-.013.036-.024.073c-1.139-.875-1.563-2.317-1.563-3.203 0-.334.109-.457.305-.454m.836 10.354c.824-1.19.766-2.082-.365-3.194-1.13-1.112-1.789-2.738-1.789-2.738s-.246-.945-.806-.858-.97 1.499.202 2.362c1.173.864-.233 1.45-.685.64-.45-.812-1.683-2.896-2.322-3.295s-1.089-.175-.938.647 2.822 2.813 2.562 3.244-1.176-.506-1.176-.506-2.866-2.567-3.49-1.898.473 1.23 2.037 2.16c1.564.932 1.686 1.178 1.464 1.53s-3.675-2.511-4-1.297c-.323 1.214 3.524 1.567 3.287 2.405-.238.839-2.71-1.587-3.216-.642-.506.946 3.49 2.056 3.522 2.064 1.29.33 4.568 1.028 5.713-.624m5.349 0c-.824-1.19-.766-2.082.365-3.194 1.13-1.112 1.789-2.738 1.789-2.738s.246-.945.806-.858.97 1.499-.202 2.362c-1.173.864.233 1.45.685.64.451-.812 1.683-2.896 2.322-3.295s1.089-.175.938.647-2.822 2.813-2.562 3.244 1.176-.506 1.176-.506 2.866-2.567 3.49-1.898-.473 1.23-2.037 2.16c-1.564.932-1.686 1.178-1.464 1.53s3.675-2.511 4-1.297c.323 1.214-3.524 1.567-3.287 2.405.238.839 2.71-1.587 3.216-.642.506.946-3.49 2.056-3.522 2.064-1.29.33-4.568 1.028-5.713-.624',
  dataverse: 'M4 10 H7 V17 H4 Z M10 10 H13 V17 H10 Z M16 10 H19 V17 H16 Z M2 19 H21 V22 H2 Z M11.5 1 L2 6 V8 H21 V6 Z',
}

const SOCIALS: Array<{ name: string; url: string; icon: SocialIconKey }> = [
  { name: 'GitHub',       url: 'https://github.com/AFOS-Analytics/afos-analitica-2026', icon: 'github' },
  { name: 'LinkedIn',     url: 'https://www.linkedin.com/in/andre-felipe-afos',         icon: 'linkedin' },
  { name: 'X',            url: 'https://x.com/AFOS_Analytics',                          icon: 'x' },
  { name: 'Bluesky',      url: 'https://bsky.app/profile/afos-analytics.com',           icon: 'bluesky' },
  { name: 'Product Hunt', url: 'https://www.producthunt.com/@afosanalytics',            icon: 'producthunt' },
  { name: 'Hugging Face', url: '/dataset',                                              icon: 'huggingface' },
  { name: 'Harvard Dataverse', url: 'https://doi.org/10.7910/DVN/2D0UK7',              icon: 'dataverse' },
]

export function Footer() {
  const { t } = useTranslation();
  const locale = useLocale();
  const nav = NAV_LABELS[locale] || NAV_LABELS['en'];
  const oss = OSS_LABELS[locale] || OSS_LABELS['en'];
  const legal = LEGAL_LABELS[locale] || LEGAL_LABELS['en'];
  const labels = CONTACT_LABELS[locale] || CONTACT_LABELS['en'];
  const social = SOCIAL_LABELS[locale] || SOCIAL_LABELS['en'];

  return (
    <footer className="bg-primary text-white py-6 px-4 sm:px-8" role="contentinfo">
      <div className="max-w-6xl mx-auto">
        {/* BLOCO 1 + 2 + 3, Navegação + Open Source + Legal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 text-xs">
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
          <div>
            <p className="font-semibold text-white/90 mb-2">{legal.title}</p>
            <a href={`/${locale}/about`} className="block text-white/60 hover:text-white py-0.5">{legal.about}</a>
            <a href={`/${locale}/privacy`} className="block text-white/60 hover:text-white py-0.5">{legal.privacy}</a>
            <a href={`/${locale}/terms`} className="block text-white/60 hover:text-white py-0.5">{legal.terms}</a>
            <a href={`/${locale}/data-sources`} className="block text-white/60 hover:text-white py-0.5">{legal.sources}</a>
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="border-t border-white/20 pt-4 pb-4 mb-4">
          <p className="text-[11px] uppercase tracking-widest text-white/50 mb-3 font-semibold">{social.title}</p>
          <div className="flex items-center gap-5">
            {SOCIALS.map(({ name, url, icon }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label={`${name} (opens in new tab)`}
                title={name}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path d={SOCIAL_PATHS[icon]} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* BLOCO 3, Fale Conosco */}
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

        {/* Rodapé, descrição + disclaimer + voltar ao topo */}
        <div className="text-center text-xs border-t border-white/20 pt-4">
          <p>{t('footer.description')}</p>
          <p className="mt-1 text-white/70">{t('footer.disclaimer')} <a href="https://polymarket.com/politics/brazil" target="_blank" rel="noopener noreferrer" className="underline hover:text-white" aria-label={t('footer.polymarketLink')}>{t('footer.polymarket')}</a> {t('footer.notAffiliated')}</p>
          <a
            href="https://doi.org/10.7910/DVN/2D0UK7"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors text-white/70 hover:text-white"
            title="Harvard Dataverse — DOI 10.7910/DVN/2D0UK7"
            aria-label="Harvard Dataverse — DOI 10.7910/DVN/2D0UK7 (opens in new tab)"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true"><path d="M4 10 H7 V17 H4 Z M10 10 H13 V17 H10 Z M16 10 H19 V17 H16 Z M2 19 H21 V22 H2 Z M11.5 1 L2 6 V8 H21 V6 Z" /></svg>
            <span className="text-[11px]"><span className="font-semibold text-white/90">Harvard Dataverse</span> · DOI 10.7910/DVN/2D0UK7</span>
          </a>
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
