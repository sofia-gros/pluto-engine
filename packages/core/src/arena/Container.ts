/**
 * @file Container.ts
 * @description
 * Phaser 4 互換のコンテナ。
 *
 * 設計上の判断 (IMPACT_SCOPE 3.2 の判定 C):
 * Container は **SoA の `parentId`** で実装します。
 * 親子関係は `InstanceBufferArena.parentId` が正本であり、
 * ワールド座標は既存の階層リゾルバ (`_resolveWorld`) が
 * `localX` / `localY` / `localRotation` から毎フレーム解決します。
 *
 * そのため本クラスは**位置を自前で計算しません**。
 * 子を追加するときは「現在のワールド座標 − 親のワールド座標」を
 * `localX` / `localY` に写入し、親を動かすと子が追従するようにします。
 *
 * **own property は `id` と `_arena` の 2 個だけ** (掟 R-03)。
 * 子リストを Array として保持しないため、追加・削除のたびに
 * 配列を詰め替える必要がありません。
 *
 * `add.existing` は却下しました。Flyweight は
 * 「オブジェクトの登録」を表現できないため、`setParentId` のみで表現します。
 */

import type { InstanceBufferArena } from './InstanceBufferArena';

/** 親子関係なしを表す親 ID */
export const PARENT_NONE = -1;

export class Container {
  /** コンテナ自身を表すアリーナの疎添字 ID */
  public readonly id: number;

  private readonly _arena: InstanceBufferArena;

  constructor(id: number, arena: InstanceBufferArena) {
    this.id = id;
    this._arena = arena;
  }

  /**
   * コンテナ自身の X 座標 (ワールド座標)。
   * 親を持つ場合は親のワールド座標を加算した値になります。
   */
  get x(): number {
    const i = this._index;
    if (i < 0) return 0;
    return this._arena.parentId[i] >= 0 ? this._arena.worldX[i] : this._arena.posX[i];
  }

  set x(v: number) {
    const i = this._index;
    if (i < 0) return;
    if (this._arena.parentId[i] >= 0) {
      this._arena.localX[i] = v;
      this._arena.dirtyHierarchy = true;
    } else {
      this._arena.setPosX(i, v);
    }
  }

  /** コンテナ自身の Y 座標 (ワールド座標) */
  get y(): number {
    const i = this._index;
    if (i < 0) return 0;
    return this._arena.parentId[i] >= 0 ? this._arena.worldY[i] : this._arena.posY[i];
  }

  set y(v: number) {
    const i = this._index;
    if (i < 0) return;
    if (this._arena.parentId[i] >= 0) {
      this._arena.localY[i] = v;
      this._arena.dirtyHierarchy = true;
    } else {
      this._arena.setPosY(i, v);
    }
  }

  /** コンテナ自身のワールド X 座標 (親からの計算結果を無視した値) */
  get worldX(): number {
    const i = this._index;
    return i < 0 ? 0 : this._arena.worldX[i];
  }

  /** コンテナ自身のワールド Y 座標 */
  get worldY(): number {
    const i = this._index;
    return i < 0 ? 0 : this._arena.worldY[i];
  }

  /** ローカル X 座標 (親の座標を差し引いた値) */
  get localX(): number {
    const i = this._index;
    return i < 0 ? 0 : this._arena.localX[i];
  }

  set localX(v: number) {
    const i = this._index;
    if (i < 0) return;
    this._arena.localX[i] = v;
    this._arena.dirtyHierarchy = true;
  }

  /** ローカル Y 座標 */
  get localY(): number {
    const i = this._index;
    return i < 0 ? 0 : this._arena.localY[i];
  }

  set localY(v: number) {
    if (this._index < 0) return;
    this._arena.localY[this._index] = v;
    this._arena.dirtyHierarchy = true;
  }

  /** コンテナの位置を設定します (Phaser 互換の `setPosition`)。 */
  setPosition(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * 当たり判定矩形の幅と高さを設定します (Phaser 互換の `setSize`)。
   */
  setSize(width: number, height: number): this {
    const i = this._index;
    if (i < 0) return this;
    this._arena.setFrameSize(i, width, height);
    return this;
  }

  /** 当たり判定矩形の幅 */
  get width(): number {
    const i = this._index;
    return i < 0 ? 0 : this._arena.frameWidth[i];
  }

  set width(v: number) {
    const i = this._index;
    if (i >= 0) this._arena.setFrameSize(i, v, this._arena.frameHeight[i]);
  }

  /** 当たり判定矩形の高さ */
  get height(): number {
    const i = this._index;
    return i < 0 ? 0 : this._arena.frameHeight[i];
  }

  set height(v: number) {
    const i = this._index;
    if (i >= 0) this._arena.setFrameSize(i, this._arena.frameWidth[i], v);
  }

  /**
   * 子を追加します (Phaser 互換の `add`)。
   *
   * 追加前のワールド座標を保つように、親のワールド座標を引いて
   * ローカル座標として保存します。以降、親を動かすと子が追従します。
   *
   * @param childId 子の疎添字 ID
   */
  add(childId: number): this {
    const ci = this._arena.idToIndex[childId];
    const pi = this._index;
    if (ci < 0 || pi < 0) return this;
    if (childId === this.id) return this; // 自分自身は入れない

    // 追加前の子のワールド座標を保持するため、親のワールド座標を引きます
    const childWorldX = this._arena.posX[ci];
    const childWorldY = this._arena.posY[ci];
    const parentWorldX =
      this._arena.parentId[pi] >= 0 ? this._arena.worldX[pi] : this._arena.posX[pi];
    const parentWorldY =
      this._arena.parentId[pi] >= 0 ? this._arena.worldY[pi] : this._arena.posY[pi];

    this._arena.setParentId(childId, this.id);
    // setParentId は localX を現在の posX で初期化するため、
    // その後を親基準のローカル座標へ上書きします
    this._arena.localX[ci] = childWorldX - parentWorldX;
    this._arena.localY[ci] = childWorldY - parentWorldY;
    this._arena.dirtyHierarchy = true;
    return this;
  }

  /**
   * 子を親から外します (Phaser 互換の `remove`)。
   *
   * 外す際に**親のワールド座標を足し戻して**、現在のワールド座標を保ちます。
   *
   * @returns 確かに直属の子だったか
   */
  remove(childId: number): boolean {
    const ci = this._arena.idToIndex[childId];
    if (ci < 0) return false;
    if (this._arena.parentId[ci] !== this.id) return false;

    const parentWorldX = this.x;
    const parentWorldY = this.y;
    // ワールド座標へ戻します
    this._arena.setPosX(ci, this._arena.worldX[ci]);
    this._arena.setPosY(ci, this._arena.worldY[ci]);
    this._arena.localX[ci] = this._arena.posX[ci] - parentWorldX;
    this._arena.localY[ci] = this._arena.posY[ci] - parentWorldY;
    this._arena.parentId[ci] = PARENT_NONE;
    this._arena.dirtyHierarchy = true;
    return true;
  }

  /**
   * 直属の子を `outIds` バッファへ展開します (Phaser 互換の `getChildren`)。
   *
   * @param outIds 呼び出し側の使い回し配列
   * @returns 展開した子の数
   */
  collectChildrenInto(outIds: Int32Array): number {
    let n = 0;
    const cap = this._arena.activeCount;
    for (let i = 0; i < cap; i++) {
      if (this._arena.parentId[i] !== this.id) continue;
      if (n >= outIds.length) break;
      outIds[n++] = this._arena.indexToId[i];
    }
    return n;
  }

  /**
   * 直属の子を数えます (Phaser 互換の `getLength`)。
   */
  getChildCount(): number {
    let n = 0;
    const cap = this._arena.activeCount;
    for (let i = 0; i < cap; i++) {
      if (this._arena.parentId[i] === this.id) n++;
    }
    return n;
  }

  /**
   * 当たり判定矩形を `out` バッファに書き出します (Phaser 互換の `getBounds`)。
   *
   * @param out 4 要素以上 (x, y, width, height) のバッファ
   */
  getBounds(out: Float32Array): Float32Array {
    out[0] = this.x;
    out[1] = this.y;
    out[2] = this.width;
    out[3] = this.height;
    return out;
  }

  /** 破棄済みか */
  get destroyed(): boolean {
    return this._index < 0;
  }

  /** 自身に対応するアリーナの密添字。未破棄なら 0 以上 */
  private get _index(): number {
    return this._arena.idToIndex[this.id];
  }
}
