import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AppForge',
  description: 'AppForge Documentation',
  base: '/AppForgeDocs/',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sofn/AppForge' },
    ],
  },
})
