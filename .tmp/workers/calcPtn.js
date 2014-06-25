(function() {
  var Event, data, funct, makeSampleFunction, nm, note, oct, smplFunct, step, t, tPerStep;

  makeSampleFunction = function(formula) {
    return new Function("t", "return " + formula);
  };

  t = 0;

  step = 0;

  oct = 0;

  note = 0;

  nm = 0;

  tPerStep = 8000;

  funct = "0";

  smplFunct = "0";

  data = {};

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

  self.addEventListener("message", (function(e) {
    var arr, fillArr, getData, ptn, smplTotal, steps, tTt;
    ptn = JSON.parse(e.data);
    getData = function() {
      var vel;
      data = ptn.data[step];
      if (data == null) {
        data = new Event;
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
        t = 0;
      }
      smplFunct = makeSampleFunction(funct);
      nm = (oct + (note / 12)) + 1;
      return tPerStep = ptn.tPerStep;
    };
    steps = ptn.steps;
    smplTotal = steps * tPerStep;
    arr = new Float32Array(smplTotal);
    tTt = 0;
    getData();
    fillArr = function() {
      var len;
      len = tPerStep;
      while (len--) {
        arr[tTt] = (smplFunct(t * nm) & 255) / 1024;
        ++t;
        ++tTt;
      }
      step = (++step) % steps;
      getData();
      if (tTt < smplTotal) {
        return fillArr();
      }
    };
    fillArr();
    return self.postMessage(arr);
  }), false);

}).call(this);
