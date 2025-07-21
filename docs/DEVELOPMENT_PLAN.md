# Sling 開発計画

## プロジェクト概要
SlingはKarabiner-Elements用のキーマッピングWeb GUIです。静的サイトとして動作し、ブラウザ上で設定ファイルの編集・エクスポートが可能です。将来的にはQMKファームウェアのレイヤー機能をKarabiner-Elements上で実現し、QMKキーコードで動作を定義できるようにすることで、自作キーボードユーザーがQMKと同じ感覚でKarabinerの設定を行えるようになります。

## 参考資料
- [Karabiner-Elements公式ドキュメント](https://karabiner-elements.pqrs.org/docs/)
- [設定ファイルリファレンス](https://karabiner-elements.pqrs.org/docs/json/)
- [Complex Modifications例](https://karabiner-elements.pqrs.org/docs/json/typical-complex-modifications-examples/)
- [QMKのレイヤー機能をKarabinerで実装する記事](https://note.com/illlilllililill/n/n77d46071d088)
- [QMK公式ドキュメント](https://docs.qmk.fm/)

## 現在の実装状況

### 完了済み機能
- **TypeScript型定義**: `src/types/karabiner.ts` - Karabiner設定の完全な型定義
- **Zodスキーマ**: `src/types/karabiner-schema.ts` - バリデーション用スキーマ
- **ファイルアップロード**: `src/components/FileUpload.tsx` - ドラッグ&ドロップ対応
- **状態管理**: `src/store/karabiner.ts` - Zustandによる設定管理（ローカルストレージ永続化付き）
- **ビジュアルキーボードUI**:
  - VIA/Remap風のビジュアルキーボード表示
  - US ANSI、JIS、MacBook US/JISレイアウト対応
  - キークリックでマッピング編集開始
  - マッピング済みキーの視覚的表示（マップ先のキーラベル表示）
  - モディファイアキー付きマッピングの表示（⌘⌥⇧などのシンボル）
- **Simple Modifications編集**:
  - Simple Modificationsの追加・編集・削除
  - モーダルでの直感的な編集UI
  - ビジュアルキーボードからのキー選択
  - モディファイアキーの組み合わせ対応（Ctrl+Shift+Aなど）
- **Complex Modifications編集**:
  - Complex Modificationsルールの作成・編集・削除
  - Manipulatorの追加・編集・削除
  - From/Toイベントの詳細設定
  - 条件（Conditions）の設定UI
  - タブによる整理されたインターフェース
- **プロファイル管理**:
  - プロファイルの作成・複製・削除
  - プロファイル名のインライン編集
  - デフォルトプロファイルの設定
  - プロファイル管理専用モーダル
- **特殊キー対応**:
  - ファンクションキー（F1-F24）の完全対応
  - メディアキー（再生/一時停止、音量調整など）
  - ディスプレイ輝度調整キー
  - システムキー（Mission Control、Launchpad、Dashboard）
  - ナビゲーションキー（Page Up/Down、Home、End など）
  - テンキー対応
  - Consumer key codeの適切な処理
- **検索・フィルタリング機能**:
  - Simple/Complex Modifications両方で検索機能実装
  - リアルタイムフィルタリング
  - 検索結果のハイライト表示（黄色のリング）
- **インポート/エクスポート履歴**:
  - 最大20件の操作履歴を保存
  - タイムスタンプと統計情報の表示
- **ルールのグループ化と有効/無効切り替え**:
  - Complex Modificationsのグループ別整理
  - 折りたたみ可能なグループUI
  - 個別ルールの有効/無効トグル
- **ダークモード対応**:
  - システム設定の自動検出
  - 手動切り替えトグル
  - ローカルストレージでの設定永続化
- **デフォルトプロファイル自動選択**:
  - karabiner.json読み込み時に`selected: true`のプロファイルを自動選択
  - デフォルトプロファイルが設定されていない場合は最初のプロファイルを選択

## 開発ロードマップ

### 緊急修正項目（GitHubイシュー）
- [ ] **#6** ダークモード有効無効が効かない - ダークモード切り替え機能の修正
- [ ] **#8** ビジュアルキーボードのキーの配置がズレている - キーレイアウトの位置調整

### フェーズ0: UX改善と国際化（1週間）
- [x] **#4** karabiner.jsonを開いたとき、デフォルトのプロファイルのタブにフォーカスする - 完了
- [ ] **#5** ビジュアルキーボードの配列の選択を記憶し、ページを開き直したときにも反映された状態にする
- [ ] **#9** ビジュアルキーボードの配列、macbookのUS配列をデフォルトにする
- [ ] **#7** 日本語、英語の切り替え対応（i18n対応）
  - 辞書をJSONで管理
  - 将来的な多言語展開を視野に入れた実装
  - react-i18nextなどの国際化ライブラリの導入

### フェーズ1: 残りの基本機能（1-2週間）
- [ ] キーボードショートカット対応
- [ ] 設定のバックアップ/リストア機能
- [ ] ルールのインポート/エクスポート（個別）
- [ ] キーマッピングのプリセット集

### フェーズ2: QMKレイヤー基本実装（2-3週間）
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

### フェーズ3: QMKキーコードマッピング（2-3週間）
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

### フェーズ4: レイヤーUI実装（2-3週間）
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

### フェーズ5: 高度なQMK機能（3-4週間）
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

### フェーズ6: 最終調整とリリース（1-2週間）
- [ ] テスト・バグ修正
- [ ] パフォーマンス最適化
- [ ] ドキュメント作成
- [ ] サンプル設定の追加
- [ ] Cloudflare Pagesへのデプロイ設定

## 技術設計

### QMKレイヤー機能のデータ構造

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

### UI/UXデザイン方針

- QMK Configuratorに似たビジュアルキーボードUI
- レイヤーごとのタブ表示
- ドラッグ&ドロップでのキー配置
- QMKキーコードの検索・選択UI
- リアルタイムプレビュー

## 技術スタック

- **フレームワーク**: React + TypeScript + Vite
- **スタイリング**: Tailwind CSS + shadcn/ui
- **状態管理**: Zustand (persist付き)
- **バリデーション**: Zod
- **コード品質**: Biome (linter + formatter)
- **ファイル操作**: react-dropzone, file-saver
- **アイコン**: lucide-react
- **デプロイ**: Cloudflare Pages

## UI/UXガイドライン

### カラースキーム
プロジェクト全体で統一されたカラースキームを使用しています：

#### テキストカラー
- **見出し・ラベル**: `text-gray-700 dark:text-gray-200`
- **本文**: `text-gray-900 dark:text-gray-100`
- **補助テキスト**: `text-gray-600 dark:text-gray-400`
- **プレースホルダー**: `placeholder:text-gray-400 dark:placeholder:text-gray-500`

#### 背景色
- **プライマリ背景**: `bg-white dark:bg-gray-900`
- **セカンダリ背景**: `bg-gray-50 dark:bg-gray-800`
- **ホバー背景**: `hover:bg-gray-50 dark:hover:bg-gray-700`

#### ボーダー
- **通常**: `border-gray-200 dark:border-gray-700`
- **入力フィールド**: `border-gray-300 dark:border-gray-600`

#### アクセントカラー
- **プライマリ**: `blue-600` (ボタン、リンク、フォーカス)
- **成功**: `green-500` (マッピング済みキー)
- **エラー**: `red-500` (削除ボタン)

## 期待される成果

- Karabinerの設定を視覚的かつ直感的に編集できるツール
- QMKユーザーが違和感なくKarabinerを使えるようになる
- 複雑なレイヤー設定が視覚的に管理できる
- QMKとKarabinerの架け橋となるツール
- 自作キーボードコミュニティへの貢献

## 注意事項

- Karabinerの制限により、完全なQMK互換は難しい場合がある
- パフォーマンスを考慮した実装が必要
- 既存のKarabiner設定との互換性を保つ
- 静的サイトとしての制限を考慮した設計