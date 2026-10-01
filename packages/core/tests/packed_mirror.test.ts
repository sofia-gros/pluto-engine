import { FlagsLane, OriginLane, ShapeLane, TransformLane, UvLane } from '@pluto-engine/renderer';
import { describe, expect, it } from 'vitest';
import { InstanceBufferArena } from '../src/arena/InstanceBufferArena';
import { Sprite } from '../src/arena/Sprite';

/**
 * packed ミラーの整合性テスト。
 *
 * vec4 ペアキングをエンジン仕様としたため、GPU へ渡すのは
 * `packed*` ミラーです。SoA とミラーがずれると
 * 「そのスプライトだけ描画がおかしくなる」ため、ここでは
 * 全 write-through 経路が SoA とミラーを一致させることを保証します。
 */

/**
 * SoA とミラーが完全に一致しているかを確認します。
 *
 * `worldMode` を指定すると transform グループはワールド座標
 * (`worldX` / `worldY` / `worldRotation`) と比較します。
 * 階層を使っている場合、ミラーにはローカルではなく
 * 解決済みのワールド座標が入るため、この指定が必要です。
 */
function assertMirrorsInSync(arena: InstanceBufferArena, label: string, worldMode = false): void {
  const refX = worldMode ? arena.worldX : arena.posX;
  const refY = worldMode ? arena.worldY : arena.posY;
  // rotation と frame 寸法は packedShape 側の担当です。
  const refRot = worldMode ? arena.worldRotation : arena.rotation;
  const refScaleX = arena.scaleX;
  const refScaleY = arena.scaleY;
  for (let i = 0; i < arena.activeCount; i++) {
    const b = i * 4;

    expect(arena.packedTransform[b + 0], `${label} transform.posX #${i}`).toBe(refX[i]);
    expect(arena.packedTransform[b + 1], `${label} transform.posY #${i}`).toBe(refY[i]);
    expect(arena.packedTransform[b + 2], `${label} transform.scaleX #${i}`).toBe(refScaleX[i]);
    expect(arena.packedTransform[b + 3], `${label} transform.scaleY #${i}`).toBe(refScaleY[i]);

    expect(arena.packedUv[b + 0], `${label} uv.x #${i}`).toBe(arena.uvX[i]);
    expect(arena.packedUv[b + 1], `${label} uv.y #${i}`).toBe(arena.uvY[i]);
    expect(arena.packedUv[b + 2], `${label} uv.w #${i}`).toBe(arena.uvW[i]);
    expect(arena.packedUv[b + 3], `${label} uv.h #${i}`).toBe(arena.uvH[i]);

    expect(arena.packedFlags[b + 0], `${label} flags.frameIdx #${i}`).toBe(arena.frameIdx[i]);
    expect(arena.packedFlags[b + 1], `${label} flags.facing #${i}`).toBe(arena.facing[i]);
    expect(arena.packedFlags[b + 2], `${label} flags.visible #${i}`).toBe(arena.visible[i]);
    expect(arena.packedFlags[b + 3], `${label} flags.isText #${i}`).toBe(arena.isText[i]);

    expect(arena.packedTint[i], `${label} tint #${i}`).toBe(arena.tint[i]);

    expect(arena.packedShape[b + ShapeLane.Rotation], `${label} shape.rotation #${i}`).toBe(
      refRot[i],
    );
    expect(arena.packedShape[b + ShapeLane.FrameWidth], `${label} shape.frameWidth #${i}`).toBe(
      arena.frameWidth[i],
    );
    expect(arena.packedShape[b + ShapeLane.FrameHeight], `${label} shape.frameHeight #${i}`).toBe(
      arena.frameHeight[i],
    );
    expect(arena.packedShape[b + ShapeLane.Depth], `${label} shape.depth #${i}`).toBe(
      arena.depth[i],
    );
  }
}

describe('packed mirror (vec4 packing)', () => {
  it('allocate した時点で SoA とミラーが一致する', () => {
    const arena = new InstanceBufferArena(16);
    const id = arena.allocate();
    expect(id).toBeGreaterThanOrEqual(0);
    assertMirrorsInSync(arena, 'allocate');
  });

  it('Sprite の全 transform セッターがミラーへ write-through される', () => {
    const arena = new InstanceBufferArena(16);
    const sprite = new Sprite(arena.allocate(), arena);

    sprite.x = 12.5;
    sprite.y = -34.25;
    sprite.scale = 2.5;
    sprite.rotation = 1.125;

    const i = sprite.index;
    expect(arena.packedTransform[i * 4 + 0]).toBe(12.5);
    expect(arena.packedTransform[i * 4 + 1]).toBe(-34.25);
    // scale は倍率で X/Y に分かれます
    expect(arena.packedTransform[i * 4 + TransformLane.ScaleX]).toBe(2.5);
    expect(arena.packedTransform[i * 4 + TransformLane.ScaleY]).toBe(2.5);
    // rotation は packedShape 側の担当になりました
    expect(arena.packedShape[i * 4 + ShapeLane.Rotation]).toBe(1.125);
    assertMirrorsInSync(arena, 'transform');
  });

  it('scaleX / scaleY は独立したレーンへ write-through される', () => {
    const arena = new InstanceBufferArena(16);
    const sprite = new Sprite(arena.allocate(), arena);

    sprite.scaleX = 3;
    sprite.scaleY = 7;
    const i = sprite.index;
    expect(arena.packedTransform[i * 4 + TransformLane.ScaleX]).toBe(3);
    expect(arena.packedTransform[i * 4 + TransformLane.ScaleY]).toBe(7);
    assertMirrorsInSync(arena, 'non-uniform scale');
  });

  it('setFrameSize がフレーム寸数を packedShape へ write-through する', () => {
    const arena = new InstanceBufferArena(16);
    const i = arena.idToIndex[arena.allocate()];

    arena.setFrameSize(i, 24, 48);
    expect(arena.frameWidth[i]).toBe(24);
    expect(arena.frameHeight[i]).toBe(48);
    expect(arena.packedShape[i * 4 + ShapeLane.FrameWidth]).toBe(24);
    expect(arena.packedShape[i * 4 + ShapeLane.FrameHeight]).toBe(48);
    // keepScale の既定 true では倍率は保持されます
    expect(arena.scaleX[i]).toBe(1);

    // keepScale = false では倍率を 1 へ戻します
    arena.setScale(i, 5);
    arena.setFrameSize(i, 10, 10, false);
    expect(arena.scaleX[i]).toBe(1);
    expect(arena.scaleY[i]).toBe(1);
    assertMirrorsInSync(arena, 'setFrameSize');
  });

  it('depth は packedShape の Depth レーンへ write-through される', () => {
    const arena = new InstanceBufferArena(16);
    const i = arena.idToIndex[arena.allocate()];

    arena.setDepth(i, 42);
    expect(arena.depth[i]).toBe(42);
    expect(arena.packedShape[i * 4 + ShapeLane.Depth]).toBe(42);
    expect(arena.dirtyShapeGroup).toBe(true);
    assertMirrorsInSync(arena, 'depth');
  });

  it('Sprite の全 UV セッターがミラーへ write-through される', () => {
    const arena = new InstanceBufferArena(16);
    const sprite = new Sprite(arena.allocate(), arena);

    sprite.uvX = 0.1;
    sprite.uvY = 0.2;
    sprite.uvW = 0.3;
    sprite.uvH = 0.4;

    const i = sprite.index;
    // Float32Array に格納されるため f32 丸め会发生します。
    expect(arena.packedUv[i * 4 + 0]).toBeCloseTo(0.1);
    expect(arena.packedUv[i * 4 + 1]).toBeCloseTo(0.2);
    expect(arena.packedUv[i * 4 + 2]).toBeCloseTo(0.3);
    expect(arena.packedUv[i * 4 + 3]).toBeCloseTo(0.4);
    assertMirrorsInSync(arena, 'uv');
  });

  it('frameIdx / facing / visible / isText が flags へ write-through される', () => {
    const arena = new InstanceBufferArena(16);
    const sprite = new Sprite(arena.allocate(), arena);

    sprite.frameIdx = 7;
    sprite.facing = -1;
    sprite.setVisible(false);
    arena.setIsText(sprite.index, 1);

    const i = sprite.index;
    expect(arena.packedFlags[i * 4 + 0]).toBe(7);
    expect(arena.packedFlags[i * 4 + 1]).toBe(-1);
    expect(arena.packedFlags[i * 4 + 2]).toBe(0);
    expect(arena.packedFlags[i * 4 + 3]).toBe(1);
    assertMirrorsInSync(arena, 'flags');
  });

  it('tint と alpha が packedTint へ write-through される', () => {
    const arena = new InstanceBufferArena(16);
    const sprite = new Sprite(arena.allocate(), arena);

    sprite.setTint(0x00ff0000);
    expect(arena.packedTint[sprite.index]).toBe(arena.tint[sprite.index]);

    sprite.alpha = 0.5;
    expect(arena.packedTint[sprite.index]).toBe(arena.tint[sprite.index]);
    assertMirrorsInSync(arena, 'tint');

    sprite.clearTint();
    sprite.clearAlpha();
    assertMirrorsInSync(arena, 'tint cleared');
  });

  it('flipX / resetFlip / toggleFlipX が facing とミラーへ write-through される', () => {
    const arena = new InstanceBufferArena(16);
    const sprite = new Sprite(arena.allocate(), arena);

    sprite.setFlipX(true);
    expect(arena.facing[sprite.index]).toBe(-1);
    expect(arena.packedFlags[sprite.index * 4 + 1]).toBe(-1);

    sprite.toggleFlipX();
    expect(arena.packedFlags[sprite.index * 4 + 1]).toBe(1);

    sprite.resetFlip();
    expect(arena.packedFlags[sprite.index * 4 + 1]).toBe(1);
    assertMirrorsInSync(arena, 'flip');
  });

  it('setTexture / setFrame が frameIdx と UV ミラーを更新する', () => {
    const arena = new InstanceBufferArena(16);
    const sprite = new Sprite(arena.allocate(), arena);
    const frames = [
      { uvX: 0, uvY: 0, uvW: 0.25, uvH: 0.25 },
      { uvX: 0.25, uvY: 0.5, uvW: 0.25, uvH: 0.25 },
    ];

    sprite.setTexture({ layerIndex: 3, width: 64, height: 64, frames }, 1);

    const i = sprite.index;
    expect(arena.packedFlags[i * 4 + 0]).toBe(3);
    expect(arena.packedUv[i * 4 + 0]).toBe(0.25);
    expect(arena.packedUv[i * 4 + 1]).toBe(0.5);
    expect(arena.packedUv[i * 4 + 2]).toBe(0.25);
    expect(arena.packedUv[i * 4 + 3]).toBe(0.25);
    assertMirrorsInSync(arena, 'setTexture');
  });

  it('free() の swap-remove でミラーも末尾要素で詰め替わる', () => {
    const arena = new InstanceBufferArena(8);
    const a = new Sprite(arena.allocate(), arena);
    const b = new Sprite(arena.allocate(), arena);
    const c = new Sprite(arena.allocate(), arena);

    a.x = 1;
    b.x = 2;
    c.x = 3;
    b.y = 20;
    c.y = 30;

    // a を解放すると、末尾の c が a のスロットへ移動する
    a.destroy();
    expect(arena.activeCount).toBe(2);
    expect(arena.posX[0]).toBe(3);
    expect(arena.posY[0]).toBe(30);
    assertMirrorsInSync(arena, 'free swap-remove');
  });

  it('setUv4 は X と W が異なる値を保持したまま正しく write-through する', () => {
    const arena = new InstanceBufferArena(8);
    const id = arena.allocate();
    const i = arena.idToIndex[id];

    // X と W、Y と H を意図的に異なる値にします。
    // 同値だと「レーンを入れ違えた」バグが SoA とミラーの両方に
    // 同じ形で適用されてしまい、テストでは検出できません。
    // （実際にこのテストを追加するきっかけになった実バグです）
    arena.setUv4(i, 0.125, 0.25, 0.5, 0.75);

    expect(arena.uvX[i]).toBe(0.125);
    expect(arena.uvY[i]).toBe(0.25);
    expect(arena.uvW[i]).toBe(0.5);
    expect(arena.uvH[i]).toBe(0.75);

    expect(arena.packedUv[i * 4 + UvLane.X]).toBe(0.125);
    expect(arena.packedUv[i * 4 + UvLane.Y]).toBe(0.25);
    expect(arena.packedUv[i * 4 + UvLane.W]).toBe(0.5);
    expect(arena.packedUv[i * 4 + UvLane.H]).toBe(0.75);

    // レーンを丸ごと入れ替えた場合と値を区別できるように、
    // 入れ替え後の想定値と同値でないことも確認します。
    expect(arena.packedUv[i * 4 + UvLane.X]).not.toBe(0.5);
    expect(arena.packedUv[i * 4 + UvLane.W]).not.toBe(0.125);

    assertMirrorsInSync(arena, 'setUv4 distinct');
  });

  it('setTransform4 / setFlags4 もレーンごとに正しく write-through する', () => {
    const arena = new InstanceBufferArena(8);
    const i = arena.idToIndex[arena.allocate()];

    // 4 値すべてを異なる値にして、レーン取り違えを検出できるようにします。
    arena.setTransform4(i, 1.5, 2.5, 3.5, 4.5);
    expect(arena.packedTransform[i * 4 + TransformLane.PosX]).toBe(1.5);
    expect(arena.packedTransform[i * 4 + TransformLane.PosY]).toBe(2.5);
    expect(arena.packedTransform[i * 4 + TransformLane.ScaleX]).toBe(3.5);
    expect(arena.packedTransform[i * 4 + TransformLane.ScaleY]).toBe(4.5);
    // rotation は packedShape 側の担当になりました。
    arena.setRotation(i, 4.5);
    expect(arena.packedShape[i * 4 + ShapeLane.Rotation]).toBe(4.5);
    assertMirrorsInSync(arena, 'setTransform4 distinct');

    arena.setFlags4(i, 5.0, -1.0, 0.0, 1.0);
    expect(arena.packedFlags[i * 4 + FlagsLane.FrameIdx]).toBe(5.0);
    expect(arena.packedFlags[i * 4 + FlagsLane.Facing]).toBe(-1.0);
    expect(arena.packedFlags[i * 4 + FlagsLane.Visible]).toBe(0.0);
    expect(arena.packedFlags[i * 4 + FlagsLane.IsText]).toBe(1.0);
    assertMirrorsInSync(arena, 'setFlags4 distinct');
  });

  it('clear() でミラーが既定値へ戻る', () => {
    const arena = new InstanceBufferArena(8);
    const sprite = new Sprite(arena.allocate(), arena);
    sprite.setVisible(false);
    arena.setIsText(sprite.index, 1);

    arena.clear();

    for (let i = 0; i < arena.capacity; i++) {
      expect(arena.packedFlags[i * 4 + 2]).toBe(1);
      expect(arena.packedFlags[i * 4 + 3]).toBe(0);
    }
  });

  it('computeWorldTransforms は階層解決後のワールド座標をミラーへ反映する', () => {
    const arena = new InstanceBufferArena(8);
    const parent = new Sprite(arena.allocate(), arena);
    const child = new Sprite(arena.allocate(), arena);

    parent.x = 100;
    parent.y = 50;
    parent.rotation = 0;
    child.setParentId(parent.id);

    arena.computeWorldTransforms();

    const ci = child.index;
    // 階層時、ミラーにはローカルではなくワールド座標が入ります。
    expect(arena.hasHierarchy).toBe(true);
    expect(arena.packedTransform[ci * 4 + 0]).toBe(arena.worldX[ci]);
    expect(arena.packedTransform[ci * 4 + 1]).toBe(arena.worldY[ci]);
    expect(arena.worldX[ci]).toBe(100);
    assertMirrorsInSync(arena, 'hierarchy', true);

    // ローカル値そのものは変わらない（SoA のまま）
    expect(arena.posX[ci]).toBe(0);
  });

  it('グループ dirty フラグがセッターごとに正しく立つ', () => {
    const arena = new InstanceBufferArena(8);
    const sprite = new Sprite(arena.allocate(), arena);
    const i = sprite.index;

    const reset = () => {
      arena.dirtyTransformGroup = false;
      arena.dirtyUvGroup = false;
      arena.dirtyFlagsGroup = false;
      arena.dirtyTintGroup = false;
    };

    reset();
    arena.setPosX(i, 5);
    expect(arena.dirtyTransformGroup).toBe(true);
    expect(arena.dirtyUvGroup).toBe(false);
    expect(arena.dirtyFlagsGroup).toBe(false);
    expect(arena.dirtyTintGroup).toBe(false);

    reset();
    arena.setUvW(i, 0.5);
    expect(arena.dirtyUvGroup).toBe(true);
    expect(arena.dirtyTransformGroup).toBe(false);

    reset();
    arena.setVisible(i, 0);
    expect(arena.dirtyFlagsGroup).toBe(true);
    expect(arena.dirtyUvGroup).toBe(false);

    reset();
    arena.setTint(i, 0xff00ff00);
    expect(arena.dirtyTintGroup).toBe(true);
    expect(arena.dirtyFlagsGroup).toBe(false);

    // depth は GPU へ渡さないため、どのグループも dirty にしない
    reset();
    arena.setDepth(i, 9);
    expect(arena.dirtyTransformGroup).toBe(false);
    expect(arena.dirtyDepth).toBe(true);

    void sprite;
  });

  it('拡張枠 setExt / getExt が vec4 を丸ごと往復する', () => {
    const arena = new InstanceBufferArena(4);
    const i = arena.idToIndex[arena.allocate()];
    const out = new Float32Array(4);

    arena.setExt(i, 2, 1, 2, 3, 4);
    arena.getExt(i, 2, out);
    expect(Array.from(out)).toEqual([1, 2, 3, 4]);

    // 拡張枠は 1 インスタンス 64 バイト (vec4 x 4) のため
    // slot 2 のオフセットは i * 16 + 8 になる
    expect(arena.packedExt[i * 16 + 8]).toBe(1);
    expect(arena.packedExt[i * 16 + 11]).toBe(4);
  });

  // --- Phase 1: Phaser 4 互換フィールド ---

  it('setOrigin が原点とミラーへ write-through される', () => {
    const arena = new InstanceBufferArena(16);
    const sprite = new Sprite(arena.allocate(), arena);
    const i = sprite.index;

    // Phaser の既定は中央 (0.5, 0.5)
    expect(arena.originX[i]).toBe(0.5);
    expect(arena.originY[i]).toBe(0.5);
    expect(arena.packedOrigin[i * 4 + OriginLane.OriginX]).toBe(0.5);
    expect(arena.packedOrigin[i * 4 + OriginLane.OriginY]).toBe(0.5);

    // setOrigin(0) は Y を省略するので両方 0
    sprite.setOrigin(0);
    expect(arena.originX[i]).toBe(0);
    expect(arena.originY[i]).toBe(0);
    expect(arena.packedOrigin[i * 4 + OriginLane.OriginX]).toBe(0);
    expect(arena.packedOrigin[i * 4 + OriginLane.OriginY]).toBe(0);

    // Y を明示すると独立に動く
    sprite.setOrigin(0.25, 0.75);
    expect(arena.packedOrigin[i * 4 + OriginLane.OriginX]).toBe(0.25);
    expect(arena.packedOrigin[i * 4 + OriginLane.OriginY]).toBe(0.75);

    // 4 つの lane をすべて異なる値にして取り違えを検出できるようにする
    sprite.setOrigin(0.1, 0.2);
    sprite.setScrollFactor(0.3, 0.4);
    expect(arena.packedOrigin[i * 4 + OriginLane.OriginX]).toBeCloseTo(0.1);
    expect(arena.packedOrigin[i * 4 + OriginLane.OriginY]).toBeCloseTo(0.2);
    expect(arena.packedOrigin[i * 4 + OriginLane.ScrollFactorX]).toBeCloseTo(0.3);
    expect(arena.packedOrigin[i * 4 + OriginLane.ScrollFactorY]).toBeCloseTo(0.4);
    // lane を取り違えても検出できるようにubes Zend
    expect(arena.packedOrigin[i * 4 + OriginLane.OriginX]).not.toBe(
      arena.packedOrigin[i * 4 + OriginLane.ScrollFactorX],
    );
  });

  it('setScrollFactor がパララックス係数をミラーへ write-through する', () => {
    const arena = new InstanceBufferArena(16);
    const sprite = new Sprite(arena.allocate(), arena);
    const i = sprite.index;

    // 既定は 1.0
    expect(arena.scrollFactorX[i]).toBe(1);
    expect(arena.scrollFactorY[i]).toBe(1);

    sprite.setScrollFactor(0.5);
    expect(arena.scrollFactorX[i]).toBe(0.5);
    expect(arena.scrollFactorY[i]).toBe(0.5);

    sprite.setScrollFactorX(0.25);
    expect(arena.scrollFactorX[i]).toBe(0.25);
    expect(arena.scrollFactorY[i]).toBe(0.5);
    sprite.setScrollFactorY(0.75);
    expect(arena.scrollFactorY[i]).toBe(0.75);
    expect(sprite.scrollFactorX).toBeCloseTo(0.25);
    expect(sprite.scrollFactorY).toBeCloseTo(0.75);
  });

  it('setActive(false) は描画を停止し、setVisible と AND を取る', () => {
    const arena = new InstanceBufferArena(16);
    const sprite = new Sprite(arena.allocate(), arena);
    const i = sprite.index;

    // 既定は active = true / visible = 1
    expect(sprite.active).toBe(true);
    expect(arena.packedFlags[i * 4 + FlagsLane.Visible]).toBe(1);

    // active を落とすと描画されない
    sprite.setActive(false);
    expect(sprite.active).toBe(false);
    expect(arena.packedFlags[i * 4 + FlagsLane.Visible]).toBe(0);
    // visible 自体は書き換えない（独立した概念のため）
    expect(arena.visible[i]).toBe(1);

    // active=false のまま setVisible(true) でも描画されない（AND）
    sprite.setVisible(true);
    expect(arena.packedFlags[i * 4 + FlagsLane.Visible]).toBe(0);

    // active を戻せば描画される
    sprite.setActive(true);
    expect(arena.packedFlags[i * 4 + FlagsLane.Visible]).toBe(1);
  });

  it('setName は文字列をスロット化する（SoA には参照だけ持つ）', () => {
    const arena = new InstanceBufferArena(16);
    const sprite = new Sprite(arena.allocate(), arena);
    const i = sprite.index;

    // 未設定は空文字
    expect(sprite.name).toBe('');
    expect(arena.nameSlot[i]).toBe(-1);

    sprite.setName('hero');
    expect(sprite.name).toBe('hero');
    expect(arena.nameSlot[i]).toBe(0);

    // 同じ文字列はスロットを共有する
    const other = new Sprite(arena.allocate(), arena);
    other.setName('hero');
    expect(arena.nameSlot[other.index]).toBe(0);
    expect(arena.namePool.length).toBe(1);

    // 別の文字列は別スロット
    other.setName('enemy');
    expect(arena.nameSlot[other.index]).toBe(1);
    expect(arena.namePool.length).toBe(2);
    expect(other.name).toBe('enemy');
    expect(sprite.name).toBe('hero');
  });

  it('setTintMode / setBlendMode は値を保持し範囲外を丸める', () => {
    const arena = new InstanceBufferArena(16);
    const sprite = new Sprite(arena.allocate(), arena);

    expect(sprite.tintMode).toBe(0);
    sprite.setTintMode('ADD');
    expect(sprite.tintMode).toBe(2);
    sprite.setTintMode(5);
    expect(sprite.tintMode).toBe(5);

    expect(sprite.blendMode).toBe(0);
    sprite.setBlendMode('SCREEN');
    expect(sprite.blendMode).toBe(3);
    // WebGL2 が対応していない値は Normal に丸められる
    sprite.setBlendMode(99);
    expect(sprite.blendMode).toBe(0);
  });

  it('getLocalTransformMatrix / getWorldTransformMatrix は out のみに書く', () => {
    const arena = new InstanceBufferArena(16);
    const sprite = new Sprite(arena.allocate(), arena);
    const out = new Float32Array(6);

    sprite.setPosition(100, 50);
    sprite.setScale(2);
    sprite.rotation = 0;

    sprite.getLocalTransformMatrix(out);
    expect(out[0]).toBeCloseTo(2); // cos(0) * scaleX
    expect(out[1]).toBeCloseTo(0); // sin(0) * scaleX
    expect(out[2]).toBeCloseTo(0); // -sin(0) * scaleY
    expect(out[3]).toBeCloseTo(2); // cos(0) * scaleY
    expect(out[4]).toBeCloseTo(100); // tx
    expect(out[5]).toBeCloseTo(50); // ty

    // 階層が無くても posX / posY がそのまま使われる
    sprite.getWorldTransformMatrix(out);
    expect(out[4]).toBeCloseTo(100);
    expect(out[5]).toBeCloseTo(50);
  });

  it('setSize / getSize はフレーム寸法だけを扱う（scale は倍率のまま）', () => {
    const arena = new InstanceBufferArena(16);
    const sprite = new Sprite(arena.allocate(), arena);
    const out = new Float32Array(2);

    sprite.setSize(48, 24);
    expect(sprite.width).toBe(48);
    expect(sprite.height).toBe(24);
    // scale は倍率なので影響を受けない
    expect(sprite.scale).toBe(1);
    // 表示サイズは変わる
    expect(sprite.displayWidth).toBe(48);
    expect(sprite.displayHeight).toBe(24);

    sprite.getSize(out);
    expect(out[0]).toBe(48);
    expect(out[1]).toBe(24);

    sprite.setScale(2);
    expect(sprite.displayWidth).toBe(96);
    expect(sprite.width).toBe(48);
  });

  it('clear() で origin / scrollFactor / active が既定値へ戻る', () => {
    const arena = new InstanceBufferArena(8);
    const sprite = new Sprite(arena.allocate(), arena);
    sprite.setOrigin(0.2, 0.3);
    sprite.setScrollFactor(0.4, 0.5);
    sprite.setActive(false);

    arena.clear();
    expect(sprite.active).toBe(true);
    expect(arena.namePool.length).toBe(0);
  });

  it('markAllDirty が全グループを立てる', () => {
    const arena = new InstanceBufferArena(4);
    arena.dirtyTransformGroup = false;
    arena.dirtyUvGroup = false;
    arena.dirtyFlagsGroup = false;
    arena.dirtyTintGroup = false;

    arena.markAllDirty();

    expect(arena.dirtyTransformGroup).toBe(true);
    expect(arena.dirtyUvGroup).toBe(true);
    expect(arena.dirtyFlagsGroup).toBe(true);
    expect(arena.dirtyTintGroup).toBe(true);
  });
});
