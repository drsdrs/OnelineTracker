(function() {
  var makeSampleFunction;

  makeSampleFunction = function(formula) {
    return new Function("t", "return " + formula);
  };

  self.addEventListener("message", (function(e) {
    var data, error, res;
    data = e.data;
    res = 0;
    try {
      res = makeSampleFunction(e.data)(128);
    } catch (_error) {
      error = _error;
      res = error.toString();
    }
    if (typeof res === "number") {
      res = false;
    }
    return self.postMessage(res);
  }), false);

}).call(this);
