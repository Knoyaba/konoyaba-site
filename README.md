# konoyaba-site

『このスキル、やばスギル ～ガチャ沼に堕ちたら俺の負け～』（略称「このやば」）の公式サイトです。HTML、CSS、JavaScriptだけで動作する静的サイトで、GitHubとCloudflare Pagesによる無料公開を想定しています。

- 公開サイト: https://konoyaba-site.pages.dev/
- GitHub: https://github.com/Knoyaba/konoyaba-site

## フォルダ構成

```text
konoyaba-site/
├─ index.html              トップ、作品紹介、最新話導線、お知らせ
├─ characters/index.html   キャラクター紹介
├─ world/index.html        世界観紹介
├─ glossary/index.html     用語集
├─ css/style.css           共通デザイン
├─ js/main.js              メニュー、キャラクター、用語データと表示処理
├─ assets/                 favicon、将来のOGP画像など
├─ images/                 公開用画像
├─ .gitignore
└─ README.md
```

## ローカルで確認する方法

簡易確認は `index.html` をブラウザで開きます。Pythonがインストールされている環境では、ページ遷移も含めて確認するため、フォルダ内で次を実行して `http://localhost:8000` を開きます。

```powershell
python -m http.server 8000
```

終了はターミナルで `Ctrl+C` です。

## GitHubへの更新方法

GitHubで `konoyaba-site` リポジトリを作成した後、表示されたURLを使って一度だけ接続します。

```powershell
git remote add origin https://github.com/ユーザー名/konoyaba-site.git
git push -u origin main
```

以後の更新は次の流れです。

```powershell
git add .
git commit -m "更新内容を短く記載"
git push
```

アカウント情報、アクセストークン、秘密鍵、`.env` はコミットしないでください。

## Cloudflare Pagesへの反映方法

Cloudflare Dashboardで Workers & Pages → Create → Pages → Connect to Git を選び、GitHubの `konoyaba-site` を接続します。

- Production branch: `main`
- Framework preset: `None`
- Build command: 空欄
- Build output directory: `/`（リポジトリのルート）

初回公開後は `main` へpushすると自動的に再デプロイされます。独自ドメインはCloudflare Pagesの Custom domains から後で設定できます。

## キャラクターを追加する方法

`js/main.js` の `characters` 配列へ、既存項目と同じ形式で追加します。`type` は `summoned`（召喚住民）、`local`（現地加入）、`main`（主人公）のいずれかです。追加内容は必ず設定正本または正式採用済み本文と照合してください。

## 用語を追加する方法

`js/main.js` の `glossary` 配列へ `term`、`reading`、`text` を追加します。未確定設定や作者だけが知る情報を、作中の公開情報として断定しないでください。

## 画像を追加する場所

Web公開用に最適化した画像は `images/` に置きます。faviconやOGP画像などサイト共通の素材は `assets/` に置きます。巨大な元画像、動画、編集途中データはリポジトリ外で管理してください。画像はWebPまたはAVIFを優先し、表示サイズに合わせて圧縮します。

OGP画像を追加する場合は `assets/og-image.jpg`（推奨1200×630px）として保存し、各HTMLの `<head>` に `og:image` と `twitter:image` を追加します。独自ドメインへ変更した場合は、canonical URLと `og:url` も新しいURLへ置換してください。

## 今後の更新時の注意点

- 作品情報は「設定正本 → 正史本文 → 正式アーク構成」の優先順で確認する。
- 正式採用前の下書きや未確定情報を公開しない。
- 小説掲載先が決まったら `index.html` の「掲載先 準備中」を正式URLのリンクへ置換する。
- 独自ドメインへ変更した場合、各ページのcanonical、OGP URL、SNS画像を更新する。
- 外部ライブラリを追加する前に、HTML/CSS/JavaScriptだけで実現できないか確認する。
- `sources/` や作品本体の正本ファイルは、このサイトリポジトリへコピーしない。
