// =====================================================================
// Thailand Memories — Re Visualizer ウィジェットプラグイン
// 拡張ID: thailand-widget（reearth.yml の extensions[].id とファイル名を一致させる）
// =====================================================================

// ---------------------------------------------------------------------
// ★ 旅行スポットのデータ定義（写真や文章の差し替えはここだけでOK）
//
//   id        : 半角英数字の一意な名前（重複しないように）
//   name      : 表示名（英語）
//   nameJa    : 表示名（日本語）
//   lat / lng : 緯度・経度
//   height    : カメラの高さ（メートル）。小さいほど地図が近くなる
//   photoUrl  : 写真のURL（https://〜）。空文字 "" ならプレースホルダーを表示
//   memory    : 思い出の説明文
//   places    : 訪れた場所のリスト
//
//   スポットを追加するときは { ... } のかたまりを1つコピーして書き換えてください。
// ---------------------------------------------------------------------
const SPOTS = [
  {
    id: "bangkok",
    name: "Bangkok",
    nameJa: "バンコク",
    lat: 13.7563,
    lng: 100.5018,
    height: 30000,
    photoUrl: "",
    memory: "ここに思い出の説明文を書きます。（例）ワット・アルンの夕焼けがとてもきれいでした。",
    places: ["ワット・アルン", "ワット・ポー", "チャトゥチャック・ウィークエンドマーケット"],
  },
  {
    id: "chiang-mai",
    name: "Chiang Mai",
    nameJa: "チェンマイ",
    lat: 18.7883,
    lng: 98.9853,
    height: 30000,
    photoUrl: "",
    memory: "ここに思い出の説明文を書きます。（例）旧市街をのんびり散歩しました。",
    places: ["ワット・プラシン", "ドイ・ステープ", "ナイトバザール"],
  },
  {
    id: "phuket",
    name: "Phuket",
    nameJa: "プーケット",
    lat: 7.8804,
    lng: 98.3923,
    height: 50000,
    photoUrl: "",
    memory: "ここに思い出の説明文を書きます。（例）海がとても青くて感動しました。",
    places: ["パトンビーチ", "プーケット・オールドタウン", "ビッグ・ブッダ"],
  },
  {
    id: "koh-samui",
    name: "Koh Samui",
    nameJa: "サムイ島",
    lat: 9.512,
    lng: 100.0136,
    height: 50000,
    photoUrl: "",
    memory: "ここに思い出の説明文を書きます。（例）ビーチで一日ゆっくり過ごしました。",
    places: ["チャウエンビーチ", "ワット・プラヤイ（ビッグ・ブッダ寺院）", "ナムアンの滝"],
  },
];

// 「タイ全体を見る」ボタンで移動する位置
const OVERVIEW = { lat: 13.0, lng: 101.0, height: 1800000 };

// ウィジェットの大きさ（ピクセル）
const WIDGET_WIDTH = 300;
const WIDGET_HEIGHT = 460;
const WIDGET_HEIGHT_FOLDED = 48;

// =====================================================================
// ここから下はプログラム本体です（通常は編集不要）
// =====================================================================

// HTML の <script> 内に安全に埋め込めるよう JSON 化する
const spotsJson = JSON.stringify(SPOTS).replace(/</g, "\\u003c");

const html = `
<style>
  :root {
    --yellow: #fff6c7;
    --yellow-strong: #ffe680;
    --yellow-dark: #e8c547;
    --text: #4a3f2a;
    --muted: #8a7d5e;
    --white: #ffffff;
  }
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    font-family: "Hiragino Maru Gothic ProN", "Hiragino Sans", "Noto Sans JP", "Segoe UI", sans-serif;
    color: var(--text);
    background: transparent;
  }
  .album {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--yellow);
    border: 2px solid var(--yellow-dark);
    border-radius: 14px;
    overflow: hidden;
  }
  .header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    background: var(--yellow-strong);
    border-bottom: 2px dashed var(--yellow-dark);
    flex-shrink: 0;
  }
  .header h1 {
    flex: 1;
    margin: 0;
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .btn {
    border: 2px solid var(--yellow-dark);
    background: var(--white);
    color: var(--text);
    border-radius: 999px;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    min-height: 32px;
  }
  .btn:hover, .btn:focus-visible { background: var(--yellow-strong); outline: none; }
  .btn-icon { padding: 4px 10px; }
  .content { flex: 1; overflow-y: auto; padding: 10px; }
  .folded .content { display: none; }
  .folded .header { border-bottom: none; }

  /* スポット一覧 */
  .spot-list { list-style: none; margin: 0; padding: 0; }
  .spot-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    margin-bottom: 8px;
    padding: 8px;
    background: var(--white);
    border: 2px solid transparent;
    border-radius: 10px;
    box-shadow: 0 2px 0 var(--yellow-dark);
    text-align: left;
    font: inherit;
    color: inherit;
    cursor: pointer;
  }
  .spot-item:hover, .spot-item:focus-visible { border-color: var(--yellow-dark); outline: none; }
  .thumb {
    width: 52px;
    height: 52px;
    flex-shrink: 0;
    border-radius: 6px;
    object-fit: cover;
    background: var(--yellow);
  }
  .spot-name { font-weight: bold; font-size: 14px; }
  .spot-sub { font-size: 12px; color: var(--muted); }
  .arrow { margin-left: auto; color: var(--yellow-dark); font-weight: bold; }
  .overview { width: 100%; margin-top: 4px; }

  /* 思い出カード */
  .card {
    background: var(--white);
    border-radius: 10px;
    padding: 10px 10px 14px;
    box-shadow: 0 3px 0 var(--yellow-dark);
  }
  .photo-frame {
    background: var(--white);
    padding: 6px 6px 0;
    border: 1px solid #eee3b5;
    transform: rotate(-1deg);
    margin-bottom: 10px;
  }
  .photo {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    background: var(--yellow);
  }
  .placeholder {
    width: 100%;
    aspect-ratio: 4 / 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    background: repeating-linear-gradient(45deg, var(--yellow), var(--yellow) 10px, #fffbe3 10px, #fffbe3 20px);
    color: var(--muted);
    font-size: 12px;
  }
  .placeholder .icon { font-size: 32px; }
  .placeholder.thumb { width: 52px; height: 52px; aspect-ratio: auto; }
  .placeholder.thumb .icon { font-size: 22px; }
  .card h2 { margin: 0 0 2px; font-size: 18px; }
  .card .ja { font-size: 13px; color: var(--muted); margin-bottom: 8px; }
  .card h3 {
    margin: 10px 0 4px;
    font-size: 13px;
    display: inline-block;
    background: var(--yellow-strong);
    padding: 1px 8px;
    border-radius: 4px;
  }
  .memory { margin: 0; font-size: 13px; line-height: 1.6; white-space: pre-wrap; }
  .places { margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.6; }
  .card-actions { display: flex; gap: 6px; margin-top: 10px; }
  .card-actions .btn { flex: 1; }
</style>

<div class="album" id="album">
  <div class="header">
    <button class="btn btn-icon" id="back" type="button" title="一覧に戻る" style="display:none">← 一覧</button>
    <h1 id="title">🌴 Thailand Memories</h1>
    <button class="btn btn-icon" id="fold" type="button" title="たたむ / ひらく">－</button>
  </div>
  <div class="content" id="content"></div>
</div>

<script>
  var SPOTS = ${spotsJson};
  var FULL_HEIGHT = ${WIDGET_HEIGHT};
  var FOLDED_HEIGHT = ${WIDGET_HEIGHT_FOLDED};

  var album = document.getElementById("album");
  var content = document.getElementById("content");
  var backBtn = document.getElementById("back");
  var foldBtn = document.getElementById("fold");
  var title = document.getElementById("title");
  var folded = false;

  // プラグイン本体へメッセージを送る（公式の UI → プラグイン通信）
  function send(msg) {
    parent.postMessage(msg, "*");
  }

  function el(tag, className, text) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text != null) e.textContent = text;
    return e;
  }

  function placeholder(small) {
    var p = el("div", "placeholder");
    p.appendChild(el("div", "icon", "📷"));
    if (!small) p.appendChild(el("div", "", "写真はまだ登録されていません"));
    return p;
  }

  // 写真を表示。URLが空、または読み込み失敗時はプレースホルダーにする
  function photo(url, className, small) {
    if (!url) {
      var ph = placeholder(small);
      if (small) ph.className += " thumb";
      return ph;
    }
    var img = el("img", className);
    img.src = url;
    img.alt = "";
    img.loading = "lazy";
    img.onerror = function () {
      var ph2 = placeholder(small);
      if (small) ph2.className += " thumb";
      img.replaceWith(ph2);
    };
    return img;
  }

  function showList() {
    title.textContent = "🌴 Thailand Memories";
    backBtn.style.display = "none";
    content.innerHTML = "";
    var ul = el("ul", "spot-list");
    SPOTS.forEach(function (spot) {
      var li = el("li");
      var b = el("button", "spot-item");
      b.type = "button";
      b.appendChild(photo(spot.photoUrl, "thumb", true));
      var text = el("div");
      text.appendChild(el("div", "spot-name", spot.name));
      text.appendChild(el("div", "spot-sub", spot.nameJa));
      b.appendChild(text);
      b.appendChild(el("span", "arrow", "›"));
      b.onclick = function () { selectSpot(spot); };
      li.appendChild(b);
      ul.appendChild(li);
    });
    content.appendChild(ul);
    var ov = el("button", "btn overview", "🗺 タイ全体を見る");
    ov.type = "button";
    ov.onclick = function () { send({ action: "overview" }); };
    content.appendChild(ov);
    content.scrollTop = 0;
  }

  function selectSpot(spot) {
    send({ action: "flyTo", id: spot.id });
    showCard(spot);
  }

  function showCard(spot) {
    title.textContent = "📍 " + spot.name;
    backBtn.style.display = "";
    content.innerHTML = "";

    var card = el("div", "card");
    var frame = el("div", "photo-frame");
    frame.appendChild(photo(spot.photoUrl, "photo", false));
    card.appendChild(frame);

    card.appendChild(el("h2", "", spot.name));
    card.appendChild(el("div", "ja", spot.nameJa));

    card.appendChild(el("h3", "", "思い出"));
    card.appendChild(el("p", "memory", spot.memory || ""));

    card.appendChild(el("h3", "", "訪れた場所"));
    var ul = el("ul", "places");
    (spot.places || []).forEach(function (p) { ul.appendChild(el("li", "", p)); });
    card.appendChild(ul);

    var actions = el("div", "card-actions");
    var again = el("button", "btn", "📍 もう一度移動");
    again.type = "button";
    again.onclick = function () { send({ action: "flyTo", id: spot.id }); };
    var back = el("button", "btn", "← 一覧へ");
    back.type = "button";
    back.onclick = showList;
    actions.appendChild(again);
    actions.appendChild(back);
    card.appendChild(actions);

    content.appendChild(card);
    content.scrollTop = 0;
  }

  backBtn.onclick = showList;

  foldBtn.onclick = function () {
    folded = !folded;
    album.classList.toggle("folded", folded);
    foldBtn.textContent = folded ? "＋" : "－";
    send({ action: "resize", height: folded ? FOLDED_HEIGHT : FULL_HEIGHT });
  };

  showList();
</script>
`;

// UI を表示する（公式API: reearth.ui.show）
reearth.ui.show(html, {
  visible: true,
  width: WIDGET_WIDTH,
  height: WIDGET_HEIGHT,
});

// UI からのメッセージを受け取る（公式API: reearth.extension.on("message", ...)）
reearth.extension.on("message", function (msg) {
  if (!msg || typeof msg !== "object") return;

  if (msg.action === "flyTo") {
    const spot = SPOTS.find(function (s) { return s.id === msg.id; });
    if (!spot) return;
    // 公式API: reearth.camera.flyTo(位置, { duration: 秒 })
    reearth.camera.flyTo(
      {
        lat: spot.lat,
        lng: spot.lng,
        height: spot.height,
        heading: 0,
        pitch: -Math.PI / 2, // 真上から見下ろす
        roll: 0,
      },
      { duration: 2 }
    );
  } else if (msg.action === "overview") {
    reearth.camera.flyTo(
      { lat: OVERVIEW.lat, lng: OVERVIEW.lng, height: OVERVIEW.height, heading: 0, pitch: -Math.PI / 2, roll: 0 },
      { duration: 2 }
    );
  } else if (msg.action === "resize" && typeof msg.height === "number") {
    // 公式API: reearth.ui.resize(幅, 高さ)
    reearth.ui.resize(WIDGET_WIDTH, msg.height);
  }
});
