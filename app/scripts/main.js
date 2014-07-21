(function() {
  var Pattern, Step, activeRow, animateRow, app, calcPtn, dev, height, initDev, offset, oldLen, ptnPos, ptnTable, swt;

  window.c = console;

  window.c.l = c.log;

  app = {};

  window.app = app;

  Step = (function() {
    function Step(obj) {
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

    return Step;

  })();

  Pattern = (function() {
    function Pattern(obj) {
      var key, val;
      this.name = "new pattern";
      this.color = "#f48";
      this.tPerStep = 8192;
      this.steps = 16;
      this.data = [];
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
    getActivePatterns: function() {
      var i, ptnNr, ptns, _i, _len, _ref, _results;
      ptns = [];
      _ref = this.selPatterns;
      _results = [];
      for (ptnNr = _i = 0, _len = _ref.length; _i < _len; ptnNr = ++_i) {
        i = _ref[ptnNr];
        _results.push(ptns[i] = this.patterns[ptnNr]);
      }
      return _results;
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

  activeRow = 15;

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

  calcPtn.onmessage = function(e) {
    if (typeof dev === "undefined" || dev === null) {
      return initDev();
    }
    return dev.writeBufferSync(e.data);
  };

  app.play = function() {
    var jsonPtn;
    jsonPtn = JSON.stringify(app.data.getActivePatterns());
    return calcPtn.postMessage(jsonPtn);
  };

  app.stop = function() {
    return dev.kill();
  };

  dev = void 0;

  swt = false;

  initDev = function() {
    var tPerStep, timeDiff;
    app.play();
    tPerStep = app.data.getActivePattern().tPerStep / 32;
    dev = audioLib.Sink(null);
    app.dev = dev;
    timeDiff = dev.getPlaybackTime();
    return dev.on("audioprocess", function(e) {
      var time;
      time = dev.getPlaybackTime();
      if (time > (timeDiff + tPerStep)) {
        animateRow();
        timeDiff = time;
      }
      if (this.getSyncWriteOffset() < 8192 && swt) {
        app.play();
        return swt = false;
      } else if (swt !== true) {
        return swt = true;
      }
    });
  };

  app.initDev = initDev;

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
  var Step, chChPtn, chEl, chMinus, chMinusEl, chPlus, chPlusEl, chStepsPtn, chTStepPtn, elToSet, escToStr, functToSet, getName, keyOnBody, parseInput, ptnNameEl, setName, stepToSet, stepsEl, stepsMinus, stepsMinusEl, stepsPlus, stepsPlusEl, tPerStepEl, tStepMinus, tStepMinusEl, tStepPlus, tStepPlusEl, testFormula, tester, toggleInputEl;

  app.renderPattern = function(ptn) {
    var COLS, ROWS, cols, fragment, headers, rows, table, tableBody, tableHead, target, td, th, tr, type;
    headers = ["Tpos", "pos", "rstT", "funct", "oct", "note", "vel", "DLYfdb", "DLYdepth"];
    COLS = headers.length;
    ROWS = ptn.steps;
    rows = ROWS;
    cols = COLS;
    fragment = document.createDocumentFragment();
    table = fragment.appendChild(document.createElement("table"));
    tableHead = table.appendChild(document.createElement("thead"));
    tableBody = table.appendChild(document.createElement("tbody"));
    tr = tableHead.appendChild(document.createElement("tr"));
    while (cols--) {
      th = tr.appendChild(document.createElement("th"));
      th.className = th.innerHTML = headers[COLS - cols - 1];
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
          td.innerHTML = ROWS - rows - 1;
        } else if (type === "Tpos") {
          td.innerHTML = (ROWS - rows) * ptn.tPerStep;
        } else if (type === "rstT") {
          if ((ptn.data[ROWS - rows - 1] != null) && ptn.data[ROWS - rows - 1][type] === true) {
            td.innerHTML = "yes";
          } else {
            td.innerHTML = "no";
          }
        } else {
          if (ptn.data[ROWS - rows - 1] != null) {
            td.innerHTML = ptn.data[ROWS - rows - 1][type];
          } else {
            td.innerHTML = "=";
          }
        }
      }
    }
    target = document.querySelector("#pattern .data");
    target.innerHTML = "";
    return target.appendChild(fragment);
  };

  Step = (function() {
    function Step(obj) {
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

    return Step;

  })();

  escToStr = function(str) {
    return str.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<");
  };

  parseInput = function(val, max) {
    if (val === "=") {
      return val;
    }
    val = parseInt(val);
    if (isNaN(val)) {
      return 0;
    } else if (val > max) {
      return max;
    } else if (val < -max) {
      return -max;
    } else {
      return val;
    }
  };

  elToSet = {};

  stepToSet = 0;

  functToSet = "0";

  tester = new Worker("workers/testFormula.js");

  testFormula = function(formula) {
    return tester.postMessage(formula);
  };

  tester.onmessage = function(e) {
    var val;
    if (e.data === false) {
      app.data.getActivePattern().data[stepToSet].funct = functToSet;
      return elToSet.parentNode.innerHTML = functToSet;
    } else {
      val = app.data.getActivePattern().data[stepToSet].funct;
      elToSet.parentNode.innerHTML = val;
      return c.l("funct: '" + functToSet + "' at pos: " + stepToSet + "\nERROR: " + e.data);
    }
  };

  toggleInputEl = function(e, close) {
    var el, input, ptn, step, type, typeE, val;
    el = document.getElementById("activePtnInput");
    typeE = e.target.className;
    if (type === "pos" || type === "Tpos") {
      return false;
    }
    if (el !== null) {
      if ((el != null) && el.parentNode === e.target.parentNode) {
        return c.l("same");
      }
      val = el.value;
      step = el.parentNode.parentNode.id.split("row")[1];
      type = el.parentNode.className;
      ptn = app.data.getActivePattern();
      if (ptn.data[step] == null) {
        ptn.data[step] = new Step;
      }
      if (type === "oct" || type === "note") {
        val = parseInput(val, 12);
      } else if (type === "vel") {
        val = parseInput(val, 100);
      }
      if (type === "funct" && val !== "=") {
        stepToSet = step;
        functToSet = val;
        elToSet = el;
        testFormula(val);
      } else {
        ptn.data[step][type] = val;
        el.parentNode.innerHTML = val;
      }
    }
    if (typeE === "rstT") {
      step = e.target.parentNode.id.split("row")[1];
      ptn = app.data.getActivePattern();
      if (ptn.data[step] == null) {
        ptn.data[step] = new Step;
      }
      val = !ptn.data[step].rstT;
      e.target.innerHTML = val === true ? "yes" : "no";
      return ptn.data[step].rstT = val;
    }
    val = escToStr(e.target.innerHTML);
    input = document.createElement("input");
    input.id = "activePtnInput";
    input.style.width = (e.target.clientWidth - 2) + "px";
    input.value = val;
    e.target.innerHTML = "";
    return e.target.appendChild(input).select();
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
    chEl.innerHTML = "ch: " + app.data.activeCh;
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
    stepsEl.innerHTML = "steps: " + ptn.steps;
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
    tPerStepEl.innerHTML = "tPerStep: " + ptn.tPerStep;
    return app.renderPattern(ptn);
  };

  tStepPlusEl.addEventListener("click", tStepPlus, false);

  tStepMinusEl.addEventListener("click", tStepMinus, false);

  ptnNameEl = document.getElementById("ptnName");

  setName = function() {
    app.data.getActivePattern().name = ptnNameEl.value;
    return app.renderPtnOptions(true);
  };

  getName = function() {
    return ptnNameEl.value = app.data.getActivePattern().name;
  };

  ptnNameEl.addEventListener("blur", setName, false);

  app.refreshPtnOptions = function(chToo) {
    var ptn;
    if (chToo === true) {
      chChPtn();
    }
    ptn = app.data.getActivePattern();
    chStepsPtn(ptn);
    chTStepPtn(ptn);
    return getName();
  };

  keyOnBody = function(e) {
    var el, k, type;
    k = e.keyCode;
    el = document.getElementById("activePtnInput");
    if (k === 33) {
      chPlus();
    } else if (k === 34) {
      chMinus();
    } else if (k === 36) {
      stepsPlus();
    } else if (k === 35) {
      stepsMinus();
    } else if (k === 45) {
      tStepPlus();
    } else if (k === 46) {
      tStepMinus();
    }
    if (el == null) {
      return;
    } else {
      type = el.parentNode.className;
    }
    if (k === 37 && type !== "funct") {
      return el.parentElement.previousSibling.click();
    } else if (k === 39 && type !== "DLYdepth") {
      return el.parentElement.nextSibling.click();
    } else if (k === 38) {
      el = el.parentElement.parentElement.previousSibling;
      if (el != null) {
        return el.getElementsByClassName(type)[0].click();
      }
    } else if (k === 40) {
      el = el.parentElement.parentElement.nextSibling;
      if (el != null) {
        return el.getElementsByClassName(type)[0].click();
      }
    } else if (k === 13) {
      return el.click(e, false);
    }
  };

  document.addEventListener("keyup", keyOnBody, false);

}).call(this);

(function() {
  window.onload = function() {
    app.refreshPtnOptions(true);
    app.renderPattern(app.data.getActivePattern());
    app.renderPtnOptions(true);
    app.initAnimation();
    return app.play();
  };

}).call(this);
