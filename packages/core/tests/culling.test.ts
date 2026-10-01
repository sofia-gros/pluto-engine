import { describe, expect, it } from 'vitest';
import { InstanceBufferArena, PlutoEngine, Scene } from '../src/index';

function ownPropertyCount(obj: object): number {
  return Object.getOwnPropertyNames(obj).length;
}

describe('partitionVisible（カリング / SoA 先頭詰め）', () => {
  it('可視なインスタンスが先頭へ寄る', () => {
    const arena = new InstanceBufferArena(16);
    for (let i = 0; i < 4; i++) arena.allocate();
    // 0: 可視 (0), 1: 可視 (50), 2: 不可視 (1000), 3: 可視 (-50)
    arena.setPosX(arena.idToIndex[0], 0);
    arena.setPosX(arena.idToIndex[1], 50);
    arena.setPosX(arena.idToIndex[2], 1000);
    arena.setPosX(arena.idToIndex[3], -50);

    // 矩形 (-100, -100) 〜 (100, 100) 之内
    const visible = arena.partitionVisible(-100, -100, 100, 100);
    expect(visible).toBe(3);
    // 先頭 3 個は可視なインスタンス
    expect(arena.posX[0]).toBe(0);
    expect(arena.posX[1]).toBe(50);
    expect(arena.posX[2]).toBe(-50);
    // 不可視なものは後ろへ寄る
    expect(arena.posX[3]).toBe(1000);
  });

  it('全件可視なら並びが変わらない', () => {
    const arena = new InstanceBufferArena(8);
    for (let i = 0; i < 4; i++) arena.allocate();
    for (let i = 0; i < 4; i++) {
      arena.setPosX(arena.idToIndex[i], i * 10);
      arena.setPosY(arena.idToIndex[i], 0);
    }
    const before = [arena.posX[0], arena.posX[1], arena.posX[2], arena.posX[3]];
    const visible = arena.partitionVisible(-100, -100, 100, 100);
    expect(visible).toBe(4);
    expect([arena.posX[0], arena.posX[1], arena.posX[2], arena.posX[3]]).toEqual(before);
  });

  it('可視 0 件なら 0 を返す', () => {
    const arena = new InstanceBufferArena(8);
    for (let i = 0; i < 3; i++) arena.allocate();
    for (let i = 0; i < 3; i++) {
      arena.setPosX(arena.idToIndex[i], 10000);
      arena.setPosY(arena.idToIndex[i], 10000);
    }
    expect(arena.partitionVisible(-100, -100, 100, 100)).toBe(0);
  });

  it('setVisible(false) のインスタンスは描画対象外になる', () => {
    const arena = new InstanceBufferArena(8);
    const id = arena.allocate();
    const i = arena.idToIndex[id];
    arena.setPosX(i, 0);
    arena.setPosY(i, 0);
    expect(arena.partitionVisible(-100, -100, 100, 100)).toBe(1);
    arena.setVisible(id, 0);
    expect(arena.partitionVisible(-100, -100, 100, 100)).toBe(0);
  });

  it('active = 0 のインスタンスは描画対象外になる', () => {
    const arena = new InstanceBufferArena(8);
    const id = arena.allocate();
    const i = arena.idToIndex[id];
    arena.setPosX(i, 0);
    arena.setPosY(i, 0);
    expect(arena.partitionVisible(-100, -100, 100, 100)).toBe(1);
    arena.setActive(id, 0);
    expect(arena.partitionVisible(-100, -100, 100, 100)).toBe(0);
  });

  it('入れ替え後も idToIndex / indexToId が整合する', () => {
    const arena = new InstanceBufferArena(8);
    const ids: number[] = [];
    for (let i = 0; i < 4; i++) {
      const id = arena.allocate();
      ids.push(id);
      const idx = arena.idToIndex[id];
      // 偶数番だけ可視にします
      arena.setPosX(idx, i % 2 === 0 ? 0 : 5000);
      arena.setPosY(idx, 0);
    }
    arena.partitionVisible(-100, -100, 100, 100);

    // すべての生き残り ID が相互に整合すること
    for (let i = 0; i < arena.activeCount; i++) {
      const id = arena.indexToId[i];
      expect(arena.idToIndex[id]).toBe(i);
    }
    // 可視なものは 2 体
    expect(arena.activeCount).toBe(4);
    let visibleCount = 0;
    for (let i = 0; i < arena.activeCount; i++) {
      if (Math.abs(arena.posX[i]) < 100) visibleCount++;
    }
    expect(visibleCount).toBe(2);
    void ids;
  });

  it('SoA と packed ミラーが入れ替え後も一致する', () => {
    const arena = new InstanceBufferArena(8);
    for (let i = 0; i < 3; i++) arena.allocate();
    // 0: 可視, 1: 不可視, 2: 可視
    arena.setPosX(arena.idToIndex[0], 10);
    arena.setPosX(arena.idToIndex[1], 9999);
    arena.setPosX(arena.idToIndex[2], 20);
    for (let i = 0; i < 3; i++) arena.setPosY(arena.idToIndex[i], i * 5);

    arena.partitionVisible(-100, -100, 100, 100);

    // 先頭 2 個について SoA とミラーの posX/posY が一致すること
    for (let i = 0; i < 2; i++) {
      const base = i * 4;
      expect(arena.packedTransform[base]).toBe(arena.posX[i]);
      expect(arena.packedTransform[base + 1]).toBe(arena.posY[i]);
    }
  });

  it('入れ替えは冪等（2 回呼んでも同じ結果）', () => {
    const arena = new InstanceBufferArena(8);
    for (let i = 0; i < 4; i++) arena.allocate();
    for (let i = 0; i < 4; i++) {
      arena.setPosX(arena.idToIndex[i], i % 2 === 0 ? i * 5 : 9999);
      arena.setPosY(arena.idToIndex[i], 0);
    }
    const a = arena.partitionVisible(-100, -100, 100, 100);
    const snapshot = [arena.posX[0], arena.posX[1], arena.posX[2], arena.posX[3]];
    const b = arena.partitionVisible(-100, -100, 100, 100);
    expect(b).toBe(a);
    expect([arena.posX[0], arena.posX[1], arena.posX[2], arena.posX[3]]).toEqual(snapshot);
  });

  it('階層があるときはワールド座標で判定する', () => {
    const arena = new InstanceBufferArena(8);
    const parentId = arena.allocate();
    const childId = arena.allocate();
    arena.setPosX(arena.idToIndex[parentId], 0);
    arena.setPosY(arena.idToIndex[parentId], 0);
    arena.setPosX(arena.idToIndex[childId], 50);
    arena.setPosY(arena.idToIndex[childId], 0);
    arena.setParentId(childId, parentId);
    arena.hasHierarchy = true;
    arena.computeWorldTransforms();
    // 親と子が画面内にあれば 2 体
    expect(arena.partitionVisible(-100, -100, 100, 100)).toBe(2);

    // 親を 70 へ動かすと、子 (ワールド 120) が完全に画面外に出ます。
    arena.setPosX(arena.idToIndex[parentId], 70);
    arena.computeWorldTransforms();
    // 「完全外」の判定は cx + halfW < minX || cx - halfW > maxX なので、
    // 子の 120 - 16 = 104 > 100 で不可視、親の 70 + 16 = 86 < 100 で可視です
    expect(arena.partitionVisible(-100, -100, 100, 100)).toBe(1);
  });

  it('階層があるときは posX ではなく worldX で判定する', () => {
    const arena = new InstanceBufferArena(8);
    const parentId = arena.allocate();
    const childId = arena.allocate();
    // ローカル座標は 0 と 50ですが、親を 2000 遠ざけるとワールド座標は画面外
    arena.setPosX(arena.idToIndex[parentId], 0);
    arena.setPosY(arena.idToIndex[parentId], 0);
    arena.setPosX(arena.idToIndex[childId], 50);
    arena.setPosY(arena.idToIndex[childId], 0);
    arena.setParentId(childId, parentId);
    arena.hasHierarchy = true;

    // まず親が 0 のとき両方可視
    arena.computeWorldTransforms();
    expect(arena.partitionVisible(-100, -100, 100, 100)).toBe(2);

    // 親を画面外へ。posX を見ていると両方可視と誤判定しますが、
    // worldX を見るため 0 体になります。
    arena.setPosX(arena.idToIndex[parentId], 2000);
    arena.computeWorldTransforms();
    expect(arena.partitionVisible(-100, -100, 100, 100)).toBe(0);
  });
});

describe('_swapInstances', () => {
  it('同じ添字なら何もしない', () => {
    const arena = new InstanceBufferArena(4);
    const id = arena.allocate();
    const i = arena.idToIndex[id];
    arena.setPosX(i, 42);
    arena._swapInstances(i, i);
    expect(arena.posX[i]).toBe(42);
  });

  it('全 SoA と packed ミラーの値が入れ替わる', () => {
    const arena = new InstanceBufferArena(4);
    const id0 = arena.allocate();
    const id1 = arena.allocate();
    const i0 = arena.idToIndex[id0];
    const i1 = arena.idToIndex[id1];

    arena.setPosX(i0, 1);
    arena.setPosY(i0, 2);
    arena.setTint(i0, 0xff000000);
    arena.setPosX(i1, 11);
    arena.setPosY(i1, 12);
    arena.setTint(i1, 0x00ff0000);

    arena._swapInstances(i0, i1);

    expect(arena.posX[i0]).toBe(11);
    expect(arena.posY[i0]).toBe(12);
    expect(arena.tint[i0]).toBe(0x00ff0000);
    expect(arena.posX[i1]).toBe(1);
    expect(arena.posY[i1]).toBe(2);
    expect(arena.tint[i1]).toBe(0xff000000);

    // ID の対応も入れ替わる
    expect(arena.indexToId[i0]).toBe(id1);
    expect(arena.indexToId[i1]).toBe(id0);
    expect(arena.idToIndex[id0]).toBe(i1);
    expect(arena.idToIndex[id1]).toBe(i0);
  });

  it('assetRef も 2 つの参照が正しく入れ替わる', () => {
    // 回帰: 以前は assetRef だけが「片方向コピー」になっており、
    // swap 後も index a に a のテクスチャが残っていました。
    // すると a のスロットに b の座標・UV・スケールと
    //  テクスチャだけ別物体的になり、描画が化けます。
    const arena = new InstanceBufferArena(4);
    const id0 = arena.allocate();
    const id1 = arena.allocate();
    const i0 = arena.idToIndex[id0];
    const i1 = arena.idToIndex[id1];

    const assetA = { key: 'a', layerIndex: 1 };
    const assetB = { key: 'b', layerIndex: 2 };
    arena.assetRef[i0] = assetA;
    arena.assetRef[i1] = assetB;

    arena._swapInstances(i0, i1);

    // 入れ替わるので、i0 には b のテクスチャが、i1 には a のテクスチャが来る
    expect(arena.assetRef[i0]?.key).toBe('b');
    expect(arena.assetRef[i1]?.key).toBe('a');
  });

  it('片方の assetRef が null でも入れ替えが壊れない', () => {
    const arena = new InstanceBufferArena(4);
    const id0 = arena.allocate();
    const id1 = arena.allocate();
    const i0 = arena.idToIndex[id0];
    const i1 = arena.idToIndex[id1];

    arena.assetRef[i0] = { key: 'a', layerIndex: 1 };
    arena.assetRef[i1] = null;

    arena._swapInstances(i0, i1);

    expect(arena.assetRef[i0]).toBeNull();
    expect(arena.assetRef[i1]?.key).toBe('a');
  });
});

describe('実描画でのカリング', () => {
  it('画面外のスプライトが描画されない', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    document.body.appendChild(canvas);

    class CullingScene extends Scene {
      preload(): void {
        this.textures.createCanvasTexture(
          'red',
          16,
          16,
          (ctx) => {
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(0, 0, 16, 16);
          },
          { frameWidth: 16, frameHeight: 16 },
        );
      }

      create(): void {
        // 画面中央 (ワールド 0,0 = スクリーン 100,100)
        const inside = this.add.sprite(0, 0, 'red');
        inside.setDisplaySize(16, 16);
        // 远远に画面外 (ワールド 5000, 0)
        const outside = this.add.sprite(5000, 0, 'red');
        outside.setDisplaySize(16, 16);
      }
    }

    const engine = new PlutoEngine({
      canvas,
      width: 200,
      height: 200,
      maxInstances: 8,
      scene: [CullingScene],
    });
    await engine.ready;

    const device = engine.device;
    if (!device) throw new Error('device が未初期化');

    engine.render();

    // カリングにより 1 体だけ描画されます
    expect(engine.totalInstanceCount).toBe(2);
    expect(engine.renderCount).toBe(1);

    const pixels = new Uint8Array(200 * 200 * 4);
    if (device.readPixels(pixels, 200, 200)) {
      const o = (100 * 200 + 100) * 4;
      // 画面中央は赤
      expect(pixels[o]).toBe(255);
      expect(pixels[o + 1]).toBe(0);
    }

    engine.destroy();
    canvas.remove();
  });

  it('カメラを動かせば描画対象が変わる', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    document.body.appendChild(canvas);

    class PanScene extends Scene {
      preload(): void {
        this.textures.createCanvasTexture(
          'dot',
          8,
          8,
          (ctx) => {
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(0, 0, 8, 8);
          },
          { frameWidth: 8, frameHeight: 8 },
        );
      }

      create(): void {
        for (let i = 0; i < 10; i++) {
          const s = this.add.sprite(i * 500, 0, 'dot');
          s.setDisplaySize(8, 8);
        }
      }
    }

    const engine = new PlutoEngine({
      canvas,
      width: 200,
      height: 200,
      maxInstances: 32,
      scene: [PanScene],
    });
    await engine.ready;
    if (!engine.device) throw new Error('device が未初期化');

    const scene = engine.scene.activeScene;
    if (!scene) throw new Error('シーンなし');

    // カメラを中央に置くと 1 体だけ可視
    scene.cameras.main.x = 0;
    scene.cameras.main.y = 0;
    scene.cameras.main.update(0.016);
    engine.render();
    const centerCount = engine.renderCount;
    expect(centerCount).toBeGreaterThan(0);
    expect(centerCount).toBeLessThan(10);

    // カメラを遠ざけると可視は 0
    scene.cameras.main.x = 100000;
    scene.cameras.main.y = 100000;
    scene.cameras.main.update(0.016);
    engine.render();
    expect(engine.renderCount).toBe(0);
    expect(engine.totalInstanceCount).toBe(10);

    engine.destroy();
    canvas.remove();
  });
});

describe('PlutoEngine の計測フィールド', () => {
  it('cullTimeMs / uploadTimeMs / drawTimeMs が数値を持つ', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    document.body.appendChild(canvas);

    class EmptyScene extends Scene {
      create(): void {
        this.add.sprite(0, 0);
      }
    }

    const engine = new PlutoEngine({
      canvas,
      width: 64,
      height: 64,
      maxInstances: 4,
      scene: [EmptyScene],
    });
    await engine.ready;
    engine.render();
    expect(typeof engine.cullTimeMs).toBe('number');
    expect(typeof engine.uploadTimeMs).toBe('number');
    expect(typeof engine.drawTimeMs).toBe('number');
    expect(engine.totalInstanceCount).toBe(1);
    expect(engine.renderCount).toBe(1);
    void ownPropertyCount;
    engine.destroy();
    canvas.remove();
  });
});
