import { describe, expect, it } from 'vitest';
import {
  Body,
  Container,
  Group,
  ParticleEmitter,
  ParticleManager,
  Scene,
  SoundHandle,
  SoundManager,
  Tilemap,
  TilemapLayer,
  World,
} from '../src/index';

function ownPropertyCount(obj: object): number {
  return Object.getOwnPropertyNames(obj).length;
}

describe('Group (Array ベース / 判定 D)', () => {
  it('add / remove が基本 동작する', () => {
    const scene = new Scene({ maxInstances: 32 });
    const a = scene.add.sprite(0, 0);
    const b = scene.add.sprite(0, 0);
    const g = scene.add.group([a, b]);

    expect(g.length).toBe(2);
    expect(g.contains(a)).toBe(true);
    expect(g.contains(b)).toBe(true);

    expect(g.remove(a)).toBe(true);
    expect(g.length).toBe(1);
    expect(g.contains(a)).toBe(false);
    // 削除後に残りが詰まる
    expect(g.getAt<SpriteLike>(0)).toBe(b as unknown as SpriteLike);
  });

  it('重複追加は無視する', () => {
    const scene = new Scene({ maxInstances: 32 });
    const a = scene.add.sprite(0, 0);
    const g = scene.add.group([a]);
    expect(g.add(a)).toBe(false);
    expect(g.length).toBe(1);
  });

  it('getAt は範囲外で null を返す', () => {
    const scene = new Scene({ maxInstances: 32 });
    const a = scene.add.sprite(0, 0);
    const g = scene.add.group([a]);
    expect(g.getAt(0)).toBe(a);
    expect(g.getAt(1)).toBeNull();
    expect(g.getAt(-1)).toBeNull();
  });

  it('getAll は out バッファを使い回す（new しない）', () => {
    const scene = new Scene({ maxInstances: 32 });
    const a = scene.add.sprite(0, 0);
    const b = scene.add.sprite(0, 0);
    const g = scene.add.group([a, b]);
    const out: unknown[] = [];
    expect(g.getAll(out)).toBe(2);
    expect(out[0]).toBe(a);
    expect(out[1]).toBe(b);
  });

  it('getFirst / getLast を公開する', () => {
    const scene = new Scene({ maxInstances: 32 });
    const a = scene.add.sprite(0, 0);
    const b = scene.add.sprite(0, 0);
    const g = scene.add.group([a, b]);
    expect(g.getFirst()).toBe(a);
    expect(g.getLast()).toBe(b);
    expect(new Group().getFirst()).toBeNull();
  });

  it('forEachInto は追加・削除中の走査にも耐える', () => {
    const scene = new Scene({ maxInstances: 32 });
    const a = scene.add.sprite(0, 0);
    const b = scene.add.sprite(0, 0);
    const g = scene.add.group([a, b]);
    const out: unknown[] = [];
    let seen = 0;
    // 走査中に remove してもずれない
    g.forEachInto(out, (item) => {
      seen++;
      g.remove(item as SpriteLike);
    });
    expect(seen).toBe(2);
    expect(g.length).toBe(0);
  });

  it('alive が false なら runChildUpdate は動かない', () => {
    const scene = new Scene({ maxInstances: 32 });
    const a = scene.add.sprite(0, 0);
    const g = scene.add.group([a]);
    g.alive = false;
    let called = 0;
    g.runChildUpdate(() => {
      called++;
    });
    expect(called).toBe(0);
    g.alive = true;
    g.runChildUpdate(() => {
      called++;
    });
    expect(called).toBe(1);
  });

  it('removeAll で空になる', () => {
    const scene = new Scene({ maxInstances: 32 });
    const g = scene.add.group([scene.add.sprite(0, 0), scene.add.sprite(0, 0)]);
    g.removeAll();
    expect(g.length).toBe(0);
  });
});

/** Group のテストで型を簡略化するためのエイリアス */
interface SpriteLike {
  id: number;
}

describe('Container (parentId SoA / 判定 C)', () => {
  it('own property は id と _arena の 2 個だけ', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(0, 0);
    const c = scene.getContainer(s.id);
    expect(Object.getOwnPropertyNames(c).sort()).toEqual(['_arena', 'id']);
    expect(ownPropertyCount(c)).toBe(2);
  });

  it('同じ ID なら毎回同じハンドルを返す', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(0, 0);
    expect(scene.getContainer(s.id)).toBe(scene.getContainer(s.id));
  });

  it('add でローカル座標に変換し、親を動かすと追従する', () => {
    const scene = new Scene({ maxInstances: 32 });
    const parentSprite = scene.add.sprite(100, 100);
    const child = scene.add.sprite(150, 130);
    const parent = scene.getContainer(parentSprite.id);
    parent.add(child.id);

    const ci = scene.arena.idToIndex[child.id];
    expect(scene.arena.localX[ci]).toBe(50);
    expect(scene.arena.localY[ci]).toBe(30);

    // 親を動かすと子が追従します
    parent.setPosition(110, 110);
    scene.arena.computeWorldTransforms();
    expect(child.x).toBe(160);
    expect(child.y).toBe(140);
  });

  it('remove でワールド座標を保ったまま親から外れる', () => {
    const scene = new Scene({ maxInstances: 32 });
    const parentSprite = scene.add.sprite(100, 100);
    const child = scene.add.sprite(150, 130);
    const parent = scene.getContainer(parentSprite.id);
    parent.add(child.id);
    scene.arena.computeWorldTransforms();
    expect(child.x).toBe(150);

    expect(parent.remove(child.id)).toBe(true);
    expect(child.parentId).toBe(-1);
    scene.arena.computeWorldTransforms();
    // 外した後もワールド座標は変わらない
    expect(child.x).toBe(150);
    expect(child.y).toBe(130);
  });

  it('自分自身は子に入れられない', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(0, 0);
    const c = scene.getContainer(s.id);
    c.add(s.id);
    expect(s.parentId).toBe(-1);
  });

  it('collectChildrenInto で子を列挙できる', () => {
    const scene = new Scene({ maxInstances: 32 });
    const parentSprite = scene.add.sprite(0, 0);
    const a = scene.add.sprite(10, 10);
    const b = scene.add.sprite(20, 20);
    const parent = scene.getContainer(parentSprite.id);
    parent.add(a.id);
    parent.add(b.id);

    const out = new Int32Array(8);
    expect(parent.collectChildrenInto(out)).toBe(2);
    expect(parent.getChildCount()).toBe(2);
  });

  it('setSize / getBounds を公開する', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(30, 40);
    const c = scene.getContainer(s.id);
    c.setSize(100, 50);
    const out = new Float32Array(4);
    c.getBounds(out);
    expect(out[0]).toBe(30);
    expect(out[1]).toBe(40);
    expect(out[2]).toBe(100);
    expect(out[3]).toBe(50);
  });

  it('空の add.container でも有効なハンドルを返す', () => {
    const scene = new Scene({ maxInstances: 32 });
    const c = scene.add.container(5, 6);
    expect(c).toBeInstanceOf(Container);
    expect(c.x).toBe(5);
    expect(c.getChildCount()).toBe(0);
  });
});

describe('Body Flyweight (R-03)', () => {
  it('own property は entityId と _physics の 2 個だけ', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(0, 0);
    const body = scene.getBody(s);
    expect(Object.getOwnPropertyNames(body).sort()).toEqual(['_physics', 'entityId']);
    expect(ownPropertyCount(body)).toBe(2);
  });

  it('setVelocity が SoA に反映される', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(0, 0);
    const body = scene.getBody(s);
    body.setVelocity(30, 40);
    expect(body.velocityX).toBe(30);
    expect(body.velocityY).toBe(40);

    scene.physics.update(1);
    expect(s.x).toBeCloseTo(30);
    expect(s.y).toBeCloseTo(40);
  });

  it('疎添字と密添字がずれても正しいエンティティに作用する', () => {
    const scene = new Scene({ maxInstances: 32 });
    const a = scene.add.sprite(0, 0);
    const b = scene.add.sprite(0, 0);
    const c = scene.add.sprite(0, 0);

    scene.getBody(a).setVelocity(10, 0);
    scene.getBody(b).setVelocity(20, 0);
    scene.getBody(c).setVelocity(30, 0);

    // b と c を解放すると、a の密添字は変わらないが他がずれる
    scene.arena.free(b.id);
    scene.arena.free(c.id);
    expect(scene.arena.activeCount).toBe(1);

    scene.physics.update(1);
    // a だけが 10 進みます（ずれた添字へ書き込みがないことの確認）
    expect(a.x).toBeCloseTo(10);
  });

  it('setAcceleration が速度に加算される', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(0, 0);
    const body = scene.getBody(s);
    body.setAcceleration(100, 0);
    // 1 秒で 100 進みます（初速 0）
    scene.physics.update(1);
    expect(s.x).toBeCloseTo(100);
  });

  it('setDrag で速度が減衰する', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(0, 0);
    const body = scene.getBody(s);
    body.setVelocity(100, 0);
    body.setDrag(0.5);
    scene.physics.update(1);
    // 100 - 100*0.5 = 50
    expect(body.velocityX).toBeCloseTo(50);
  });

  it('setMaxVelocity で上限に達する', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(0, 0);
    const body = scene.getBody(s);
    body.setVelocity(1000, 0);
    body.setMaxVelocity(50, 0);
    scene.physics.update(1);
    expect(body.velocityX).toBeCloseTo(50);
  });

  it('setCircle / setSize / setOffset を公開する', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(0, 0);
    const body = scene.getBody(s);
    body.setCircle(20);
    expect(body.radius).toBe(20);
    body.setSize(30, 40);
    // setSize は radius を無効化します
    expect(body.radius).toBe(0);
    expect(scene.physics.getHalfWidth(s.id)).toBe(15);
    expect(scene.physics.getHalfHeight(s.id)).toBe(20);
    body.setOffset(3, 4);
    expect(scene.physics.getBodyX(s.id)).toBe(0);
  });

  it('reset で速度と加速度が消える', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(0, 0);
    const body = scene.getBody(s);
    body.setVelocity(100, 100);
    body.setAcceleration(50, 50);
    body.setDrag(0.5);
    body.reset();
    expect(body.velocityX).toBe(0);
    expect(body.accelerationX).toBe(0);
    expect(body.drag).toBe(0);
  });

  it('Sprite.body が Body を返す', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(0, 0);
    const body = s.body;
    expect(body).toBeInstanceOf(Body);
    // キャッシュ済みなので同じインスタンス
    expect(s.body).toBe(body);
  });

  it('speed と angle が SoA の速度から算出される', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(0, 0);
    const body = scene.getBody(s);
    body.setVelocity(3, 4);
    expect(body.speed).toBeCloseTo(5);
    expect(body.angle).toBeCloseTo(Math.atan2(4, 3));

    body.setVelocityFromAngle(90, 10);
    expect(body.velocityX).toBeCloseTo(0);
    expect(body.velocityY).toBeCloseTo(10);
  });

  it('enable/disable が SoA に反映される', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(0, 0);
    const body = scene.getBody(s);
    // 既定は有効
    expect(body.enabled).toBe(true);
    expect(scene.physics.getEnabled(s.id)).toBe(true);

    body.setVelocity(100, 0);
    body.disable();
    expect(scene.physics.getEnabled(s.id)).toBe(false);
    scene.physics.update(1);
    // 無効なので積分されない
    expect(s.x).toBeCloseTo(0);

    body.enable();
    scene.physics.update(1);
    expect(s.x).toBeCloseTo(100);
  });

  it('setFriction が SoA に反映され、加速度 0 のときだけ減衰する', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(0, 0);
    const body = scene.getBody(s);
    body.setVelocity(100, 0);
    body.setFriction(0.5);
    expect(scene.physics.getFriction(s.id)).toBe(0.5);

    scene.physics.update(1);
    // 100 - 100 * 0.5 = 50
    expect(body.velocityX).toBeCloseTo(50);
  });

  it('摩擦は加速度があると効かない（drag と区別される）', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(0, 0);
    const body = scene.getBody(s);
    body.setVelocity(0, 0);
    body.setAcceleration(100, 0);
    body.setFriction(0.9);
    scene.physics.update(1);
    // 加速度で立てた速度は摩擦で削られない
    expect(body.velocityX).toBeCloseTo(100);
  });

  it('frictionStatic で完全停止する', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(0, 0);
    const body = scene.getBody(s);
    body.setVelocity(3, 0);
    body.setFriction(0.5, 2);
    scene.physics.update(1);
    // 3 - 1.5 = 1.5 で 2 以下なので 0 に丸められる
    expect(body.velocityX).toBe(0);
  });

  it('enable が 0 のエンティティは update の積分から除外される（疎添字のずれも無い）', () => {
    const scene = new Scene({ maxInstances: 32 });
    const a = scene.add.sprite(0, 0);
    const b = scene.add.sprite(0, 0);
    scene.getBody(a).setVelocity(10, 0);
    scene.getBody(b).setVelocity(20, 0);
    scene.getBody(b).disable();

    scene.physics.update(1);
    expect(a.x).toBeCloseTo(10);
    expect(b.x).toBeCloseTo(0);
  });
});

describe('physics.add.group / staticGroup', () => {
  it('group は Array ベースの Group を返す（SoA を汚さない）', () => {
    const scene = new Scene({ maxInstances: 32 });
    const a = scene.add.sprite(0, 0);
    const b = scene.add.sprite(0, 0);
    const g = scene.physics.add.group([a, b]);
    expect(g).toBeInstanceOf(Group);
    expect(g.getLength()).toBe(2);
    expect(g.contains(a)).toBe(true);
  });

  it('staticGroup は所属メンバーに immovable を立てる', () => {
    const scene = new Scene({ maxInstances: 32 });
    const a = scene.add.sprite(0, 0);
    const b = scene.add.sprite(0, 0);
    const g = scene.physics.add.staticGroup([a, b]);
    expect(g.getLength()).toBe(2);
    expect(scene.physics.getImmovable(a.id)).toBe(true);
    expect(scene.physics.getImmovable(b.id)).toBe(true);
  });

  it('staticGroup は後から add したメンバーにも immovable を立てる', () => {
    const scene = new Scene({ maxInstances: 32 });
    const g = scene.physics.add.staticGroup();
    const a = scene.add.sprite(0, 0);
    g.add(a);
    expect(scene.physics.getImmovable(a.id)).toBe(true);
  });

  it('group は immovable を立てない（group と staticGroup の差）', () => {
    const scene = new Scene({ maxInstances: 32 });
    const a = scene.add.sprite(0, 0);
    scene.physics.add.group([a]);
    expect(scene.physics.getImmovable(a.id)).toBe(false);
  });
});

describe('World Flyweight (R-03)', () => {
  it('own property は _physics の 1 個だけ', () => {
    const scene = new Scene({ maxInstances: 32 });
    const w = scene.world;
    expect(Object.getOwnPropertyNames(w)).toEqual(['_physics']);
    expect(ownPropertyCount(w)).toBe(1);
  });

  it('setBoundsRectangle で境界を設定できる', () => {
    const scene = new Scene({ maxInstances: 32 });
    scene.world.setBoundsRectangle(0, 0, 200, 200);
    expect(scene.world.hasBounds).toBe(true);
    const out = new Float32Array(4);
    scene.world.getBounds(out);
    expect(out[0]).toBe(0);
    expect(out[1]).toBe(0);
    expect(out[2]).toBe(200);
    expect(out[3]).toBe(200);
  });

  it('重力が速度に加算される', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(0, 0);
    scene.world.gravityY = 100;
    scene.physics.update(1);
    expect(scene.getBody(s).velocityY).toBeCloseTo(100);
  });

  it('ワールド境界で反射する', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(0, 0);
    scene.world.setBounds(100, 100);
    const body = scene.getBody(s);
    body.setCollideWorldBounds(true);
    // Phaser 標準では bounce の既定は 0 なので、反発せず止まります。
    // 反発させるには明示的に bounce を設定します。
    body.setBounce(1);
    body.setVelocity(200, 0);
    // 当たり判定矩形の中心が境界を越える点で反射するため、
    // 既定サイズ 32 のスプライトなら中心は 100 - 16 = 84 で止まります。
    scene.physics.update(1);
    expect(s.x).toBeCloseTo(84);
    expect(body.velocityX).toBeCloseTo(-200);
  });

  it('bounce 0 なら境界で止まる（Phaser 互換）', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(0, 0);
    scene.world.setBounds(100, 100);
    const body = scene.getBody(s);
    body.setCollideWorldBounds(true);
    body.setVelocity(200, 0);
    scene.physics.update(1);
    expect(s.x).toBeCloseTo(84);
    expect(body.velocityX).toBeCloseTo(0);
  });

  it('collideWorldBounds が無効なら境界外へ出られる', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(0, 0);
    scene.world.setBounds(100, 100);
    scene.getBody(s).setVelocity(200, 0);
    scene.physics.update(1);
    expect(s.x).toBeCloseTo(200);
  });

  it('isOutsideWorld を公開する', () => {
    const scene = new Scene({ maxInstances: 32 });
    const s = scene.add.sprite(50, 50);
    scene.world.setBounds(100, 100);
    expect(scene.world.isOutsideWorld(s.id)).toBe(false);
    s.x = 500;
    expect(scene.world.isOutsideWorld(s.id)).toBe(true);
  });

  it('clearBounds で境界が消える', () => {
    const scene = new Scene({ maxInstances: 32 });
    scene.world.setBounds(100, 100);
    scene.world.clearBounds();
    expect(scene.world.hasBounds).toBe(false);
  });
});

describe('SoundHandle Flyweight (R-03)', () => {
  it('own property は voiceIndex と _manager の 2 個だけ', () => {
    const sound = new SoundManager();
    const h = new SoundHandle(sound, -1);
    expect(Object.getOwnPropertyNames(h).sort()).toEqual(['_manager', 'voiceIndex']);
    expect(ownPropertyCount(h)).toBe(2);
  });

  it('未割当ハンドルは安全な既定値を返す', () => {
    const sound = new SoundManager();
    const h = new SoundHandle(sound, -1);
    expect(h.isPlaying).toBe(false);
    expect(h.isPaused).toBe(false);
    expect(h.key).toBe('');
    expect(h.volume).toBe(0);
    expect(h.rate).toBe(1);
    expect(h.x).toBe(0);
    expect(() => h.stop()).not.toThrow();
  });

  it('stop したハンドルは再利用される（毎回の new がない）', () => {
    const sound = new SoundManager();
    sound.add('hit', makeSilentBuffer(sound.context));
    const a = sound.play('hit');
    expect(a).not.toBeNull();
    if (!a) return;
    const first = a;

    // 再生中は貸出中なので別のハンドルになります
    const b = sound.play('hit');
    expect(b).not.toBe(first);

    // 両方止めるとハンドルが空き、最初のハンドルが再利用されます
    first.stop();
    b?.stop();
    const c = sound.play('hit');
    expect(c).toBe(first);
  });

  it('同時に鳴らせるのはボイス数まで', () => {
    const sound = new SoundManager({ poolSize: 2 });
    sound.add('hit', makeSilentBuffer(sound.context));
    expect(sound.play('hit')).not.toBeNull();
    expect(sound.play('hit')).not.toBeNull();
    // 3 本目はプール枯渇で null
    expect(sound.play('hit')).toBeNull();
  });
});

/** 実際に鳴らさない無音バッファを作ります。 */
function makeSilentBuffer(ctx: AudioContext): AudioBuffer {
  return ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.1), ctx.sampleRate);
}

describe('ParticleEmitter Flyweight (R-03)', () => {
  it('own property は id と _manager の 2 個だけ', () => {
    const scene = new Scene({ maxInstances: 64 });
    const e = scene.particles.create({ x: 0, y: 0 });
    expect(e).toBeInstanceOf(ParticleEmitter);
    if (!e) throw new Error('エミッター生成失敗');
    expect(Object.getOwnPropertyNames(e).sort()).toEqual(['_manager', 'id']);
    expect(ownPropertyCount(e)).toBe(2);
  });

  it('emitParticle で粒子が生成される', () => {
    const scene = new Scene({ maxInstances: 64 });
    const e = scene.particles.create({ x: 10, y: 10 });
    if (!e) throw new Error('エミッター生成失敗');
    expect(scene.particles.particleCount).toBe(0);
    e.emitParticle();
    expect(scene.particles.particleCount).toBe(1);
  });

  it('explode でまとめて生成できる', () => {
    const scene = new Scene({ maxInstances: 64 });
    const e = scene.particles.create({ x: 0, y: 0 });
    if (!e) throw new Error('エミッター生成失敗');
    expect(e.explode(5)).toBe(5);
    expect(scene.particles.particleCount).toBe(5);
  });

  it('start で毎フレーム生成が始まる', () => {
    const scene = new Scene({ maxInstances: 256 });
    const e = scene.particles.create({ x: 0, y: 0, frequency: 60, lifespan: 10000 });
    if (!e) throw new Error('エミッター生成失敗');
    e.start();
    expect(e.isEmitting).toBe(true);
    // 1 秒で 60 個 (端数は持ち越す)
    scene.particles.update(0.5);
    expect(scene.particles.particleCount).toBe(30);
    scene.particles.update(0.5);
    expect(scene.particles.particleCount).toBe(60);
    e.stop();
    expect(e.isEmitting).toBe(false);
  });

  it('寿命を過ぎると粒子が消える', () => {
    const scene = new Scene({ maxInstances: 64 });
    const e = scene.particles.create({ x: 0, y: 0, lifespan: 100 });
    if (!e) throw new Error('エミッター生成失敗');
    e.emitParticleAt(3);
    expect(scene.particles.particleCount).toBe(3);
    // 寿命 100ms なので 0.2 秒進めると消えます
    scene.particles.update(0.2);
    expect(scene.particles.particleCount).toBe(0);
  });

  it('setConfig で設定を書き換えられる', () => {
    const scene = new Scene({ maxInstances: 64 });
    const e = scene.particles.create({ x: 0, y: 0, speed: 10 });
    if (!e) throw new Error('エミッター生成失敗');
    e.setConfig({ x: 50, y: 60, frequency: 10 });
    expect(e.x).toBe(50);
    expect(e.y).toBe(60);
    expect(e.frequency).toBe(10);
  });

  it('旧 API の createEmitter は burst として動く', () => {
    const scene = new Scene({ maxInstances: 64 });
    const made = scene.particles.createEmitter({
      x: 0,
      y: 0,
      count: 4,
      speed: 10,
      life: 1000,
    });
    expect(made).toBe(4);
    expect(scene.particles.particleCount).toBe(4);
  });

  it('ParticleManager を直接使うと初期化が必要なのに例外を出さない', () => {
    const pm = new ParticleManager(16, 4);
    expect(pm.particleCount).toBe(0);
    expect(pm.create({ x: 0 })).toBeInstanceOf(ParticleEmitter);
  });
});

describe('TilemapLayer Flyweight (R-03)', () => {
  function makeTiledJson(): Record<string, unknown> {
    return {
      width: 4,
      height: 4,
      tilewidth: 16,
      tileheight: 16,
      layers: [
        {
          type: 'tilelayer',
          visible: true,
          opacity: 1,
          x: 0,
          y: 0,
          // 0 は空き、1 は 1 行目のタイル
          data: [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
      tilesets: [
        {
          firstgid: 1,
          image: 'tiles.png',
          name: 'tiles',
          tilewidth: 16,
          tileheight: 16,
          columns: 4,
          count: 8,
        },
      ],
    };
  }

  it('own property は index と _map の 2 個だけ', () => {
    const scene = new Scene({ maxInstances: 64 });
    const map = new Tilemap(scene.arena, makeTiledJson() as never, 16);
    const layer = map.getLayer(0);
    expect(Object.getOwnPropertyNames(layer).sort()).toEqual(['_map', 'index']);
    expect(ownPropertyCount(layer)).toBe(2);
  });

  it('tileIndex で gid を取得できる', () => {
    const scene = new Scene({ maxInstances: 64 });
    const map = new Tilemap(scene.arena, makeTiledJson() as never, 16);
    const layer = map.getLayer(0);
    expect(layer.tileIndex(0, 0)).toBe(1);
    expect(layer.tileIndex(1, 0)).toBe(1);
    // 範囲外は 0
    expect(layer.tileIndex(99, 99)).toBe(0);
  });

  it('setCollisionByIndex で衝突が立つ', () => {
    const scene = new Scene({ maxInstances: 64 });
    const map = new Tilemap(scene.arena, makeTiledJson() as never, 16);
    const layer = map.getLayer(0);
    expect(layer.collides(0, 0)).toBe(false);
    expect(layer.setCollisionByIndex(1, true)).toBe(4);
    expect(layer.collides(0, 0)).toBe(true);
    // gid 0 のマスは衝突ではない
    expect(layer.collides(4, 0)).toBe(false);
    expect(layer.collides(0, 1)).toBe(false);
  });

  it('setCollision で複数 gid をまとめて設定できる', () => {
    const scene = new Scene({ maxInstances: 64 });
    const map = new Tilemap(scene.arena, makeTiledJson() as never, 16);
    const layer = map.getLayer(0);
    expect(layer.setCollision([1, 2])).toBe(4);
  });

  it('setPosition がレイヤーオフセットへ反映される', () => {
    const scene = new Scene({ maxInstances: 64 });
    const map = new Tilemap(scene.arena, makeTiledJson() as never, 16);
    const layer = map.getLayer(0);
    layer.setPosition(32, 48);
    expect(layer.scrollX).toBe(32);
    expect(layer.scrollY).toBe(48);
  });

  it('getBounds がマップ寸法を返す', () => {
    const scene = new Scene({ maxInstances: 64 });
    const map = new Tilemap(scene.arena, makeTiledJson() as never, 16);
    const out = map.getLayer(0).getBounds(new Float32Array(4));
    expect(out[2]).toBe(64); // 4 * 16
    expect(out[3]).toBe(64);
  });

  it('gid をフレーム番号へ変換できる', () => {
    const scene = new Scene({ maxInstances: 64 });
    const map = new Tilemap(scene.arena, makeTiledJson() as never, 16);
    expect(map.gidToFrame(1)).toBe(0);
    expect(map.gidToFrame(4)).toBe(3);
    // 範囲外
    expect(map.gidToFrame(0)).toBe(-1);
    expect(map.gidToFrame(100)).toBe(-1);
  });

  it('tileCount が存在的タイルを数える', () => {
    const scene = new Scene({ maxInstances: 64 });
    const map = new Tilemap(scene.arena, makeTiledJson() as never, 16);
    expect(map.getLayer(0).tileCount).toBe(4);
  });

  it('同じインデックスなら毎回同じハンドルを返す', () => {
    const scene = new Scene({ maxInstances: 64 });
    const map = new Tilemap(scene.arena, makeTiledJson() as never, 16);
    expect(map.getLayer(0)).toBe(map.getLayer(0));
  });

  it('Tiled の object layer から衝突を拾う', () => {
    const scene = new Scene({ maxInstances: 64 });
    const json = {
      ...makeTiledJson(),
      objectlayers: [
        {
          name: 'collision',
          visible: true,
          objects: [{ gid: 0, x: 0, y: 0, width: 32, height: 16 }],
        },
      ],
    };
    const map = new Tilemap(scene.arena, json as never, 16);
    const layer = map.getLayer(0);
    // 32x16 = 2x1 タイル分
    expect(layer.collides(0, 0)).toBe(true);
    expect(layer.collides(1, 0)).toBe(true);
    expect(layer.collides(2, 0)).toBe(false);
    expect(layer.collides(0, 1)).toBe(false);
  });
});
