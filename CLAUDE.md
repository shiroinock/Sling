# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code) への指針を提供します。

## プロジェクト概要

SlingはKarabiner-Elements用のキーマッピングWeb GUIです。このプロジェクトは現在、初期セットアップ段階にあります。

## 開発セットアップ

静的サイトとしてCloudflare Pagesにデプロイ可能なWeb GUIプロジェクトです。

### 技術スタック
- **ビルドツール**: Vite
- **フレームワーク**: React + TypeScript
- **スタイリング**: Tailwind CSS + shadcn/ui
- **状態管理**: Zustand
- **ファイル操作**: react-dropzone, file-saver
- **バリデーション**: Zod
- **アイコン**: lucide-react

### 開発コマンド
```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

### Karabiner-Elements統合
- Karabiner-Elementsの設定ファイルは通常JSON形式
- 静的サイトとして動作するため、設定ファイルの読み書きは以下の方法で実装：
  - ファイルアップロード（ドラッグ&ドロップ、ファイル選択）で設定を読み込み
  - 編集した設定をJSONファイルとしてダウンロード
  - ローカルストレージやIndexedDBを使用して一時的に設定を保存

## アーキテクチャの考慮事項

静的サイトとして実装する際：

1. **クライアントサイド完結**：すべての処理をブラウザ内で実行
2. **ファイル操作**：File APIを使用した設定ファイルの読み込み/ダウンロード
3. **データモデル**：Karabiner設定構造用のTypeScriptインターフェース/型を作成
4. **状態管理**：React Context/Redux/Zustandなどでクライアントサイドの状態管理
5. **永続化**：ブラウザのローカルストレージまたはIndexedDBを活用

## Cloudflare Pagesデプロイ

### ビルドコマンド（プロジェクト設定後に更新）
```bash
npm run build  # または yarn build, pnpm build
```

### ビルド出力ディレクトリ
```
dist/  # または build/, out/
```

### 環境変数
- 静的サイトのため、環境変数は不要（すべてクライアントサイドで処理）

## プロジェクト構造

```
sling/
├── src/
│   ├── components/      # UIコンポーネント
│   │   └── ui/         # shadcn/uiコンポーネント
│   ├── lib/            # ユーティリティ関数
│   │   └── utils.ts    # クラスユーティリティ
│   ├── store/          # Zustand状態管理
│   ├── types/          # TypeScript型定義
│   ├── App.tsx         # メインアプリケーション
│   ├── main.tsx        # エントリーポイント
│   └── index.css       # Tailwind CSS
├── public/             # 静的アセット
├── index.html          # HTMLテンプレート
├── package.json        # 依存関係とスクリプト
├── tsconfig.json       # TypeScript設定
├── vite.config.ts      # Vite設定
├── tailwind.config.js  # Tailwind CSS設定
└── postcss.config.js   # PostCSS設定
```

## 今後の開発ノート

プロジェクトが発展するにつれて、このファイルを以下の内容で更新してください：
- Karabiner設定ファイルの型定義とバリデーションルール
- コンポーネントの実装詳細
- テストとリントの設定
- パフォーマンス最適化の方法