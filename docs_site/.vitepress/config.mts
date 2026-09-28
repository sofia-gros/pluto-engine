import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/pluto-engine/',
  title: 'PlutoEngine',
  ignoreDeadLinks: true,

  locales: {
    root: {
      label: '日本語',
      lang: 'ja',
      description: '次世代ゼロアロケーション2D WebGL/WebGPUゲームエンジン',
      themeConfig: {
        nav: [
          { text: 'ホーム', link: '/' },
          { text: 'デモを遊ぶ', link: '/demos' },
          { text: 'ガイド', link: '/guide/intro' },
          { text: 'チュートリアル', link: '/tutorial/01-setup' },
          { text: 'コア概念', link: '/concepts/engine-config' },
          { text: 'プラグイン', link: '/plugins/xpbd' },
          { text: 'API', link: '/api/pluto-engine' },
        ],
        sidebar: [
          {
            text: 'デモゲーム',
            collapsed: false,
            items: [{ text: '🎮 プレイアブルデモ一覧', link: '/demos' }],
          },
          {
            text: 'ガイド (Guide)',
            collapsed: false,
            items: [
              { text: 'PlutoEngine とは', link: '/guide/intro' },
              { text: 'クイックスタート', link: '/guide/getting-started' },
              { text: 'インストールとセットアップ', link: '/guide/setup' },
              { text: 'Hello World', link: '/guide/hello-world' },
              { text: 'アーキテクチャ概要', link: '/guide/architecture' },
            ],
          },
          {
            text: 'チュートリアル: Swarm Survivor',
            collapsed: false,
            items: [
              { text: '第1章: プロジェクト構築とアリーナ初期化', link: '/tutorial/01-setup' },
              { text: '第2章: プレイヤー操作と入力管理', link: '/tutorial/02-player' },
              {
                text: '第3章: 数千体の敵大群（スウォーム）出現',
                link: '/tutorial/03-spawning-swarms',
              },
              {
                text: '第4章: モートン空間ハッシュによる超高速近傍探索',
                link: '/tutorial/04-spatial-hash',
              },
              { text: '第5章: 自動攻撃システムと飛び道具', link: '/tutorial/05-weapons' },
              {
                text: '第6章: XPBDによる群衆のめり込み防止物理',
                link: '/tutorial/06-xpbd-physics',
              },
              {
                text: '第7章: 経験値ジェム・ドロップとレベルアップ',
                link: '/tutorial/07-gems-leveling',
              },
              { text: '第8章: HUD表示とTweenアニメーション', link: '/tutorial/08-hud-tweens' },
              {
                text: '第9章: 画面振動・フラッシュとサウンド演出',
                link: '/tutorial/09-sound-polish',
              },
              { text: '第10章: ボス戦AI・ウェーブ完了とゲームループ', link: '/tutorial/10-boss' },
            ],
          },
          {
            text: 'コア概念 (Concepts)',
            collapsed: false,
            items: [
              { text: 'エンジン設定と初期化', link: '/concepts/engine-config' },
              { text: 'シーンとアリーナメモリ管理', link: '/concepts/scene-arena' },
              { text: 'WGSL レンダリングパイプライン', link: '/concepts/rendering' },
              { text: 'アセットローダー', link: '/concepts/loader' },
            ],
          },
          {
            text: 'プラグイン (Plugins)',
            collapsed: false,
            items: [
              { text: 'XPBD 物理エンジン', link: '/plugins/xpbd' },
              { text: 'モートン順序空間分割', link: '/plugins/morton' },
              { text: 'AI & ビヘイビア', link: '/plugins/ai' },
              { text: 'SDF テキスト & 距離場', link: '/plugins/sdf' },
              { text: 'オーディオ', link: '/plugins/sound' },
              { text: 'ポアソン群集流体 (Continuum Crowds)', link: '/plugins/poisson' },
            ],
          },
          {
            text: 'API リファレンス',
            collapsed: false,
            items: [
              { text: 'PlutoEngine', link: '/api/pluto-engine' },
              { text: 'Scene', link: '/api/scene' },
              { text: 'TweenManager', link: '/api/tween-manager' },
              { text: 'Camera', link: '/api/camera' },
            ],
          },
        ],
      },
    },
    en: {
      label: 'English',
      lang: 'en',
      description: 'Next-generation Zero-Allocation 2D WebGL/WebGPU Game Engine',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Play Demos', link: '/en/demos' },
          { text: 'Guide', link: '/en/guide/intro' },
          { text: 'Tutorial', link: '/en/tutorial/01-setup' },
          { text: 'Concepts', link: '/en/concepts/engine-config' },
          { text: 'Plugins', link: '/en/plugins/xpbd' },
          { text: 'API', link: '/en/api/pluto-engine' },
        ],
        sidebar: [
          {
            text: 'Demos',
            collapsed: false,
            items: [{ text: '🎮 Playable Demos', link: '/en/demos' }],
          },
          {
            text: 'Guide',
            collapsed: false,
            items: [
              { text: 'Introduction to PlutoEngine', link: '/en/guide/intro' },
              { text: 'Quick Start', link: '/en/guide/getting-started' },
              { text: 'Installation & Setup', link: '/en/guide/setup' },
              { text: 'Hello World', link: '/en/guide/hello-world' },
              { text: 'Architecture Overview', link: '/en/guide/architecture' },
            ],
          },
          {
            text: 'Tutorial: Making a Swarm Survivor',
            collapsed: false,
            items: [
              { text: 'Chapter 1: Project Setup & Arena Init', link: '/en/tutorial/01-setup' },
              { text: 'Chapter 2: Player Controls & Input', link: '/en/tutorial/02-player' },
              {
                text: 'Chapter 3: Spawning Thousands in the Swarm',
                link: '/en/tutorial/03-spawning-swarms',
              },
              {
                text: 'Chapter 4: Morton Spatial Hashing & Queries',
                link: '/en/tutorial/04-spatial-hash',
              },
              {
                text: 'Chapter 5: Automated Weapons & Projectiles',
                link: '/en/tutorial/05-weapons',
              },
              {
                text: 'Chapter 6: XPBD Crowd Physics & Anti-Clustering',
                link: '/en/tutorial/06-xpbd-physics',
              },
              {
                text: 'Chapter 7: XP Gems, Free List & Leveling Up',
                link: '/en/tutorial/07-gems-leveling',
              },
              {
                text: 'Chapter 8: Dynamic HUD & Zero-Alloc Tweens',
                link: '/en/tutorial/08-hud-tweens',
              },
              {
                text: 'Chapter 9: Camera Shake, Flash & Polish',
                link: '/en/tutorial/09-sound-polish',
              },
              {
                text: 'Chapter 10: Boss Battle, Utility AI & Victory Loop',
                link: '/en/tutorial/10-boss',
              },
            ],
          },
          {
            text: 'Concepts',
            collapsed: false,
            items: [
              { text: 'Engine Configuration & Init', link: '/en/concepts/engine-config' },
              { text: 'Scene & Arena Memory Management', link: '/en/concepts/scene-arena' },
              { text: 'WGSL Rendering Pipeline', link: '/en/concepts/rendering' },
              { text: 'Asset Loader', link: '/en/concepts/loader' },
            ],
          },
          {
            text: 'Plugins',
            collapsed: false,
            items: [
              { text: 'XPBD Physics Engine', link: '/en/plugins/xpbd' },
              { text: 'Morton Spatial Partitioning', link: '/en/plugins/morton' },
              { text: 'AI & Behavior Systems', link: '/en/plugins/ai' },
              { text: 'SDF Text & Signed Distance Fields', link: '/en/plugins/sdf' },
              { text: 'Poisson Continuum Crowds', link: '/en/plugins/poisson' },
            ],
          },
          {
            text: 'API Reference',
            collapsed: false,
            items: [
              { text: 'PlutoEngine', link: '/en/api/pluto-engine' },
              { text: 'Scene', link: '/en/api/scene' },
              { text: 'TweenManager', link: '/en/api/tween-manager' },
            ],
          },
        ],
      },
    },
  },

  themeConfig: {
    socialLinks: [{ icon: 'github', link: 'https://github.com/sofia-gros/pluto-engine' }],
    search: {
      provider: 'local',
    },
  },
});
