# ZIP ファイルの作り方と Re Visualizer への導入手順

## 1. ZIP に入れるファイル

ZIP には **次の 2 つだけ** を入れます。

| ファイル | 役割 |
| --- | --- |
| `reearth.yml` | プラグインの設定ファイル（名前・拡張IDなど） |
| `thailand-widget.js` | ウィジェット本体（HTML・CSS もこの中に入っています） |

> ⚠️ **大事なポイント**
> ZIP を開いたとき、**いちばん上（ルート直下）に `reearth.yml` と `thailand-widget.js` が並んでいる** 必要があります。
> フォルダごと圧縮すると `フォルダ名/reearth.yml` のように 1 段深くなってしまい、Re に読み込めません。

正しい例:

```
thailand-memories.zip
├── reearth.yml
└── thailand-widget.js
```

間違った例:

```
thailand-memories.zip
└── Hackathon_Oct_KanokoFujiwara/
    ├── reearth.yml
    └── thailand-widget.js
```

`README.md`・`index.html`・`assets/` などは **ZIP に入れません**（GitHub 用のファイルです）。

---

## 2. ZIP の作り方

どれか 1 つの方法で作ってください。

### 方法 A：Mac の Finder で作る

1. リポジトリのフォルダを Finder で開く
2. `reearth.yml` と `thailand-widget.js` の **2 つのファイルだけ** を ⌘(command) キーを押しながらクリックして選択
3. 右クリック →「2 項目を圧縮」
4. `アーカイブ.zip` ができるので、`thailand-memories.zip` に名前を変える

### 方法 B：Windows のエクスプローラーで作る

1. リポジトリのフォルダをエクスプローラーで開く
2. `reearth.yml` と `thailand-widget.js` の **2 つのファイルだけ** を Ctrl キーを押しながらクリックして選択
3. 右クリック →「ZIP ファイルに圧縮する」（Windows 10 は「送る」→「圧縮 (zip 形式) フォルダー」）
4. できた ZIP を `thailand-memories.zip` に名前を変える

### 方法 C：ターミナルでスクリプトを使う（Mac / Linux）

```sh
sh make-zip.sh
```

`dist/thailand-memories.zip` ができます。最後に中身の一覧が表示されるので、
`reearth.yml` と `thailand-widget.js` がフォルダ名なしで並んでいることを確認してください。

### 確認方法

ZIP を作ったら、一度ダブルクリックで展開してみて、
**フォルダの中に直接 `reearth.yml` と `thailand-widget.js` が出てくる** ことを確認しましょう。

---

## 3. Re Visualizer への導入手順

Re Visualizer v1.0.0-beta.16.26 で確認した手順です。

1. Re Visualizer にログインし、ダッシュボードで使いたいプロジェクトを開く（なければ「新規プロジェクト」で作成）
2. 画面上部の **プロジェクト名の横の「⌄」** からプロジェクト設定を開き、左メニューの **「プラグイン」** を選ぶ
3. 上のタブで **「個人インストール済み」** を選び、**「PCからZipファイルをアップロード」** で `thailand-memories.zip` を選ぶ
4. 「インストール済みプラグイン」に **Thailand Memories** が表示されればインストール完了
5. 地図の編集画面に戻り、右上の **「ウィジェット」** タブ → **「ウィジェットを追加」** で **Thailand Memories** を追加する
6. 地図の左上にパステルイエローのウィジェットが表示されれば成功です
   - スマートフォン用の表示は別設定です。ウィジェットタブ上部の **「モバイル」** に切り替えて、もう一度「ウィジェットを追加」してください
7. 右上の **「公開」** タブからプロジェクトを公開すると、公開URLが発行されます

> 💡 ダッシュボード左下の **「プラグインプレイグラウンド」** でも、`reearth.yml` と `thailand-widget.js` の中身を貼り付けて ▶ で試せます。
> （プレイグラウンドは背景の地図が表示されないことがあります）

> ⚠️ ダッシュボードの「インポート」ボタンはプロジェクト用です。プラグインの ZIP には使いません。

### プラグインを更新するとき

`thailand-widget.js` を書き換えたら、**ZIP を作り直して同じ手順でアップロードし直して** ください。
変更が反映されないときは、`reearth.yml` の `version` を `1.0.1` のように上げてからアップロードすると反映されやすくなります。
