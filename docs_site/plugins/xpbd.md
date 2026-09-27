# XPBD 物理エンジン (Extended Position Based Dynamics)

PlutoEngineは、従来の剛体力学（Rigid Body Dynamics）に代わり、堅牢で安定したExtended Position Based Dynamics (XPBD) ベースの2D物理エンジンを内蔵しています。

## XPBDの利点

XPBDは、力や加速度を積分して速度を求め、そこから位置を更新する従来のアプローチ（Force-based）とは異なります。
XPBDは**直接「位置」を制約条件に従って修正（Solve）**します。

- **無限の剛性**: 従来のバネダンパモデルでは発散（爆発）してしまうような、非常に硬い制約（関節やロープ）でも安定してシミュレーション可能です。
- **イテレーション非依存**: サブステップの回数に依存せず、常に一定の物理的挙動を保ちます。

## DODとSoAによる実装

物理演算はCPU・メモリのボトルネックになりやすい領域です。
PlutoEngineのXPBDソルバは完全にデータ指向（DOD）で設計されています。

- `positions`, `prev_positions`, `inverse_mass`, `velocities` などの配列をSoA形式で保持します。
- 衝突解決やジョイント制約の計算は、フラットな `Float32Array` に対する単純な数学演算として連続的に実行されます。
- クラスインスタンスの生成（`new Vector2()` や `new ContactPoint()`）はループ内で一切発生しません。
