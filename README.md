# Sling

SlingはKarabiner-Elements用のキーマッピングWeb GUIです。VIA/Remap風のビジュアルキーボードインターフェースで、直感的にキーマッピングを編集できます。

## 機能

### 実装済み
- **ビジュアルキーボードUI**
  - US ANSI、JIS、MacBook US/JISレイアウト対応
  - キークリックで直感的にマッピング設定
  - マッピング済みキーの視覚的表示
  
- **Simple Modifications編集**
  - キーマッピングの追加・編集・削除
  - モディファイアキーの組み合わせ対応（Ctrl+Shift+Aなど）
  
- **特殊キー対応**
  - ファンクションキー（F1-F24）
  - メディアキー（再生/一時停止、音量調整など）
  - システムキー（Mission Control、Launchpad、Dashboard）
  - ディスプレイ輝度調整キー
  - ナビゲーションキー（Page Up/Down、Home、End など）
  - テンキー対応
  
- **Complex Modifications編集**
  - ルールの作成・編集・削除
  - Manipulatorの管理
  - 条件（Conditions）の設定
  
- **プロファイル管理**
  - プロファイルの作成・複製・削除
  - デフォルトプロファイルの設定
  
- **ファイル操作**
  - ドラッグ&ドロップでの設定ファイル読み込み
  - JSON形式での設定ファイルエクスポート

### 開発予定
- マッピングの検索・フィルタリング機能
- インポート/エクスポート履歴
- ルールのグループ化と有効/無効切り替え
- ダークモードの手動切り替えトグル

## 技術スタック
- React + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Zustand（状態管理）

## 開発
```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build
```
