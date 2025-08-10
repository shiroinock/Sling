# レイヤー機能実装ガイド

## 概要
QMK/VIA風のレイヤー機能とMod-Tap、Layer-TapをKarabiner-Elementsで実装するためのガイドです。

## Karabinerでのレイヤー実装方法

### 基本原理
Karabiner-Elementsには直接的なレイヤー機能はありませんが、以下の機能を組み合わせて実現できます：

1. **変数（Variables）**: `set_variable`でレイヤーの状態を管理
2. **条件（Conditions）**: `variable_if`/`variable_unless`でレイヤーごとの動作を制御
3. **Complex Modifications**: 上記を組み合わせてルールを作成

### 実装パターン

#### レイヤー切り替え
```json
{
  "type": "basic",
  "from": { "key_code": "fn" },
  "to": [{ "set_variable": { "name": "layer_1_active", "value": 1 } }],
  "to_after_key_up": [{ "set_variable": { "name": "layer_1_active", "value": 0 } }]
}
```

#### レイヤー条件付きキーマッピング
```json
{
  "type": "basic",
  "from": { "key_code": "a" },
  "to": [{ "key_code": "1" }],
  "conditions": [{ "type": "variable_if", "name": "layer_1_active", "value": 1 }]
}
```

## QMK/VIAの機能対応表

| QMK機能 | 説明 | Karabiner実装方法 |
|---------|------|-------------------|
| MO(layer) | ホールド中のみレイヤー有効 | `to`で変数設定、`to_after_key_up`で解除 |
| TG(layer) | レイヤーのトグル | 変数の値を反転 |
| TO(layer) | 指定レイヤーのみ有効化 | 全レイヤー変数を0にして、指定レイヤーのみ1に |
| TT(layer) | タップでトグル、ホールドで一時的 | `to_if_alone`でトグル、`to_if_held_down`で一時的 |
| LT(layer, key) | タップでキー、ホールドでレイヤー | `to_if_alone`でキー送信、`to_if_held_down`でレイヤー切り替え |
| MT(mod, key) | タップでキー、ホールドで修飾キー | `to_if_alone`でキー送信、`to`で修飾キー |

## Tap/Hold機能の実装

### Mod-Tap（修飾キー＋タップ）
```json
{
  "type": "basic",
  "from": { "key_code": "caps_lock" },
  "to": [{ "key_code": "left_control" }],
  "to_if_alone": [{ "key_code": "escape" }]
}
```
- タップ時：Escape
- ホールド時：Left Control

### Layer-Tap（レイヤー＋タップ）
```json
{
  "type": "basic",
  "from": { "key_code": "spacebar" },
  "to": [{ "set_variable": { "name": "layer_1_active", "value": 1 } }],
  "to_if_alone": [{ "key_code": "spacebar" }],
  "to_after_key_up": [{ "set_variable": { "name": "layer_1_active", "value": 0 } }]
}
```
- タップ時：Space
- ホールド時：Layer 1有効化

## タイミングパラメータ

Karabinerで使用可能なタイミング設定：

```json
{
  "parameters": {
    "basic.to_if_alone_timeout_milliseconds": 1000,      // タップと判定する最大時間
    "basic.to_if_held_down_threshold_milliseconds": 500, // ホールドと判定する最小時間
    "basic.to_delayed_action_delay_milliseconds": 500    // 遅延アクションの待機時間
  }
}
```

## 変数命名規則

レイヤー関連の変数は以下の命名規則を使用：
- レイヤー状態: `sling_layer_{id}_active` (例: `sling_layer_1_active`)
- 一時的な状態: `sling_temp_{name}` (例: `sling_temp_mod_tap_active`)

## UI設計の考慮点

### 初心者向けの配慮
1. **ビジュアル重視**: キーコードではなく、視覚的な選択
2. **プリセット提供**: よく使う設定をワンクリックで適用
3. **リアルタイムプレビュー**: 設定の効果を即座に確認

### 選択肢の提示方法
```
「キーを押したときの動作を選択」
├─ 文字を入力する → [ドロップダウンでキー選択]
├─ 修飾キーとして使う → [Cmd/Ctrl/Shift/Alt選択]
├─ レイヤーを切り替える → [レイヤー番号選択]
└─ 何もしない
```

## 実装の優先順位

1. **Phase 1**: 基盤構築
   - データモデル定義 ✅
   - ストア拡張
   - 変換関数作成

2. **Phase 2**: UI実装
   - レイヤータブUI
   - ビジュアルキーボード拡張
   - アクションセレクター

3. **Phase 3**: 機能実装
   - Mod-Tap設定
   - Layer-Tap設定
   - プリセット適用

4. **Phase 4**: 改善
   - パフォーマンス最適化
   - UX向上

## 参考リンク
- [Karabiner Complex Modifications](https://karabiner-elements.pqrs.org/docs/json/complex-modifications-manipulator-definition/)
- [QMK Layer Documentation](https://docs.qmk.fm/keycodes#layer-switching)
- [QMK Mod-Tap](https://docs.qmk.fm/mod_tap)