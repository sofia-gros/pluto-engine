import { PlutoEngine, Scene } from '@pluto-engine/core';

/**
 * メインシーン。ゼロアロケーションアーキテクチャを実演します。
 */
class MainScene extends Scene {
  /** プレイヤーのスプライト */
  private player!: ReturnType<typeof this.add.sprite>;
  
  /** 弾の物理ボディ配列 (衝突判定用) */
  private bulletBodies: ReturnType<typeof this.getBodyById>[] = [];
  /** 敵の物理ボディ配列 (衝突判定用) */
  private enemyBodies: ReturnType<typeof this.getBodyById>[] = [];
  
  /** 最後に弾を撃った時間 */
  private lastFired = 0;
  /** 次に敵をスポーンさせる時間 */
  private spawnTimer = 0;

  constructor() {
    super({ id: 'MainScene', maxInstances: 10000 });
  }

  preload() {
    // Requirements: use this.load.image and this.load.spritesheet
    const redSquare = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const yellowSquare = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    const blueSquare = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGAW08/XwAAAABJRU5ErkJggg==';

    this.load.image('player', blueSquare);
    this.load.image('bullet', yellowSquare);
    this.load.spritesheet('enemy', redSquare, { frameWidth: 1, frameHeight: 1 });
  }

  /**
   * シーンの初期化
   */
  create() {
    this.physics.setBounds(0, 0, 800, 600);

    // プレイヤーの初期化
    this.player = this.add.sprite(400, 500, 'player');
    this.player.setDisplaySize(32, 32);
    
    this.physics.setCollideWorldBounds(this.player.id, true);
    this.physics.setDrag(this.player.id, 0.1);
    this.physics.setMaxVelocity(this.player.id, 400, 400);
    this.physics.setSize(this.player.id, 32, 32);

    // 弾と敵の衝突判定 (Overlap)
    this.physics.add.overlap(this.bulletBodies, this.enemyBodies, (bullet, enemy) => {
      // 物理ボディ
      const bId = bullet.entityId;
      const eId = enemy.entityId;
      
      // アリーナから解放 (ゼロアロケーションアーキテクチャ)
      this.arena.free(bId);
      this.arena.free(eId);
      
      // 物理演算を無効化
      this.physics.setEnabled(bId, false);
      this.physics.setEnabled(eId, false);

      const bIdx = this.arena.idToIndex[bId];
      if (bIdx >= 0) this.arena.setVisible(bIdx, 0);

      const eIdx = this.arena.idToIndex[eId];
      if (eIdx >= 0) this.arena.setVisible(eIdx, 0);
    });
  }

  /**
   * 毎フレームの更新
   */
  update(dt: number) {
    const time = this.time.now;
    
    // 入力処理
    if (this.input.keyboard?.isDown('ArrowLeft')) {
       this.physics.setAcceleration(this.player.id, -1200, 0);
    } else if (this.input.keyboard?.isDown('ArrowRight')) {
       this.physics.setAcceleration(this.player.id, 1200, 0);
    } else {
       this.physics.setAcceleration(this.player.id, 0, 0);
    }

    if (this.input.keyboard?.isDown('Space') && time > this.lastFired) {
      this.fireBullet();
      this.lastFired = time + 150; // 発射レート
    }

    // 敵のスポーン
    if (time > this.spawnTimer) {
      this.spawnEnemy();
      this.spawnTimer = time + 1000;
    }
  }

  /**
   * 弾を発射します。
   * this.arena.allocate() を使用してゼロアロケーションで生成します。
   */
  fireBullet() {
    const id = this.arena.allocate();
    if (id < 0) return;
    const idx = this.arena.idToIndex[id];
    
    this.arena.setPosX(idx, this.player.x);
    this.arena.setPosY(idx, this.player.y - 16);
    
    const tex = this.textures.get('bullet');
    if (tex) {
      this.arena.assetRef[idx] = tex;
      this.arena.setFrameIdx(idx, tex.layerIndex ?? 0);
      this.arena.setFrameSize(idx, 10, 20);
      this.arena.setScale(idx, 10, 20);
      this.arena.setTint(idx, 0xffffffff);
      this.arena.setUv4(idx, 0, 0, 1, 1);
    }
    this.arena.setVisible(idx, 1);
    this.arena.setActive(idx, 1);

    // 物理ボディの設定
    this.physics.setEnabled(id, true);
    this.physics.setVelocity(id, 0, -500);
    this.physics.setSize(id, 10, 20);
    this.physics.setBodyX(id, this.player.x);
    this.physics.setBodyY(id, this.player.y - 16);
    
    // 衝突判定用にハンドルをキャッシュ
    const body = this.getBodyById(id);
    if (!this.bulletBodies.includes(body)) {
      this.bulletBodies.push(body);
    }
  }

  /**
   * 敵をスポーンします。
   * ゼロアロケーションで生成します。
   */
  spawnEnemy() {
    const id = this.arena.allocate();
    if (id < 0) return;
    const idx = this.arena.idToIndex[id];

    const startX = 32 + Math.random() * (800 - 64);
    const startY = -32;

    this.arena.setPosX(idx, startX);
    this.arena.setPosY(idx, startY);

    const tex = this.textures.get('enemy');
    if (tex) {
      this.arena.assetRef[idx] = tex;
      this.arena.setFrameIdx(idx, tex.layerIndex ?? 0);
      this.arena.setFrameSize(idx, 32, 32);
      this.arena.setScale(idx, 32, 32);
      this.arena.setTint(idx, 0xffffffff);
      this.arena.setUv4(idx, 0, 0, 1, 1);
    }
    this.arena.setVisible(idx, 1);
    this.arena.setActive(idx, 1);

    this.physics.setEnabled(id, true);
    this.physics.setVelocity(id, 0, 150);
    this.physics.setSize(id, 32, 32);
    this.physics.setBodyX(id, startX);
    this.physics.setBodyY(id, startY);
    
    const body = this.getBodyById(id);
    if (!this.enemyBodies.includes(body)) {
      this.enemyBodies.push(body);
    }
  }
}

const config = {
  width: 800,
  height: 600,
  scene: [MainScene]
};

new PlutoEngine(config);
