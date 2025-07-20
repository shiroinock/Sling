# Sling 開発計画

## プロジェクト概要
SlingはKarabiner-Elements用のキーマッピングWeb GUIです。静的サイトとして動作し、ブラウザ上で設定ファイルの編集・エクスポートが可能です。

## Karabiner-Elementsリポジトリの活用

Karabiner-Elementsは[オープンソース](https://github.com/pqrs-org/Karabiner-Elements)ですが、公式のJSONスキーマは提供されていません。そのため、以下のアプローチを取ります：

1. **公式ドキュメントの参照**: [Karabiner Configuration Reference Manual](https://karabiner-elements.pqrs.org/docs/json/)
2. **設定ファイル構造の理解**: karabiner.jsonの構造を分析し、TypeScript型定義を作成
3. **サンプルファイルの収集**: 実際の設定ファイルをテストデータとして使用

## 機能追加計画

### フェーズ1: コア機能（優先度：高）

#### 1. Karabiner設定ファイルの型定義とスキーマ作成
- [ ] karabiner.jsonの基本構造の型定義
- [ ] プロファイル（profiles）の型定義
- [ ] simple_modificationsの型定義
- [ ] complex_modificationsの型定義
- [ ] Zodスキーマによるバリデーション実装

#### 2. ファイルアップロード機能
- [ ] react-dropzoneコンポーネントの実装
- [ ] ドラッグ&ドロップエリアのUI
- [ ] ファイル選択ボタン
- [ ] アップロードされたファイルの基本検証

#### 3. 設定ファイルのパーサーとバリデーション
- [ ] JSONパースエラーのハンドリング
- [ ] Karabiner設定構造の検証
- [ ] エラーメッセージの表示
- [ ] 有効な設定の状態管理（Zustand）

### フェーズ2: 基本的な編集機能（優先度：中）

#### 4. キーマッピング一覧表示
- [ ] simple_modificationsの一覧表示
- [ ] complex_modificationsの一覧表示
- [ ] ルールのグループ化表示
- [ ] 有効/無効の切り替えUI

#### 5. キーマッピング編集フォーム
- [ ] simple_modifications編集フォーム
- [ ] complex_modifications編集フォーム
- [ ] from/toイベントの編集
- [ ] 条件（conditions）の編集
- [ ] バリデーションとプレビュー

#### 6. キーコード選択UI
- [ ] ビジュアルキーボードコンポーネント
- [ ] キーコードのオートコンプリート
- [ ] モディファイアキーの選択
- [ ] 特殊キー（fn、メディアキーなど）のサポート

#### 7. プロファイル管理
- [ ] プロファイル一覧表示
- [ ] プロファイルの作成/複製
- [ ] プロファイルの削除
- [ ] デフォルトプロファイルの設定

#### 8. エクスポート機能
- [ ] 編集内容のリアルタイムプレビュー
- [ ] karabiner.jsonとしてダウンロード
- [ ] 部分的なエクスポート（特定のルールのみ）
- [ ] エクスポート履歴の記録

### フェーズ3: UX改善（優先度：低）

#### 9. 一時保存機能
- [ ] LocalStorageへの自動保存
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