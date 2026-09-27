/**
 * @file Text.ts
 * @description
 * MSDFフォントのモック実装、またはシンプルなスプライトベースのテキスト。
 * 文字列の各文字をスプライトとしてアリーナに登録し、描画をエミュレートします。
 */

import type { InstanceBufferArena } from './InstanceBufferArena';
import { Sprite } from './Sprite';

export interface TextStyle {
  fontSize?: number;
  color?: number;
}

export class Text {
  private _text: string;
  private _sprites: Sprite[] = [];
  public x: number;
  public y: number;
  private _arena: InstanceBufferArena;
  private _style: TextStyle;

  constructor(x: number, y: number, text: string, style: TextStyle, arena: InstanceBufferArena) {
    this.x = x;
    this.y = y;
    this._text = text;
    this._style = style;
    this._arena = arena;
    this._buildSprites();
  }

  private _buildSprites(): void {
    // 既存のスプライトを解放
    for (const sprite of this._sprites) {
      this._arena.free(sprite.id);
    }
    this._sprites.length = 0;

    const fontSize = this._style.fontSize ?? 16;
    const color = this._style.color ?? 0xffffffff;

    let currentX = this.x;
    for (let i = 0; i < this._text.length; i++) {
      // 文字ごとにスプライトをアロケート（実際にはテクスチャUVなどを設定する）
      const id = this._arena.allocate();
      if (id !== -1) {
        this._arena.posX[id] = currentX;
        this._arena.posY[id] = this.y;
        this._arena.scale[id] = fontSize; // サイズをスケールで代用
        this._arena.tint[id] = color;
        this._sprites.push(new Sprite(id, this._arena));
      }

      // 単純な等幅フォントとして扱う
      currentX += fontSize;
    }
  }

  public get text(): string {
    return this._text;
  }

  public set text(value: string) {
    if (this._text !== value) {
      this._text = value;
      this._buildSprites();
    }
  }

  public destroy(): void {
    for (const sprite of this._sprites) {
      this._arena.free(sprite.id);
    }
    this._sprites.length = 0;
  }
}
