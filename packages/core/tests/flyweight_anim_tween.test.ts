import { describe, expect, it } from 'vitest';
import {
  AnimState,
  AnimationManager,
  InstanceBufferArena,
  Tween,
  TweenManager,
} from '../src/index';
import { Scene } from '../src/scene/Scene';

function ownPropertyCount(obj: object): number {
  return Object.getOwnPropertyNames(obj).length;
}

/**
 * テスト用のアリーナと、そこに登録済みのエンティティ ID を用意します。
 *
 * AnimationManager.update() は `arena.idToIndex[entityId]` が 0 未満だと
 * アニメーションを解放してしまうため、実際のスロットが必要です。
 */
function makeEntity(): { arena: InstanceBufferArena; entityId: number } {
  const arena = new InstanceBufferArena(64);
  return { arena, entityId: arena.allocate() };
}

describe('AnimState Flyweight (R-03)', () => {
  it('own property は slot と _manager の 2 個だけ', () => {
    const { arena } = makeEntity();
    const anim = new AnimationManager(arena, 16);
    const st = new AnimState(0, anim);
    expect(Object.getOwnPropertyNames(st).sort()).toEqual(['_manager', 'slot']);
    expect(ownPropertyCount(st)).toBe(2);
  });

  it('play は AnimState ハンドルを返す', () => {
    const { arena, entityId } = makeEntity();
    const anim = new AnimationManager(arena, 16);
    anim.create({ key: 'walk', frames: [0, 1, 2, 3], frameRate: 10, repeat: -1 });
    const st = anim.play(entityId, 'walk');
    expect(st).toBeInstanceOf(AnimState);
    expect(st?.isPlaying).toBe(true);
  });

  it('同じスロットなら毎回同じハンドルを返す（毎フレーム new しない）', () => {
    const { arena, entityId } = makeEntity();
    const anim = new AnimationManager(arena, 16);
    anim.create({ key: 'walk', frames: [0, 1, 2, 3], frameRate: 10, repeat: -1 });
    const a = anim.play(entityId, 'walk');
    const b = anim.play(entityId, 'walk');
    expect(a).toBe(b);
  });

  it('未定義キーは null を返す', () => {
    const { arena, entityId } = makeEntity();
    const anim = new AnimationManager(arena, 16);
    expect(anim.play(entityId, 'no_such')).toBeNull();
  });

  it('pause / resume でコマが進まなくなる', () => {
    const { arena, entityId } = makeEntity();
    const anim = new AnimationManager(arena, 16);
    anim.create({ key: 'walk', frames: [0, 1, 2, 3], frameRate: 10, repeat: -1 });
    const st = anim.play(entityId, 'walk');
    if (!st) throw new Error('ハンドル取得失敗');

    st.pause();
    expect(st.isPaused).toBe(true);
    const before = st.currentFrame;
    // frameRate 10 = 1コマ 0.1 秒。0.5 秒進ませてもコマは変わらない
    anim.update(0.5);
    expect(st.currentFrame).toBe(before);

    st.resume();
    expect(st.isPaused).toBe(false);
    anim.update(0.15);
    expect(st.currentFrame).toBeGreaterThan(before);
  });

  it('stop でハンドルが無効化される', () => {
    const { arena, entityId } = makeEntity();
    const anim = new AnimationManager(arena, 16);
    anim.create({ key: 'walk', frames: [0, 1, 2, 3], frameRate: 10, repeat: -1 });
    const st = anim.play(entityId, 'walk');
    if (!st) throw new Error('ハンドル取得失敗');
    st.stop();
    expect(st.isPlaying).toBe(false);
    expect(st.isValid).toBe(false);
    expect(st.slot).toBe(-1);
    // 二重解放しても安全
    expect(() => st.stop()).not.toThrow();
  });

  it('currentFrame / totalFrames を公開する', () => {
    const { arena, entityId } = makeEntity();
    const anim = new AnimationManager(arena, 16);
    anim.create({ key: 'walk', frames: [0, 1, 2, 3], frameRate: 10, repeat: -1 });
    const st = anim.play(entityId, 'walk');
    if (!st) throw new Error('ハンドル取得失敗');
    expect(st.totalFrames).toBe(4);
    expect(st.currentFrame).toBe(0);
  });

  it('progress は 0 から始まり 1 未満', () => {
    const { arena, entityId } = makeEntity();
    const anim = new AnimationManager(arena, 16);
    anim.create({ key: 'walk', frames: [0, 1, 2, 3], frameRate: 10, repeat: -1 });
    const st = anim.play(entityId, 'walk');
    if (!st) throw new Error('ハンドル取得失敗');
    expect(st.progress).toBe(0);
    anim.update(0.2); // 2コマ (0.1 秒 x 2)
    const p = st.progress;
    expect(p).toBeGreaterThan(0);
    expect(p).toBeLessThanOrEqual(1);
  });

  it('playReverse は最終コマから開始する', () => {
    const { arena, entityId } = makeEntity();
    const anim = new AnimationManager(arena, 16);
    anim.create({ key: 'walk', frames: [0, 1, 2, 3], frameRate: 10, repeat: -1 });
    const st = anim.playReverse(entityId, 'walk');
    if (!st) throw new Error('ハンドル取得失敗');
    expect(st.isPlayingReverse).toBe(true);
    // 4 コマの最終コマから開始
    expect(st.currentFrame).toBe(3);
  });

  it('逆再生ではコマ番号が減る', () => {
    const { arena, entityId } = makeEntity();
    const anim = new AnimationManager(arena, 16);
    anim.create({ key: 'walk', frames: [0, 1, 2, 3], frameRate: 10, repeat: -1 });
    const st = anim.playReverse(entityId, 'walk');
    if (!st) throw new Error('ハンドル取得失敗');
    const before = st.currentFrame;
    anim.update(0.15);
    expect(st.currentFrame).toBeLessThan(before);
  });

  it('setDirection で正再生へ戻せる', () => {
    const { arena, entityId } = makeEntity();
    const anim = new AnimationManager(arena, 16);
    anim.create({ key: 'walk', frames: [0, 1, 2, 3], frameRate: 10, repeat: -1 });
    const st = anim.play(entityId, 'walk');
    if (!st) throw new Error('ハンドル取得失敗');
    st.setDirection(true);
    expect(st.isPlayingReverse).toBe(true);
    st.setDirection(false);
    expect(st.isPlayingReverse).toBe(false);
  });

  it('stopIfPlaying は再生中だけ停止する', () => {
    const { arena, entityId } = makeEntity();
    const anim = new AnimationManager(arena, 16);
    anim.create({ key: 'walk', frames: [0, 1, 2, 3], frameRate: 10, repeat: -1 });
    const st = anim.play(entityId, 'walk');
    if (!st) throw new Error('ハンドル取得失敗');
    st.stopIfPlaying();
    expect(st.isPlaying).toBe(false);
    // 停止済みにもう一度呼んでも安全
    expect(() => st.stopIfPlaying()).not.toThrow();
  });

  it('Sprite.anims が AnimationManager 未初期化なら null を返す', () => {
    const scene = new Scene({ maxInstances: 32 });
    const sprite = scene.add.sprite(0, 0);
    expect(sprite.anims).toBeNull();
  });

  it('Sprite.anims は anim を触った後に AnimState を返す', () => {
    const scene = new Scene({ maxInstances: 32 });
    const sprite = scene.add.sprite(0, 0);
    scene.anim.create({ key: 'walk', frames: [0, 1], frameRate: 10, repeat: -1 });
    sprite.play('walk');
    const st = sprite.anims;
    expect(st).toBeInstanceOf(AnimState);
    expect(st?.isPlaying).toBe(true);
  });
});

describe('AnimationManager の Flyweight 用アクセサ', () => {
  it('getSlot は再生中ならスロット番号を返す', () => {
    const { arena, entityId } = makeEntity();
    const anim = new AnimationManager(arena, 16);
    anim.create({ key: 'a', frames: [0, 1], frameRate: 10, repeat: -1 });
    expect(anim.getSlot(entityId)).toBe(-1);
    anim.play(entityId, 'a');
    expect(anim.getSlot(entityId)).toBeGreaterThanOrEqual(0);
  });

  it('isSlotActive / isSlotPaused / isSlotReverse を公開する', () => {
    const { arena, entityId } = makeEntity();
    const anim = new AnimationManager(arena, 16);
    anim.create({ key: 'a', frames: [0, 1], frameRate: 10, repeat: -1 });
    const slot = anim.getSlot(entityId);
    expect(anim.isSlotActive(slot)).toBe(false);
    anim.play(entityId, 'a');
    const s = anim.getSlot(entityId);
    expect(anim.isSlotActive(s)).toBe(true);
    expect(anim.isSlotPaused(s)).toBe(false);
    expect(anim.isSlotReverse(s)).toBe(false);
  });

  it('clear で全スロットを解放する', () => {
    const { arena, entityId } = makeEntity();
    const anim = new AnimationManager(arena, 16);
    anim.create({ key: 'a', frames: [0, 1], frameRate: 10, repeat: -1 });
    anim.play(entityId, 'a');
    anim.clear();
    expect(anim.getSlot(entityId)).toBe(-1);
    expect(anim.active.filter((v) => v === 1).length).toBe(0);
  });

  it('エンティティが破棄されると再生も自動終了する', () => {
    const { arena, entityId } = makeEntity();
    const anim = new AnimationManager(arena, 16);
    anim.create({ key: 'a', frames: [0, 1], frameRate: 10, repeat: -1 });
    anim.play(entityId, 'a');
    expect(anim.getSlot(entityId)).toBeGreaterThanOrEqual(0);
    arena.free(entityId);
    anim.update(0.016);
    expect(anim.getSlot(entityId)).toBe(-1);
  });
});

describe('Tween Flyweight (R-03)', () => {
  it('own property は id と _manager の 2 個だけ', () => {
    const { arena } = makeEntity();
    const tweens = new TweenManager(arena, 16);
    const t = new Tween(0, tweens);
    expect(Object.getOwnPropertyNames(t).sort()).toEqual(['_manager', 'id']);
    expect(ownPropertyCount(t)).toBe(2);
  });

  it('add は Tween ハンドルを返す', () => {
    const scene = new Scene({ maxInstances: 32 });
    const sprite = scene.add.sprite(0, 0);
    const t = scene.tweens.add({ targets: sprite, props: { x: 100 }, duration: 1000 });
    expect(t).toBeInstanceOf(Tween);
    expect(t.isPlaying).toBe(true);
    expect(t.isDestroyed).toBe(false);
  });

  it('isPaused / pause / resume が SoA に反映される', () => {
    const scene = new Scene({ maxInstances: 32 });
    const sprite = scene.add.sprite(0, 0);
    const t = scene.tweens.add({ targets: sprite, props: { x: 100 }, duration: 1000 });
    t.pause();
    expect(t.isPaused).toBe(true);
    scene.tweens.update(500);
    expect(sprite.x).toBe(0);
    t.resume();
    expect(t.isPaused).toBe(false);
    scene.tweens.update(500);
    expect(sprite.x).toBeCloseTo(50);
  });

  it('progress / elapsed / duration を公開する', () => {
    const scene = new Scene({ maxInstances: 32 });
    const sprite = scene.add.sprite(0, 0);
    const t = scene.tweens.add({ targets: sprite, props: { x: 100 }, duration: 1000 });
    expect(t.duration).toBe(1000);
    expect(t.elapsed).toBe(0);
    expect(t.progress).toBe(0);
    scene.tweens.update(500);
    expect(t.elapsed).toBeCloseTo(500);
    expect(t.progress).toBeCloseTo(0.5);
  });

  it('stop でハンドルが無効化される', () => {
    const scene = new Scene({ maxInstances: 32 });
    const sprite = scene.add.sprite(0, 0);
    const t = scene.tweens.add({ targets: sprite, props: { x: 100 }, duration: 1000 });
    t.stop();
    expect(t.isPlaying).toBe(false);
    expect(t.isDestroyed).toBe(true);
    expect(t.id).toBe(-1);
    expect(scene.tweens.count).toBe(0);
    // 二重停止しても安全
    expect(() => t.stop()).not.toThrow();
  });

  it('reset で開始値へ戻る', () => {
    const scene = new Scene({ maxInstances: 32 });
    const sprite = scene.add.sprite(0, 0);
    const t = scene.tweens.add({ targets: sprite, props: { x: 100 }, duration: 1000 });
    scene.tweens.update(500);
    expect(sprite.x).toBeCloseTo(50);
    t.reset();
    expect(t.elapsed).toBe(0);
    expect(sprite.x).toBe(0);
  });

  it('seek で指定位置の値を適用する', () => {
    const scene = new Scene({ maxInstances: 32 });
    const sprite = scene.add.sprite(0, 0);
    const t = scene.tweens.add({ targets: sprite, props: { x: 100 }, duration: 1000 });
    t.seek(250);
    expect(sprite.x).toBeCloseTo(25);
    expect(t.elapsed).toBeCloseTo(250);
  });

  it('seek は範囲内にクランプされる', () => {
    const scene = new Scene({ maxInstances: 32 });
    const sprite = scene.add.sprite(0, 0);
    const t = scene.tweens.add({ targets: sprite, props: { x: 100 }, duration: 1000 });
    t.seek(-100);
    expect(sprite.x).toBe(0);
    t.seek(99999);
    expect(sprite.x).toBeCloseTo(100);
  });

  it('play は no-op（SoA の状態は保持される）', () => {
    const scene = new Scene({ maxInstances: 32 });
    const sprite = scene.add.sprite(0, 0);
    const t = scene.tweens.add({ targets: sprite, props: { x: 100 }, duration: 1000 });
    t.play();
    expect(t.isPlaying).toBe(true);
  });

  it('killTweensOfGroup はハンドルも受け付ける', () => {
    const scene = new Scene({ maxInstances: 32 });
    const sprite = scene.add.sprite(0, 0);
    const t = scene.tweens.add({ targets: sprite, props: { x: 100, y: 100 }, duration: 1000 });
    expect(scene.tweens.killTweensOfGroup(t)).toBe(2);
    expect(scene.tweens.count).toBe(0);
  });

  it('killTweensOfGroup は数値も受け付ける（後方互換）', () => {
    const scene = new Scene({ maxInstances: 32 });
    const sprite = scene.add.sprite(0, 0);
    const t = scene.tweens.add({ targets: sprite, props: { x: 100, y: 100 }, duration: 1000 });
    expect(scene.tweens.killTweensOfGroup(t.id)).toBe(2);
  });

  it('clear でハンドルの Map も解放される', () => {
    const scene = new Scene({ maxInstances: 32 });
    const sprite = scene.add.sprite(0, 0);
    scene.tweens.add({ targets: sprite, props: { x: 100 }, duration: 1000 });
    scene.tweens.clear();
    expect(scene.tweens.count).toBe(0);
    expect(scene.tweens.paused.filter((v) => v === 1).length).toBe(0);
  });

  it('チェーンもハンドルを返す', () => {
    const scene = new Scene({ maxInstances: 32 });
    const sprite = scene.add.sprite(0, 0);
    const t = scene.tweens.chain([
      { targets: sprite, props: { x: 50 }, duration: 100 },
      { targets: sprite, props: { y: 50 }, duration: 100 },
    ]);
    expect(t).toBeInstanceOf(Tween);
    expect(t.isPlaying).toBe(true);
  });

  it('空チェーンでもハンドルを返す', () => {
    const scene = new Scene({ maxInstances: 32 });
    const t = scene.tweens.chain([]);
    expect(t).toBeInstanceOf(Tween);
    expect(t.isPlaying).toBe(false);
  });
});

describe('TweenManager の Flyweight 用アクセサ', () => {
  it('isGroupActive / isGroupPlaying を公開する', () => {
    const scene = new Scene({ maxInstances: 32 });
    const sprite = scene.add.sprite(0, 0);
    const t = scene.tweens.add({ targets: sprite, props: { x: 100 }, duration: 1000 });
    expect(scene.tweens.isGroupActive(t.id)).toBe(true);
    expect(scene.tweens.isGroupPlaying(t.id)).toBe(true);
    expect(scene.tweens.isGroupActive(-1)).toBe(false);
  });

  it('isGroupPaused を公開する', () => {
    const scene = new Scene({ maxInstances: 32 });
    const sprite = scene.add.sprite(0, 0);
    const t = scene.tweens.add({ targets: sprite, props: { x: 100 }, duration: 1000 });
    expect(scene.tweens.isGroupPaused(t.id)).toBe(false);
    scene.tweens.pauseGroup(t.id);
    expect(scene.tweens.isGroupPaused(t.id)).toBe(true);
  });

  it('getGroupProgress は複数スロットで最大値を返す', () => {
    const scene = new Scene({ maxInstances: 32 });
    const a = scene.add.sprite(0, 0);
    const b = scene.add.sprite(0, 0);
    // a は 1000ms、b は 500ms
    const t = scene.tweens.add({ targets: a, props: { x: 100 }, duration: 1000 });
    scene.tweens.add({ targets: b, props: { x: 100 }, duration: 500 });
    scene.tweens.update(250);
    // a は 0.25
    expect(scene.tweens.getGroupProgress(t.id)).toBeCloseTo(0.25);
  });

  it('stopGroup はスロット数を返す', () => {
    const scene = new Scene({ maxInstances: 32 });
    const sprite = scene.add.sprite(0, 0);
    const t = scene.tweens.add({ targets: sprite, props: { x: 100, y: 100 }, duration: 1000 });
    expect(scene.tweens.stopGroup(t.id)).toBe(2);
    expect(scene.tweens.count).toBe(0);
  });
});
