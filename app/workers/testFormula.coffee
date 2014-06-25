makeSampleFunction = (formula)-> new Function("t", "return " + formula)
  

self.addEventListener "message", ((e) ->
  data = e.data
  res = 0
  try
    res = makeSampleFunction(e.data)(128)
  catch error
    res = error.toString()

  if typeof res is "number" then res = false
  self.postMessage res
), false