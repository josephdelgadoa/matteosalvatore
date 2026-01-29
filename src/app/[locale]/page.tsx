import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Index');
  const tHero = useTranslations('Hero');

  return (
    <main className="container">
      <section className="section" style={{ textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1>{tHero('title')}</h1>
        <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>{tHero('subtitle')}</p>
        <button style={{
          padding: '1rem 2rem',
          backgroundColor: 'var(--color-black)',
          color: 'var(--color-white)',
          fontSize: '1rem',
          marginTop: '2rem'
        }}>
          {tHero('cta')}
        </button>
      </section>
    </main>
  );
}
