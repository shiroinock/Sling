# Karabiner-Elements統合ガイド

## Karabiner-Elementsについて

Karabiner-ElementsはmacOS用の強力なキーボードカスタマイザーです。JSON形式の設定ファイルを使用して、キーマッピングやマクロを定義します。

## サブモジュールの検討

### メリット
1. **最新の仕様への追従**: 公式リポジトリの更新を追跡
2. **実例の参照**: 公式のcomplex modificationsサンプルを参照可能
3. **型定義の生成**: 実際のコードから正確な型を生成

### デメリット
1. **リポジトリサイズ**: Karabiner-Elements全体は大きい
2. **不要なファイル**: ソースコードの大部分は不要
3. **メンテナンス**: サブモジュールの更新管理

### 推奨アプローチ

サブモジュールではなく、以下のアプローチを推奨します：

1. **必要な部分のみ抽出**
   - 設定ファイルのサンプル
   - ドキュメントの該当部分
   - 型定義の参考となるコード

2. **定期的な仕様確認**
   - リリースノートの確認
   - 破壊的変更への対応
   - 新機能のサポート

3. **コミュニティリソースの活用**
   - [Karabiner-Elements complex_modifications](https://github.com/pqrs-org/KE-complex_modifications)
   - ユーザー作成の設定例

## 設定ファイルの場所

- **macOS**: `~/.config/karabiner/karabiner.json`
- **設定のバックアップ**: `~/.config/karabiner/automatic_backups/`

## 重要な設定構造

### 1. Simple Modifications
単純なキーの置き換え
```json
"simple_modifications": [
  {
    "from": { "key_code": "caps_lock" },
    "to": [{ "key_code": "escape" }]
  }
]
```

### 2. Complex Modifications
条件付きの複雑なマッピング
```json
"complex_modifications": {
  "rules": [
    {
      "description": "Change caps_lock to escape if pressed alone",
      "manipulators": [
        {
          "type": "basic",
          "from": {
            "key_code": "caps_lock",
            "modifiers": { "optional": ["any"] }
          },
          "to": [{ "key_code": "left_control" }],
          "to_if_alone": [{ "key_code": "escape" }]
        }
      ]
    }
  ]
}
```

### 3. Function Keys
ファンクションキーのカスタマイズ
```json
"fn_function_keys": [
  {
    "from": { "key_code": "f1" },
    "to": [{ "key_code": "display_brightness_decrement" }]
  }
]
```

## 実装時の注意点

1. **バージョン互換性**
   - Karabiner-Elementsのバージョンによって設定形式が異なる場合がある
   - 最小サポートバージョンを明確にする

2. **バリデーション**
   - 無効な設定はKarabiner-Elementsがクラッシュする原因になる
   - 厳密なバリデーションが必要

3. **パフォーマンス**
   - 大量のルールがある場合のレンダリング最適化
   - 仮想スクロールの実装を検討

4. **エラーハンドリング**
   - 不正なJSONのパース
   - 未知のキーコード
   - 循環参照の検出