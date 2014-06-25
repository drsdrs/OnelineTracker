
#######################
##  render pattern    #
#######################
app.renderPattern = (ptn)->
  headers = [
    "Tpos", "pos", "rstT", "funct", "oct", "note", "vel", "DLYfdb", "DLYdepth"
  ]
  COLS  = headers.length
  ROWS = ptn.steps
  c.l ptn
  rows = ROWS
  cols  = COLS
  # build table
  fragment = document.createDocumentFragment()
  table = fragment.appendChild document.createElement("table")
  tableHead = table.appendChild document.createElement("thead")
  tableBody = table.appendChild document.createElement("tbody")

  #build header
  tr = tableHead.appendChild document.createElement("tr")
  while cols--
    th = tr.appendChild document.createElement("th")
    th.className = th.innerText = headers[COLS-cols-1]
  #build body
  while rows--
    tr = tableBody.appendChild document.createElement("tr")
    tr.id = "row"+(ROWS-rows-1)
    cols  = COLS
    while cols--
      td = tr.appendChild document.createElement("td")
      td.addEventListener "click", toggleInputEl
      type = headers[COLS-cols-1]
      td.className = type
      if type=="pos"
        td.innerText = ROWS-rows-1
      else if type=="Tpos"
        td.innerText = (ROWS-rows-1)*ptn.tPerStep
      else if type=="rstT"
        if ptn.data[ROWS-rows-1]? && ptn.data[ROWS-rows-1][type]==true
          td.innerText= "yes"
        else
          td.innerText= "no"
      else
        if ptn.data[ROWS-rows-1]?
          td.innerText = ptn.data[ROWS-rows-1][type]
        else
          td.innerText= "="

  target = document.querySelector("#pattern .data")
  target.innerHTML = ""
  target.appendChild fragment

############################

toggleInputEl = (e)->
  el = document.getElementById("activePtnInput")
  if el isnt null then el.parentNode.innerHTML = el.value
  input = document.createElement("input")
  input.id = "activePtnInput"
  input.value = e.target.innerHTML
  input.style.width = e.target.clientWidth+"px"
  #input.style.height = e.target.clientHeight+"px"
  #input.type = "activePtnInput"
  data = e.target.innerHTM
  e.target.innerHTML= ""
  e.target.appendChild input
  c.l e, input


############################
#    ptn options events    #
############################
##~~~~ CHANNEL EVENTS ~~~~##
chEl = document.getElementById "ptnChannel"
chPlusEl = document.getElementById "chPlus"
chMinusEl = document.getElementById "chMinus"

chPlus = ->
  app.data.activeCh = (app.data.activeCh+1)%6
  chChPtn()
chMinus = ->
  app.data.activeCh = (app.data.activeCh-1)%6
  if app.data.activeCh<0 then app.data.activeCh = 5
  chChPtn()
chChPtn = ->
  chEl.innerText = "ch: "+(app.data.activeCh)
  ptn = app.data.getActivePattern()
  app.renderPattern(ptn)
  app.refreshPtnOptions(false)


chPlusEl.addEventListener "click", chPlus, false
chMinusEl.addEventListener "click", chMinus, false

##~~~~ STEPS EVENTS ~~~~##
stepsEl = document.getElementById "steps"
stepsPlusEl = document.getElementById "stepsPlus"
stepsMinusEl = document.getElementById "stepsMinus"

stepsPlus = ->
  ptn = app.data.getActivePattern()
  ptn.steps *= 2
  if ptn.steps>512 then ptn.steps = 512
  chStepsPtn(ptn)
stepsMinus = ->
  ptn = app.data.getActivePattern()
  ptn.steps /= 2
  if ptn.steps<4 then ptn.steps = 4
  chStepsPtn(ptn)
chStepsPtn = (ptn)->
  stepsEl.innerText = "steps: "+ptn.steps
  #app.playBuffer.rst()
  app.renderPattern(ptn)


stepsPlusEl.addEventListener "click", stepsPlus, false
stepsMinusEl.addEventListener "click", stepsMinus, false

##~~~~ tPerStep EVENTS ~~~~##
tPerStepEl = document.getElementById "tPerStep"
tStepPlusEl = document.getElementById "tStepPlus"
tStepMinusEl = document.getElementById "tStepMinus"

tStepPlus = ->
  ptn = app.data.getActivePattern()
  ptn.tPerStep *= 2
  if ptn.tPerStep>65000 then ptn.tPerStep = ptn.tPerStep/2
  chTStepPtn(ptn)
tStepMinus = ->
  ptn = app.data.getActivePattern()
  ptn.tPerStep /= 2
  if ptn.tPerStep<16 then ptn.tPerStep = 16
  chTStepPtn(ptn)
chTStepPtn = (ptn)->
  tPerStepEl.innerText = "tPerStep: "+ptn.tPerStep
  #app.playBuffer.rst()
  app.renderPattern(ptn)

tStepPlusEl.addEventListener "click", tStepPlus, false
tStepMinusEl.addEventListener "click", tStepMinus, false

###################################
app.refreshPtnOptions = (chToo)->
  if chToo is true then chChPtn()
  ptn = app.data.getActivePattern()
  chStepsPtn(ptn)
  chTStepPtn(ptn)