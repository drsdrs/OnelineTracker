(function() {
  var chMode, chModeEl, docsEl;

  if (typeof app === "undefined" || app === null) {
    window.app = {};
  }

  app.getMaxOfArray = function(arr) {
    return Math.max.apply(null, arr);
  };

  app.getMinOfArray = function(arr) {
    return Math.min.apply(null, arr);
  };

  app.chMode = function(mode) {
    document.getElementById("error").innerHTML = "";
    if (mode != null) {
      app.activeMode = mode;
    } else {
      mode = app.activeMode;
    }
    if (mode === "ptn") {
      app.refreshPtnOptions();
      app.refreshSelect();
      app.renderPattern(app.getActivePattern());
      return document.getElementById("ptnOptions").className = "show";
    } else if (mode === "funct") {
      document.getElementById("ptnOptions").className = "";
      return app.renderFunct();
    } else if (mode === "sng") {
      document.getElementById("ptnOptions").className = "";
      return app.renderSong();
    }
  };

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
    modesLoadet = app.ls.load();
    if ((modesLoadet != null) && modesLoadet !== false) {
      app.modes = modesLoadet;
    } else {
      app.initDefaults();
    }
    window.onbeforeunload = function() {
      return app.ls.save(app.modes);
    };
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
    return app.getActivePatterns = function() {
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
      app.chMode("sng");
      return e.target.value = "MODE: SONG";
    } else if (mode === "SONG") {
      app.chMode("ptn");
      return e.target.value = "MODE: PATTERN";
    }
  };

  chModeEl.addEventListener("click", chMode, true);


  /* EN/DISABLE DOCS */

  docsEl = document.getElementById("docs");

  document.getElementById("toggleDocs").addEventListener("click", function() {
    return docsEl.className = docsEl.className === "show" ? "" : "show";
  });


  /* RESET APP */

  document.getElementById("reset").addEventListener("click", function() {
    if (confirm("Really reset data ??")) {
      app.initDefaults();
      return app.chMode();
    }
  });

  document.getElementById("play").addEventListener("click", function() {
    return app.play();
  });

  document.getElementById("rec").addEventListener("click", function() {
    return app.rec();
  });

  document.getElementById("save2file").addEventListener("click", function() {
    return app.fs.download("song.json", app.modes);
  });

  document.getElementById("loadFile").addEventListener("click", function() {
    return document.getElementById("fileInput").click();
  });

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
            app.chMode();
            return app.rstSteps = true;
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

  app.models = {};

  app.models.Step = (function() {
    function Step(obj) {
      var key, val;
      this.rstT = false;
      this.funct = "=";
      this.oct = "=";
      this.note = "=";
      this.vel = "=";
      this.aModSpeed = "=";
      this.aModDepth = "=";
      this.pModSpeed = "=";
      this.pModDepth = "=";
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
      this.id = Date.now() + "" + ~~(Math.random() * 666666);
      this.name = "new pattern";
      this.tPerStep = 8192;
      this.steps = 3;
      this.volume = 25;
      this.mute = false;
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
    var el, k, lastStep, nextEl, type;
    e.stopPropagation();
    k = e.keyCode;
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
      el = document.getElementById("activePtnInput");
      if (el != null) {
        type = el.parentNode.className;
        if (k === 37) {
          if (type === "funct") {
            el.parentElement.parentElement.getElementsByClassName("P-ModDepth").item().click();
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
            document.querySelector("#row" + lastStep + " ." + type).click();
          }
        } else if (k === 40) {
          el = el.parentElement.parentElement.nextSibling;
          if (el != null) {
            el.getElementsByClassName(type)[0].click();
          } else {
            document.querySelector("#row0 ." + type).click();
          }
        } else if (k === 13) {
          el.click(e, false);
        }
      } else if (k === 13) {
        document.querySelector("#row0 .funct").click();
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
    c.l(k);
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
  var chChPtn, chEl, chInputVal, chMinus, chMinusEl, chPlus, chPlusEl, chSelItem, chStepsPtn, chTStepPtn, copyPtn, copyPtnEl, delPtn, delPtnEl, getName, newPtn, newPtnEl, ptnNameEl, selectEl, setName, stepsEl, stepsMinus, stepsMinusEl, stepsPlus, stepsPlusCopy, stepsPlusCopyEl, stepsPlusEl, tPerStepEl, tStepMinus, tStepMinusEl, tStepPlus, tStepPlusEl;

  if (typeof app === "undefined" || app === null) {
    window.app = {};
  }

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
    return app.refreshPtnOptions();
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

  stepsMinusEl = document.getElementById("stepsMinus");

  stepsPlus = function() {
    var ptn;
    ptn = app.getActivePattern();
    if (ptn.steps < 128) {
      ptn.steps *= 2;
    }
    return chStepsPtn(ptn);
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

  stepsMinus = function() {
    var ptn;
    ptn = app.getActivePattern();
    if (ptn.steps > 2) {
      ptn.steps /= 2;
    }
    return chStepsPtn(ptn);
  };

  chStepsPtn = function(ptn) {
    stepsEl.value = ptn.steps;
    return app.renderPattern(ptn);
  };

  chInputVal = function(e) {
    var ptn;
    ptn = app.getActivePattern();
    ptn.steps = e.target.value;
    return app.renderPattern(ptn);
  };

  stepsPlusEl.addEventListener("click", stepsPlus, false);

  stepsPlusCopyEl.addEventListener("click", stepsPlusCopy, false);

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
    var p, ptn, ptnMd, _i, _len, _ref;
    ptnMd = app.modes.ptn;
    _ref = ptnMd.data;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      if (p.name === e.target.value) {
        ptn = p;
      }
    }
    ptnMd.selPatterns[ptnMd.activeCh] = ptn.id;
    return app.refreshPtnOptions();
  };

  selectEl.addEventListener("click", chSelItem, false);

  app.refreshSelect = function() {
    var item, option, _i, _len, _ref, _results;
    selectEl.innerHTML = "";
    option = document.createElement("option");
    option.selected = true;
    option.disabled = true;
    option.innerHTML = "SELECT PATTERN";
    selectEl.appendChild(option);
    _ref = app.modes.ptn.data;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      option = document.createElement("option");
      option.innerHTML = item.name;
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
    return getName();
  };

}).call(this);

(function() {
  window.initPlaySnd = function() {
    var calcPtn, cv, dev, initDev, lastBuff, swt;
    lastBuff = null;
    window.lastBuff = lastBuff;
    calcPtn = new Worker("workers/calcPtn.js");
    cv = new app.CanvasVisual("canvasVisual");
    dev = null;
    app.recordObj = null;
    app.cv = cv;
    calcPtn.onmessage = function(e) {
      if (dev == null) {
        return initDev();
      }
      dev.writeBufferSync(e.data);
      return lastBuff = e.data;
    };
    app.play = function() {
      var jsonFuncts, jsonPtn, rst;
      jsonPtn = JSON.stringify(app.getActivePatterns());
      jsonFuncts = JSON.stringify(app.modes.funct.data[0].data);
      if (app.rstSteps === true) {
        rst = true;
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
      var newWindow, wav;
      return c.l("have to implement better way ...");
      if (dev == null) {
        return initDev();
      }
      if (app.recordObj === null) {
        return app.recordObj = dev.record();
      } else {
        app.recordObj.stop();
        wav = 'data:application/octet-stream,' + btoa(app.recordObj.toWav());
        return newWindow = window.open(wav, "*.wav");
      }
    };
    dev = void 0;
    swt = false;
    initDev = function() {
      var channelCount, preBufferSize, sampleRate, tPerStep;
      channelCount = 2;
      preBufferSize = 1024;
      sampleRate = 44100;
      app.play();
      tPerStep = app.getActivePattern().tPerStep / 32;
      dev = audioLib.Sink(null, channelCount, preBufferSize, sampleRate);
      app.dev = dev;
      return dev.on("audioprocess", function(e) {
        if (this.getSyncWriteOffset() < (preBufferSize * 4) && swt) {
          app.cv.drawArea(lastBuff);
          app.play();
          return swt = false;
        } else if (swt !== true) {
          return swt = true;
        }
      });
    };
    return app.dev = dev;
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
      this.width = this.canvas.width = 512;
      this.height = this.canvas.height = 512;
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
  var elToSet, functKeyToSet, functToSet, playFunct, playFunctWorker, saveFunct, testFormula, tester;

  if (typeof app === "undefined" || app === null) {
    window.app = {};
  }

  tester = new Worker("workers/testFormula.js");

  playFunctWorker = new Worker("workers/playFormula.js");

  functKeyToSet = "";

  elToSet = "";

  functToSet = "";

  playFunct = function(e) {
    var formula, key;
    key = e.target.value;
    formula = app.modes.funct.data[0].data[key];
    return playFunctWorker.postMessage(formula);
  };

  playFunctWorker.onmessage = function(e) {
    return app.dev.writeBufferSync(e.data);
  };

  saveFunct = function(e) {
    c.l(e);
    functKeyToSet = e.target.previousSibling.value;
    elToSet = e.target;
    functToSet = e.target.value;
    return testFormula(functToSet);
  };

  app.renderFunct = function() {
    var cnt, dataEl, fragment, funct, input, key, spanKey, val, wrap, _ref;
    dataEl = document.getElementById("data");
    fragment = document.createDocumentFragment();
    wrap = fragment.appendChild(document.createElement("div"));
    wrap.className = "functWrap";
    funct = app.modes.funct.data[0];
    dataEl.innerHTML = "";
    cnt = 0;
    _ref = funct.data;
    for (key in _ref) {
      val = _ref[key];
      spanKey = wrap.appendChild(document.createElement("input"));
      input = wrap.appendChild(document.createElement("input"));
      input.value = val;
      spanKey.value = key;
      spanKey.type = "button";
      spanKey.className = "btn";
      spanKey.addEventListener("click", playFunct, false);
      input.addEventListener("blur", saveFunct, false);
      cnt++;
    }
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
      return errorEl.innerHTML = "";
    } else {
      val = app.modes.funct.data[0].data[functKeyToSet];
      elToSet.value = val;
      return errorEl.innerHTML = "funct: '" + functToSet + ",ERROR: " + e.data;
    }
  };

}).call(this);

(function() {
  var Step, elToSet, escToStr, functToSet, parseInput, stepToSet, testFormula, tester, toggleInputEl;

  if (typeof app === "undefined" || app === null) {
    window.app = {};
  }

  Step = app.models.Step;

  app.renderPattern = function(ptn) {
    var COLS, ROWS, cols, div1, fragment, headers, posCode, rows, table, tableBody, tableHead, target, td, th, tr, txt, type;
    headers = ["Tpos", "pos", "hlp", "rstT", "funct", "oct", "note", "vel", "aModSpeed", "aModDepth", "pModSpeed", "pModDepth"];
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
            txt = "++++";
          } else if ((rows + 1) % (div1 / 2) === 0) {
            txt = "+++";
          } else if ((rows + 1) % (div1 / 4) === 0) {
            txt = "++";
          } else if ((rows + 1) % (div1 / 8) === 0) {
            txt = "+";
          } else if ((rows + 1) % (div1 / 16) === 0) {
            txt = "-";
          }
          td.innerHTML = txt;
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

  tester = new Worker("workers/testFormula.js");

  testFormula = function(formula) {
    var functs, key, val;
    functs = app.modes.funct.data[0].data;
    for (key in functs) {
      val = functs[key];
      formula = formula.replace(new RegExp(key, 'gi'), "(" + val + ")");
    }
    c.l(formula);
    return tester.postMessage(formula);
  };

  tester.onmessage = function(e) {
    var errorEl, val;
    errorEl = document.getElementById("error");
    if (e.data === false) {
      app.getActivePattern().data[stepToSet].funct = functToSet;
      elToSet.parentNode.innerHTML = functToSet;
      return errorEl.innerHTML = "";
    } else {
      val = app.getActivePattern().data[stepToSet].funct;
      elToSet.parentNode.innerHTML = val;
      return errorEl.innerHTML = "funct: '" + functToSet + "' at pos: " + stepToSet + "\nERROR: " + e.data;
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
        testFormula(val);
      } else {
        ptn.data[step][type] = val;
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

}).call(this);

(function() {
  var saveFunct;

  if (typeof app === "undefined" || app === null) {
    window.app = {};
  }

  saveFunct = function(e) {
    return checkFormula(e.target.value);
  };

  app.renderSong = function() {
    var chWrap, channels, cnt, dataEl, dragRow, fragment, i, id, ptn, ptnEl, ptns, rowEl, sng, spanEl, wrap, _i, _j, _len, _len1, _ref;
    dataEl = document.getElementById("data");
    dataEl.innerHTML = "";
    fragment = document.createDocumentFragment();
    wrap = fragment.appendChild(document.createElement("div"));
    wrap.className = "sngWrap";
    rowEl = wrap.appendChild(document.createElement("ul"));
    rowEl.className = "draggarea";
    ptns = app.modes.ptn.data;
    for (i = _i = 0, _len = ptns.length; _i < _len; i = ++_i) {
      ptn = ptns[i];
      ptnEl = rowEl.appendChild(document.createElement("li"));
      ptnEl.className = "draggable";
      ptnEl.uid = ptn.id;
      ptnEl.style.width = ((ptn.steps * ptn.tPerStep / 400) - 6) + "px";
      ptnEl.innerHTML = ptn.name;
    }
    wrap.appendChild(document.createElement("hr"));
    chWrap = wrap.appendChild(document.createElement("div"));
    chWrap.className = "chWrap";
    channels = 6;
    cnt = 0;
    sng = app.modes.sng.data[0].data;
    while (cnt < channels) {
      dragRow = chWrap.appendChild(document.createElement("ul"));
      dragRow.className = "dropable";
      dragRow.id = "sngChannel" + cnt;
      spanEl = dragRow.appendChild(document.createElement("span"));
      spanEl.innerHTML = cnt + ":";
      _ref = sng[cnt];
      for (i = _j = 0, _len1 = _ref.length; _j < _len1; i = ++_j) {
        id = _ref[i];
        ptn = app.getPatternById(id);
        ptnEl = dragRow.appendChild(document.createElement("li"));
        ptnEl.style.width = ((ptn.steps * ptn.tPerStep / 400) - 6) + "px";
        ptnEl.innerHTML = ptn.name;
        ptnEl.uid = id;
        ptnEl.className = "draggable";
      }
      cnt++;
    }
    dataEl.appendChild(fragment);
    $(".draggarea li").draggable({
      appendTo: "body",
      helper: "clone"
    });
    $(".dropable").droppable({
      activeClass: "ui-state-default",
      hoverClass: "ui-state-hover",
      accept: ":not(.ui-sortable-helper)",
      drop: function(event, ui) {
        var clone;
        $(this).find(".placeholder").remove();
        clone = ui.helper.context.cloneNode(true);
        clone.uid = ui.helper.context.uid;
        clone.onmousedown = function(e) {
          if (e.button === 2) {
            return $(e.target).remove();
          }
        };
        return $(this).append(clone);
      }
    }).sortable({
      items: "li:not(.placeholder)",
      stop: function(e, ui) {
        var channel, el, j, sngData, _k, _len2, _ref1, _results;
        channel = e.target.id.split("sngChannel")[1];
        sngData = app.modes.sng.data[0].data;
        _ref1 = e.target.children;
        _results = [];
        for (j = _k = 0, _len2 = _ref1.length; _k < _len2; j = ++_k) {
          el = _ref1[j];
          if (j !== 0) {
            _results.push(sngData[channel][j - 1] = el.uid);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    });
    return $(".dropable li").on("mousedown", function(e) {
      if (e.button === 2) {
        return $(e.target).remove();
      }
    });
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
