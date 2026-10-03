[**PlutoEngine API Documentation**](../../../README.md)

***

[PlutoEngine API Documentation](../../../README.md) / [core/src](../README.md) / parseAtlasJson

# Function: parseAtlasJson()

> **parseAtlasJson**(`json`): [`ParsedAtlas`](../interfaces/ParsedAtlas.md)

Defined in: [core/src/loader/AtlasParser.ts:50](https://github.com/sofia-gros/pluto-engine/blob/16c911452114fe4f95f3c344039f091ae77e98a5/packages/core/src/loader/AtlasParser.ts#L50)

TexturePacker の JSON を解析します。

- JSON Hash 形式 (`{ frames: { name: {...} }, meta: {...} }`) に対応します
- 旧形式の配列 (`[ { filename, frame }, ... ]`) にも対応します
- `rotated: true` は 90 度回転済みなので、そのまま UV を使います
  (-pluto では回転の補正を行わないため、trimmed 情報のみ参照します)

## Parameters

### json

`unknown`

解析済みの JSON オブジェクト

## Returns

[`ParsedAtlas`](../interfaces/ParsedAtlas.md)

解析結果。形式が読めない場合は空の結果を返します
