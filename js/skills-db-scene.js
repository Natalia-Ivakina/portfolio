export function buildDbBoard(root) {
  const types = ["web", "mobile", "data"];
  const records = [
    "web",
    "mobile",
    "data",
    "web",
    "mobile",
    "web",
    "data",
    "web",
    "mobile",
    "web",
    "mobile",
    "web",
  ].map((type, index) => ({
    id: index + 1,
    type,
    name: "item_" + String(index + 1).padStart(2, "0"),
  }));

  const board = root.querySelector('[data-pane="db"] .ns-db-board');

  // columns
  const groupCounts = types.map((type, column) => {
    const group = document.createElement("div");
    group.className = "ns-db-group";
    group.dataset.group = type;
    group.style.setProperty("--col", column);
    group.innerHTML =
      '<div class="ns-group-title">' +
      type +
      '</div><div class="ns-group-fields">id<span>record</span></div><div class="ns-group-count"></div>';
    for (let i = 0; i < 7; i++) {
      const line = document.createElement("div");
      line.className = "ns-grid-rule";
      line.style.top = 86 + i * 34 + "px";
      line.style.transitionDelay = i * 0.09 + "s";
      group.appendChild(line);
    }
    board.appendChild(group);
    return group.querySelector(".ns-group-count");
  });

  // rows
  const rows = records.map((record, index) => {
    const row = document.createElement("div");
    row.className = "ns-db-row";
    row.dataset.id = String(record.id);
    row.dataset.group = record.type;
    row.style.cssText = [
      `--slot:${index}`,
      `--col:${types.indexOf(record.type)}`,
      `--mess-x:${25 + ((index * 13) % 35)}%`,
      `--mess-y:${120 + ((index * 31) % 100)}px`,
      `--tilt:${((index * 17) % 42) - 21}deg`,
      `--fall-delay:${index * 0.065}s`,
    ].join(";");

    [String(record.id).padStart(2, "0"), record.name].forEach((value) => {
      const cell = document.createElement("span");
      cell.textContent = value;
      row.appendChild(cell);
    });

    board.appendChild(row);
    return row;
  });

  return { types, records, board, groupCounts, rows };
}
