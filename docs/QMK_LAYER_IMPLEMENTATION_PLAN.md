# QMKレイヤー機能実装計画

## 概要
QMKファームウェアのレイヤー機能をKarabiner-Elements上で実現し、QMKキーコードで動作を定義できるようにする。これにより、自作キーボードユーザーがQMKと同じ感覚でKarabinerの設定を行えるようになる。

## 参考資料
- [QMKのレイヤー機能をKarabinerで実装する記事](https://note.com/illlilllililill/n/n77d46071d088)
- [QMK公式ドキュメント](https://docs.qmk.fm/)

## 実装タスク

### 1. QMKレイヤー機能の設計と基本実装（優先度：高）
- [ ] レイヤー管理システムの設計
  - レイヤー状態の管理（最大32レイヤー対応）
  - デフォルトレイヤーと一時レイヤーの概念
  - レイヤースタックの実装
- [ ] レイヤー設定の型定義
  - QMKレイヤー構造のTypeScript型定義
  - Karabiner設定への変換ロジック
- [ ] 基本的なレイヤー切り替え機能
  - MO(layer) - 押している間だけレイヤー有効
  - TG(layer) - レイヤーのトグル
  - TO(layer) - レイヤーへの切り替え
  - DF(layer) - デフォルトレイヤーの設定

### 2. QMKキーコードのKarabiner変換マッピング（優先度：高）
- [ ] 基本キーコード（KC_A〜KC_Z、KC_1〜KC_0など）
- [ ] モディファイアキー（KC_LCTL、KC_LSFT、KC_LALT、KC_LGUI）
- [ ] 特殊キー（KC_ESC、KC_TAB、KC_BSPC、KC_DEL、KC_ENT）
- [ ] ファンクションキー（KC_F1〜KC_F24）
- [ ] メディアキー（KC_MUTE、KC_VOLU、KC_VOLD、KC_MPLY など）
- [ ] マウスキー（KC_MS_U、KC_MS_D、KC_MS_L、KC_MS_R、KC_BTN1、KC_BTN2）
- [ ] QMK固有のキーコード
  - KC_TRNS（透過）
  - KC_NO（無効）
  - レイヤー切り替えキーコード

### 3. レイヤー切り替えUIの実装（優先度：高）
- [ ] レイヤータブUI
  - レイヤーの追加・削除・名前変更
  - レイヤーの並び替え
  - アクティブレイヤーの視覚的表示
- [ ] レイヤー別キーマッピング表示
  - 各レイヤーでのキー配置を個別に表示
  - 透過キー（KC_TRNS）の視覚的表現
  - レイヤー継承の可視化
- [ ] レイヤープレビュー機能
  - 複数レイヤーの重ね合わせ表示
  - 実際のキー動作のプレビュー

### 4. タップ/ホールド機能の実装（優先度：中）
- [ ] Mod-Tap（MT）
  - タップで通常キー、ホールドでモディファイア
  - LCTL_T(KC_A) のような記法のサポート
- [ ] Layer-Tap（LT）
  - タップで通常キー、ホールドでレイヤー切り替え
  - LT(1, KC_SPC) のような記法のサポート
- [ ] タップダンス（TD）
  - 複数回タップで異なる動作
  - カスタムタップダンスの定義
- [ ] タイミング設定
  - TAPPING_TERM の設定UI
  - PERMISSIVE_HOLD、IGNORE_MOD_TAP_INTERRUPT などの設定

## 技術設計

### データ構造

```typescript
interface QMKLayer {
  id: number;
  name: string;
  keymap: QMKKeymap;
  isDefault?: boolean;
}

interface QMKKeymap {
  [position: string]: QMKKeycode | QMKKeyDefinition;
}

interface QMKKeyDefinition {
  tap?: QMKKeycode;
  hold?: QMKKeycode;
  layer?: number;
  type: 'mt' | 'lt' | 'td' | 'basic';
}

type QMKKeycode = 
  | 'KC_A' | 'KC_B' | ... // 基本キー
  | 'KC_LCTL' | 'KC_LSFT' | ... // モディファイア
  | 'KC_TRNS' | 'KC_NO' // 特殊キー
  | `MO(${number})` | `TG(${number})` | ... // レイヤーキー
  | `LCTL_T(${string})` | `LT(${number}, ${string})` // Mod-Tap/Layer-Tap
```

### Karabiner変換ロジック

1. QMKキーコードをKarabinerのkey_codeに変換
2. レイヤー状態を変数で管理
3. レイヤー切り替えをcomplex_modificationsで実装
4. タップ/ホールドをto_if_alone/to_if_held_downで実装

### UI/UXデザイン

- QMK Configuratorに似たビジュアルキーボードUI
- レイヤーごとのタブ表示
- ドラッグ&ドロップでのキー配置
- QMKキーコードの検索・選択UI
- リアルタイムプレビュー

## 実装スケジュール

1. **第1フェーズ（1-2週間）**
   - 基本的なレイヤー管理システム
   - 主要なQMKキーコードのマッピング
   - シンプルなレイヤー切り替え（MO、TG）

2. **第2フェーズ（1-2週間）**
   - レイヤーUIの実装
   - 全QMKキーコードのサポート
   - KC_TRNSによる透過機能

3. **第3フェーズ（2-3週間）**
   - Mod-Tap/Layer-Tap機能
   - タップダンス
   - 高度な設定オプション

4. **第4フェーズ（1週間）**
   - テスト・バグ修正
   - ドキュメント作成
   - サンプル設定の追加

## 期待される成果

- QMKユーザーが違和感なくKarabinerを使えるようになる
- 複雑なレイヤー設定が視覚的に管理できる
- QMKとKarabinerの架け橋となるツール
- 自作キーボードコミュニティへの貢献

## 注意事項

- Karabinerの制限により、完全なQMK互換は難しい場合がある
- パフォーマンスを考慮した実装が必要
- 既存のKarabiner設定との互換性を保つ