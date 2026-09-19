# GitHub Pages 学習サイト

GitHub Pagesで静的HTMLサイトを公開し、後からPagefindによるカテゴリ指定検索を追加する学習プロジェクトです。

公開サイトの題材は、架空の島「星凪島」の自然観察ガイドです。文章、地名、施設、動植物、行事、画像は、この学習用に作成した架空の内容です。

## ディレクトリ

- `docs/`：GitHub Pagesで公開するHTML、CSS、画像
- `WORKLOG.md`：設計、操作、確認結果を記録した作業ログ

GitHub Pagesでは、`main` ブランチの `/docs` を公開元として使用する予定です。

## 現在の状態

静的サイトをGitHub Pagesで公開し、Pagefindによるサイト内検索を追加済みです。検索画面では、サイト全体または北海岸・中央の森・南港のいずれかを指定して検索できます。

公開URL：<https://hoshinagi-web-lab.github.io/github-pages-study/>

## 検索索引の更新

Pagefind 1.5.2を開発用依存関係として使用しています。最初に依存関係を準備します。

```text
npm install
```

HTMLを追加または変更した後は、公開前に検索索引を再生成します。

```text
npm run build:search
```

この操作により、`docs/pagefind/` の静的な検索用ファイルが更新されます。HTMLの変更と一緒に、生成された検索用ファイルもGitへ登録します。

検索を含むローカルプレビューは次の操作で起動できます。

```text
npm run preview
```
