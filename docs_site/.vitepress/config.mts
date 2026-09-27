import { defineConfig } from 'vitepress'

export default defineConfig({
  base: "/pluto-engine/",
  title: "PlutoEngine",
  
  locales: {
    root: {
      label: '日本語',
      lang: 'ja',
      description: '次世代ゼロアロケーション2D WebGL/WebGPUゲームエンジン',
      themeConfig: {
        nav: [
          { text: 'ホーム', link: '/' },
          { text: 'ガイド', link: '/guide/getting-started' },
          { text: 'APIリファレンス', link: '/api/pluto-engine' }
        ],
        sidebar: {
          '/guide/': [
            {
              text: 'ガイド',
              items: [
                { text: 'はじめに', link: '/guide/getting-started' },
                { text: 'アーキテクチャ', link: '/guide/architecture' }
              ]
            }
          ],
          '/api/': [
            {
              text: 'APIリファレンス',
              items: [
                { text: 'PlutoEngine', link: '/api/pluto-engine' },
                { text: 'Scene', link: '/api/scene' },
                { text: 'TweenManager', link: '/api/tween-manager' }
              ]
            }
          ]
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en',
      description: 'Next-generation Zero-Allocation 2D WebGL/WebGPU Game Engine',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Guide', link: '/en/guide/getting-started' },
          { text: 'API Reference', link: '/en/api/pluto-engine' }
        ],
        sidebar: {
          '/en/guide/': [
            {
              text: 'Guide',
              items: [
                { text: 'Getting Started', link: '/en/guide/getting-started' },
                { text: 'Architecture', link: '/en/guide/architecture' }
              ]
            }
          ],
          '/en/api/': [
            {
              text: 'API Reference',
              items: [
                { text: 'PlutoEngine', link: '/en/api/pluto-engine' },
                { text: 'Scene', link: '/en/api/scene' },
                { text: 'TweenManager', link: '/en/api/tween-manager' }
              ]
            }
          ]
        }
      }
    }
  },

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/pluto-engine' }
    ]
  }
})
