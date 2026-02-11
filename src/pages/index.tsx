import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const PRIMARY_SECTIONS = [
  {
    emoji: '🏗️',
    title: 'Platform',
    description: 'Architecture, frontend apps, allocator engine, security, and core platform documentation.',
    link: '/docs/platform/architecture',
  },
  {
    emoji: '⚙️',
    title: 'Infrastructure',
    description: 'Self-hosted Supabase, database schema, VM environment, key management, and CI/CD.',
    link: '/docs/infrastructure/environment/supabase-self-hosted',
  },
  {
    emoji: '📋',
    title: 'Projects',
    description: 'Active development initiatives, migration tracking, and project roadmaps.',
    link: '/docs/projects/overview',
  },
];

const QUICK_ACCESS = [
  {
    emoji: '📱',
    title: 'Frontend Apps',
    description: 'Preferencer, Workforce, and Planner interfaces.',
    link: '/docs/platform/frontend-apps/receptor-preferencer',
  },
  {
    emoji: '🧮',
    title: 'Allocator Engine',
    description: 'OR-Tools CP-SAT matching algorithm.',
    link: '/docs/platform/allocator-backend/',
  },
  {
    emoji: '🗄️',
    title: 'Database',
    description: 'Schema, RLS policies, and migrations.',
    link: '/docs/infrastructure/database/database-schema',
  },
  {
    emoji: '🧪',
    title: 'Testing & DevOps',
    description: 'Test suites, CI/CD, and troubleshooting.',
    link: '/docs/infrastructure/operations/testing-guide',
  },
  {
    emoji: '🧠',
    title: 'Knowledge Map',
    description: 'Interactive graph of all doc relationships.',
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

function PrimaryCard({ emoji, title, description, link }: typeof PRIMARY_SECTIONS[0]) {
  return (
    <Link to={link} className={styles.primaryCard}>
      <span className={styles.cardEmoji}>{emoji}</span>
      <div>
        <Heading as="h3" className={styles.cardTitle}>{title}</Heading>
        <p className={styles.cardDescription}>{description}</p>
      </div>
    </Link>
  );
}

function QuickCard({ emoji, title, description, link }: typeof QUICK_ACCESS[0]) {
  return (
    <Link to={link} className={styles.quickCard}>
      <span className={styles.quickEmoji}>{emoji}</span>
      <Heading as="h4" className={styles.quickTitle}>{title}</Heading>
      <p className={styles.quickDescription}>{description}</p>
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
        {/* Primary navigation — three big cards */}
        <section className={styles.primaryGrid}>
          {PRIMARY_SECTIONS.map((section) => (
            <PrimaryCard key={section.title} {...section} />
          ))}
        </section>

        {/* Quick-access shortcuts */}
        <Heading as="h2" className={styles.quickHeading}>Quick Access</Heading>
        <section className={styles.quickGrid}>
          {QUICK_ACCESS.map((item) => (
            <QuickCard key={item.title} {...item} />
          ))}
        </section>

        {/* Sibling sites */}
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
