(function() {
  if (typeof app === "undefined" || app === null) {
    window.app = {};
  }

  app.initDefaults = function() {
    var Funct, Pattern, Song;
    Pattern = app.models.Pattern;
    Funct = app.models.Funct;
    Song = app.models.Song;
    app.modes = {};
    app.modes.ptn = {
      activeCh: 0,
      data: [
        new Pattern({
          id: 0,
          name: "pattern 1",
          data: []
        }), new Pattern({
          id: 1,
          steps: 8,
          name: "hihats+noise",
          data: []
        }), new Pattern({
          id: 2,
          tPerStep: 2048,
          name: "effects",
          data: []
        }), new Pattern({
          id: 3,
          name: "beats",
          data: []
        }), new Pattern({
          id: 4,
          name: "synth",
          data: []
        }), new Pattern({
          id: 5,
          name: "lead",
          data: []
        })
      ],
      selPatterns: [0, 1, 2, 3, 4, 5]
    };
    app.modes.funct = {
      data: [new Funct]
    };
    return app.modes.sng = {
      data: [new Song]
    };
  };

  window.initApp = function() {
    var modesLoadet;
    app.name = "onelineTracker";
    app.activeMode = "ptn";
    app.newPatterns = true;
    app.newFuncts = true;
    modesLoadet = app.ls.load();
    if ((modesLoadet != null) && modesLoadet !== false) {
      app.modes = modesLoadet;
    } else {
      app.initDefaults();
    }
    window.onbeforeunload = function() {
      return app.ls.save(app.modes);
    };
    return app.corrSteps = function(ptns) {
      var i, j, modulo, srcNr, trgNr;
      i = ptns.length;
      while (i--) {
        modulo = ptns[i].steps;
        srcNr = (step[i] + 1) % modulo;
        j = ptns.length;
        while (j--) {
          trgNr = (step[j] + 1) % modulo;
          if (trgNr > srcNr) {
            step[j] += (trgNr - srcNr) & modulo;
          } else if (trgNr < srcNr) {
            step[j] += (srcNr - trgNr) % modulo;
          }
        }
      }
      return console.log(step);
    };
  };

}).call(this);

(function() {
  if (typeof app === "undefined" || app === null) {
    window.app = {};
  }

  if (app.helpers == null) {
    app.helpers = {};
  }

  app.helpers.FileStorrage = (function() {
    function FileStorrage(elId, dataObj) {
      elId = elId == null ? "fileInput" : void 0;
      document.getElementById(elId).addEventListener('change', this.handleFileSelect, false);
    }

    FileStorrage.prototype.handleFileSelect = function(e) {
      var file, reader;
      file = e.target.files[0];
      c.l(file);
      if (file.size < 90000) {
        reader = new FileReader();
        reader.onload = (function(e) {
          return function(e) {
            var data;
            data = JSON.parse(e.target.result);
            c.l(data);
            app.modes = data;
            return app.chMode();
          };
        })(file);
        return reader.readAsText(file);
      } else {
        return alert("file to big...");
      }
    };

    FileStorrage.prototype.download = function(filename, text) {
      var el, json;
      json = JSON.stringify(app.modes);
      el = document.createElement("a");
      el.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(json));
      el.setAttribute("download", filename);
      return el.click();
    };

    FileStorrage.prototype.save = function() {
      var data;
      data = JSON.stringify(app.modes);
      c.l(data);
      return location.href = 'data:application/octet-stream,' + encodeURIComponent(data);
    };

    return FileStorrage;

  })();

}).call(this);

(function() {
  var ls;

  if (typeof app === "undefined" || app === null) {
    window.app = {};
  }

  ls = {
    load: function() {
      var data;
      data = JSON.parse(localStorage.getItem(app.name + "SAVE")) || null;
      if (data == null) {
        return false;
      } else {
        return data;
      }
    },
    save: function(data) {
      return localStorage.setItem(app.name + "SAVE", JSON.stringify(data));
    }
  };

  app.ls = ls;

}).call(this);

(function() {
  if (typeof app === "undefined" || app === null) {
    window.app = {};
  }

  app.getPatternById = function(id) {
    var ptn, _i, _len, _ref;
    _ref = app.modes.ptn.data;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ptn = _ref[_i];
      if (ptn.id === id) {
        return ptn;
      }
    }
  };

  app.getActivePattern = function(ch) {
    var id, pos;
    pos = ch != null ? ch : app.modes.ptn.activeCh;
    id = app.modes.ptn.selPatterns[pos];
    return app.getPatternById(id);
  };

  app.getActivePatterns = function() {
    var i, ptnId, ptns, _i, _len, _ref, _results;
    ptns = [];
    _ref = app.modes.ptn.selPatterns;
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      ptnId = _ref[i];
      _results.push(ptns[ptnId] = app.getActivePattern(i));
    }
    return _results;
  };

}).call(this);

(function() {
  if (typeof app === "undefined" || app === null) {
    window.app = {};
  }

  app.models = {};

  app.models.Step = (function() {
    function Step(obj) {
      var key, val;
      this.rstT = false;
      this.funct = "=";
      this.oct = "=";
      this.note = "=";
      this.vel = "=";
      this.AMspeed = "=";
      this.AMdepth = "=";
      this.PMspeed = "=";
      this.PMdepth = "=";
      for (key in obj) {
        val = obj[key];
        if (this[key] != null) {
          this[key] = val;
        }
      }
    }

    return Step;

  })();

  app.models.Pattern = (function() {
    function Pattern(obj) {
      var key, val;
      this.id = Date.now() + "." + ~~(Math.random() * 666666);
      this.name = "new pattern";
      this.tPerStep = 8192;
      this.steps = 4;
      this.volume = 25;
      this.mute = false;
      this.solo = false;
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

  app.models.Funct = (function() {
    function Funct(obj) {
      var key, val;
      this.data = {
        bd: "15999999/t",
        sd: "99999999/(t^t<<3)*t>>4",
        hho: "1822111/t*Math.random()",
        hhc: "622111/t*Math.random()",
        sn: "999999999/(t^t>>4)*t>>1",
        ld: "(t^t>>1)^t<<1",
        bs: "(t+t*0.99999)",
        chR: "t&1",
        chL: "t&1^1"
      };
      for (key in obj) {
        val = obj[key];
        if (this[key] != null) {
          this[key] = val;
        }
      }
    }

    return Funct;

  })();

  app.models.Song = (function() {
    function Song(obj) {
      this.data = [[0, 0, 0, 0], [1, 2, 1, 2], [3, 4], [5], [], []];
    }

    return Song;

  })();

}).call(this);

(function() {
  var downKey, keyDown, keyUp;

  downKey = "";

  keyUp = function(e) {
    var el, k, lastStep, nextEl, type, _ref, _ref1, _ref2;
    e.stopPropagation();
    k = e.keyCode;
    el = document.getElementById("activePtnInput");
    if (k === 111) {
      chMinus();
    } else if (k === 106) {
      chPlus();
    } else if (k === 104) {
      stepsMinus();
    } else if (k === 105) {
      stepsPlus();
    } else if (k === 101) {
      tStepMinus();
    } else if (k === 102) {
      tStepPlus();
    } else if (k === 13) {
      if (el != null) {
        el.click();
      } else {
        if ((_ref = document.querySelector("#row0 .funct")) != null) {
          _ref.click();
        }
      }
    }
    if (downKey === "ctrl") {
      if (k === 37) {
        app.chMode("sng");
      } else if (k === 39) {
        app.chMode("funct");
      } else if (k === 38) {
        app.chMode("ptn");
      } else if (k === 40) {
        app.chMode("ptn");
      } else if (k === 13) {
        alert("you pressed strg+enter, WOW");
      }
    } else if (downKey === "shift") {
      if (el != null) {
        type = el.parentNode.className;
        if (k === 37) {
          if (type === "funct") {
            el.parentElement.parentElement.getElementsByClassName("PMdepth").item().click();
          } else {
            el.parentElement.previousSibling.click();
          }
        } else if (k === 39) {
          nextEl = el.parentElement.nextSibling;
          if (nextEl != null) {
            nextEl.click();
          } else {
            el.parentElement.parentElement.getElementsByClassName("funct").item().click();
          }
        } else if (k === 38) {
          el = el.parentElement.parentElement.previousSibling;
          if (el != null) {
            el.getElementsByClassName(type)[0].click();
          } else {
            lastStep = app.getActivePattern().steps - 1;
            if ((_ref1 = document.querySelector("#row" + lastStep + " ." + type)) != null) {
              _ref1.click();
            }
          }
        } else if (k === 40) {
          el = el.parentElement.parentElement.nextSibling;
          if (el != null) {
            el.getElementsByClassName(type)[0].click();
          } else {
            if ((_ref2 = document.querySelector("#row0 ." + type)) != null) {
              _ref2.click();
            }
          }
        } else if (k === 13) {
          el.click(e, false);
        }
      }
    }
    if (k === 16 || k === 17) {
      return downKey = "none";
    }
  };

  keyDown = function(e) {
    var k;
    e.stopPropagation();
    k = e.keyCode;
    if (k === 16) {
      return downKey = "shift";
    } else if (k === 17) {
      return downKey = "ctrl";
    }
  };

  document.addEventListener("keyup", keyUp, true);

  document.addEventListener("keydown", keyDown, true);

}).call(this);

(function() {
  var chChPtn, chEl, chInputVal, chMinus, chMinusEl, chPlus, chPlusEl, chSelItem, chStepsPtn, chTStepPtn, copyPtn, copyPtnEl, delPtn, delPtnEl, getName, getVolume, muteAll, muteEl, muteIt, newPtn, newPtnEl, ptnNameEl, selectEl, setName, setVolume, soloEl, soloIt, stepsEl, stepsMinus, stepsMinusEl, stepsMinusJoin, stepsMinusJoinEl, stepsPlus, stepsPlusCopy, stepsPlusCopyEl, stepsPlusEl, stepsPlusSplit, stepsPlusSplitEl, tPerStepEl, tStepMinus, tStepMinusEl, tStepPlus, tStepPlusEl, volumeEl;

  if (typeof app === "undefined" || app === null) {
    window.app = {};
  }

  volumeEl = document.getElementById("volume");

  muteEl = document.getElementById("mute");

  soloEl = document.getElementById("single");

  muteIt = function(checkOnly) {
    var mute, ptn, ptns, solo, _i, _j, _len, _len1;
    mute = app.getActivePattern().mute;
    solo = app.getActivePattern().solo;
    ptns = app.getActivePatterns();
    app.newPatterns = true;
    if (checkOnly !== true) {
      mute = !mute;
      if (solo === true) {
        for (_i = 0, _len = ptns.length; _i < _len; _i++) {
          ptn = ptns[_i];
          ptn.mute = false;
        }
        app.getActivePattern().solo = false;
      }
      for (_j = 0, _len1 = ptns.length; _j < _len1; _j++) {
        ptn = ptns[_j];
        ptn.solo = false;
      }
      app.getActivePattern().mute = mute;
    }
    if (mute) {
      muteEl.className = "active";
    } else {
      muteEl.className = "";
    }
    return soloEl.className = "";
  };

  soloIt = function(checkOnly) {
    var mute, ptn, ptns, solo, _i, _j, _len, _len1;
    solo = app.getActivePattern().solo;
    mute = app.getActivePattern().mute;
    ptns = app.getActivePatterns();
    app.newPatterns = true;
    if (mute) {
      muteIt;
    }
    if (checkOnly !== true) {
      solo = !solo;
      for (_i = 0, _len = ptns.length; _i < _len; _i++) {
        ptn = ptns[_i];
        ptn.mute = solo;
      }
      if (solo === true) {
        for (_j = 0, _len1 = ptns.length; _j < _len1; _j++) {
          ptn = ptns[_j];
          ptn.solo = false;
        }
        app.getActivePattern().mute = false;
      }
      app.getActivePattern().solo = solo;
    }
    if (solo) {
      soloEl.className = "active";
      return muteEl.className = "";
    } else {
      return soloEl.className = "";
    }
  };

  muteAll = function(mute) {
    var i, ptn, _i, _len, _ref;
    c.l("muteall");
    _ref = app.getActivePatterns();
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      ptn = _ref[i];
      ptn.mute = true;
      ptn.solo = false;
    }
    app.getActivePattern().mute = false;
    app.getActivePattern().solo = true;
    return app.newPatterns = true;
  };

  setVolume = function() {
    var val;
    val = ~~volumeEl.value;
    if (val < 0) {
      val = 0;
    } else if (val > 100) {
      val = 100;
    }
    volumeEl.value = val;
    app.getActivePattern().volume = val;
    return app.newPatterns = true;
  };

  getVolume = function() {
    return volumeEl.value = app.getActivePattern().volume;
  };

  muteEl.addEventListener("click", muteIt, false);

  soloEl.addEventListener("click", soloIt, false);

  volumeEl.addEventListener("change", setVolume, false);

  newPtnEl = document.getElementById("newPtn");

  copyPtnEl = document.getElementById("copyPtn");

  delPtnEl = document.getElementById("deletePtn");

  newPtn = function() {
    var ptnMd;
    ptnMd = app.modes.ptn;
    newPtn = new app.models.Pattern({
      name: "new Pattern"
    });
    ptnMd.data.push(newPtn);
    ptnMd.selPatterns[ptnMd.activeCh] = newPtn.id;
    app.refreshPtnOptions();
    return app.newPatterns = true;
  };

  copyPtn = function() {
    var Step, activePtn, i, newData, ptnMd, step, _i, _len, _ref;
    ptnMd = app.modes.ptn;
    activePtn = app.getActivePattern();
    newPtn = new app.models.Pattern(activePtn);
    Step = app.models.Step;
    newData = [];
    _ref = newPtn.data;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      step = _ref[i];
      newData[i] = new Step(newPtn.data[i]);
    }
    newPtn.data = newData;
    newPtn.name += " copy";
    newPtn.id += Date.now();
    ptnMd.data.push(newPtn);
    ptnMd.selPatterns[ptnMd.activeCh] = newPtn.id;
    app.newPatterns = true;
    return app.refreshPtnOptions();
  };

  delPtn = function() {
    var activePtn, i, pos, ptn, ptnId, ptnMd, _i, _j, _len, _len1, _ref, _ref1;
    ptnMd = app.modes.ptn;
    activePtn = app.getActivePattern();
    if (ptnMd.data.length === 1) {
      return alert("You can't delete the last pattern.");
    }
    _ref = ptnMd.data;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      ptn = _ref[i];
      if (ptn.id === activePtn.id) {
        pos = i;
      }
    }
    ptnMd.data.splice(pos, 1);
    _ref1 = ptnMd.selPatterns;
    for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
      ptnId = _ref1[i];
      if (ptnId === activePtn.id) {
        ptnMd.selPatterns[i] = ptnMd.data[0].id;
      }
    }
    return app.refreshPtnOptions();
  };

  newPtnEl.addEventListener("click", newPtn, false);

  copyPtnEl.addEventListener("click", copyPtn, false);

  delPtnEl.addEventListener("click", delPtn, false);

  chEl = document.getElementById("ptnChannel");

  chPlusEl = document.getElementById("chPlus");

  chMinusEl = document.getElementById("chMinus");

  chPlus = function() {
    app.modes.ptn.activeCh = (app.modes.ptn.activeCh + 1) % 6;
    return chChPtn();
  };

  chMinus = function() {
    app.modes.ptn.activeCh = (app.modes.ptn.activeCh - 1) % 6;
    if (app.modes.ptn.activeCh < 0) {
      app.modes.ptn.activeCh = 5;
    }
    return chChPtn();
  };

  chChPtn = function() {
    var ptn;
    ptn = app.getActivePattern();
    chEl.innerHTML = "ch: " + app.modes.ptn.activeCh;
    app.renderPattern(ptn);
    return app.refreshPtnOptions(false);
  };

  chPlusEl.addEventListener("click", chPlus, false);

  chMinusEl.addEventListener("click", chMinus, false);

  stepsEl = document.getElementById("steps");

  stepsPlusEl = document.getElementById("stepsPlus");

  stepsPlusCopyEl = document.getElementById("stepsPlusCopy");

  stepsPlusSplitEl = document.getElementById("stepsPlusSplit");

  stepsMinusJoinEl = document.getElementById("stepsMinusJoin");

  stepsMinusEl = document.getElementById("stepsMinus");

  stepsPlus = function() {
    var ptn;
    ptn = app.getActivePattern();
    if (ptn.steps < 128) {
      ptn.steps *= 2;
    }
    chStepsPtn(ptn);
    return app.newPatterns = true;
  };

  stepsPlusCopy = function() {
    var i, len, ptn, step, _i, _len, _ref;
    ptn = app.getActivePattern();
    len = ptn.steps;
    _ref = ptn.data;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      step = _ref[i];
      if (ptn.data[i] != null) {
        ptn.data[i + len] = new app.models.Step(ptn.data[i]);
      }
    }
    return stepsPlus();
  };

  stepsPlusSplit = function() {
    var i, len, newData, ptn, step, _i, _len, _ref;
    ptn = app.getActivePattern();
    newData = [];
    len = ptn.steps;
    _ref = ptn.data;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      step = _ref[i];
      if (ptn.data[i] != null) {
        newData[i * 2] = new app.models.Step(ptn.data[i]);
      }
    }
    ptn.data = newData;
    return stepsPlus();
  };

  stepsMinusJoin = function() {
    var i, len, newData, ptn, step, _i, _len, _ref;
    ptn = app.getActivePattern();
    newData = [];
    len = ptn.steps;
    _ref = ptn.data;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      step = _ref[i];
      if ((ptn.data[i] != null) && (i / 2) % 1 === 0) {
        newData[i / 2] = new app.models.Step(ptn.data[i]);
      }
    }
    ptn.data = newData;
    return stepsMinus();
  };

  stepsMinus = function() {
    var ptn;
    ptn = app.getActivePattern();
    if (ptn.steps > 2 && (ptn.steps / 2) % 1 === 0) {
      ptn.steps /= 2;
    }
    chStepsPtn(ptn);
    return app.newPatterns = true;
  };

  chStepsPtn = function(ptn) {
    stepsEl.value = ptn.steps;
    return app.renderPattern(ptn);
  };

  chInputVal = function(e) {
    var ptn, val;
    ptn = app.getActivePattern();
    val = e.target.value;
    if (val > 0) {
      ptn.steps = val;
    } else {
      e.target.value = 1;
      ptn.steps = 1;
    }
    app.renderPattern(ptn);
    return app.newPatterns = true;
  };

  stepsPlusEl.addEventListener("click", stepsPlus, false);

  stepsPlusCopyEl.addEventListener("click", stepsPlusCopy, false);

  stepsPlusSplitEl.addEventListener("click", stepsPlusSplit, false);

  stepsMinusJoinEl.addEventListener("click", stepsMinusJoin, false);

  stepsMinusEl.addEventListener("click", stepsMinus, false);

  stepsEl.addEventListener("change", chInputVal, false);

  tPerStepEl = document.getElementById("tPerStep");

  tStepPlusEl = document.getElementById("tStepPlus");

  tStepMinusEl = document.getElementById("tStepMinus");

  tStepPlus = function() {
    var ptn;
    ptn = app.getActivePattern();
    ptn.tPerStep *= 2;
    if (ptn.tPerStep > 32768) {
      ptn.tPerStep = ptn.tPerStep / 2;
    }
    chTStepPtn(ptn);
    return app.rstSteps = true;
  };

  tStepMinus = function() {
    var ptn;
    ptn = app.getActivePattern();
    ptn.tPerStep /= 2;
    if (ptn.tPerStep < 1024) {
      ptn.tPerStep = 1024;
    }
    chTStepPtn(ptn);
    return app.rstSteps = true;
  };

  chTStepPtn = function(ptn) {
    app.newPatterns = true;
    tPerStepEl.innerHTML = "tPerStep: " + ptn.tPerStep;
    return app.renderPattern(ptn);
  };

  tStepPlusEl.addEventListener("click", tStepPlus, false);

  tStepMinusEl.addEventListener("click", tStepMinus, false);

  ptnNameEl = document.getElementById("ptnName");

  setName = function() {
    app.getActivePattern().name = ptnNameEl.value;
    return app.refreshSelect();
  };

  getName = function() {
    return ptnNameEl.value = app.getActivePattern().name;
  };

  ptnNameEl.addEventListener("blur", setName, false);

  selectEl = document.getElementsByClassName("selectItems")[0];

  chSelItem = function(e) {
    var p, ptn, ptnMd, ptnName, _i, _len, _ref;
    ptnMd = app.modes.ptn;
    ptnName = e.target.value.split(":").pop();
    _ref = ptnMd.data;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      if (p.name === ptnName) {
        ptn = p;
      }
    }
    ptnMd.selPatterns[ptnMd.activeCh] = ptn.id;
    return app.refreshPtnOptions();
  };

  selectEl.addEventListener("click", chSelItem, false);

  app.refreshSelect = function() {
    var i, option, ptn, ptnId, ptns, selPatterns, _i, _j, _len, _len1, _ref, _results;
    selectEl.innerHTML = "";
    option = document.createElement("option");
    option.selected = true;
    option.disabled = true;
    option.innerHTML = "SELECT PATTERN";
    selectEl.appendChild(option);
    selPatterns = app.modes.ptn.selPatterns;
    ptns = app.getActivePatterns();
    _ref = app.modes.ptn.data;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ptn = _ref[_i];
      option = document.createElement("option");
      option.innerHTML = "-";
      for (i = _j = 0, _len1 = selPatterns.length; _j < _len1; i = ++_j) {
        ptnId = selPatterns[i];
        if (ptnId === ptn.id) {
          if (option.innerHTML === "-") {
            option.innerHTML = i;
          } else {
            option.innerHTML += "+" + i;
          }
        }
      }
      option.innerHTML += ":";
      option.innerHTML += ptn.mute ? "M" : ptn.solo ? "S" : "_";
      option.innerHTML += ":" + ptn.name;
      _results.push(selectEl.appendChild(option));
    }
    return _results;
  };

  app.refreshPtnOptions = function(chToo) {
    var ptn;
    if (chToo === true) {
      chChPtn();
    }
    ptn = this.getActivePattern();
    chStepsPtn(ptn);
    chTStepPtn(ptn);
    this.refreshSelect();
    getName();
    getVolume();
    muteIt(true);
    return soloIt(true);
  };

}).call(this);

(function() {
  var chMode, chModeEl;

  if (typeof app === "undefined" || app === null) {
    window.app = {};
  }

  app.chMode = function(mode) {
    var ptnOptionEl;
    document.getElementById("error").innerHTML = "";
    if (mode != null) {
      app.activeMode = mode;
    } else {
      mode = app.activeMode;
    }
    ptnOptionEl = document.getElementById("ptnOptions");
    if (mode === "ptn") {
      app.refreshPtnOptions();
      app.refreshSelect();
      app.renderPattern(app.getActivePattern());
      return ptnOptionEl.className = "show";
    } else if (mode === "funct") {
      ptnOptionEl.className = "";
      return app.renderFunct();
    } else if (mode === "sng") {
      ptnOptionEl.className = "";
      return app.renderSong();
    }
  };


  /* ch mode btn event */

  chModeEl = document.getElementById("chMode");

  chMode = function(e) {
    var mode;
    mode = e.target.value.split(" ").pop();
    if (mode === "PATTERN") {
      app.chMode("funct");
      return e.target.value = "MODE: FUNCTION";
    } else if (mode === "FUNCTION") {
      app.chMode("ptn");
      return e.target.value = "MODE: PATTERN";
    }
  };

  chModeEl.addEventListener("click", chMode, true);


  /* RESET APP */

  document.getElementById("reset").addEventListener("click", function() {
    if (confirm("Really reset data ??")) {
      app.initDefaults();
      return app.chMode();
    }
  });

  document.getElementById("play").addEventListener("click", function() {
    app.stop = false;
    return app.play();
  });

  document.getElementById("stop").addEventListener("click", function() {
    return app.stop();
  });

  document.getElementById("save2file").addEventListener("click", function() {
    return app.fs.download("song.json", app.modes);
  });

  document.getElementById("loadFile").addEventListener("click", function() {
    return document.getElementById("fileInput").click();
  });

}).call(this);

(function() {
  window.initPlaySnd = function() {
    var audioBuff, audioCtx, calcPtn, channels, cv, frameCount, preBuffer, saveWaveToFile, soundgen;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    calcPtn = new Worker("workers/calcPtn.js");
    cv = new app.CanvasVisual("canvasVisual");
    frameCount = audioCtx.sampleRate * 16;
    channels = 2;
    audioBuff = audioCtx.createBuffer(2, frameCount, audioCtx.sampleRate);
    preBuffer = [];
    soundgen = (function() {
      var bufferSize, node, output;
      bufferSize = 4096;
      node = audioCtx.createScriptProcessor(bufferSize, 0, 2);
      output = [];
      node.onaudioprocess = function(e) {
        var b, i, len, newBuff;
        app.play();
        output[0] = e.outputBuffer.getChannelData(0);
        output[1] = e.outputBuffer.getChannelData(1);
        newBuff = preBuffer.shift() || null;
        cv.drawArea(newBuff);
        if (newBuff === null) {
          return c.l("no Buffer");
        }
        len = newBuff.length;
        i = 0;
        b = 0;
        while (len > i) {
          output[0][b] = newBuff[i];
          output[1][b] = newBuff[i];
          i += 2;
          b++;
        }
      };
      return node;
    })();
    calcPtn.onmessage = function(e) {
      preBuffer.push(e.data);
      return soundgen.connect(audioCtx.destination);
    };
    app.play = function() {
      var jsonFuncts, jsonPtn, rst;
      if (app.newPatterns === true) {
        jsonPtn = JSON.stringify(app.getActivePatterns());
        app.newPatterns = false;
      } else {
        jsonPtn = null;
      }
      if (app.newFuncts === true) {
        jsonFuncts = JSON.stringify(app.modes.funct.data[0].data);
        app.newFuncts = false;
      } else {
        jsonFuncts = null;
      }
      if (app.rstSteps) {
        rst = app.rstSteps;
        app.rstSteps = false;
      } else {
        rst = false;
      }
      return calcPtn.postMessage({
        ptns: jsonPtn,
        rst: rst,
        functs: jsonFuncts
      });
    };
    app.rec = function() {
      return null;
    };
    return saveWaveToFile = function(filename, link) {
      var r;
      r = new XMLHttpRequest();
      r.open("GET", link, true);
      r.onreadystatechange = function() {
        var el;
        if (r.readyState !== 4 || r.status !== 200) {
          return;
        }
        el = document.createElement("a");
        el.setAttribut("href", "data:audio/wav;charset=utf-8," + r.responseText);
        c.l(r);
        el.setAttribute("download", filename);
        return el.click();
      };
      return r.send();
    };
  };

}).call(this);

(function() {
  if (typeof app === "undefined" || app === null) {
    window.app = {};
  }

  app.CanvasVisual = (function() {
    function CanvasVisual(el) {
      this.canvas = document.getElementById(el);
      this.context = this.canvas.getContext("2d");
      this.width = this.canvas.width = (8192 * 4) / 64;
      this.height = this.canvas.height = 16;
      this.canvas.width = this.width;
      this.zoom = 0.9;
      this.speed = 1;
      this.halt = false;
      this.canvas.addEventListener("mousedown", this.haltVis.bind(this));
      this.canvas.addEventListener("mouseup", this.haltVis.bind(this));
      this.canvas.ondblclick = this.haltVis.bind(this);
      this.initData();
    }

    CanvasVisual.prototype.initData = function() {
      if (this.context.createImageData != null) {
        return this.imgd = this.context.createImageData(this.width, this.height);
      } else if (this.context.getImageData != null) {
        return this.imgd = this.context.getImageData(0, 0, this.width, this.height);
      } else {
        return c.warn("you browser sucks !");
      }
    };

    CanvasVisual.prototype.haltVis = function() {
      return this.halt = !this.halt;
    };

    CanvasVisual.prototype.worker = new Worker("workers/canvasWorker.js");

    CanvasVisual.prototype.clear = function() {
      if (this.halt === false) {
        this.context.fillStyle = "#FF0000FF";
        return this.context.fillRect(0, 0, width, height);
      }
    };

    CanvasVisual.prototype.drawArea = function(soundData) {
      var self;
      self = this;
      if (!this.halt) {
        this.worker.postMessage({
          soundData: soundData,
          imgd: this.imgd
        });
      }
      return this.worker.onmessage = function(e) {
        self.imgd = e.data;
        return self.context.putImageData(e.data, 0, 0);
      };
    };

    return CanvasVisual;

  })();

}).call(this);

(function() {
  var addFunct, dataEl, elToSet, functKeyToSet, functToSet, genInputFunctField, playFunct, playFunctWorker, removeFunct, renameProperty, saveFunct, saveKey, testFormula, tester;

  if (typeof app === "undefined" || app === null) {
    window.app = {};
  }

  tester = new Worker("workers/testFormula.js");

  playFunctWorker = new Worker("workers/playFormula.js");

  dataEl = document.getElementById("data");

  renameProperty = function(obj, oldName, newName) {
    if (obj.hasOwnProperty(oldName)) {
      obj[newName] = obj[oldName];
      delete obj[oldName];
    }
    return obj;
  };

  functKeyToSet = "";

  elToSet = "";

  functToSet = "";

  playFunctWorker.onmessage = function(e) {
    return app.dev.writeBufferSync(e.data);
  };

  playFunct = function(e) {
    var formula, key;
    key = e.target.value;
    formula = app.modes.funct.data[0].data[key];
    return playFunctWorker.postMessage(formula);
  };

  removeFunct = function(e) {
    var funct, functName, functs, key;
    functName = e.target.nextSibling.value;
    functs = app.modes.funct.data[0].data;
    for (key in functs) {
      funct = functs[key];
      if (functName === key) {
        delete app.modes.funct.data[0].data[key];
        return app.renderFunct();
      }
    }
  };

  saveFunct = function(e) {
    if (e.keyCode != null) {
      if (e.keyCode !== 13) {
        return;
      }
    }
    functKeyToSet = e.target.previousSibling.value;
    elToSet = e.target;
    functToSet = e.target.value;
    return testFormula(functToSet);
  };

  saveKey = function(e) {
    if (e.keyCode != null) {
      if (e.keyCode !== 13) {
        return;
      }
    }
    functKeyToSet = e.target.value;
    renameProperty(app.modes.funct.data[0].data, e.target.alt, e.target.value);
    return functToSet = e.target.value;
  };

  addFunct = function() {
    var funct, functName, functs, key;
    functName = "new";
    functs = app.modes.funct.data[0].data;
    for (key in functs) {
      funct = functs[key];
      if (functName === key) {
        functName += "X";
      }
      console.log(key);
    }
    app.modes.funct.data[0].data[functName] = "t*t";
    return app.renderFunct();
  };

  genInputFunctField = function(title, funct) {
    var input, remove, spanKey, wrap;
    wrap = document.createElement("div");
    wrap.className = "functWrap";
    remove = wrap.appendChild(document.createElement("input"));
    spanKey = wrap.appendChild(document.createElement("input"));
    input = wrap.appendChild(document.createElement("input"));
    input.value = funct;
    remove.type = "button";
    remove.className = "remove";
    remove.value = "x";
    spanKey.value = title;
    spanKey.type = "text";
    spanKey.className = "btn";
    spanKey.alt = title;
    spanKey.addEventListener("change", saveKey, false);
    input.addEventListener("change", saveFunct, false);
    spanKey.addEventListener("keypress", saveKey, false);
    input.addEventListener("keypress", saveFunct, false);
    remove.addEventListener("click", removeFunct, false);
    return wrap;
  };

  app.renderFunct = function() {
    var addNewWrapEl, cnt, fragment, funct, input, key, val, _ref;
    dataEl.innerHTML = "";
    fragment = document.createDocumentFragment();
    funct = app.modes.funct.data[0];
    cnt = 0;
    _ref = funct.data;
    for (key in _ref) {
      val = _ref[key];
      fragment.appendChild(genInputFunctField(key, val));
      cnt++;
    }
    addNewWrapEl = fragment.appendChild(document.createElement("div"));
    input = addNewWrapEl.appendChild(document.createElement("input"));
    input.type = "button";
    input.value = "ADD NEW";
    input.className = "btn btn-new";
    input.addEventListener("click", addFunct, false);
    return dataEl.appendChild(fragment);
  };

  testFormula = function(formula) {
    return tester.postMessage(formula);
  };

  tester.onmessage = function(e) {
    var errorEl, val;
    errorEl = document.getElementById("error");
    if (e.data === false) {
      app.modes.funct.data[0].data[functKeyToSet] = functToSet;
      elToSet.innerHTML = functToSet;
      errorEl.innerHTML = "";
      return app.newFuncts = true;
    } else {
      val = app.modes.funct.data[0].data[functKeyToSet];
      elToSet.value = val;
      return errorEl.innerHTML = "funct: '" + functToSet + ",ERROR: " + e.data;
    }
  };

}).call(this);

(function() {
  var Step, elToSet, escToStr, functToSet, parseInput, removeInput, stepToSet, testFormula, tester, toggleInputEl;

  if (typeof app === "undefined" || app === null) {
    window.app = {};
  }

  Step = app.models.Step;

  app.renderPattern = function(ptn) {
    var COLS, ROWS, cols, div1, fragment, headers, posCode, rows, table, tableBody, tableHead, target, td, th, tr, txt, type;
    headers = ["Tpos", "pos", "hlp", "rstT", "funct", "oct", "note", "vel"];
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
        } else if (type === "hlp") {
          div1 = ROWS / 2;
          posCode = (rows + 1) % div1;
          txt = "";
          if ((rows + 1) % div1 === 0) {
            txt = "####";
          } else if ((rows + 1) % (div1 / 2) === 0) {
            txt = "###";
          } else if ((rows + 1) % (div1 / 4) === 0) {
            txt = "++";
          } else if ((rows + 1) % (div1 / 8) === 0) {
            txt = "--";
          } else if ((rows + 1) % (div1 / 16) === 0) {
            txt = "-";
          }
          td.innerHTML = txt;
        } else if (type === "rstT") {
          if ((ptn.data[ROWS - rows - 1] != null) && ptn.data[ROWS - rows - 1][type] === true) {
            td.innerHTML = "X";
          } else {
            td.innerHTML = " ";
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
    target = document.querySelector("#data");
    target.innerHTML = "";
    return target.appendChild(fragment);
  };

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

  removeInput = false;

  tester = new Worker("workers/testFormula.js");

  testFormula = function(formula) {
    var functs, key, val;
    functs = app.modes.funct.data[0].data;
    for (key in functs) {
      val = functs[key];
      formula = formula.replace(new RegExp(key, 'gi'), "(" + val + ")");
    }
    return tester.postMessage(formula);
  };

  tester.onmessage = function(e) {
    var errorEl, val;
    errorEl = document.getElementById("error");
    if (e.data === false) {
      app.getActivePattern().data[stepToSet].funct = functToSet;
      if (removeInput === false) {
        elToSet.parentNode.innerHTML = functToSet;
      }
      errorEl.innerHTML = "";
      app.newPatterns = true;
      return c.l("formula is cool!");
    } else {
      val = app.getActivePattern().data[stepToSet].funct;
      if (removeInput === false) {
        elToSet.parentNode.innerHTML = val;
      }
      return errorEl.innerHTML = "funct: '" + functToSet + "' at pos: " + stepToSet + "\nERROR: " + e.data;
    }
  };

  toggleInputEl = function(e, close) {
    var el, input, ptn, step, tagName, type, typeE, val;
    tagName = e.target.tagName;
    if (tagName !== "TD" && tagName !== "INPUT") {
      return c.l("some went wrong", e);
    }
    el = document.getElementById("activePtnInput");
    typeE = e.target.className;
    if (typeE === "pos" || typeE === "Tpos" || typeE === "hlp") {
      return false;
    }
    if (el !== null) {
      val = el.value;
      step = el.parentNode.parentNode.id.split("row")[1];
      type = el.parentNode.className;
      ptn = app.getActivePattern();
      if (ptn.data[step] == null) {
        ptn.data[step] = new Step();
      }
      if (type === "oct" || type === "note") {
        val = parseInput(val, 12);
      } else if (type === "vel") {
        val = parseInput(val, 100);
      }
      if (type === "funct" && val !== "=") {
        stepToSet = step;
        elToSet = el;
        functToSet = val;
        if (el.parentNode !== e.target.parentNode) {
          removeInput = false;
        } else {
          removeInput = true;
        }
        testFormula(val);
      } else {
        ptn.data[step][type] = val;
        app.newPatterns = true;
        if ((el != null) && el.parentNode === e.target.parentNode) {
          return false;
        }
        el.parentNode.innerHTML = val;
      }
    }
    if (typeE === "rstT") {
      step = e.target.parentNode.id.split("row")[1];
      ptn = app.getActivePattern();
      if (ptn.data[step] == null) {
        ptn.data[step] = new Step();
      }
      val = !ptn.data[step].rstT;
      e.target.innerHTML = val === true ? "X" : " ";
      app.newPatterns = true;
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

}).call(this);

(function() {
  window.onload = function() {
    window.c = console;
    c.l = c.log;
    initApp();
    initPlaySnd();
    app.chMode();
    return app.fs = new app.helpers.FileStorrage();
  };

}).call(this);
