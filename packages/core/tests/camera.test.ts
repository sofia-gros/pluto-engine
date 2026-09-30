import { describe, expect, it } from 'vitest';
import { Camera } from '../src/scene/Camera';
import { CameraManager, MAX_CAMERAS } from '../src/scene/CameraManager';
import { Scene } from '../src/scene/Scene';

describe('Camera - Phaser 互換のスクロール', () => {
  it('setScroll / setScrollX / setScrollY が this を返す', () => {
    const cam = new Camera();
    expect(cam.setScroll(10, 20)).toBe(cam);
    expect(cam.x).toBe(10);
    expect(cam.y).toBe(20);
    cam.setScrollX(30);
    cam.setScrollY(40);
    expect(cam.x).toBe(30);
    expect(cam.y).toBe(40);
  });

  it('scrollX / scrollY のセッターが機能する', () => {
    const cam = new Camera();
    cam.scrollX = 5;
    cam.scrollY = 6;
    expect(cam.x).toBe(5);
    expect(cam.y).toBe(6);
  });

  it('setZoom が正の値のみを受け入れる', () => {
    const cam = new Camera();
    cam.setZoom(2.5);
    expect(cam.zoom).toBe(2.5);
    // 0 や負は前回の値を維持します（0 だと描画が破綻するため）
    cam.setZoom(0);
    expect(cam.zoom).toBe(2.5);
    cam.setZoom(-1);
    expect(cam.zoom).toBe(2.5);
  });

  it('setRotation が度を受け取ってラジアンで保持する', () => {
    const cam = new Camera();
    cam.setRotation(90);
    expect(cam.rotation).toBeCloseTo(Math.PI / 2, 5);
    expect(cam.angle).toBeCloseTo(90, 5);
  });

  it('centerOn が画面中央へスクロール位置を移動する', () => {
    const cam = new Camera();
    cam.centerOn(100, 200, 800, 600);
    expect(cam.x).toBeCloseTo(100 - 400, 4);
    expect(cam.y).toBeCloseTo(200 - 300, 4);
  });

  it('getWorldPoint がスクリーン座標をワールド座標へ戻す', () => {
    const cam = new Camera();
    cam.setScroll(100, 100);
    cam.setZoom(2);
    const out = { x: 0, y: 0 };
    // 画面中央 (400, 300) はスクロール位置と一致します
    cam.getWorldPoint(400, 300, 800, 600, out);
    expect(out.x).toBeCloseTo(100, 4);
    expect(out.y).toBeCloseTo(100, 4);
  });

  it('getWorldBounds が可視範囲の矩形を返す', () => {
    const cam = new Camera();
    cam.setScroll(0, 0);
    const out = { x: 0, y: 0, width: 0, height: 0 };
    cam.getWorldBounds(out, 800, 600);
    expect(out.x).toBeCloseTo(-400, 4);
    expect(out.y).toBeCloseTo(-300, 4);
    expect(out.width).toBeCloseTo(800, 4);
    expect(out.height).toBeCloseTo(600, 4);
  });

  it('setBackgroundColor が 16 進文字列と数値を受け付ける', () => {
    const cam = new Camera();
    cam.setBackgroundColor('#ff0000');
    expect(cam.backgroundColor).toBe(0xff0000);
    cam.setBackgroundColor(0x00ff00);
    expect(cam.backgroundColor).toBe(0x00ff00);
  });
});

describe('Camera - 追従', () => {
  it('startFollow が追従を有効にし、isFollowing が true になる', () => {
    const cam = new Camera();
    expect(cam.isFollowing).toBe(false);
    cam.startFollow(5);
    expect(cam.isFollowing).toBe(true);
  });

  it('追従対象の座標へスナップ移動する (lerp = 0)', () => {
    const cam = new Camera();
    cam.startFollow(1);
    cam.update(1 / 60, 100, 200);
    expect(cam.x).toBeCloseTo(100, 4);
    expect(cam.y).toBeCloseTo(200, 4);
  });

  it('lerp を入れると滑らかに追従する', () => {
    const cam = new Camera();
    cam.startFollow(1, 5, 5);
    cam.update(1 / 60, 100, 0);
    // 1 回の update では目標へ完全には到達しません
    expect(cam.x).toBeGreaterThan(0);
    expect(cam.x).toBeLessThan(100);
    for (let i = 0; i < 200; i++) cam.update(1 / 60, 100, 0);
    expect(cam.x).toBeCloseTo(100, 1);
  });

  it('stopFollow が追従を解除する', () => {
    const cam = new Camera();
    cam.startFollow(1);
    cam.stopFollow();
    expect(cam.isFollowing).toBe(false);
    const before = cam.x;
    cam.update(1 / 60, 500, 500);
    expect(cam.x).toBe(before);
  });
});

describe('Camera - フェード / パン / ズームトゥ', () => {
  it('fadeIn が alpha を 0 から 1 へ進める', () => {
    const cam = new Camera();
    cam.fadeIn(1000);
    expect(cam.isFading).toBe(true);
    const out = new Float32Array(4);
    cam.update(0.5, -1, -1);
    cam.getFadeColor(out);
    // 半分進んでいれば 0 より大きく 1 より小さい値になります
    expect(out[3]).toBeGreaterThan(0);
    expect(out[3]).toBeLessThan(1);
  });

  it('フェード完了時に isFading が false になる', () => {
    const cam = new Camera();
    cam.fadeOut(100);
    for (let i = 0; i < 30; i++) cam.update(1 / 60, -1, -1);
    expect(cam.isFading).toBe(false);
    const out = new Float32Array(4);
    cam.getFadeColor(out);
    expect(out[3]).toBeCloseTo(0, 2);
  });

  it('フェードのコールバックが 1 度だけ呼ばれる', () => {
    const cam = new Camera();
    let n = 0;
    cam.fadeOut(100, 0, 0, 0, () => n++);
    for (let i = 0; i < 60; i++) cam.update(1 / 60, -1, -1);
    expect(n).toBe(1);
  });

  it('fadeComplete が即座に完了させる', () => {
    const cam = new Camera();
    cam.fadeOut(10000);
    cam.fadeComplete();
    expect(cam.isFading).toBe(false);
  });

  it('pan がスクロール位置を滑らかに移動させる', () => {
    const cam = new Camera();
    cam.pan(200, 300, 1000);
    cam.update(0.5, -1, -1);
    expect(cam.x).toBeGreaterThan(0);
    expect(cam.x).toBeLessThan(200);
    for (let i = 0; i < 60; i++) cam.update(1 / 60, -1, -1);
    expect(cam.x).toBeCloseTo(200, 1);
    expect(cam.y).toBeCloseTo(300, 1);
  });

  it('zoomTo がズームを滑らかに変化させる', () => {
    const cam = new Camera();
    cam.zoomTo(3, 1000);
    for (let i = 0; i < 60; i++) cam.update(1 / 60, -1, -1);
    expect(cam.zoom).toBeCloseTo(3, 1);
  });

  it('エフェクトの delay が機能する', () => {
    const cam = new Camera();
    cam.zoomTo(3, 1000, false, 500);
    // 遅延中は変化しません
    cam.update(0.2, -1, -1);
    expect(cam.zoom).toBe(1.0);
    // 遅延明けに進み始めます
    for (let i = 0; i < 60; i++) cam.update(1 / 60, -1, -1);
    expect(cam.zoom).toBeGreaterThan(1.0);
  });
});

describe('Camera - シェイク', () => {
  it('shake 後に actualX / actualY がずれる', () => {
    const cam = new Camera();
    cam.setScroll(100, 100);
    cam.shake(10, 0.5);
    cam.update(1 / 60);
    // シェイク中は実際座標がスクロール位置と異なります
    const moved = cam.actualX !== 100 || cam.actualY !== 100;
    expect(moved).toBe(true);
  });

  it('時間経過でシェイクが止まり元へ戻る', () => {
    const cam = new Camera();
    cam.setScroll(50, 50);
    cam.shake(10, 0.1);
    for (let i = 0; i < 30; i++) cam.update(1 / 60);
    expect(cam.actualX).toBe(50);
    expect(cam.actualY).toBe(50);
  });

  it('stopShake が即座にシェイクを止める', () => {
    const cam = new Camera();
    cam.setScroll(0, 0);
    cam.shake(10, 10);
    cam.update(1 / 60);
    cam.stopShake();
    expect(cam.shakeX).toBe(0);
    expect(cam.shakeY).toBe(0);
  });
});

describe('CameraManager', () => {
  it('main カメラが既定で存在する', () => {
    const scene = new Scene({ maxInstances: 16 });
    expect(scene.cameras.main).toBeDefined();
    // 既存の this.camera は main の別名です
    expect(scene.camera).toBe(scene.cameras.main);
  });

  it('add がカメラを追加する', () => {
    const scene = new Scene({ maxInstances: 16 });
    const cam = scene.cameras.add(10, 20);
    expect(cam).not.toBeNull();
    expect(cam?.x).toBe(10);
    expect(cam?.y).toBe(20);
    expect(scene.cameras.count).toBe(2);
  });

  it('getCamera が名前で取得できる', () => {
    const scene = new Scene({ maxInstances: 16 });
    const cam = scene.cameras.add(0, 0, 'minimap');
    expect(scene.cameras.getCamera('minimap')).toBe(cam);
    expect(scene.cameras.getCamera('main')).toBe(scene.cameras.main);
    expect(scene.cameras.getCamera('missing')).toBeNull();
  });

  it('上限を超えると null を返し警告する', () => {
    const scene = new Scene({ maxInstances: 16 });
    for (let i = 0; i < MAX_CAMERAS - 1; i++) {
      expect(scene.cameras.add()).not.toBeNull();
    }
    expect(scene.cameras.add()).toBeNull();
    expect(scene.cameras.count).toBe(MAX_CAMERAS);
  });

  it('collectForRender が可視カメラだけを呼び出し側配列へ書く', () => {
    const scene = new Scene({ maxInstances: 16 });
    const a = scene.cameras.add(0, 0, 'a');
    const b = scene.cameras.add(0, 0, 'b');
    expect(a).not.toBeNull();
    expect(b).not.toBeNull();

    const out: Camera[] = [];
    expect(scene.cameras.collectForRender(out)).toBe(3);

    // b を非表示にすると 2 台になります
    (b as Camera).visible = false;
    // 返り値が有効なカメラ数です。配列の length は前の呼び出しの
    // 残骸なので、判定には必ず返り値を使います。
    expect(scene.cameras.collectForRender(out)).toBe(2);
    expect(out[0]).toBe(scene.cameras.main);
  });

  it('update が追従.camera へ対象座標を渡す', () => {
    const scene = new Scene({ maxInstances: 16 });
    const main = scene.cameras.main;
    main.startFollow(7);
    scene.cameras.update(1 / 60, 7, 300, 400);
    expect(main.x).toBeCloseTo(300, 4);
    expect(main.y).toBeCloseTo(400, 4);
  });

  it('追従していないカメラは座標を渡されても動かない', () => {
    const scene = new Scene({ maxInstances: 16 });
    const cam = scene.cameras.add(0, 0, 'static');
    scene.cameras.update(1 / 60, -1, 999, 999);
    expect(cam?.x).toBe(0);
    expect(cam?.y).toBe(0);
  });
});

describe('Scene - カメラのファサード', () => {
  it('scene.cameras と scene.camera が同じオブジェクトを指す', () => {
    const scene = new Scene({ maxInstances: 16 });
    expect(scene.camera).toBe(scene.cameras.main);
  });

  it('setCameraFollowTarget が追従座標を設定する', () => {
    const scene = new Scene({ maxInstances: 16 });
    expect(() => scene.setCameraFollowTarget(1, 50, 60)).not.toThrow();
  });
});
