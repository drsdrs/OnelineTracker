if !app? then window.app = {}
app.getMaxOfArray = (arr)-> Math.max.apply(null, arr)
app.getMinOfArray = (arr)-> Math.min.apply(null, arr)

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

  window.onbeforeunload = -> app.ls.save(app.modes)