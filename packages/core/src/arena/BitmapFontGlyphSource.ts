/**
 * @file BitmapFontGlyphSource.ts
 * @description
 * BMFont (AngelCode) の解析結果を `Text` の {@link FontGlyphSource} 契約へ
 * 橋渡しします。
 *
 * `Text` は UV と前進幅 (fontSize 単位) を要求しますが、BMFont は
 * ピクセル単位のメトリクスを持つため、ここで正規化します。
 * `Text` 側は `advance * fontSize` を前進幅として使うため、
 * 正規化係数は `xadvance / font.size` になります。
 *
 * own property は 2 個だけ (R-03)。
 */

import type { TextureAsset } from '@pluto-engine/renderer';
import type { ParsedBitmapFont } from '../loader/BitmapFontParser';
import type { FontGlyphSource } from './Text';

export class BitmapFontGlyphSource implements FontGlyphSource {
  /** ページ画像の GPU レイヤーインデックス。0 は白 1 ピクセル相当。 */
  public readonly layerIndex: number;

  private readonly _map: Map<number, number>;
  private readonly _uvs: Float32Array;
  private readonly _advances: Float32Array;
  private readonly _size: number;

  constructor(font: ParsedBitmapFont, asset: TextureAsset | null | undefined) {
    this.layerIndex = asset?.layerIndex ?? 0;
    this._size = font.size > 0 ? font.size : 1;

    const chars = font.chars;
    this._map = new Map<number, number>();
    this._uvs = new Float32Array(chars.length * 4);
    this._advances = new Float32Array(chars.length);

    // ページ画像の UV 正規化。テクスチャ配列のレイヤー寸法で正規化されるため、
    // アセットのフレーム UV (0〜1) をそのまま使うのが確実です。
    // ページ画像が未登録なら UV は 0 幅 = 何も描画されません。
    const fullUv = asset?.frames?.[0];
    const hasAsset = fullUv !== undefined && fullUv.uvW > 0;
    const imgW = asset?.width ?? 0;
    const imgH = asset?.height ?? 0;

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      this._map.set(c.id, i);
      if (hasAsset && imgW > 0 && imgH > 0) {
        this._uvs[i * 4] = c.x / imgW;
        this._uvs[i * 4 + 1] = c.y / imgH;
        this._uvs[i * 4 + 2] = c.width / imgW;
        this._uvs[i * 4 + 3] = c.height / imgH;
      } else {
        // ページ画像が無い場合は「1 文字 = アトラス全体」を描画しません。
        // UV 幅 0 にすることで何も出ません。
        this._uvs[i * 4] = 0;
        this._uvs[i * 4 + 1] = 0;
        this._uvs[i * 4 + 2] = 0;
        this._uvs[i * 4 + 3] = 0;
      }
      // `Text` は `advance * fontSize` を前進に使います
      this._advances[i] = c.xadvance / this._size;
    }
  }

  /**
   * 文字コードから UV (outUv の 0〜3) と前進幅 (fontSize 単位) を返します。
   *
   * 未知の文字は前進幅 0 を返します（Phaser と同じ挙動）。
   */
  public lookup(charCode: number, outUv: Float32Array): number {
    const i = this._map.get(charCode);
    if (i === undefined) {
      outUv[0] = 0;
      outUv[1] = 0;
      outUv[2] = 0;
      outUv[3] = 0;
      return 0;
    }
    const u = i * 4;
    outUv[0] = this._uvs[u];
    outUv[1] = this._uvs[u + 1];
    outUv[2] = this._uvs[u + 2];
    outUv[3] = this._uvs[u + 3];
    return this._advances[i];
  }
}
