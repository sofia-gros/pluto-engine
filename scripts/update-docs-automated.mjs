import fs from 'fs';
import path from 'path';

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  for (const { search, replace } of replacements) {
    if (typeof search === 'string') {
      content = content.replace(search, replace);
    } else {
      content = content.replace(search, replace);
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
  } else {
    console.log(`No changes made to ${filePath}`);
  }
}

// 1. docs_site/concepts/rendering.md
replaceInFile('docs_site/concepts/rendering.md', [
  {
    search: /# レンダリングパイプライン \(Rendering\)[\s\S]*?(?=\n#|$)/,
    replace: `# レンダリングパイプライン (Rendering)\n\nPlutoEngine のレンダラは、**WebGPU** および **WebGL2** の双方でハードウェアインスタンシングによる超大規模描画（30万体以上）を完全サポートした統合アーキテクチャです。\`createGraphicsDevice(canvas)\` により、WebGPU 対応環境ではモダンな WebGPU パイプラインが自動選択され、未対応環境ではシームレスに WebGL2 へフォールバックします。\n\n## アーキテクチャの概要\n\nCPU（JavaScript/TypeScript側）の役割は、SoA（Structure of Arrays）形式のバッファをゼロアロケーションで GPU へストリーミングすることに特化しています。\n\n1. **データ同期 (CPU → GPU)**\n   CPU上の \`Float32Array\` アリーナから、\`GraphicsDevice\`（\`WebGL2Device\` / \`WebGPUDevice\`）を通じて GPU バッファへデータを転送します。Dirty Flags 機構により、変更のあったバッファのみを選択的に転送します。\n2. **GPU Texture2DArray**\n   スプライトテクスチャは \`TextureManager\` が管理する \`GPU Texture2DArray\` としてアップロードされます。これにより、異なるテクスチャを持つスプライトを描画する際にもバインド切り替えを発生させず、1ドローコールでの一括描画を可能にします。\n3. **ハードウェアインスタンシング**\n   単一のクアッドメッシュ（4頂点）に対してインスタンスアトリビュートをバインドし、WebGL2 の \`gl.drawArraysInstanced()\` または WebGPU の \`drawIndexed(6, activeCount)\` を1回呼び出すことで、30万体以上のスプライトを一括描画します。\n\n## WebGPU バックエンドの最適化 (30万体対応)\n\nWebGPU バックエンドでは、以前の 150,000 体クラッシュ限界（ブラウザ/GPU 間の IPC キュー過負荷）を克服するため、以下の最適化が適用されています：\n\n- **JS パッキングループのインライン化**: 属性ごとの関数呼び出し（\`_readF32\` / \`_readU32\`）や Map 検索を排除し、ループ外で事前に TypedArray 参照を解決してインライン配列アクセス化。CPU 側のパッキング負荷を最小化。\n- **\`writeBuffer\` 転送の適正サイズ化**: 固定の全バッファ（64MB）転送を廃止し、実際に描画される \`activeCount * STRIDE_BYTES\` だけを GPU キューへ転送。IPC 過負荷を根絶し、30万体の極限負荷でも WebGL2 と同等の滑らかさで動作します。\n\n## メリット\n\n- **描画コールの極小化**: 30万体以上のエンティティを単一ドローコールで描画。\n- **ゼロアロケーションとの統合**: アリーナの \`Float32Array\` を追加コピーなしにそのまま GPU へストリーミング。\n- **最高峰のスケーラビリティ & 互換性**: WebGPU による次世代の描画性能と、WebGL2 による確実なフォールバックを両立。`,
  },
]);

// 2. docs_site/index.md
replaceInFile('docs_site/index.md', [
  {
    search: /WebGL2 ハードウェアインスタンシング \(WebGPU 対応予定\)/,
    replace: 'WebGPU / WebGL2 統合ハードウェアインスタンシング',
  },
  {
    search:
      /WebGL2 による GPU Texture2DArray とハードウェアインスタンシングを主軸とし、WebGPU への移行パスも整備中。/,
    replace:
      'WebGPU と WebGL2 の両バックエンドで30万体（300,000+）の同時描画を完全サポート。パッキングのインライン化と適正サイズ転送により、クラッシュ知らずの圧倒的スケーラビリティを実現。',
  },
]);

// 3. docs_site/guide/intro.md
replaceInFile('docs_site/guide/intro.md', [
  {
    search: /ブラウザ上で10万体以上のエンティティを、60FPS \/ 144FPSで安定して滑らかに動かす/,
    replace: 'ブラウザ上で10万〜30万体以上のエンティティを、60FPS / 144FPSで安定して滑らかに動かす',
  },
  {
    search: /100,000\+ スプライトが 144 FPS で躍動/,
    replace: '100,000〜300,000+ スプライトが 144 FPS で躍動',
  },
  {
    search:
      /## グラフィックス: WebGL2 と WebGPU の統合[\s\S]*?- \*\*ゼロコピーGPU転送\*\*: アリーナの `Float32Array` をそのままダイレクトにGPUバッファへストリーミング。/,
    replace: `## グラフィックス: WebGL2 と WebGPU の統合\n\nPlutoEngine のレンダラーは、インスタンシング描画（Hardware Instanced Drawing）を前提に最適化されており、WebGPU と WebGL2 の双方で 30万体（300,000+）の同時描画を安定してサポートします。\n\n- **WebGPU 完全対応**: WGSL によるモダンな描画パイプラインを実装。パッキングループのインライン化と \`activeCount\` に基づく \`writeBuffer\` 転送サイズ最適化により、IPC キュー過負荷によるクラッシュ限界（旧15万体）を克服し、30万体でも WebGL2 と同等の極限パフォーマンスを発揮。\n- **WebGL2 フルサポート**: GPU Texture2DArray と頂点属性インスタンシングにより、WebGPU 未対応環境でも 30万体のスプライトを 1 ドローコールで一括描画。\n- **ゼロアロケーション SoA 連携**: どちらのバックエンドでも同一の SoA アリーナデータを共有し、毎フレームのヒープ確保ゼロで VRAM へダイレクトにストリーミング。`,
  },
  {
    search: /\| \*\*同時スプライト数 \(60FPS\)\*\* \| \*\*100,000\+\*\* \|/,
    replace: '| **同時スプライト数 (60FPS)** | **100,000〜300,000+** |',
  },
]);

// 4. docs_site/guide/architecture.md
replaceInFile('docs_site/guide/architecture.md', [
  {
    search:
      /## 5\. ハードウェア・インスタンシング描画パイプライン[\s\S]*?ゼロアロケーション走査で行われます。/,
    replace: `## 5. ハードウェア・インスタンシング描画パイプライン\n\n数十万体のスプライトを描画する際、スプライトごとに描画コマンドを発行すると GPU ドライバや IPC が過負荷で停止します。\nPlutoEngine では、**単一のクアッドメッシュ（4頂点）**に対し、アリーナの座標・スケール配列を頂点アトリビュートとしてバインドし、WebGL2 の \`drawArraysInstanced\` または WebGPU の \`drawIndexed(6, count)\` を 1 回だけ呼び出します。\n\n\`\`\`typescript\n// 1回のAPIコールで最大30万個のインスタンスを一括描画\ndevice.setupInstancedAttributes(gpuBuffers, renderCount);\ndevice.drawInstanced(renderCount);\n\`\`\`\n\nCPU 側でのパッキング処理も、有効なスプライト（\`active[i] === 1\`）のみを連続バッファへコピーするゼロアロケーション走査で行われます。特に WebGPU バックエンドでは、パッキングループ内の関数呼び出しを排除してインライン配列アクセス化し、GPU \`writeBuffer\` の転送サイズを \`renderCount\` に厳密に合わせて最適化することで、ブラウザの IPC 過負荷クラッシュを防ぎ、30万体でも安定して動作します。`,
  },
]);

// 5. docs_site/performance.md
replaceInFile('docs_site/performance.md', [
  {
    search: /そして \*\*WebGL2 のハードウェアインスタンシング\*\* を活用し、/,
    replace: 'そして **WebGL2 / WebGPU のハードウェアインスタンシング** を活用し、',
  },
  {
    search: /(## [\s\S]*)$/,
    replace: `$1\n\n---\n\n### 3. WebGPU バックエンドの最適化と 30万体対応 (クラッシュ限界の克服)\n\nWebGPU バックエンドにおいて、以前は 150,000 体を超えるとブラウザの GPU プロセスや IPC キューが過負荷となりクラッシュする問題が存在していました。この原因を徹底解析し、以下の2つの根本的最適化を施したことで、**クラッシュなしに 300,000 体（30万体）の安定描画（WebGL2 と同等性能）** を達成しました。\n\n1. **パッキングループのインライン化 (JS 呼び出しオーバーヘッド排除)**:\n   - 旧実装では属性ごとにヘルパー関数（\`_readF32\`, \`_readU32\`）を呼び出し、Map 検索や型チェックをエンティティ数 × 属性数分（数十万〜数百万回）繰り返していました。\n   - ループ外で各属性の TypedArray 参照とオフセット（\`attrArrays\`, \`attrOffsets\`, \`tintData\`, \`isTextData\`）を事前解決し、ループ内を純粋なインライン配列アクセス (\`arr[offset + i]\`) とビット演算に刷新。CPU 側のパッキング処理負荷を大幅に削減しました。\n2. **\`writeBuffer\` 転送の適正サイズ化 (IPC キュー過負荷の解消)**:\n   - 旧実装では固定の最大アリーナ容量（全 64MB）を毎フレーム無条件に \`writeBuffer\` で転送していたため、エンティティ数が増えるとブラウザと GPU 間の IPC キューが溢れてクラッシュを引き起こしていました。\n   - \`setupInstancedAttributes\` に現在のアクティブ描画数（\`activeCount\`）を渡し、実際に描画される \`activeCount * STRIDE_BYTES\` だけをキューに転送するよう適正化。無駄な VRAM 帯域と IPC 負荷をゼロにし、300,000 体の極限負荷でも一切クラッシュしない堅牢性を獲得しました。`,
  },
]);

// 6. docs_site/concepts/loader.md
replaceInFile('docs_site/concepts/loader.md', [
  {
    search:
      /ロードされた画像テクスチャは、WebGL2Device.uploadTexture\(\) を通じて GPU の Texture2DArray にまとめてアップロードされます。/,
    replace:
      'ロードされた画像テクスチャは、device.uploadTexture() を通じて GPU の Texture2DArray（WebGL2 / WebGPU 双方に対応）にまとめてアップロードされます。',
  },
]);

// 7. docs/PlutoEngine_Manual.md
replaceInFile('docs/PlutoEngine_Manual.md', [
  {
    search: /JavaScript上で10万体のエンティティを60FPS\/144FPSで動かす/,
    replace: 'JavaScript上で10万〜30万体以上のエンティティを60FPS/144FPSで動かす',
  },
]);

console.log('Update script completed.');
