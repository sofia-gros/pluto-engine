$ErrorActionPreference = 'SilentlyContinue'
$root = 'A:\Project\plute-engine\docs\phaser4'
$dest = 'A:\Project\plute-engine\docs\phaser4\API_INDEX.md'

# --- 収集 ---
$methodSyms = New-Object System.Collections.Generic.HashSet[string]
$factorySyms = New-Object System.Collections.Generic.HashSet[string]
$perSkill = [ordered]@{}

foreach ($f in Get-ChildItem "$root\skills" -Recurse -Filter *.md) {
    $t = Get-Content $f.FullName -Raw
    $set = New-Object System.Collections.Generic.HashSet[string]
    foreach ($m in [regex]::Matches($t, '`([A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*)\s*\(')) {
        $s = $m.Groups[1].Value
        [void]$methodSyms.Add($s)
        [void]$set.Add($s)
    }
    $rel = $f.FullName.Replace("$root\", '')
    $perSkill[$rel] = $set.Count
}

$RXROOT = '(?:scene|this\.scene|camera|game|input|load|this\.load|textures|this\.textures|physics|this\.physics|anims|this\.anims|data|this\.data|registry|this\.registry|time|this\.time|scale|this\.scale|sound|this\.sound|matter|this\.matter|fx|this\.fx|tweens|this\.tweens|add|this\.add|make|this\.make|children|dom|this\.dom)'
foreach ($f in Get-ChildItem "$root\rex-notes" -Recurse -Filter index.md) {
    $t = Get-Content $f.FullName -Raw
    foreach ($m in [regex]::Matches($t, ('\b(' + $RXROOT + '\.[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*)\s*\('))) {
        [void]$factorySyms.Add($m.Groups[1].Value)
    }
}

# --- 生成 ---
$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine('# Phaser 4 API インデックス（全量列挙）')
[void]$sb.AppendLine()
[void]$sb.AppendLine('> 本書は PlutoEngine が Phaser 4 互換 API を実装するための調査成果物です。')
[void]$sb.AppendLine('> 抽出元: `phaser@4.2.1` npm パッケージの `skills/` (28 サブシステム) と')
[void]$sb.AppendLine('> `rexrainbow/phaser3-rex-notes` の `docs/site` (421 ページ)。')
[void]$sb.AppendLine('> いずれも `docs/phaser4/` に原本を保存済み。')
[void]$sb.AppendLine()
[void]$sb.AppendLine('## サマリー')
[void]$sb.AppendLine()
[void]$sb.AppendLine('| 区分 | 件数 |')
[void]$sb.AppendLine('| --- | --- |')
[void]$sb.AppendLine("| メソッド・関数シンボル (`skills/`) | $($methodSyms.Count) |")
[void]$sb.AppendLine("| ファクトリ・呼び出しチェーン (`rex-notes/`) | $($factorySyms.Count) |")
[void]$sb.AppendLine("| **合計** | **$($methodSyms.Count + $factorySyms.Count)** |")
[void]$sb.AppendLine()
[void]$sb.AppendLine('## サブシステム別シンボル数（`skills/`）')
[void]$sb.AppendLine()
[void]$sb.AppendLine('| サブシステム | シンボル数 |')
[void]$sb.AppendLine('| --- | --- |')
foreach ($k in $perSkill.Keys) { [void]$sb.AppendLine("| ``$k`` | $($perSkill[$k]) |") }
[void]$sb.AppendLine()
[void]$sb.AppendLine('## ファクトリ呼び出し一覧（`scene.add.*` ほか）')
[void]$sb.AppendLine()
foreach ($s in ($factorySyms | Sort-Object)) { [void]$sb.AppendLine("- ``$s(``") }
[void]$sb.AppendLine()
[void]$sb.AppendLine('## メソッド・関数シンボル一覧')
[void]$sb.AppendLine()
foreach ($s in ($methodSyms | Sort-Object)) { [void]$sb.AppendLine("- ``$s(``") }

[System.IO.File]::WriteAllText($dest, $sb.ToString(), (New-Object System.Text.UTF8Encoding $false))
"written: $dest"
"lines: " + ($sb.ToString() -split "`n").Count
