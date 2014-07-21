makeSampleFunction = (formula)-> new Function("t", "return "+formula)

self.addEventListener "message", ((e) ->
  formula = e.data
  smplFunct = makeSampleFunction(formula)
  t = 0
  len = 8192*4
  arr = new Float32Array len
  while len--
    arr[t] = ((((smplFunct(t))&1023)/82)-1)*0.05
    t++
  self.postMessage arr
), false