if !app? then window.app = {}

app.chMode= (mode)->
  document.getElementById("error").innerHTML= ""
  if mode? then app.activeMode = mode
  else mode = app.activeMode
  ptnOptionEl = document.getElementById("ptnOptions")
  if mode is "ptn"
    app.refreshPtnOptions()
    app.refreshSelect()
    app.renderPattern(app.getActivePattern())
    ptnOptionEl.className = "show"
  else if mode is "funct"
    ptnOptionEl.className = ""
    app.renderFunct()
  else if mode is "sng"
    ptnOptionEl.className = ""
    app.renderSong()

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

document.getElementById("play").addEventListener "click", ->
  app.stop = false
  app.play()
document.getElementById("stop").addEventListener "click", -> app.stop = true
document.getElementById("rec").addEventListener "click", -> app.rec()


document.getElementById("save2file").addEventListener "click", ->
  app.fs.download("song.json", app.modes)
document.getElementById("loadFile").addEventListener "click", ->
  document.getElementById("fileInput").click()
