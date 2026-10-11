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

> ℹ️ 以下の画面上の名前（メニュー名・ボタン名）は、この環境から Re Visualizer の画面を確認できなかったため **未検証** です。
> Re のバージョンによって表示が少し違う場合があります。違っていたら、公式ドキュメントの
> [Plugin の概要](https://docs.reearth.io/en/developer/plugin/overview/plugin-structure/) や
> [Simple UI Plugin チュートリアル](https://docs.reearth.io/en/tutorials/simple-ui-plugin/) を確認してください。

1. Re Visualizer にログインし、使いたいプロジェクトを開く（なければ新しく作成）
2. プロジェクトの設定画面を開き、**プラグイン（Plugin）** の項目を開く
3. 「個人プラグイン（Personal plugins）」などのアップロード欄から、作った `thailand-memories.zip` をアップロードする
4. 地図の編集画面に戻り、**ウィジェット（Widgets）** の設定で **Thailand Memories** を追加して表示をオンにする
5. 地図の左上にパステルイエローのウィジェットが表示されれば成功です
6. 最後にプロジェクトを公開（Publish）すると、公開URLが発行されます

### プラグインを更新するとき

`thailand-widget.js` を書き換えたら、**ZIP を作り直して同じ手順でアップロードし直して** ください。
変更が反映されないときは、`reearth.yml` の `version` を `1.0.1` のように上げてからアップロードすると反映されやすくなります。
