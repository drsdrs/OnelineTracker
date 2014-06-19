self.addEventListener('message', function(e) {
  var data = e.data;

  var arr = new Float32Array(255<<10);
  for (var i = 0; i < arr.length; ++i) {
    arr[i] = (((7999999/i^(i&i>>11)*(i*i>>20))&255)/512)-0.5;
  }

  console.log('\n\n');
  console.log('BOOOM');

  self.postMessage(arr);


}, false);