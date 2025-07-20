# Sling 開発計画

## プロジェクト概要
SlingはKarabiner-Elements用のキーマッピングWeb GUIです。静的サイトとして動作し、ブラウザ上で設定ファイルの編集・エクスポートが可能です。

## Karabiner-Elementsリポジトリの活用

Karabiner-Elementsは[オープンソース](https://github.com/pqrs-org/Karabiner-Elements)ですが、公式のJSONスキーマは提供されていません。そのため、以下のアプローチを取ります：

1. **公式ドキュメントの参照**: [Karabiner Configuration Reference Manual](https://karabiner-elements.pqrs.org/docs/json/)
2. **設定ファイル構造の理解**: karabiner.jsonの構造を分析し、TypeScript型定義を作成
3. **サンプルファイルの収集**: 実際の設定ファイルをテストデータとして使用

## 実装状況

### 完了済み機能
- **TypeScript型定義**: `src/types/karabiner.ts` - Karabiner設定の完全な型定義
- **Zodスキーマ**: `src/types/karabiner-schema.ts` - バリデーション用スキーマ
- **ファイルアップロード**: `src/components/FileUpload.tsx` - ドラッグ&ドロップ対応
- **状態管理**: `src/store/karabiner.ts` - Zustandによる設定管理（ローカルストレージ永続化付き）
- **基本UI**: ファイルアップロード、エクスポート機能実装済み
- **ビジュアルキーボードUI**:
  - `src/components/keyboard/VisualKeyboard.tsx` - VIA/Remap風のビジュアルキーボード表示
  - `src/components/keyboard/Key.tsx` - 個別キーコンポーネント
  - `src/data/keyboardLayouts.ts` - US ANSI、JIS、MacBook US/JISレイアウト対応
- **キーマッピング編集**:
  - `src/components/KeyMappingEditor.tsx` - モーダルでのキーマッピング編集
  - ビジュアルキーボードからのキー選択
  - マッピングの追加、編集、削除機能
- **キーマッピング表示**: 
  - ビジュアルキーボードでの現在のマッピング表示（マップ先のキーラベル表示）
  - `src/components/ComplexModificationsList.tsx` - 複雑な修飾キーの一覧表示
  - `src/components/ProfileTabs.tsx` - プロファイル切り替えタブ
  - `src/components/ConfigurationEditor.tsx` - 統合されたエディターUI
- **エクスポート機能**: JSON形式での設定ファイルダウンロード機能実装済み
- **開発環境整備**:
  - Biomeによるコード品質管理（リンター、フォーマッター）
  - TypeScriptの厳密な型チェック
  - アクセシビリティ対応（キーボードナビゲーション、ARIA属性）

## 機能追加計画

### フェーズ1: コア機能（優先度：高） ← 現在ここ

#### 1. Karabiner設定ファイルの型定義とスキーマ作成 ✅
- [x] karabiner.jsonの基本構造の型定義
- [x] プロファイル（profiles）の型定義
- [x] simple_modificationsの型定義
- [x] complex_modificationsの型定義
- [x] Zodスキーマによるバリデーション実装

#### 2. ファイルアップロード機能 ✅
- [x] react-dropzoneコンポーネントの実装
- [x] ドラッグ&ドロップエリアのUI
- [x] ファイル選択ボタン
- [x] アップロードされたファイルの基本検証

#### 3. 設定ファイルのパーサーとバリデーション ✅
- [x] JSONパースエラーのハンドリング
- [x] Karabiner設定構造の検証
- [x] エラーメッセージの表示
- [x] 有効な設定の状態管理（Zustand）

### フェーズ2: 基本的な編集機能（優先度：中）

#### 4. キーマッピング一覧表示 ✅
- [x] simple_modificationsの一覧表示（ビジュアルキーボード）
- [x] complex_modificationsの一覧表示
- [ ] ルールのグループ化表示
- [ ] 有効/無効の切り替えUI

#### 5. キーマッピング編集フォーム ✅
- [x] simple_modifications編集フォーム（モーダル）
- [x] キークリックでの編集開始
- [x] from/toキーの視覚的選択
- [x] マッピングの削除機能（モーダル内）
- [x] complex_modifications編集フォーム
- [x] 条件（conditions）の編集
- [x] バリデーションとプレビュー

#### 6. キーコード選択UI ✅
- [x] ビジュアルキーボードコンポーネント
- [x] US ANSI、JIS、MacBook配列対応
- [x] マッピング済みキーの視覚的表示
- [ ] キーコードのオートコンプリート
- [ ] モディファイアキーの組み合わせ選択
- [ ] 特殊キー（fn、メディアキーなど）のサポート

#### 7. プロファイル管理
- [x] プロファイル一覧表示（タブUI）
- [ ] プロファイルの作成/複製
- [ ] プロファイルの削除
- [ ] デフォルトプロファイルの設定

#### 8. エクスポート機能
- [ ] 編集内容のリアルタイムプレビュー
- [x] karabiner.jsonとしてダウンロード
- [ ] 部分的なエクスポート（特定のルールのみ）
- [ ] エクスポート履歴の記録

### フェーズ3: UX改善（優先度：低）

#### 9. 一時保存機能（一部実装済み）
- [x] LocalStorageへの自動保存（Zustand persistによる実装済み）
- [ ] IndexedDBへの移行（大容量対応）
- [ ] 複数の作業セッションの管理
- [ ] 自動復元機能

#### 10. 検索・フィルタリング
- [ ] キーマッピングの全文検索
- [ ] キーコードによるフィルタ
- [ ] アプリケーション別フィルタ
- [ ] 高度な検索オプション

#### 11. インポート/エクスポート履歴
- [ ] 操作履歴の記録
- [ ] 履歴からの復元
- [ ] 差分表示
- [ ] 履歴のエクスポート

#### 12. ダークモード対応
- [ ] システム設定の検出
- [ ] 手動切り替えトグル
- [ ] テーマのカスタマイズ
- [ ] アクセシビリティ対応

## 技術的な考慮事項

### Karabiner設定ファイルの構造
```json
{
  "global": {
    "check_for_updates_on_startup": true,
    "show_in_menu_bar": true,
    "show_profile_name_in_menu_bar": false
  },
  "profiles": [
    {
      "name": "Default profile",
      "selected": true,
      "simple_modifications": [],
      "fn_function_keys": [],
      "complex_modifications": {
        "parameters": {},
        "rules": []
      },
      "virtual_hid_keyboard": {
        "keyboard_type": "ansi",
        "caps_lock_delay_milliseconds": 0
      },
      "devices": []
    }
  ]
}
```

### 参考リソース
- [Karabiner-Elements公式ドキュメント](https://karabiner-elements.pqrs.org/docs/)
- [設定ファイルリファレンス](https://karabiner-elements.pqrs.org/docs/json/)
- [Complex Modifications例](https://karabiner-elements.pqrs.org/docs/json/typical-complex-modifications-examples/)
- [外部JSONジェネレーター](https://karabiner-elements.pqrs.org/docs/json/external-json-generators/)

### コミュニティツール
- **GokuRakuJoudo (Goku)**: EDN形式からkarabiner.jsonを生成
- **karabiner.ts**: TypeScriptで型安全にルールを記述
- **Jsonnet**: JSONテンプレート言語

## 次のステップ

フェーズ2の主要な編集機能が完成しました。Complex Modifications編集UIも実装済みです。次の実装予定：

1. **モディファイアキーの組み合わせ** - Ctrl+Shift+Aなどの複合キー対応（Complex Modificationsで部分対応済み）
2. **プロファイル管理の拡張** - 作成、複製、削除機能
3. **特殊キーサポート** - メディアキー、ファンクションキーの完全対応
4. **検索・フィルタリング機能** - マッピングの検索UI
5. **ルールのグループ化と有効/無効切り替え** - より高度な管理機能

## 実装済み技術スタック

- **フレームワーク**: React + TypeScript + Vite
- **スタイリング**: Tailwind CSS + shadcn/ui
- **状態管理**: Zustand (persist付き)
- **バリデーション**: Zod
- **コード品質**: Biome (linter + formatter)
- **ファイル操作**: react-dropzone, file-saver
- **アイコン**: lucide-react

## 最近の更新内容

### 2025年7月 - Complex Modifications編集機能の実装
- Complex Modificationsルールの作成・編集・削除機能を実装
- Manipulator、From/Toイベント、Conditionsの包括的な編集UI
- タブによる整理されたインターフェース
- ダークモード対応のUI改善
  - 背景色とテキストカラーのコントラスト改善
  - Input、Select、Button、Badge等のUIコンポーネントの色調整
  - ライトモード・ダークモード両方での視認性向上