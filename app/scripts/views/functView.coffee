if !app? then window.app = {}

tester = new Worker "workers/testFormula.js"
playFunctWorker = new Worker "workers/playFormula.js"

dataEl = document.getElementById("data")


renameProperty = (obj, oldName, newName) ->
  if obj.hasOwnProperty(oldName)
    obj[newName] = obj[oldName]
    delete obj[oldName]
  obj


#addNewWrapEl = {}

functKeyToSet = ""
elToSet = ""
functToSet = ""

playFunctWorker.onmessage = (e)-> app.dev.writeBufferSync e.data
playFunct = (e) ->
  key = e.target.value
  formula = app.modes.funct.data[0].data[key]
  playFunctWorker.postMessage(formula)


removeFunct = (e) ->
  functName = e.target.nextSibling.value
  functs = app.modes.funct.data[0].data
  for key, funct of functs
    if functName is key
      delete app.modes.funct.data[0].data[key]
      return app.renderFunct()

saveFunct = (e) ->
  if e.keyCode?
    if e.keyCode isnt 13  then return
  functKeyToSet = e.target.previousSibling.value
  elToSet = e.target
  functToSet = e.target.value
  testFormula(functToSet)

saveKey = (e) ->
  if e.keyCode?
    if e.keyCode isnt 13  then return
  functKeyToSet = e.target.value
  renameProperty app.modes.funct.data[0].data, e.target.alt, e.target.value



  functToSet = e.target.value

addFunct = ()->
  functName = "new"
  functs = app.modes.funct.data[0].data
  for key, funct of functs
    if functName is key then functName += "X"
    console.log key
  app.modes.funct.data[0].data[functName] = "t*t"
  app.renderFunct()

genInputFunctField = (title, funct)->
  wrap = document.createElement("div")
  wrap.className = "functWrap"
  remove = wrap.appendChild document.createElement("input")
  spanKey = wrap.appendChild document.createElement("input")
  input = wrap.appendChild document.createElement("input")
  input.value = funct
  remove.type = "button"
  remove.className = "remove"
  remove.value = "x"
  spanKey.value = title
  spanKey.type = "text"
  spanKey.className = "btn"
  spanKey.alt = title
  spanKey.addEventListener "change", saveKey, false
  input.addEventListener "change", saveFunct, false
  spanKey.addEventListener "keypress", saveKey, false
  input.addEventListener "keypress", saveFunct, false

  remove.addEventListener "click", removeFunct, false
  return wrap


app.renderFunct = ->
  dataEl.innerHTML = ""
  fragment = document.createDocumentFragment()
  funct = app.modes.funct.data[0]
  cnt = 0
  for key, val of funct.data
    fragment.appendChild genInputFunctField(key, val)
    cnt++

  addNewWrapEl = fragment.appendChild document.createElement("div")
  input = addNewWrapEl.appendChild document.createElement("input")
  input.type = "button"
  input.value = "ADD NEW"
  input.className = "btn btn-new"
  input.addEventListener "click", addFunct, false

  dataEl.appendChild fragment

testFormula = (formula)-> tester.postMessage(formula)
tester.onmessage = (e)->
  errorEl = document.getElementById "error"
  if e.data is false
    app.modes.funct.data[0].data[functKeyToSet] = functToSet
    elToSet.innerHTML = functToSet
    errorEl.innerHTML= ""
    app.newFuncts = true
  else
    val = app.modes.funct.data[0].data[functKeyToSet]
    elToSet.value = val
    errorEl.innerHTML=
      "funct: '"+functToSet+",ERROR: "+e.data
