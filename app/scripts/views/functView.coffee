if !app? then window.app = {}

tester = new Worker "workers/testFormula.js"
playFunctWorker = new Worker "workers/playFormula.js"

functKeyToSet = ""
elToSet = ""
functToSet = ""

playFunct = (e) ->
  key = e.target.value
  formula = app.modes.funct.data[0].data[key]
  playFunctWorker.postMessage(formula)

playFunctWorker.onmessage = (e)-> app.dev.writeBufferSync e.data

saveFunct = (e) ->
  c.l e
  functKeyToSet = e.target.previousSibling.value
  elToSet = e.target
  functToSet = e.target.value
  testFormula(functToSet)

app.renderFunct = ->
  dataEl = document.getElementById("data")
  fragment = document.createDocumentFragment()
  wrap = fragment.appendChild document.createElement("div")
  wrap.className = "functWrap"
  funct = app.modes.funct.data[0]
  dataEl.innerHTML = ""
  cnt = 0
  for key, val of funct.data
    spanKey = wrap.appendChild document.createElement("input")
    input = wrap.appendChild document.createElement("input")
    input.value = val
    spanKey.value = key
    spanKey.type = "button"
    spanKey.className = "btn"
    spanKey.addEventListener "click", playFunct, false
    input.addEventListener "blur", saveFunct, false
    cnt++

  dataEl.appendChild fragment

testFormula = (formula)-> tester.postMessage(formula)
tester.onmessage = (e)->
  errorEl = document.getElementById "error"
  if e.data is false
    app.modes.funct.data[0].data[functKeyToSet] = functToSet
    elToSet.innerHTML = functToSet
    errorEl.innerHTML= ""
  else
    val = app.modes.funct.data[0].data[functKeyToSet]
    elToSet.value = val
    errorEl.innerHTML=
      "funct: '"+functToSet+",ERROR: "+e.data
