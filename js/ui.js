const $ = id => document.getElementById(id);
const btn = (label, fn, id) => { const b = document.createElement("button"); b.textContent = label; b.onclick = fn; if (id) b.dataset.id = id; return b; };

export class UI {
  hud(g) {
    $("hLevel").textContent = `${g.levelIdx + 1}/${g.cfg.levels.length}`;
    $("hGold").textContent = g.gold; $("hLife").textContent = g.life; $("hScore").textContent = g.score;
  }
  msg(t) { $("msg").textContent = t; }
  flash() { const s = $("stage"); s.classList.add("hit"); setTimeout(() => s.classList.remove("hit"), 150); }
  startBtn(show) { $("btnStart").hidden = !show; }
  panel(g) {
    const t = $("towers");
    for (const [id, c] of Object.entries(g.cfg.towers))
      t.append(btn(c.label, () => {
        g.selected = g.selected === id ? null : id;
        [...t.children].forEach(b => b.classList.toggle("on", b.dataset.id === g.selected));
      }, id));
    for (const [id, a] of Object.entries(g.cfg.abilities)) $("abilities").append(btn(a.label, () => g.useAbility(id)));
  }
  overlay({ title, text = "", input = false, buttons = [], rank = null }) {
    $("overlay").hidden = false; $("oTitle").textContent = title; $("oText").textContent = text; $("oName").hidden = !input;
    const bs = $("oBtns"); bs.innerHTML = ""; buttons.forEach(([l, f]) => bs.append(btn(l, f)));
    const ol = $("oRank"); ol.innerHTML = "";
    if (rank) rank().then(rows => rows.forEach(r => {
      const li = document.createElement("li"); li.textContent = `${r.nombre} — ${r.puntaje} pts (nivel ${r.nivel})`; ol.append(li);
    })).catch(() => { const li = document.createElement("li"); li.textContent = "No se pudo cargar el ranking."; ol.append(li); });
  }
  ranking(rows) {
    const ol = $("liveRank"); ol.innerHTML = "";
    const add = t => { const li = document.createElement("li"); li.textContent = t; ol.append(li); };
    if (!rows) add("No se pudo cargar el ranking.");
    else if (!rows.length) add("Aún no hay puntajes. ¡Sé el primero!");
    else rows.forEach(r => add(`${r.nombre} — ${r.puntaje} pts (nivel ${r.nivel})`));
  }
  hide() { $("overlay").hidden = true; }
  name() { return $("oName").value.trim().slice(0, 20); }
  note(t) { $("oText").textContent = t; }
}
