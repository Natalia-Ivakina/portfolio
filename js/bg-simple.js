(function () {
  const LINE_HEIGHT = 17;
  const FONT_SIZE = 12;
  const PAD = 4;

  let root = null;
  let cellW = 0;
  let cols = 0;
  let rows = 0;
  let timer = null;

  function randomHex() {
    return Math.floor(Math.random() * 16).toString(16);
  }

  function measureCell() {
    const probe = document.createElement("span");
    probe.style.cssText = `
      position: absolute;
      visibility: hidden;
      white-space: pre;
      font-family: monospace;
      font-size: ${FONT_SIZE}px;
    `;
    probe.textContent = "ff ".repeat(100);
    document.body.appendChild(probe);
    const w = probe.getBoundingClientRect().width / 100;
    probe.remove();
    return w || 8;
  }

  function fill(c, r) {
    const lines = new Array(r);
    for (let y = 0; y < r; y++) {
      let line = "";
      for (let x = 0; x < c; x++) line += randomHex() + randomHex() + " ";
      lines[y] = line;
    }
    root.textContent = lines.join("\n");
  }

  function update() {
    const needCols = Math.ceil(window.innerWidth / cellW) + PAD;
    const needRows = Math.ceil(window.innerHeight / LINE_HEIGHT) + PAD;

    if (needCols <= cols && needRows <= rows) return;

    cols = Math.max(cols, needCols);
    rows = Math.max(rows, needRows);
    fill(cols, rows);
  }

  function createBg() {
    root = document.createElement("div");
    root.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #2a4268d7 0%, #1a2332 50%, #27584b 100%);
      z-index: -1;
      pointer-events: none;
      font-family: monospace;
      font-size: ${FONT_SIZE}px;
      color: rgba(118, 118, 118, 0.09);
      line-height: ${LINE_HEIGHT}px;
      white-space: pre;
      -webkit-text-stroke: 0.2px rgba(152, 228, 185, 0.05);
      text-shadow:
        0 0 1px rgba(152, 228, 185, 0.01),
        0 0 2px rgba(152, 228, 185, 0.04),
        0 0 4px rgba(152, 228, 185, 0.04);
      overflow: hidden;
    `;

    document.body.insertBefore(root, document.body.firstChild);

    cellW = measureCell();
    update();

    window.addEventListener("resize", () => {
      clearTimeout(timer);
      timer = setTimeout(update, 150);
    });
  }

  if (document.body) {
    createBg();
  } else {
    document.addEventListener("DOMContentLoaded", createBg);
  }
})();
