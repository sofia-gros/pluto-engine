import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "PlutoEngine",
  base: "/pluto-engine/",
  description: "Next-generation Zero-Allocation 2D WebGL/WebGPU Game Engine",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API Reference', link: '/api/' }
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Architecture', link: '/guide/architecture' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/pluto-engine' }
    ]
  }
})
