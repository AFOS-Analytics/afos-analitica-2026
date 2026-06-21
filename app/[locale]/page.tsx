import { LandingPageDual } from '../components/LandingPageDual';
import { Footer } from '../components/Footer';

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale = (params.locale === 'en' || params.locale === 'es') ? params.locale : 'pt-BR';
  // Footer compartilhado também na home: passa link-juice interno (latam/eu, about,
  // glossary, legais e hubs institucionais) a partir da página de maior autoridade.
  return (
    <>
      <LandingPageDual locale={locale} />
      <Footer compact />
    </>
  );
}
