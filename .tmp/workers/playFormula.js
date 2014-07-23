(function() {
  var makeSampleFunction;

  makeSampleFunction = function(formula) {
    return new Function("t", "return " + formula);
  };

  self.addEventListener("message", (function(e) {
    var arr, formula, len, smplFunct, t;
    formula = e.data;
    smplFunct = makeSampleFunction(formula);
    t = 0;
    len = 8192 * 4;
    arr = new Float32Array(len);
    while (len--) {
      arr[t] = ((((smplFunct(t)) & 1023) / 82) - 1) * 0.05;
      t++;
    }
    return self.postMessage(arr);
  }), false);

}).call(this);
