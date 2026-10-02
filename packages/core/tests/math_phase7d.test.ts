import { describe, expect, it } from 'vitest';
import { Geom, Struct } from '../src/index';

describe('Phase 7d — Geom (オブジェクト生成なし / out 必須)', () => {
  const out = new Float32Array(8);

  it('矩形・楕円・線・三角形を out へ書き出す', () => {
    Geom.RectangleToPoints(1, 2, 30, 40, out);
    expect([...out.slice(0, 4)]).toEqual([1, 2, 30, 40]);
    Geom.EllipseToPoints(1, 2, 3, 4, out);
    expect([...out.slice(0, 4)]).toEqual([1, 2, 3, 4]);
    Geom.LineToPoints(0, 0, 10, 20, out);
    expect([...out.slice(0, 4)]).toEqual([0, 0, 10, 20]);
    Geom.TriangleToPoints(0, 0, 10, 0, 5, 8, out);
    expect([...out.slice(0, 6)]).toEqual([0, 0, 10, 0, 5, 8]);
  });

  it('生成関数は out と同じ参照を返す', () => {
    expect(Geom.RectangleToPoints(0, 0, 1, 1, out)).toBe(out);
    expect(Geom.LineToPoints(0, 0, 1, 1, out)).toBe(out);
  });

  it('菱形と六角形を展開できる', () => {
    Geom.RhombusToPoints(5, 6, 10, 20, out);
    expect([...out.slice(0, 4)]).toEqual([5, 6, 10, 20]);

    const hex = new Float32Array(12);
    expect(Geom.HexagonToPoints(0, 0, 10, hex)).toBe(12);
    // 6 頂点が円周上に並ぶ
    for (let i = 0; i < 6; i++) {
      expect(Math.sqrt(hex[i * 2] ** 2 + hex[i * 2 + 1] ** 2)).toBeCloseTo(10);
    }
    // バッファが小さいときは 0
    expect(Geom.HexagonToPoints(0, 0, 10, new Float32Array(6))).toBe(0);
  });

  it('多角形を展開し、close で始点を追加できる', () => {
    const v = new Float32Array([0, 0, 10, 0, 10, 10]);
    const buf = new Float32Array(8);
    expect(Geom.PolygonToPoints(v, false, buf)).toBe(6);
    expect(buf[6]).toBe(0);
    expect(Geom.PolygonToPoints(v, true, buf)).toBe(8);
    expect([buf[6], buf[7]]).toEqual([0, 0]);
    // バッファが足りないときは開いたまま
    expect(Geom.PolygonToPoints(v, true, new Float32Array(7))).toBe(6);
  });

  it('矩形の測量', () => {
    const r = new Float32Array([10, 20, 30, 40]);
    expect(Geom.RectangleWidth(r)).toBe(30);
    expect(Geom.RectangleHeight(r)).toBe(40);
    expect(Geom.RectangleArea(r)).toBe(1200);
    expect(Geom.RectanglePerimeter(r)).toBe(140);
    expect(Geom.RectangleContains(r, 15, 25)).toBe(true);
    expect(Geom.RectangleContains(r, 5, 25)).toBe(false);
    expect(Geom.RectangleContains(r, 40, 60)).toBe(true);
  });

  it('円の測量', () => {
    const c = new Float32Array([0, 0, 5]);
    expect(Geom.CircleArea(c)).toBeCloseTo(Math.PI * 25);
    expect(Geom.CircleContains(c, 3, 4)).toBe(true);
    expect(Geom.CircleContains(c, 6, 0)).toBe(false);
  });

  it('GetTriangleAngles が 3 頂点の角度を返す（合計は PI）', () => {
    const t = new Float32Array([0, 0, 10, 0, 0, 10]);
    const angles = new Float32Array(3);
    expect(Geom.GetTriangleAngles(t, angles)).toBe(angles);
    // 直角三角形で、(0,0) の角が直角
    expect(angles[0]).toBeCloseTo(Math.PI / 2);
    expect(angles[1]).toBeCloseTo(Math.PI / 4);
    expect(angles[2]).toBeCloseTo(Math.PI / 4);
    expect(angles[0] + angles[1] + angles[2]).toBeCloseTo(Math.PI);
  });

  it('GetTriangleAngles は重複頂点で 0 を返す', () => {
    const t = new Float32Array([0, 0, 0, 0, 10, 10]);
    const angles = new Float32Array(3);
    Geom.GetTriangleAngles(t, angles);
    expect(angles[0]).toBe(0);
  });

  it('TriangleArea が面積を返す', () => {
    expect(Geom.TriangleArea(new Float32Array([0, 0, 10, 0, 0, 10]))).toBe(50);
  });

  it('PolygonArea が靴ひも公式の面積を返す', () => {
    // 10x10 の正方形
    expect(Geom.PolygonArea(new Float32Array([0, 0, 10, 0, 10, 10, 0, 10]))).toBe(100);
    // 頂点が足りない
    expect(Geom.PolygonArea(new Float32Array([0, 0, 1, 1]))).toBe(0);
  });

  it('GetCentroid が頂点の平均を返す', () => {
    const p = new Float32Array([0, 0, 10, 0, 10, 10, 0, 10]);
    const c = new Float32Array(2);
    expect(Geom.GetCentroid(p, c)).toBe(4);
    expect([c[0], c[1]]).toEqual([5, 5]);
    expect(Geom.GetCentroid(new Float32Array(0), c)).toBe(0);
  });

  it('GetBounds が包む矩形を返す', () => {
    const p = new Float32Array([-5, 2, 10, -3, 0, 0]);
    const b = new Float32Array(4);
    expect(Geom.GetBounds(p, b)).toBe(3);
    expect([...b]).toEqual([-5, -3, 10, 2]);
    expect(Geom.GetBounds(new Float32Array(1), b)).toBe(0);
  });

  it('Interpolate が補間する', () => {
    const a = new Float32Array([0, 0]);
    const b = new Float32Array([10, 20]);
    Geom.Interpolate(a, b, 0.5, out);
    expect([out[0], out[1]]).toEqual([5, 10]);
    Geom.Interpolate(a, b, 0, out);
    expect([out[0], out[1]]).toEqual([0, 0]);
    Geom.Interpolate(a, b, 1, out);
    expect([out[0], out[1]]).toEqual([10, 20]);
  });

  it('OverlapPoint が SoA 矩形群と交差インデックスを返す', () => {
    const rects = new Float32Array([0, 0, 10, 10, 20, 20, 10, 10, 40, 40, 10, 10]);
    const hits = new Int32Array(4);
    expect(Geom.OverlapPoint(25, 25, rects, 4, hits)).toBe(1);
    expect(hits[0]).toBe(1);
    // どこにも当たらない
    expect(Geom.OverlapPoint(15, 15, rects, 4, hits)).toBe(0);
  });

  it('OverlapPoint が SoA 円群と交差インデックスを返す', () => {
    const circles = new Float32Array([0, 0, 5, 20, 20, 5]);
    const hits = new Int32Array(4);
    expect(Geom.OverlapPoint(3, 3, circles, 3, hits)).toBe(1);
    expect(hits[0]).toBe(0);
    expect(Geom.OverlapPoint(30, 30, circles, 3, hits)).toBe(0);
  });

  it('OverlapPoint が SoA 三角形群と交差インデックスを返す', () => {
    const tris = new Float32Array([0, 0, 10, 0, 0, 10, 20, 20, 30, 20, 20, 30]);
    const hits = new Int32Array(4);
    expect(Geom.OverlapPoint(2, 2, tris, 6, hits)).toBe(1);
    expect(hits[0]).toBe(0);
    expect(Geom.OverlapPoint(10, 10, tris, 6, hits)).toBe(0);
  });

  it('OverlapPoint は out が小さいと打ち切る', () => {
    const rects = new Float32Array([0, 0, 10, 10, 20, 20, 10, 10]);
    const hits = new Int32Array(1);
    expect(Geom.OverlapPoint(5, 5, rects, 4, hits)).toBe(1);
  });
});

describe('Phase 7d — Struct (Set / Map のネイティブ実装)', () => {
  it('createSet がネイティブ Set を返す', () => {
    const s = Struct.createSet(1, 2, 3);
    expect(s).toBeInstanceOf(Set);
    expect(s.size).toBe(3);
    // 配列で渡すとすべて展開する
    expect(Struct.createSet([4, 5]).size).toBe(2);
  });

  it('createMap がネイティブ Map を返す', () => {
    const m = Struct.createMap<string, number>();
    expect(m).toBeInstanceOf(Map);
    m.set('a', 1);
    expect(m.get('a')).toBe(1);
  });

  it('insert は重複時は追加せず false を返す', () => {
    const s = Struct.createSet<number>();
    expect(Struct.insert(s, 1)).toBe(true);
    expect(Struct.insert(s, 1)).toBe(false);
    expect(s.size).toBe(1);
  });

  it('getIndex が添字を返す（見つからなければ -1）', () => {
    const s = Struct.createSet('a', 'b', 'c');
    expect(Struct.getIndex(s, 'a')).toBe(0);
    expect(Struct.getIndex(s, 'c')).toBe(2);
    expect(Struct.getIndex(s, 'z')).toBe(-1);
  });

  it('remove が削除できたかを返す', () => {
    const s = Struct.createSet(1, 2);
    expect(Struct.remove(s, 1)).toBe(true);
    expect(Struct.remove(s, 1)).toBe(false);
  });

  it('setValuesInto が新しい配列を作らず展開する', () => {
    const s = Struct.createSet(10, 20, 30);
    const buf: number[] = [0, 0, 0, 0];
    expect(Struct.setValuesInto(s, buf)).toBe(3);
    expect(buf.slice(0, 3)).toEqual([10, 20, 30]);
    // バッファが小さければそこまで
    const small: number[] = [0];
    expect(Struct.setValuesInto(s, small)).toBe(1);
  });

  it('setKeysInto / valuesInto が Map を展開する', () => {
    const m = Struct.createMap<string, number>();
    m.set('a', 1);
    m.set('b', 2);
    const keys: string[] = ['', ''];
    expect(Struct.setKeysInto(m, keys)).toBe(2);
    expect(keys).toEqual(['a', 'b']);
    const values: number[] = [0, 0];
    expect(Struct.valuesInto(m, values)).toBe(2);
    expect(values).toEqual([1, 2]);
  });

  it('mapNumbersInto が数値 Map を Float32Array へ展開する', () => {
    const m = Struct.createMap<string, number>();
    m.set('a', 1.5);
    m.set('b', 2.5);
    const out = new Float32Array(2);
    expect(Struct.mapNumbersInto(m, out)).toBe(2);
    expect(out[0]).toBe(1.5);
    expect(out[1]).toBe(2.5);
  });

  it('each / eachSet が走査する', () => {
    const m = Struct.createMap<string, number>();
    m.set('a', 1);
    m.set('b', 2);
    let sum = 0;
    Struct.each(m, (v) => {
      sum += v;
    });
    expect(sum).toBe(3);

    const s = Struct.createSet(1, 2, 3);
    let total = 0;
    Struct.eachSet(s, (v) => {
      total += v;
    });
    expect(total).toBe(6);
  });
});
