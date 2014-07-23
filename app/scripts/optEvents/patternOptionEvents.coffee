if !app? then window.app = {}

##~~~~ VOLUME EVENTS ~~~~##
volumeEl = document.getElementById "volume"
muteEl = document.getElementById "mute"
singleEl = document.getElementById "single"

mute = -> app.getActivePattern().mute = true

single = ->
  muteAll()
  app.getActivePattern().mute = false

muteAll = ->
  for ptn, i in app.getActivePatterns() then ptn.mute = true

setVolume = ()->
  val = ~~(volumeEl.value)
  if val<0 then val = 0 else if val>100 then val = 100
  volumeEl.value = val
  app.getActivePattern().volume = val
getVolume = ()-> volumeEl.value = app.getActivePattern().volume

muteEl.addEventListener "click", mute, false
singleEl.addEventListener "click", single, false
volumeEl.addEventListener "change", setVolume, false

##~~~~ BUTTON EVENTS ~~~~##
newPtnEl = document.getElementById "newPtn"
copyPtnEl = document.getElementById "copyPtn"
delPtnEl = document.getElementById "deletePtn"

newPtn = ->
  ptnMd = app.modes.ptn
  newPtn = new app.models.Pattern name: "new Pattern"
  ptnMd.data.push newPtn
  ptnMd.selPatterns[ptnMd.activeCh] = newPtn.id
  app.refreshPtnOptions()

copyPtn = ->
  ptnMd = app.modes.ptn
  activePtn = app.getActivePattern()
  newPtn = new app.models.Pattern activePtn
  Step = app.models.Step
  newData = []
  for step, i in newPtn.data then newData[i] = new Step newPtn.data[i]
  newPtn.data = newData
  newPtn.name +=" copy"
  newPtn.id += Date.now()
  ptnMd.data.push newPtn
  ptnMd.selPatterns[ptnMd.activeCh] = newPtn.id


  app.refreshPtnOptions()

delPtn = ->
  ptnMd = app.modes.ptn
  activePtn = app.getActivePattern()
  if ptnMd.data.length is 1
    return alert "You can't delete the last pattern."
  for ptn, i in ptnMd.data
    if ptn.id is activePtn.id then pos = i

  ptnMd.data.splice pos, 1

  for ptnId, i in ptnMd.selPatterns
    if ptnId is activePtn.id
      ptnMd.selPatterns[i] = ptnMd.data[0].id
  app.refreshPtnOptions()

newPtnEl.addEventListener "click", newPtn, false
copyPtnEl.addEventListener "click", copyPtn, false
delPtnEl.addEventListener "click", delPtn, false

##~~~~ CHANNEL EVENTS ~~~~##
chEl = document.getElementById "ptnChannel"
chPlusEl = document.getElementById "chPlus"
chMinusEl = document.getElementById "chMinus"

chPlus = ->
  app.modes.ptn.activeCh = (app.modes.ptn.activeCh+1)%6
  chChPtn()
chMinus = ->
  app.modes.ptn.activeCh = (app.modes.ptn.activeCh-1)%6
  if app.modes.ptn.activeCh<0 then app.modes.ptn.activeCh = 5
  chChPtn()
chChPtn = ->
  ptn = app.getActivePattern()
  chEl.innerHTML = "ch: "+(app.modes.ptn.activeCh)
  app.renderPattern(ptn)
  app.refreshPtnOptions(false)


chPlusEl.addEventListener "click", chPlus, false
chMinusEl.addEventListener "click", chMinus, false

##~~~~ STEPS EVENTS ~~~~##
stepsEl = document.getElementById "steps"
stepsPlusEl = document.getElementById "stepsPlus"
stepsPlusCopyEl = document.getElementById "stepsPlusCopy"
stepsPlusSplitEl = document.getElementById "stepsPlusSplit"
stepsMinusJoinEl = document.getElementById "stepsMinusJoin"
stepsMinusEl = document.getElementById "stepsMinus"

stepsPlus = ->
  ptn = app.getActivePattern()
  if ptn.steps<128 then ptn.steps *= 2
  chStepsPtn(ptn)
stepsPlusCopy = ->
  ptn = app.getActivePattern()
  len = ptn.steps
  for step, i in ptn.data
    if ptn.data[i]? then ptn.data[i+len]= new app.models.Step ptn.data[i]
  stepsPlus()
stepsPlusSplit = ->
  ptn = app.getActivePattern()
  newData = []
  len = ptn.steps
  for step, i in ptn.data
    if ptn.data[i]?
      newData[i*2]= new app.models.Step ptn.data[i]
  ptn.data = newData
  stepsPlus()
stepsMinusJoin = ->
  ptn = app.getActivePattern()
  newData = []
  len = ptn.steps
  for step, i in ptn.data
    if ptn.data[i]? and (i/2)%1 is 0
      newData[i/2]= new app.models.Step ptn.data[i]
  ptn.data = newData
  stepsMinus()
stepsMinus = ->
  ptn = app.getActivePattern()
  if ptn.steps>2 and (ptn.steps / 2)%1 is 0 then ptn.steps /= 2
  chStepsPtn(ptn)
chStepsPtn = (ptn)->
  stepsEl.value = ptn.steps
  app.renderPattern(ptn)

chInputVal = (e)->
  ptn = app.getActivePattern()
  val = e.target.value
  if val>0 then ptn.steps = val
  else e.target.value = 1; ptn.steps = 1
  app.renderPattern(ptn)

stepsPlusEl.addEventListener "click", stepsPlus, false
stepsPlusCopyEl.addEventListener "click", stepsPlusCopy, false
stepsPlusSplitEl.addEventListener "click", stepsPlusSplit, false
stepsMinusJoinEl.addEventListener "click", stepsMinusJoin, false
stepsMinusEl.addEventListener "click", stepsMinus, false
stepsEl.addEventListener "change", chInputVal, false

##~~~~ tPerStep EVENTS ~~~~##
tPerStepEl = document.getElementById "tPerStep"
tStepPlusEl = document.getElementById "tStepPlus"
tStepMinusEl = document.getElementById "tStepMinus"

tStepPlus = ->
  ptn = app.getActivePattern()
  ptn.tPerStep *= 2
  if ptn.tPerStep>32768 then ptn.tPerStep = ptn.tPerStep/2
  chTStepPtn(ptn)
  app.rstSteps = true
tStepMinus = ->
  ptn = app.getActivePattern()
  ptn.tPerStep /= 2
  if ptn.tPerStep<1024 then ptn.tPerStep = 1024
  chTStepPtn(ptn)
  app.rstSteps = true
chTStepPtn = (ptn)->
  tPerStepEl.innerHTML = "tPerStep: "+ptn.tPerStep
  app.renderPattern(ptn)

tStepPlusEl.addEventListener "click", tStepPlus, false
tStepMinusEl.addEventListener "click", tStepMinus, false

##~~~~ ptnName EVENTS ~~~~##
ptnNameEl = document.getElementById "ptnName"

setName = ->
  app.getActivePattern().name = ptnNameEl.value
  app.refreshSelect()
getName = -> ptnNameEl.value = app.getActivePattern().name

ptnNameEl.addEventListener "blur", setName, false

##~~~~ select Pattern EVENTS ~~~~##

selectEl = document.getElementsByClassName("selectItems")[0]

chSelItem = (e)->
  ptnMd = app.modes.ptn
  for p in ptnMd.data
    if p.name is e.target.value then ptn = p
  ptnMd.selPatterns[ptnMd.activeCh] = ptn.id
  app.refreshPtnOptions()

selectEl.addEventListener "click", chSelItem, false

######################################################

app.refreshSelect = ->
  selectEl.innerHTML = ""
  option = document.createElement "option"
  option.selected = true
  option.disabled = true
  option.innerHTML = "SELECT PATTERN"
  selectEl.appendChild option
  for item in app.modes.ptn.data
    option = document.createElement "option"
    option.innerHTML = item.name
    selectEl.appendChild option

#######################################################

app.refreshPtnOptions = (chToo)->
  if chToo is true then chChPtn()
  ptn = @getActivePattern()
  chStepsPtn(ptn)
  chTStepPtn(ptn)
  @refreshSelect()
  getName()
  getVolume()
