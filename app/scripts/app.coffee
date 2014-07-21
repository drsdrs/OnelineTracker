if !app? then window.app = {}
app.getMaxOfArray = (arr)-> Math.max.apply(null, arr)
app.getMinOfArray = (arr)-> Math.min.apply(null, arr)


app.chMode= (mode)->
  document.getElementById("error").innerHTML= ""
  if mode? then app.activeMode = mode
  else mode = app.activeMode
  if mode is "ptn"
    app.refreshPtnOptions()
    app.refreshSelect()
    app.renderPattern(app.getActivePattern())
    document.getElementById("ptnOptions").className = "show"
  else if mode is "funct"
    document.getElementById("ptnOptions").className = ""
    app.renderFunct()
  else if mode is "sng"
    document.getElementById("ptnOptions").className = ""
    app.renderSong()


app.initDefaults = ->
  Pattern = app.models.Pattern
  Funct = app.models.Funct
  Song = app.models.Song
  app.modes= {}
  app.modes.ptn =
    activeCh: 0
    data: [
      new Pattern id:0, name: "pattern 1", data: []
      new Pattern id:1, steps: 8, name: "hihats+noise", data: []
      new Pattern id:2, tPerStep: 2048, name: "effects", data: []
      new Pattern id:3, name: "beats", data: []
      new Pattern id:4, name: "synth", data: []
      new Pattern id:5, name: "lead", data: []
    ]
    selPatterns:[ 0, 1, 2, 3, 4, 5 ]

  app.modes.funct =
    data: [ new Funct ]

  app.modes.sng =
    data: [ new Song ]

window.initApp = ->
  app.name= "onelineTracker"
  app.activeMode= "ptn"


  modesLoadet = app.ls.load()
  if modesLoadet? && modesLoadet isnt false then app.modes = modesLoadet
  else app.initDefaults()
  window.onbeforeunload = ->
    app.ls.save(app.modes)
  app.getPatternById= (id)->
    for ptn in app.modes.ptn.data then if ptn.id is id then return ptn
  app.getActivePattern= (ch)->
    pos = if ch? then ch else app.modes.ptn.activeCh
    id = app.modes.ptn.selPatterns[ pos ]
    app.getPatternById(id)
  app.getActivePatterns= ->
    ptns = []
    for ptnId, i in app.modes.ptn.selPatterns
      ptns[ptnId] = app.getActivePattern(i)

###################
## TOP VIEW EVENTS
###################


### ch mode btn event ###
chModeEl = document.getElementById "chMode"
chMode = (e)->
  mode = e.target.value.split(" ").pop()
  if mode is "PATTERN"
    app.chMode "funct"
    e.target.value = "MODE: FUNCTION"
  else if mode is "FUNCTION"
    app.chMode "sng"
    e.target.value = "MODE: SONG"
  else if mode is "SONG"
    app.chMode "ptn"
    e.target.value = "MODE: PATTERN"

chModeEl.addEventListener "click", chMode, true

### EN/DISABLE DOCS ###
docsEl = document.getElementById("docs")
document.getElementById("toggleDocs").addEventListener "click", ->
  docsEl.className = if docsEl.className is "show" then "" else "show"

### RESET APP ###
document.getElementById("reset").addEventListener "click", ->
  if confirm("Really reset data ??")
    app.initDefaults()
    app.chMode()

document.getElementById("play").addEventListener "click", -> app.play()
document.getElementById("rec").addEventListener "click", -> app.rec()


document.getElementById("save2file").addEventListener "click", ->
  app.fs.download("song.json", app.modes)
document.getElementById("loadFile").addEventListener "click", ->
  document.getElementById("fileInput").click()
