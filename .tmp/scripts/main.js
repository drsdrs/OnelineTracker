(function() {
  var Event, Pattern, activeRow, animateRow, app, calcPtn, dev, height, initDev, offset, oldLen, playBuffer, ptnPos, ptnTable, swt, tester;

  window.c = console;

  window.c.l = c.log;

  app = {};

  window.app = app;

  Event = (function() {
    function Event(obj) {
      var key, val;
      this.rstT = false;
      this.funct = "=";
      this.oct = "=";
      this.note = "=";
      this.vel = "=";
      this.DLYfdb = "=";
      this.DLYdepth = "=";
      for (key in obj) {
        val = obj[key];
        if (this[key] != null) {
          this[key] = val;
        }
      }
    }

    return Event;

  })();

  Pattern = (function() {
    function Pattern(obj) {
      var key, val;
      this.name = "new pattern";
      this.color = "#f48";
      this.tPerStep = 8192;
      this.steps = 16;
      this.data = [
        new Event({
          note: 0,
          funct: "17999999/t",
          rstT: true
        }), new Event({
          note: 0,
          funct: "t|t>>2"
        }), new Event({
          note: 1
        }), new Event({
          note: 0
        }), new Event({
          note: 0,
          funct: "7999999/t",
          rstT: true
        }), new Event({
          note: 0,
          funct: "t|t>>2"
        }), new Event({
          note: 0
        }), new Event({
          note: 0
        }), new Event({
          note: 2,
          funct: "17999999/t",
          rstT: true
        }), new Event({
          note: 0,
          funct: "t|t>>2"
        }), new Event({
          note: 0
        }), new Event({
          note: 0
        }), new Event({
          note: 0,
          funct: "7999999/t",
          rstT: true
        }), new Event({
          note: 0,
          funct: "t|t>>2"
        }), new Event({
          note: 0
        }), new Event({
          note: 0
        })
      ];
      for (key in obj) {
        val = obj[key];
        if (this[key] != null) {
          this[key] = val;
        }
      }
    }

    return Pattern;

  })();

  app.data = {
    mode: "pattern",
    activeCh: 0,
    selPatterns: [0, 1, 2, 3, 4, 5],
    patterns: [new Pattern, new Pattern, new Pattern, new Pattern, new Pattern, new Pattern],
    getActivePattern: function() {
      return this.patterns[this.selPatterns[this.activeCh]];
    },
    songView: null,
    songs: [null, null]
  };

  app.renderPtnOptions = function(pattOrSong) {
    var data, item, options, sel, type, _i, _len, _ref;
    if (pattOrSong === true) {
      type = "PATTERN";
      data = "patterns";
    } else {
      type = "SONG";
      data = "songs";
    }
    sel = document.getElementById("selectItems");
    options = "<option>SELECT " + type + "</option>";
    _ref = app.data[data];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      options += "<option>" + item.name + "</option>";
    }
    return sel.innerHTML = options;
  };

  ptnPos = null;

  ptnTable = null;

  offset = 0;

  height = 0;

  oldLen = 99990;

  app.initAnimation = function() {
    var rules;
    ptnPos = document.getElementById("ptnPosition");
    ptnTable = document.getElementsByClassName("data")[0].childNodes[0];
    offset = ptnTable.childNodes[0].offsetHeight;
    height = ptnTable.childNodes[1].offsetHeight;
    rules = document.styleSheets[0].rules;
    return animateRow();
  };

  activeRow = 0;

  animateRow = function(len) {
    var activeEl, activeEls;
    activeEls = document.getElementsByClassName("active");
    if (activeEls.length > 0) {
      activeEls[0].className = "";
    }
    activeEl = document.getElementById("row" + activeRow);
    activeEl.className = "active";
    return activeRow = ++activeRow % 16;
  };

  calcPtn = new Worker("workers/calcPtn.js");

  tester = new Worker("workers/testFormula.js");

  app.testFormula = function(formula) {
    return tester.postMessage(formula);
  };

  tester.onmessage = function(e) {
    return c.l("tester says: " + e.data);
  };

  calcPtn.onmessage = function(e) {
    if (typeof dev === "undefined" || dev === null) {
      return initDev();
    }
    return dev.writeBufferSync(e.data);
  };

  app.play = function() {
    var jsonPtn;
    jsonPtn = JSON.stringify(app.data.getActivePattern());
    return calcPtn.postMessage(jsonPtn);
  };

  app.stop = function() {
    return dev.kill();
  };

  dev = void 0;

  swt = false;

  initDev = function() {
    var tPerStep, timeDiff;
    tPerStep = app.data.getActivePattern().tPerStep;
    c.l(tPerStep);
    dev = audioLib.Sink(null);
    app.dev = dev;
    timeDiff = dev.getPlaybackTime();
    return dev.on("audioprocess", function(e) {
      var time;
      time = dev.getPlaybackTime();
      if (time > (timeDiff + (tPerStep / 16))) {
        animateRow();
        timeDiff = time;
      }
      if (this.getSyncWriteOffset() < 1024 && swt) {
        app.play();
        return swt = false;
      } else if (swt !== true) {
        return swt = true;
      }
    });
  };

  playBuffer = {
    tPerStep: app.data.getActivePattern().tPerStep,
    steps: app.data.getActivePattern().steps,
    activeRow: 0,
    buffLen: this.tPerStep * this.steps,
    buff: new Float32Array(this.buffLen),
    buffNxt: null,
    t: 0,
    swt: true
  };

  app.initDev = initDev;

  app.playBuffer = playBuffer;

  app.animateRow = animateRow;

}).call(this);

(function() {
  window.findKeyframesRule = function(rule) {
    var i, j, nameFits, ss, type, typeNormal, typeWebkit;
    ss = document.styleSheets;
    i = 0;
    while (i < ss.length) {
      j = 0;
      while (j < ss[i].cssRules.length) {
        type = ss[i].cssRules[j].type;
        typeWebkit = type === window.CSSRule.WEBKIT_KEYFRAMES_RULE;
        typeNormal = type === window.CSSRule.KEYFRAMES_RULE;
        nameFits = ss[i].cssRules[j].name === rule;
        if ((typeWebkit || typeNormal) && nameFits) {
          return ss[i].cssRules[j];
        }
        ++j;
      }
      ++i;
    }
    return null;
  };

}).call(this);

(function() {
  var lastTime, vendors, x;

  lastTime = 0;

  vendors = ["webkit", "moz"];

  x = 0;

  while (x < vendors.length && !window.requestAnimationFrame) {
    window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
    window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
    ++x;
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime, id, timeToCall;
      currTime = new Date().getTime();
      timeToCall = Math.max(0, 16 - (currTime - lastTime));
      id = window.setTimeout(function() {
        return callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      return clearTimeout(id);
    };
  }

}).call(this);

(function() {
  var chChPtn, chEl, chMinus, chMinusEl, chPlus, chPlusEl, chStepsPtn, chTStepPtn, stepsEl, stepsMinus, stepsMinusEl, stepsPlus, stepsPlusEl, tPerStepEl, tStepMinus, tStepMinusEl, tStepPlus, tStepPlusEl, toggleInputEl;

  app.renderPattern = function(ptn) {
    var COLS, ROWS, cols, fragment, headers, rows, table, tableBody, tableHead, target, td, th, tr, type;
    headers = ["Tpos", "pos", "rstT", "funct", "oct", "note", "vel", "DLYfdb", "DLYdepth"];
    COLS = headers.length;
    ROWS = ptn.steps;
    c.l(ptn);
    rows = ROWS;
    cols = COLS;
    fragment = document.createDocumentFragment();
    table = fragment.appendChild(document.createElement("table"));
    tableHead = table.appendChild(document.createElement("thead"));
    tableBody = table.appendChild(document.createElement("tbody"));
    tr = tableHead.appendChild(document.createElement("tr"));
    while (cols--) {
      th = tr.appendChild(document.createElement("th"));
      th.className = th.innerText = headers[COLS - cols - 1];
    }
    while (rows--) {
      tr = tableBody.appendChild(document.createElement("tr"));
      tr.id = "row" + (ROWS - rows - 1);
      cols = COLS;
      while (cols--) {
        td = tr.appendChild(document.createElement("td"));
        td.addEventListener("click", toggleInputEl);
        type = headers[COLS - cols - 1];
        td.className = type;
        if (type === "pos") {
          td.innerText = ROWS - rows - 1;
        } else if (type === "Tpos") {
          td.innerText = (ROWS - rows - 1) * ptn.tPerStep;
        } else if (type === "rstT") {
          if ((ptn.data[ROWS - rows - 1] != null) && ptn.data[ROWS - rows - 1][type] === true) {
            td.innerText = "yes";
          } else {
            td.innerText = "no";
          }
        } else {
          if (ptn.data[ROWS - rows - 1] != null) {
            td.innerText = ptn.data[ROWS - rows - 1][type];
          } else {
            td.innerText = "=";
          }
        }
      }
    }
    target = document.querySelector("#pattern .data");
    target.innerHTML = "";
    return target.appendChild(fragment);
  };

  toggleInputEl = function(e) {
    var data, el, input;
    el = document.getElementById("activePtnInput");
    if (el !== null) {
      el.parentNode.innerHTML = el.value;
    }
    input = document.createElement("input");
    input.id = "activePtnInput";
    input.value = e.target.innerHTML;
    input.style.width = e.target.clientWidth + "px";
    data = e.target.innerHTM;
    e.target.innerHTML = "";
    e.target.appendChild(input);
    return c.l(e, input);
  };

  chEl = document.getElementById("ptnChannel");

  chPlusEl = document.getElementById("chPlus");

  chMinusEl = document.getElementById("chMinus");

  chPlus = function() {
    app.data.activeCh = (app.data.activeCh + 1) % 6;
    return chChPtn();
  };

  chMinus = function() {
    app.data.activeCh = (app.data.activeCh - 1) % 6;
    if (app.data.activeCh < 0) {
      app.data.activeCh = 5;
    }
    return chChPtn();
  };

  chChPtn = function() {
    var ptn;
    chEl.innerText = "ch: " + app.data.activeCh;
    ptn = app.data.getActivePattern();
    app.renderPattern(ptn);
    return app.refreshPtnOptions(false);
  };

  chPlusEl.addEventListener("click", chPlus, false);

  chMinusEl.addEventListener("click", chMinus, false);

  stepsEl = document.getElementById("steps");

  stepsPlusEl = document.getElementById("stepsPlus");

  stepsMinusEl = document.getElementById("stepsMinus");

  stepsPlus = function() {
    var ptn;
    ptn = app.data.getActivePattern();
    ptn.steps *= 2;
    if (ptn.steps > 512) {
      ptn.steps = 512;
    }
    return chStepsPtn(ptn);
  };

  stepsMinus = function() {
    var ptn;
    ptn = app.data.getActivePattern();
    ptn.steps /= 2;
    if (ptn.steps < 4) {
      ptn.steps = 4;
    }
    return chStepsPtn(ptn);
  };

  chStepsPtn = function(ptn) {
    stepsEl.innerText = "steps: " + ptn.steps;
    return app.renderPattern(ptn);
  };

  stepsPlusEl.addEventListener("click", stepsPlus, false);

  stepsMinusEl.addEventListener("click", stepsMinus, false);

  tPerStepEl = document.getElementById("tPerStep");

  tStepPlusEl = document.getElementById("tStepPlus");

  tStepMinusEl = document.getElementById("tStepMinus");

  tStepPlus = function() {
    var ptn;
    ptn = app.data.getActivePattern();
    ptn.tPerStep *= 2;
    if (ptn.tPerStep > 65000) {
      ptn.tPerStep = ptn.tPerStep / 2;
    }
    return chTStepPtn(ptn);
  };

  tStepMinus = function() {
    var ptn;
    ptn = app.data.getActivePattern();
    ptn.tPerStep /= 2;
    if (ptn.tPerStep < 16) {
      ptn.tPerStep = 16;
    }
    return chTStepPtn(ptn);
  };

  chTStepPtn = function(ptn) {
    tPerStepEl.innerText = "tPerStep: " + ptn.tPerStep;
    return app.renderPattern(ptn);
  };

  tStepPlusEl.addEventListener("click", tStepPlus, false);

  tStepMinusEl.addEventListener("click", tStepMinus, false);

  app.refreshPtnOptions = function(chToo) {
    var ptn;
    if (chToo === true) {
      chChPtn();
    }
    ptn = app.data.getActivePattern();
    chStepsPtn(ptn);
    return chTStepPtn(ptn);
  };

}).call(this);

(function() {
  window.onload = function() {
    app.refreshPtnOptions(true);
    app.renderPattern(app.data.getActivePattern());
    app.renderPtnOptions(true);
    app.testFormula("t*t");
    app.testFormula("tc((t");
    return app.initAnimation();
  };

}).call(this);
