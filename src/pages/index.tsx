import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const SECTIONS = [
  {
    emoji: '🏗️',
    title: 'Architecture',
    description: 'System design, data flows, and service topology for the Receptor platform.',
    link: '/docs/app-documentation/architecture',
  },
  {
    emoji: '⚙️',
    title: 'Infrastructure',
    description: 'Supabase self-hosting, database schema, RLS policies, and CI/CD pipelines.',
    link: '/docs/infrastructure/supabase-self-hosted',
  },
  {
    emoji: '📱',
    title: 'Frontend Apps',
    description: 'Preference, Workforce, and Planner — the three user-facing applications.',
    link: '/docs/app-documentation/frontend-apps/preference-frontend',
  },
  {
    emoji: '🧮',
    title: 'Allocator Engine',
    description: 'The MILP-based optimization engine that powers fair rotation allocation.',
    link: '/docs/app-documentation/allocator-backend/algorithm',
  },
  {
    emoji: '📂',
    title: 'Projects',
    description: 'Development workspace setup, contribution guides, and project management.',
    link: '/docs/projects/development-workspace',
  },
  {
    emoji: '🧠',
    title: 'Knowledge Map',
    description: 'Interactive graph of all documentation relationships and topics.',
    link: '/knowledge-graph',
  },
];

const SIBLINGS = [
  { label: 'Common Bond Corporate', href: 'https://docs.commonbond.au/corporate/', emoji: '🏛️' },
  { label: 'Rotator Legacy Archive', href: 'https://docs.commonbond.au/rotator/', emoji: '📜' },
];

function HeroSection() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.heroActions}>
          <Link className={styles.heroPrimary} to="/docs/intro">
            Get Started
          </Link>
          <Link className={styles.heroSecondary} to="/knowledge-graph">
            🧠 Knowledge Map
          </Link>
        </div>
      </div>
    </header>
  );
}

function SectionCard({ emoji, title, description, link }: typeof SECTIONS[0]) {
  return (
    <Link to={link} className={styles.sectionCard}>
      <span className={styles.cardEmoji}>{emoji}</span>
      <Heading as="h3" className={styles.cardTitle}>{title}</Heading>
      <p className={styles.cardDescription}>{description}</p>
    </Link>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Home"
      description="Technical documentation for the Receptor workforce management platform.">
      <HeroSection />
      <main className={styles.main}>
        <section className={styles.grid}>
          {SECTIONS.map((section) => (
            <SectionCard key={section.title} {...section} />
          ))}
        </section>

        <section className={styles.siblings}>
          <Heading as="h2" className={styles.siblingsTitle}>Other Documentation Sites</Heading>
          <div className={styles.siblingLinks}>
            {SIBLINGS.map((s) => (
              <a key={s.label} href={s.href} className={styles.siblingCard}>
                <span className={styles.cardEmoji}>{s.emoji}</span>
                <span>{s.label}</span>
              </a>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
