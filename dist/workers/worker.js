(function() {
  self.addEventListener("message", (function(e) {
    var arr, data, i;
    data = e.data;
    arr = new Float32Array(255 << 10);
    i = 0;
    while (i < arr.length) {
      arr[i] = (((7999999 / i ^ (i & i >> 11) * (i * i >> 20)) & 255) / 512) - 0.5;
      ++i;
    }
    console.log("\n\n");
    console.log("BOOOM");
    self.postMessage(arr);
  }), false);

}).call(this);
