[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / parseBitmapFontText

# Function: parseBitmapFontText()

> **parseBitmapFontText**(`text`): [`ParsedBitmapFont`](../interfaces/ParsedBitmapFont.md)

Defined in: [core/src/loader/BitmapFontParser.ts:59](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/BitmapFontParser.ts#L59)

AngelCode のテキスト形式を解析します。

```
info face="Arial" size=32 ...
common lineHeight=32 base=26 scaleW=256 scaleH=256 pages=1
page id=0 file="arial.png"
chars count=95
char id=32 x=0 y=0 width=0 height=0 xoffset=0 yoffset=0 xadvance=8 page=0
```

## Parameters

### text

`string`

ファイル全文

## Returns

[`ParsedBitmapFont`](../interfaces/ParsedBitmapFont.md)

解析結果
