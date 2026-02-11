import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Receptor Ecosystem',
  tagline: 'Technical documentation for the Receptor workforce platform.',
  favicon: 'img/favicon.png',

  url: 'https://docs.commonbond.au',
  baseUrl: '/receptor/',
  trailingSlash: false,

  organizationName: 'dm-ra-01',
  projectName: 'doco-receptor-ecosystem',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/dm-ra-01/doco-receptor-ecosystem/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/receptor-logo.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Receptor',
      logo: {
        alt: 'Receptor Logo',
        src: 'img/receptor-logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'platformSidebar',
          position: 'left',
          label: 'Platform',
        },
        {
          type: 'docSidebar',
          sidebarId: 'infraSidebar',
          position: 'left',
          label: 'Infra',
        },
        {
          type: 'docSidebar',
          sidebarId: 'projectsSidebar',
          position: 'left',
          label: 'Projects',
        },
        { to: '/knowledge-graph', label: '🧠 Map', position: 'left' },
        {
          href: 'https://github.com/dm-ra-01/doco-receptor-ecosystem',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation Ecosystem',
          items: [
            {
              label: 'Common Bond Corporate',
              href: 'https://docs.commonbond.au/corporate',
            },
            {
              label: 'Rotator Legacy Archive',
              href: 'https://docs.commonbond.au/rotator',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Common Bond. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
