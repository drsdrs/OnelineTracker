(function() {
  var MINLENGTH, Step, arr, c, data, funct, makeSampleFunction, minLength, nm, note, oct, setAndFill, smplFunct, step, t, tPerStep, ts;

  makeSampleFunction = function(formula) {
    return new Function("t", "return " + formula);
  };

  c = console;

  c.l = c.log;

  t = 0;

  ts = [0, 0, 0, 0, 0, 0];

  step = 0;

  oct = 0;

  note = 0;

  nm = 0;

  tPerStep = 8000;

  funct = "0";

  smplFunct = "0";

  MINLENGTH = 8192;

  minLength = MINLENGTH;

  arr = [];

  data = {};

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

  setAndFill = function(ptn, ch) {
    var len, smpl, vel;
    data = ptn.data[step];
    if (data == null) {
      data = new Step;
    }
    if (data.oct !== "=") {
      oct = data.oct;
    }
    if (data.note !== "=") {
      note = data.note;
    }
    if (data.vel !== "=") {
      vel = data.vel;
    }
    if (data.funct !== "=") {
      funct = data.funct;
    }
    if (data.rstT === true) {
      ts[ch] = 0;
    }
    smplFunct = makeSampleFunction(funct);
    tPerStep = ptn.tPerStep;
    len = tPerStep;
    while (len--) {
      nm = (oct + (note / 12)) + 1;
      smpl = (((smplFunct(ts[ch] * nm) & 255) - 64) / 64) * 0.1;
      arr[ch][t] = smpl;
      ++t;
      ++ts[ch];
    }
    step = (++step) % ptn.steps;
    if (t < minLength) {
      return setAndFill(ptn, ch);
    }
  };


  /* Start Processing */

  self.addEventListener("message", (function(e) {
    var channels, len, newArr, ptn, ptns, steps, _i, _len;
    ptns = JSON.parse(e.data);
    minLength = MINLENGTH;
    for (_i = 0, _len = ptns.length; _i < _len; _i++) {
      ptn = ptns[_i];
      len = ptn.tPerStep * ptn.steps;
      if (len > minLength) {
        minLength = len;
      }
    }
    steps = ptn.steps;
    channels = 6;
    while (channels--) {
      arr[channels] = new Float32Array(minLength);
      t = 0;
      step = 0;
      oct = 0;
      note = 0;
      funct = 0;
      setAndFill(ptns[channels], channels);
    }
    newArr = new Float32Array(minLength);
    len = minLength;
    while (minLength--) {
      newArr[minLength] = (arr[0][minLength] + arr[1][minLength] + arr[2][minLength] + arr[3][minLength] + arr[4][minLength] + arr[5][minLength]) / 6;
    }
    return self.postMessage(newArr);
  }), false);

}).call(this);
