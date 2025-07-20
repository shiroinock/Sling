# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code) への指針を提供します。

## プロジェクト概要

SlingはKarabiner-Elements用のキーマッピングWeb GUIです。VIA/Remap風のビジュアルキーボードインターフェースで、直感的にキーマッピングを編集できます。

## 開発セットアップ

静的サイトとしてCloudflare Pagesにデプロイ可能なWeb GUIプロジェクトです。

### 技術スタック
- **ビルドツール**: Vite
- **フレームワーク**: React + TypeScript
- **スタイリング**: Tailwind CSS + shadcn/ui
- **状態管理**: Zustand（ローカルストレージ永続化付き）
- **ファイル操作**: react-dropzone, file-saver
- **バリデーション**: Zod
- **コード品質**: Biome（リンター + フォーマッター）
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

# コードリント（チェックのみ）
npm run lint

# コードリント（自動修正付き）
npm run lint:fix

# コードフォーマット
npm run format

# 総合チェック（リント＋フォーマット）
npm run check

# 総合チェック（自動修正付き）
npm run check:fix

# TypeScriptの型チェック
npx tsc --noEmit
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
│   ├── components/         # UIコンポーネント
│   │   ├── FileUpload.tsx         # ファイルアップロードコンポーネント
│   │   ├── ConfigurationEditor.tsx # メイン編集UI
│   │   ├── ProfileTabs.tsx        # プロファイル切り替えタブ
│   │   ├── KeyMappingEditor.tsx   # キーマッピング編集モーダル
│   │   ├── ComplexModificationsList.tsx # 複雑な修飾キー一覧
│   │   ├── keyboard/              # キーボード関連コンポーネント
│   │   │   ├── VisualKeyboard.tsx # ビジュアルキーボード
│   │   │   └── Key.tsx            # 個別キーコンポーネント
│   │   └── ui/                    # shadcn/uiコンポーネント
│   ├── data/              # 静的データ
│   │   └── keyboardLayouts.ts     # キーボードレイアウト定義
│   ├── lib/               # ユーティリティ関数
│   │   └── utils.ts       # クラスユーティリティ
│   ├── store/             # Zustand状態管理
│   │   └── karabiner.ts   # Karabiner設定ストア
│   ├── types/             # TypeScript型定義
│   │   ├── karabiner.ts   # Karabiner設定の型定義
│   │   └── karabiner-schema.ts # スキーマ定義
│   ├── App.tsx            # メインアプリケーション
│   ├── main.tsx           # エントリーポイント
│   └── index.css          # Tailwind CSS
├── docs/                  # ドキュメント
│   ├── DEVELOPMENT_PLAN.md      # 開発計画
│   └── KARABINER_INTEGRATION.md # Karabiner統合ガイド
├── public/                # 静的アセット
├── biome.json             # Biome設定
├── index.html             # HTMLテンプレート
├── package.json           # 依存関係とスクリプト
├── tsconfig.json          # TypeScript設定
├── tsconfig.node.json     # Node.js用TypeScript設定
├── vite.config.ts         # Vite設定
├── vite-env.d.ts          # Vite型定義
├── tailwind.config.js     # Tailwind CSS設定
├── postcss.config.js      # PostCSS設定
├── README.md              # プロジェクトREADME
├── CLAUDE.md              # Claude Code用ガイド
└── LICENSE                # ライセンスファイル
```

## 現在の実装状況

### 完了済み
- **Karabiner設定の型定義** (`src/types/karabiner.ts`)
  - 完全なKarabiner設定構造の型定義
  - よく使用されるキーコード、修飾キー、コンシューマキーの定数定義
- **ファイル操作**
  - ドラッグ&ドロップでの設定ファイル読み込み
  - JSON形式での設定ファイルエクスポート
  - Zodスキーマによるバリデーション
- **ビジュアルキーボードUI**
  - VIA/Remap風のビジュアルキーボード表示
  - US ANSI、JIS、MacBook US/JISレイアウト対応
  - キークリックでマッピング編集開始
  - マッピング済みキーの視覚的表示（マップ先のキーラベル表示）
- **Simple Modifications編集**
  - Simple Modificationsの追加・編集・削除
  - モーダルでの直感的な編集UI
  - ビジュアルキーボードからのキー選択
- **Complex Modifications編集** ✨ NEW
  - Complex Modificationsルールの作成・編集・削除
  - Manipulatorの追加・編集・削除
  - From/Toイベントの詳細設定
  - 条件（Conditions）の設定UI
  - タブによる整理されたインターフェース
- **状態管理**
  - Zustandによる設定管理（ローカルストレージ永続化付き）
  - プロファイル切り替え機能
  - リアルタイムでの変更反映
- **UIコンポーネント**
  - shadcn/ui準拠のコンポーネント群
  - Dialog、Tabs、Select、Badge、Button、Input、Label
  - ダークモード対応の色設定（適切なコントラスト）

### 実装予定
- モディファイアキーの組み合わせ対応（Complex Modificationsで部分対応済み）
- プロファイルの作成・複製・削除
- 特殊キー（メディアキー、ファンクションキー）の完全対応
- マッピングの検索・フィルタリング機能
- インポート/エクスポート履歴
- ルールのグループ化と有効/無効切り替え

## 今後の開発ノート

プロジェクトが発展するにつれて、このファイルを以下の内容で更新してください：
- Karabiner設定ファイルのバリデーションルール
- コンポーネントの実装詳細
- テストとリントの設定
- パフォーマンス最適化の方法

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