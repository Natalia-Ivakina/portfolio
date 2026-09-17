/* ========================================================================== 
   NATAIVA — SKILLS IN ACTION

   Что делает этот файл:
   1. связывает пять кнопок с пятью демонстрационными сценами;
   2. печатает небольшой осмысленный фрагмент кода;
   3. только после печати включает визуальное действие этого кода;
   4. повторяет процесс при клике, наведении или фокусе с клавиатуры.

   Здесь нет библиотек и сетевых запросов: компонент работает на чистом JS.
   ========================================================================== */

(function initSkillsStories() {
  "use strict";

  const root = document.getElementById("ns-stories");
  if (!root) return;

  const buttons = [...root.querySelectorAll(".ns-skill-button")];
  const panes = [...root.querySelectorAll(".ns-pane")];
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // terminal
  const sharedCode = root.querySelector(".ns-codebox");
  root.querySelectorAll(".ns-codebox").forEach((box) => {
    if (box !== sharedCode) box.remove();
  });
  root.querySelector(".ns-stage").appendChild(sharedCode);

  let timers = [];
  let typingInterval = 0;
  let activeMode = "";
  let hoverTimer = 0;

  /** Найти элемент только внутри конкретной сцены. */
  function get(paneName, selector) {
    if (selector === ".ns-language" || selector === ".ns-code")
      return sharedCode.querySelector(selector);
    return root.querySelector(`[data-pane="${paneName}"] ${selector}`);
  }

  /** Сохранить таймер, чтобы безопасно отменить его при смене сцены. */
  function later(callback, delay) {
    timers.push(window.setTimeout(callback, delay));
  }

  /** Остановить незавершённую сцену перед запуском следующей. */
  function clearAnimationQueue() {
    timers.forEach(window.clearTimeout);
    timers = [];
    window.clearInterval(typingInterval);
  }

  /* ------------------------------------------------------------------------
     ДАННЫЕ ДЛЯ SQL-СЦЕНЫ
     Порядок массива намеренно хаотичный. На втором этапе записи получают
     позиции по типу и id; третий этап показывает COUNT(*) каждой группы.
     ------------------------------------------------------------------------ */

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

  const databaseBoard = get("db", ".ns-db-board");

  // Равные колонки с собственными строками, цветом и итоговым COUNT(*).
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
    databaseBoard.appendChild(group);
    return group.querySelector(".ns-group-count");
  });

  // Создание строк из массива records — это уже реальная работа с данными.
  const databaseRows = records.map((record, index) => {
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

    databaseBoard.appendChild(row);
    return row;
  });

  /* ------------------------------------------------------------------------
     СБРОС СОСТОЯНИЙ
     Нужен, чтобы повторный клик действительно проигрывал сцену с начала.
     ------------------------------------------------------------------------ */

  function resetAllScenes() {
    root.querySelector('[data-pane="ui"]').dataset.ui = "0";
    root.querySelectorAll(".ns-code-under").forEach((element) => {
      element.classList.remove("ns-on");
    });

    databaseBoard.classList.remove("ns-ruled", "ns-filled", "ns-sorted");
    groupCounts.forEach((el) => (el.textContent = ""));
    databaseRows.forEach((row, index) =>
      row.style.setProperty("--slot", index),
    );

    get("commerce", ".ns-commerce-area").className = "ns-commerce-area";
    get("commerce", ".ns-normalized").textContent = '" Lamp " · "25.00"';

    get("mobile", ".ns-phone").className = "ns-phone";

    get("deploy", ".ns-git").className = "ns-git";
    get("deploy", ".ns-server").className = "ns-server";
    get("deploy", ".ns-live-site").className = "ns-live-site";
    get("deploy", ".ns-live-indicator").textContent = "Waiting for deploy…";
  }

  /* ------------------------------------------------------------------------
     ЭФФЕКТ ПЕЧАТИ КОДА
     Код читается до визуального действия. При prefers-reduced-motion текст и
     результат появляются сразу, без заставляющей ждать анимации.
     ------------------------------------------------------------------------ */

  function typeCode(paneName, language, source, afterTyping) {
    const languageLabel = get(paneName, ".ns-language");
    const codeElement = get(paneName, ".ns-code");

    languageLabel.textContent = language;
    window.clearInterval(typingInterval);

    if (reducedMotion) {
      codeElement.textContent = source;
      afterTyping();
      return;
    }

    let visibleCharacters = 0;
    codeElement.textContent = "";

    typingInterval = window.setInterval(() => {
      // Длинный код печатается чуть быстрее, но всё равно остаётся читаемым.
      visibleCharacters += Math.max(1, Math.ceil(source.length / 22));
      codeElement.textContent = source.slice(0, visibleCharacters);

      if (visibleCharacters >= source.length) {
        window.clearInterval(typingInterval);
        later(afterTyping, 250);
      }
    }, 35);
  }

  /* ------------------------------------------------------------------------
     СЦЕНАРИИ
     Каждая сцена содержит ровно три понятных шага:
       [подпись языка, показываемый код, визуальное действие после кода].
     ------------------------------------------------------------------------ */

  const stages = {
    ui: [
      [
        "CSS / page space",
        ".scene { perspective: 1000px; }\n.title { transform: translateZ(75px); }",
        () => {
          root.querySelector('[data-pane="ui"]').dataset.ui = "1";
          get("ui", '[data-snippet="layout"]').classList.add("ns-on");
        },
      ],
      [
        "CSS / image in the foreground",
        ".portrait {\n  transform: translateZ(120px) translateY(-8px);\n}",
        () => {
          root.querySelector('[data-pane="ui"]').dataset.ui = "2";
          get("ui", '[data-snippet="portrait"]').classList.add("ns-on");
        },
      ],
      [
        "CSS / cards in the foreground",
        ".project {\n  transform: translateZ(100px) translateY(15px);\n}",
        () => {
          root.querySelector('[data-pane="ui"]').dataset.ui = "3";
          get("ui", '[data-snippet="cards"]').classList.add("ns-on");
        },
      ],
    ],

    db: [
      [
        "CSS / draw table grid",
        ".grid-line {\n  transform: scaleX(1);\n  transition: transform 1.3s;\n}",
        () => databaseBoard.classList.add("ns-ruled"),
      ],
      [
        "SQL / organize records by type",
        "SELECT id, name, type FROM projects\nORDER BY FIELD(type, 'web', 'mobile', 'data'), id;",
        () => {
          databaseRows.forEach((row, index) => {
            const peers = records
              .filter((r) => r.type === records[index].type)
              .sort((a, b) => a.id - b.id);
            row.style.setProperty(
              "--slot",
              peers.findIndex((r) => r.id === records[index].id),
            );
          });
          databaseBoard.classList.add("ns-filled");
        },
      ],
      [
        "SQL / count records in each group",
        "SELECT type, COUNT(*) AS total\nFROM projects\nGROUP BY type;",
        () => {
          types.forEach(
            (type, i) =>
              (groupCounts[i].textContent =
                "total: " + records.filter((r) => r.type === type).length),
          );

          databaseBoard.classList.add("ns-sorted");
        },
      ],
    ],

    commerce: [
      [
        "JavaScript / очищаем поля",
        "const title = raw.title.trim();\nconst price = Number(raw.price);",
        () => {
          get("commerce", ".ns-commerce-area").classList.add("ns-clean");
          get("commerce", ".ns-normalized").textContent =
            '{ title: "Lamp", price: 25 }';
        },
      ],
      [
        "REST API / передаём каталог",
        'POST /api/catalog\n{"title":"Lamp","price":25}',
        () => {
          get("commerce", ".ns-normalized").textContent =
            "201 Created · catalogue updated";
        },
      ],
      [
        "Liquid / показываем товар",
        "{{ product.title }}\n{{ product.price | money }}",
        () =>
          get("commerce", ".ns-commerce-area").classList.add("ns-published"),
      ],
    ],

    mobile: [
      [
        "CSS / responsive layout",
        "@media (max-width: 600px) {\n  .projects { grid-template-columns: 1fr; }\n}",
        () => get("mobile", ".ns-phone").classList.add("ns-shell"),
      ],
      [
        "Dart / Flutter — navigation",
        "NavigationBar(destinations: [\n  projectsTab, aboutTab, contactTab,\n])",
        () => get("mobile", ".ns-phone").classList.add("ns-native"),
      ],
      [
        "Dart / Flutter — system feedback",
        'ScaffoldMessenger.of(context).showSnackBar(\n  const SnackBar(content: Text("Project saved")),\n);',
        () => get("mobile", ".ns-phone").classList.add("ns-notify"),
      ],
    ],

    deploy: [
      [
        "Git / создаём ветку и коммит",
        'git switch -c feature/skills\ngit add .\ngit commit -m "Add live skills"',
        () => get("deploy", ".ns-git").classList.add("ns-branched"),
      ],
      [
        "GitHub / объединяем и отправляем",
        "git switch main\ngit merge feature/skills\ngit push origin main",
        () => get("deploy", ".ns-git").classList.add("ns-merged"),
      ],
      [
        "Linux / проверяем и применяем nginx",
        "ssh deploy@server\ngit -C /var/www/nataiva pull --ff-only\nsudo nginx -t && sudo systemctl reload nginx",
        () => {
          get("deploy", ".ns-server").classList.add("ns-online");
          get("deploy", ".ns-live-site").classList.add("ns-live");
          get("deploy", ".ns-live-indicator").textContent = "● HTTPS · online";
        },
      ],
    ],
  };

  const finishedMessages = {
    ui: "Layout · portrait · projects — три уровня глубины",
    db: "12 records → web: 6 · mobile: 4 · data: 2",
    commerce: "Очистка данных → API → товарные карточки Shopify.",
    mobile:
      "Адаптивная страница → навигация Flutter → понятная обратная связь.",
    deploy: "Ветка → merge / push → Linux-сервер. Упрощённая схема публикации.",
  };

  /* ------------------------------------------------------------------------
     ЗАПУСК СЦЕНЫ
     Обычный hover не перезапускает уже активную сцену. Клик с force=true
     всегда начинает её заново. Каждый шаг получает 3.4 секунды.
     ------------------------------------------------------------------------ */

  function startScene(nextMode, forceRestart) {
    if (activeMode === nextMode && !forceRestart) return;

    activeMode = nextMode;
    clearAnimationQueue();
    resetAllScenes();

    buttons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.mode === nextMode),
      );
    });

    panes.forEach((pane) => {
      pane.classList.toggle("ns-active", pane.dataset.pane === nextMode);
    });
    root.dataset.mode = nextMode;

    // В обычном режиме: 3 × 3.4 секунды. Reduced motion сокращает ожидание.
    const stageDuration = reducedMotion ? 1300 : 3400;

    stages[nextMode].forEach(([language, source, action], index) => {
      later(() => {
        typeCode(nextMode, language, source, action);
      }, index * stageDuration);
    });
  }

  /* ------------------------------------------------------------------------
     УПРАВЛЕНИЕ
     - мышь: короткая задержка защищает от случайного пролёта курсора;
     - клавиатура: focus запускает тот же сценарий;
     - touch: только click, потому что на телефоне hover ненадёжен.
     ------------------------------------------------------------------------ */

  buttons.forEach((button) => {
    button.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      window.clearTimeout(hoverTimer);
      hoverTimer = window.setTimeout(
        () => startScene(button.dataset.mode, false),
        180,
      );
    });

    button.addEventListener("pointerleave", () =>
      window.clearTimeout(hoverTimer),
    );
    button.addEventListener("focus", () =>
      startScene(button.dataset.mode, false),
    );
    button.addEventListener("click", () =>
      startScene(button.dataset.mode, true),
    );
  });
})();
