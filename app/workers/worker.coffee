self.addEventListener "message", ((e) ->
  data = e.data
  arr = new Float32Array(255 << 7)
  i = 0

  while i < arr.length
    arr[i] = (((7999999 / i ^ (i & i >> 11) * (i * i >> 21)) & 255) / 512) - 0.5
    ++i


  console.log "\n\n"
  console.log "BOOOM"
  self.postMessage arr
), false