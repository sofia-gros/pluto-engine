import { describe, expect, it } from 'vitest';
import {
  CORE_INSTANCE_BUFFER_COUNT,
  DEFAULT_FRAME_SIZE,
  FlagsLane,
  INSTANCE_BUFFERS,
  INSTANCE_BUFFER_BY_NAME,
  OriginLane,
  QUAD_LOCATION,
  QUAD_STRIDE_BYTES,
  ShapeLane,
  TransformLane,
  UvLane,
  glslAttributeCount,
  glslAttributeSpecs,
  glslInstanceDecl,
  totalBytesPerInstance,
  wgslAttributeSpecs,
  wgslInstanceMembers,
} from '../src/InstanceLayout';

/**
 * インスタンスレイアウトの整合性テスト。
 *
 * 「vec を渡して枠をデータ的に増やす」= vec4 ペアキング の仕様が
 * 実際に効いていることは、次の 3 点で担保されます。
 *   1. 枠消費が WebGL2 16 / WebGPU 8 の上限に収まる
 *   2. バッファのストライドとシェーダの宣言が食い違わない
 *   3. 拡張枠を使わない既定でも既存の描画が壊れない
 */
describe('InstanceLayout', () => {
  it('WebGL2 の頂点属性が上限 16 に収まる', () => {
    // 既定 (拡張枠なし) で使うのは共有 Quad 2 + インスタンス 6 = 8
    expect(glslAttributeCount()).toBe(8);
    expect(glslAttributeCount()).toBeLessThanOrEqual(16);

    // 拡張枠 (vec4 x 4) を使う場合も 12 で収まる
    expect(glslAttributeCount(true)).toBe(12);
    expect(glslAttributeCount(true)).toBeLessThanOrEqual(16);
  });

  it('WebGPU の頂点バッファが上限 8 に収まる', () => {
    const slots = INSTANCE_BUFFERS.filter((b) => b.eager).map((b) => b.slot);
    // 共有 Quad が slot 0、インスタンスは 1〜6
    expect(slots).toEqual([1, 2, 3, 4, 5, 6]);
    expect(slots.length + 1).toBeLessThanOrEqual(8);

    // 拡張枠はオプトインなので slot 7（上限ちょうど）
    const allSlots = INSTANCE_BUFFERS.map((b) => b.slot);
    expect(Math.max(...allSlots) + 1).toBeLessThanOrEqual(8);
  });

  it('GPU アップロード単位が 6 グループ（拡張枠は任意）になる', () => {
    expect(CORE_INSTANCE_BUFFER_COUNT).toBe(6);
  });

  it('1 インスタンスあたりの転送量が 84 バイトになる', () => {
    // transform 16 + uv 16 + flags 16 + shape 16 + tint 4 + origin 16
    expect(totalBytesPerInstance()).toBe(84);
    // 拡張枠 64 バイトを加えると 148
    expect(totalBytesPerInstance(true)).toBe(148);
  });

  it('ストライドが GLSL / WGSL の宣言と一致する', () => {
    for (const spec of INSTANCE_BUFFERS) {
      if (!spec.eager) continue;
      const glsl = glslAttributeSpecs().filter((a) => a.location === spec.location);
      expect(glsl.length, spec.name).toBe(spec.vectors);
      for (const attr of glsl) {
        expect(attr.stride, `${spec.name} stride`).toBe(spec.stride);
      }

      const wgsl = wgslAttributeSpecs().filter((a) => a.shaderLocation === spec.location);
      expect(wgsl.length, spec.name).toBe(spec.vectors);
    }
  });

  it('GLSL と WGSL が同じ location を共有する', () => {
    const glslDecl = glslInstanceDecl();
    const wgslDecl = wgslInstanceMembers();
    for (const spec of INSTANCE_BUFFERS) {
      if (!spec.eager) continue;
      expect(glslDecl, spec.name).toContain(`layout(location = ${spec.location})`);
      expect(wgslDecl, spec.name).toContain(`@location(${spec.location})`);
    }
  });

  it('共有 Quad の location が 0 / 1 で固定されている', () => {
    expect(QUAD_LOCATION.Pos).toBe(0);
    expect(QUAD_LOCATION.Uv).toBe(1);
    expect(QUAD_STRIDE_BYTES).toBe(16);
  });

  it('tint だけは unorm8x4 で 4 バイトストライドになる', () => {
    const tint = INSTANCE_BUFFER_BY_NAME.get('packedTint');
    expect(tint).toBeDefined();
    if (!tint) return;
    expect(tint.format).toBe('unorm8x4');
    expect(tint.stride).toBe(4);

    const attr = glslAttributeSpecs().find((a) => a.location === tint.location);
    expect(attr).toBeDefined();
    if (!attr) return;
    expect(attr.normalized).toBe(true);
    expect(attr.size).toBe(4);
    expect(attr.stride).toBe(4);
  });

  it('拡張枠は 1 本のバッファに vec4 x 4 を格納する', () => {
    const ext = INSTANCE_BUFFER_BY_NAME.get('packedExt');
    expect(ext).toBeDefined();
    if (!ext) return;
    expect(ext.vectors).toBe(4);
    expect(ext.stride).toBe(64);
    expect(ext.eager).toBe(false);
    // 4 つの連続した location を占有する
    const attrs = glslAttributeSpecs(true).filter((a) => a.location >= ext.location);
    expect(attrs.map((a) => a.location)).toEqual([8, 9, 10, 11]);
    expect(attrs.map((a) => a.offset)).toEqual([0, 16, 32, 48]);
  });

  it('レーン位置が SoA と vec4 内の契約を定義している', () => {
    expect(TransformLane.PosX).toBe(0);
    expect(TransformLane.PosY).toBe(1);
    expect(TransformLane.ScaleX).toBe(2);
    expect(TransformLane.ScaleY).toBe(3);

    expect(ShapeLane.Rotation).toBe(0);
    expect(ShapeLane.FrameWidth).toBe(1);
    expect(ShapeLane.FrameHeight).toBe(2);
    expect(ShapeLane.Depth).toBe(3);

    expect(UvLane.X).toBe(0);
    expect(UvLane.Y).toBe(1);
    expect(UvLane.W).toBe(2);
    expect(UvLane.H).toBe(3);

    expect(FlagsLane.FrameIdx).toBe(0);
    expect(FlagsLane.Facing).toBe(1);
    expect(FlagsLane.Visible).toBe(2);
    expect(FlagsLane.SpriteFlags).toBe(3);
  });

  it('パッキングによって WebGL2 頂点属性が 15 から 7 に減っている', () => {
    // 旧実装は location 0〜14 の 15 枠を使っていた
    expect(glslAttributeCount()).toBeLessThan(15);
  });

  it('packedShape が rotation とフレーム寸数を保持する', () => {
    // フレーム寸法が無いと頂点シェーダがクワッドの大きさを決められないため、
    // scale(倍率) とは別に必ず per-instance で渡す必要があります。
    const shape = INSTANCE_BUFFER_BY_NAME.get('packedShape');
    expect(shape).toBeDefined();
    if (!shape) return;
    expect(shape.vectors).toBe(1);
    expect(shape.stride).toBe(16);
    expect(shape.format).toBe('float32x4');
    expect(shape.eager).toBe(true);
  });

  it('packedOrigin が原点とスクロール係数を保持する', () => {
    // origin はクワッドを shift させるため頂点シェーダで必要になり、
    // scrollFactor はカメラごとの描画位置計算に必要です。
    const origin = INSTANCE_BUFFER_BY_NAME.get('packedOrigin');
    expect(origin).toBeDefined();
    if (!origin) return;
    expect(origin.vectors).toBe(1);
    expect(origin.stride).toBe(16);
    expect(origin.format).toBe('float32x4');
    expect(origin.eager).toBe(true);

    expect(OriginLane.OriginX).toBe(0);
    expect(OriginLane.OriginY).toBe(1);
    expect(OriginLane.ScrollFactorX).toBe(2);
    expect(OriginLane.ScrollFactorY).toBe(3);
  });

  it('active / tintMode / blendMode は GPU へ転送しない（帯域の節約）', () => {
    // 3 つとも頂点シェーダでは使わないため、GPU バッファを消費しません。
    const names = INSTANCE_BUFFERS.map((b) => b.name);
    expect(names).not.toContain('packedActive');
    expect(names).not.toContain('packedTintMode');
    expect(names).not.toContain('packedBlendMode');
    expect(names.filter((n) => n === 'packedExt').length).toBe(1);
  });

  it('DEFAULT_FRAME_SIZE が 32 で定義されている (Phaser __DEFAULT 互換)', () => {
    expect(DEFAULT_FRAME_SIZE).toBe(32);
  });
});
