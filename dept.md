# dept: 235

依存ライブラリが最新版からどれだけ遅れているか。最新版までに出たリリースを major / minor / patch に分けて数え、重みを掛けて足したもの([スコアの定義](https://github.com/shiroinock/dept#スコアの定義))。

- 合計 **235** = major 4 × 30 + minor 22 × 3 + patch 49 × 1
- 8 / 34 パッケージが遅れている、1.4 libyears
- ロックファイル:`./pnpm-lock.yaml`

| SCORE | PACKAGE | CURRENT | LATEST | MAJ | MIN | PAT | LIBYEAR | KIND |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| 149 | `@types/node` | 24.19.2 | 26.6.7 | 2 | 15 | 44 | 0.1 | dev |
| 61 | `typescript` | 5.9.3 | 7.0.2 | 2 | 0 | 1 | 0.8 | dev |
| 18 | `lucide-react` | 1.73.0 | 1.79.0 | 0 | 6 | 0 | 0.0 | dev |
| 3 | `autoprefixer` | 10.6.2 | 10.7.0 | 0 | 1 | 0 | 0.1 | dev |
| 1 | `@biomejs/biome` | 2.6.8 | 2.6.9 | 0 | 0 | 1 | 0.0 | dev |
| 1 | `@types/react` | 19.3.0 | 19.3.1 | 0 | 0 | 1 | 0.2 | dev |
| 1 | `react-dropzone` | 20.2.0 | 20.2.1 | 0 | 0 | 1 | 0.0 | prod |
| 1 | `tailwind-merge` | 3.7.0 | 3.7.1 | 0 | 0 | 1 | 0.2 | dev |

<details>
<summary>最新の依存(26 件)</summary>

| PACKAGE | VERSION | KIND |
| --- | --- | --- |
| `@playwright/test` | 1.65.1 | dev |
| `@radix-ui/react-collapsible` | 1.2.1 | prod |
| `@radix-ui/react-dialog` | 1.3.1 | prod |
| `@radix-ui/react-label` | 2.1.17 | prod |
| `@radix-ui/react-radio-group` | 1.5.1 | prod |
| `@radix-ui/react-scroll-area` | 1.4.0 | prod |
| `@radix-ui/react-select` | 2.4.1 | prod |
| `@radix-ui/react-slot` | 1.5.0 | dev |
| `@radix-ui/react-switch` | 1.4.1 | prod |
| `@radix-ui/react-tabs` | 1.2.1 | prod |
| `@tailwindcss/postcss` | 4.3.5 | prod |
| `@types/file-saver` | 2.0.7 | dev |
| `@types/react-dom` | 19.3.0 | dev |
| `@types/uuid` | 11.0.0 | dev |
| `@vitejs/plugin-react` | 6.3.0 | dev |
| `class-variance-authority` | 0.7.1 | dev |
| `clsx` | 2.1.1 | dev |
| `file-saver` | 2.0.5 | prod |
| `postcss` | 8.5.33 | dev |
| `react` | 19.3.1 | prod |
| `react-dom` | 19.3.1 | prod |
| `tailwindcss` | 4.3.5 | dev |
| `uuid` | 14.0.3 | prod |
| `vite` | 8.3.8 | dev |
| `zod` | 4.6.7 | prod |
| `zustand` | 5.1.0 | prod |

</details>

---

[dept](https://github.com/shiroinock/dept) で作成
