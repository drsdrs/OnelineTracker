(function() {
  var Step, arr, c, funct, functs, getNm, makeSampleFunction, minlength, note, oct, replaceShortcuts, setAndFill, setDefaults, step, t, tp, ts, vel;

  c = console;

  c.l = c.log;

  makeSampleFunction = function(formula) {
    return new Function("t", "return " + formula);
  };

  getNm = function(octave, note) {
    var multiplicator;
    if (octave >= 0) {
      multiplicator = 1 << octave;
    } else {
      multiplicator = 1 / (1 << -octave);
    }
    return multiplicator + ((multiplicator / 12) * note);
  };

  Step = (function() {
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

  t = 0;

  ts = [0, 0, 0, 0, 0, 0];

  tp = [0, 0, 0, 0, 0, 0];

  step = [0, 0, 0, 0, 0, 0];

  oct = [0, 0, 0, 0, 0, 0];

  note = [0, 0, 0, 0, 0, 0];

  vel = [100, 100, 100, 100, 100, 100];

  funct = ["1023", "1023", "1023", "1023", "1023", "1023"];

  minlength = 8192 * 4;

  arr = [];

  functs = {};

  setDefaults = function() {};

  replaceShortcuts = function(formula) {
    var key, val;
    for (key in functs) {
      val = functs[key];
      formula = formula.replace(new RegExp(key, 'gi'), "(" + val + ")");
    }
    return formula;
  };

  setAndFill = function(ptn, ch, offset) {
    var data, len, ml, nm, smpl, smplFunct, tPerStep, _results;
    data = ptn.data[step[ch]];
    if (offset != null) {
      if (data == null) {
        data = new Step;
      }
      if (data.oct !== "=") {
        oct[ch] = data.oct;
      }
      if (data.note !== "=") {
        note[ch] = data.note;
      }
      if (data.vel !== "=") {
        vel[ch] = data.vel;
      }
      if (data.funct !== "=") {
        funct[ch] = replaceShortcuts(data.funct);
      }
      if (data.rstT === true) {
        ts[ch] = 0;
      }
    }
    smplFunct = makeSampleFunction(funct[ch]);
    tPerStep = ptn.tPerStep;
    nm = getNm(oct[ch], note[ch]);
    ml = tPerStep > minlength ? tPerStep : minlength;
    len = offset || minlength;
    _results = [];
    while (len--) {
      smpl = smplFunct(ts[ch] * nm);
      smpl = (smpl & 2047) - 1023;
      smpl = smpl / 170.5;
      smpl = smpl / 10000 * vel[ch] * ptn.volume;
      if (isNaN(smpl)) {
        c.l("nan!");
      }
      arr[ch][t] = smpl;
      ++t;
      ++ts[ch];
      ++tp[ch];
      if (tp[ch] >= tPerStep && len > 1) {
        tp[ch] = 0;
        step[ch] = (++step[ch]) % ptn.steps;
        setAndFill(ptn, ch, len);
        _results.push(len = 1);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };


  /* Start Processing */

  self.addEventListener("message", (function(e) {
    var channels, len, newArr, ptns;
    ptns = JSON.parse(e.data.ptns);
    functs = JSON.parse(e.data.functs);
    if (e.data.rst === true) {
      setDefaults();
    }
    channels = 6;
    while (channels--) {
      arr[channels] = new Float32Array(minlength);
      t = 0;
      setAndFill(ptns[channels], channels);
    }
    newArr = new Float32Array(minlength);
    len = minlength;
    while (len--) {
      newArr[len] = (arr[0][len] + arr[1][len] + arr[2][len] + arr[3][len] + arr[4][len] + arr[5][len]) / 6;
    }
    return self.postMessage(newArr);
  }), false);

}).call(this);
