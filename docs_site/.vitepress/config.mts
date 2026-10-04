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
              { text: 'ベンチマーク (Performance)', link: '/performance' },
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
              { text: 'Arcade Physics (AABB 物理)', link: '/plugins/arcade-physics' },
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
              { text: 'Camera', link: '/api/camera' },
              { text: 'TweenManager', link: '/api/tween-manager' },
              { text: 'InstanceBufferArena', link: '/api/instance-buffer-arena' },
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
