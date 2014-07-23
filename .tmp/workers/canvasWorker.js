(function() {
  var arrs, c, getMaxOfArray, getMinOfArray, memcpy;

  getMaxOfArray = function(arr) {
    return Math.max.apply(null, arr);
  };

  getMinOfArray = function(arr) {
    return Math.min.apply(null, arr);
  };

  memcpy = function(dst, dstOffset, src, srcOffset, length) {
    var dstU8, srcU8;
    dstU8 = new Uint8ClampedArray(dst, dstOffset, length);
    srcU8 = new Uint8ClampedArray(src, srcOffset, length);
    return dstU8.set(srcU8);
  };

  c = console;

  c.l = c.log;

  arrs = [];

  self.addEventListener("message", (function(e) {
    var at, height, imgd, len, max, min, mul, neg, old, pix, pos, smpl, soundData, sub, width;
    soundData = e.data.soundData;
    imgd = e.data.imgd;
    pix = new Uint8ClampedArray(soundData.length * 4);
    width = imgd.width;
    height = soundData.length / width;
    sub = imgd.data.subarray(0, imgd.data.length - (soundData.length * 4));
    old = sub[12];
    max = 0.2502443790435791;
    min = -0.25;
    neg = min < 0 ? -min : 0;
    mul = 255 / (max + neg);
    len = soundData.length;
    at = 0;
    while (at < len) {
      smpl = ~~(soundData[at] * mul);
      if (smpl < 0) {
        smpl = -smpl;
      }
      pos = at * 4;
      pix[pos] = 0;
      pix[pos + 1] = 255;
      pix[pos + 2] = 0;
      pix[pos + 3] = smpl;
      at++;
    }
    imgd.data.set(sub, soundData.length * 4);
    imgd.data.set(pix, 0);
    return self.postMessage(imgd);
  }), false);

}).call(this);
