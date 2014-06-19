(function() {
  define(function(require) {
    var COLS, ROWS, app, cols, data, fragment, headers, pattern, playBuffer, rows, table, tableBody, tableHead, tr, worker;
    window.c = console;
    window.c.l = c.log;
    app = {};
    window.app = app;
    pattern = {
      name: "new pattern",
      color: "#f48",
      tPerRow: 0xff
    };
    headers = ["tPos", "pos", "resetT", "funct", "oct", "note", "vel", "amSpeed", "amAmount", "amSpeed", "amAmount"];
    COLS = headers.length;
    ROWS = 128;
    rows = ROWS;
    cols = COLS;
    fragment = document.createDocumentFragment();
    table = fragment.appendChild(document.createElement("table"));
    tableHead = table.appendChild(document.createElement("thead"));
    tableBody = table.appendChild(document.createElement("tbody"));
    tr = tableHead.appendChild(document.createElement("tr"));
    while (cols--) {
      data = tr.appendChild(document.createElement("th"));
      data.innerText = headers[COLS - cols - 1];
    }
    while (rows--) {
      tr = tableBody.appendChild(document.createElement("tr"));
      cols = COLS;
      while (cols--) {
        data = tr.appendChild(document.createElement("td"));
        data.innerText = (ROWS - rows) + ":" + (COLS - cols);
      }
    }
    document.querySelector("#pattern").appendChild(fragment);
    playBuffer = {
      buff: new Float32Array(44100),
      buffLen: 44100,
      t: 0,
      process: function(L, R) {
        var i, _results;
        i = 0;
        _results = [];
        while (i < L.length) {
          L[i] = this.buff[this.t];
          R[i] = this.buff[this.t + 1];
          if (this.t > this.buffLen) {
            this.t = 0;
          }
          this.t += 2;
          _results.push(i++);
        }
        return _results;
      }
    };
    app.playBuffer = playBuffer;
    worker = new Worker("worker.js");
    worker.postMessage("hulu");
    worker.onmessage = function(e) {
      playBuffer.buff = e.data;
      return playBuffer.buffLen = e.data.length;
    };
    return require("raphael");
  });

}).call(this);

(function() {
  console.log('\'Allo \'Allo! from coffee !!!' + app.a);

}).call(this);
