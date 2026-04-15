import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'ArchSmith',
  description: 'Modern enterprise admin platform built with Spring Boot 4 + Vue 3',
  base: '/',
  lang: 'en-US',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'ArchSmith',

    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Modules', link: '/modules/user-management' },
      { text: 'Deploy', link: '/deploy/docker' },
      {
        text: 'Links',
        items: [
          { text: 'Backend (ArchSmith)', link: 'https://github.com/sofn/ArchSmith' },
          { text: 'Frontend (ArchSmithAdmin)', link: 'https://github.com/sofn/ArchSmithAdmin' },
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is ArchSmith?', link: '/guide/introduction' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Tech Stack', link: '/guide/tech-stack' },
            { text: 'Project Structure', link: '/guide/project-structure' },
          ]
        },
        {
          text: 'Development',
          items: [
            { text: 'Local Setup', link: '/guide/local-setup' },
            { text: 'Configuration', link: '/guide/configuration' },
            { text: 'Database Migration', link: '/guide/database-migration' },
          ]
        }
      ],
      '/modules/': [
        {
          text: 'System Modules',
          items: [
            { text: 'User Management', link: '/modules/user-management' },
            { text: 'Role & Permission', link: '/modules/role-permission' },
            { text: 'Menu Management', link: '/modules/menu-management' },
            { text: 'Config & Notice', link: '/modules/config-notice' },
            { text: 'Log Management', link: '/modules/log-management' },
            { text: 'Server Monitor', link: '/modules/server-monitor' },
          ]
        },
        {
          text: 'Core Features',
          items: [
            { text: 'Authentication (JWT)', link: '/modules/authentication' },
            { text: 'API Documentation', link: '/modules/api-docs' },
          ]
        }
      ],
      '/deploy/': [
        {
          text: 'Deployment',
          items: [
            { text: 'Docker Compose', link: '/deploy/docker' },
            { text: 'Production Guide', link: '/deploy/production' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sofn/ArchSmith' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present ArchSmith'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/sofn/ArchSmithDocs/edit/master/docs/:path',
      text: 'Edit this page on GitHub'
    }
  }
})
