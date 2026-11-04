/* ======= SKILLS =============== */
import { buildDbBoard } from "./skills_db_scene.js";
import { scrollStageIntoView } from "./scroll-stage.js";
import { createTyper } from "./type_text.js";

(function initSkillsStories() {
  "use strict";

  const root = document.getElementById("ns-stories");
  if (!root) return;

  const buttons = [...root.querySelectorAll(".ns-skill-button")];
  const panes = [...root.querySelectorAll(".ns-pane")];
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  //terminal
  const sharedCode = root.querySelector(".ns-codebox");
  root.querySelectorAll(".ns-codebox").forEach((box) => {
    if (box !== sharedCode) box.remove();
  });
  root.querySelector(".ns-stage").appendChild(sharedCode);

  //typer
  const typer = createTyper({
    label: sharedCode.querySelector(".ns-language"),
    code: sharedCode.querySelector(".ns-code"),
  });

  let timers = [];
  let activeMode = "";
  let runningButton = null;

  //Find an element
  function get(paneName, selector) {
    if (selector === ".ns-language" || selector === ".ns-code")
      return sharedCode.querySelector(selector);
    return root.querySelector(`[data-pane="${paneName}"] ${selector}`);
  }

  //Store the timer
  function later(callback, delay) {
    timers.push(window.setTimeout(callback, delay));
  }

  //Stop
  function clearAnimationQueue() {
    timers.forEach(window.clearTimeout);
    timers = [];
    typer.stop();
  }

  //SQL
  const {
    types,
    records,
    board: databaseBoard,
    groupCounts,
    rows: databaseRows,
  } = buildDbBoard(root);

  /* ------------ Clear ------------ */
  function resetAllScenes() {
    root.querySelector('[data-pane="ui"]').dataset.ui = "0";
    root.querySelectorAll(".ns-code-under").forEach((element) => {
      element.classList.remove("ns-on");
    });

    //sql
    databaseBoard.classList.remove("ns-ruled", "ns-filled", "ns-sorted");
    groupCounts.forEach((el) => (el.textContent = ""));
    databaseRows.forEach((row, index) =>
      row.style.setProperty("--slot", index),
    );

    //api
    get("commerce", ".ns-commerce-area").className = "ns-commerce-area";
    get("commerce", ".ns-import-flag-text").textContent = "Importing…";
    get("commerce", ".ns-import-flag i").className =
      "fa-solid fa-arrows-rotate";

    //mobile
    get("mobile", ".ns-phone").className = "ns-phone";

    //deploy
    get("deploy", ".ns-git").className = "ns-git";
    get("deploy", ".ns-preview-site").className = "ns-preview-site";
    get("deploy", ".ns-server").className = "ns-server";
    get("deploy", ".ns-live-site").className = "ns-live-site";
    get("deploy", ".ns-live-indicator").textContent = "Not published";
  }

  /* ---------------- Scenes --------------- */
  const stages = {
    ui: [
      [
        "CSS / Perspective",
        ".scene { perspective: 1000px; }\n.title { transform: translateZ(75px); }",
        () => {
          root.querySelector('[data-pane="ui"]').dataset.ui = "1";
          get("ui", '[data-snippet="layout"]').classList.add("ns-on");
        },
      ],
      [
        "CSS / Avatar",
        ".portrait {\n  transform: translateZ(120px) translateY(-8px);\n}",
        () => {
          root.querySelector('[data-pane="ui"]').dataset.ui = "2";
          get("ui", '[data-snippet="portrait"]').classList.add("ns-on");
        },
      ],
      [
        "CSS / Cards",
        ".project {\n  transform: translateZ(100px) translateY(15px);\n}",
        () => {
          root.querySelector('[data-pane="ui"]').dataset.ui = "3";
          get("ui", '[data-snippet="cards"]').classList.add("ns-on");
        },
      ],
      [
        "CSS / Web browsers",
        "#web-logo-bar {\n  transform: translateZ(170px) translateY(25px);\n}",
        () => {
          root.querySelector('[data-pane="ui"]').dataset.ui = "4";
          get("ui", "#web-logo-bar").classList.add("ns-on");
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
        "JavaScript / Node.js",
        "$ node transform_prices.js\n→ Processing product data...",
        () => {
          const area = get("commerce", ".ns-commerce-area");
          later(() => area.classList.add("ns-show-files"), 0);
          later(() => area.classList.add("ns-show-bad"), 600);
          later(() => area.classList.add("ns-clean"), 1200);
        },
      ],
      [
        "JavaScript / Node.js",
        "$ node create_import_table.js\n→ Import table created",
        () => {
          const area = get("commerce", ".ns-commerce-area");
          later(() => area.classList.add("ns-show-transform"), 0);
          later(() => area.classList.add("ns-show-good"), 600);
          later(() => {
            area.classList.add("ns-importing");
            area.classList.add("ns-show-importflag");
          }, 1200);
        },
      ],
      [
        "Liquid / render product",
        "{{ product.title }}\n{{ product.price | money }}",
        () => {
          const area = get("commerce", ".ns-commerce-area");
          later(() => {
            get("commerce", ".ns-import-flag-text").textContent =
              "Data imported!";
            get("commerce", ".ns-import-flag i").className =
              "fa-solid fa-check";
            area.classList.remove("ns-importing");
            area.classList.add("ns-published");
          }, 900);
        },
      ],
    ],
    mobile: [
      [
        "CSS / responsive layout",
        "@media (max-width: 600px) {\n  .projects { grid-template-columns: 1fr; }\n}",
        () => {
          const phone = get("mobile", ".ns-phone");
          phone.classList.add("ns-transitioning");
          later(() => {
            phone.classList.add("ns-shell");
            later(() => phone.classList.remove("ns-transitioning"), 30);
          }, 350);
        },
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
        "dev@Portfolio:~$ _",
        "> node server.js\n> npm start\n> git push origin main",
        () => {
          get("deploy", ".ns-git").classList.add("ns-ready");
          get("deploy", ".ns-preview-site").classList.add(
            "ns-ready",
            "ns-trail",
          );
        },
      ],
      [
        "root@Portfolio:~# _",
        "> npm run build\n> pm2 start server.js --name portfolio\n> certbot --nginx -d nataiva.com",
        () => {
          resetDeployCards();
          get("deploy", ".ns-git").classList.add("ns-ready", "ns-publishing");
          get("deploy", ".ns-server").classList.add("ns-online", "ns-trail");
        },
      ],
      [
        "root@Portfolio:~# _",
        "> curl -I https://nataiva.com\n> pm2 status\n> systemctl status nginx",
        () => {
          resetDeployCards();
          get("deploy", ".ns-git").classList.add(
            "ns-ready",
            "ns-publishing",
            "ns-live-step",
          );
          get("deploy", ".ns-live-site").classList.add("ns-live");
          get("deploy", ".ns-live-indicator").textContent = "● Online · public";
        },
      ],
      [
        "root@Portfolio:~# _",
        "> pm2 restart portfolio\n> pm2 logs portfolio\n> uptime -p",
        () => {
          get("deploy", ".ns-git").classList.add(
            "ns-ready",
            "ns-publishing",
            "ns-live-step",
            "ns-maintenance",
          );

          get("deploy", ".ns-live-site").classList.add(
            "ns-live",
            "ns-supported",
          );
        },
      ],
    ],
    backend: [
      [
        "Node.js / Express",
        "$ npm start\n→ Server running on port 3000",
        () => {
          // coming...
        },
      ],
    ],
  };

  /* --------- Start scene --------- */
  //mobile delay
  const initialDelays = {
    mobile: 1000,
  };

  function startScene(nextMode, button) {
    if (!stages[nextMode] || activeMode === nextMode) return;

    clearAnimationQueue();

    const mobilePane = root.querySelector('[data-pane="mobile"]');
    const mobileArea = mobilePane.querySelector(".ns-phone-area");
    const replayMobile =
      nextMode === "mobile" && mobilePane.classList.contains("ns-active");

    mobileArea.classList.remove("ns-mobile-fading", "ns-mobile-resetting");

    if (runningButton) {
      runningButton.disabled = false;
      runningButton.classList.remove("ns-playing");
    }

    activeMode = nextMode;
    runningButton = button;

    button.classList.add("ns-playing");
    button.disabled = true;

    function beginScene() {
      if (replayMobile) {
        mobileArea.classList.add("ns-mobile-resetting");
      }

      resetAllScenes();

      panes.forEach((pane) => {
        pane.classList.toggle("ns-active", pane.dataset.pane === nextMode);
      });

      root.dataset.mode = nextMode;

      //Mobile reverse
      if (replayMobile) {
        void mobileArea.offsetWidth;
        mobileArea.classList.remove("ns-mobile-resetting");
        mobileArea.classList.remove("ns-mobile-fading");
      }

      const stageDuration = reducedMotion ? 1300 : 3000;
      const startDelay = reducedMotion ? 0 : initialDelays[nextMode] || 0;

      stages[nextMode].forEach(([language, source, action], index) => {
        later(
          () => {
            typer.type(language, source, action);
          },
          startDelay + index * stageDuration,
        );
      });

      const totalDuration =
        startDelay + stages[nextMode].length * stageDuration;

      later(() => {
        button.disabled = false;
        button.classList.remove("ns-playing");
        button.blur();

        runningButton = null;
        activeMode = "";
      }, totalDuration);
    }

    if (replayMobile && !reducedMotion) {
      mobileArea.classList.add("ns-mobile-fading");
      later(beginScene, 300);
    } else {
      beginScene();
    }
  }

  //reset
  function resetDeployCards() {
    get("deploy", ".ns-preview-site").classList.remove("ns-ready");
    get("deploy", ".ns-server").classList.remove("ns-online");
    get("deploy", ".ns-live-site").classList.remove("ns-live", "ns-supported");
  }

  // Events
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      startScene(button.dataset.mode, button);
      scrollStageIntoView(root.querySelector(".ns-stage"));
    });
  });
})();
