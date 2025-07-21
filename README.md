# Sling

[![Deploy to GitHub Pages](https://github.com/shiroinock/Sling/actions/workflows/deploy.yml/badge.svg)](https://github.com/shiroinock/Sling/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Visual key mapping GUI for Karabiner-Elements - Easily customize your keyboard with a VIA/Remap-style interface.

🚀 **[Try it now](https://shiroinock.github.io/Sling/)**

## 日本語

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

- **検索・フィルタリング機能**
  - Simple/Complex Modifications両方で検索可能
  - リアルタイムフィルタリング
  
- **インポート/エクスポート履歴**
  - 最大20件の操作履歴を保存
  - タイムスタンプと統計情報の表示
  
- **ルールのグループ化と有効/無効切り替え**
  - Complex Modificationsのグループ別整理
  - 個別ルールの有効/無効トグル
  
- **ダークモード対応**
  - システム設定の自動検出
  - 手動切り替えトグル

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
