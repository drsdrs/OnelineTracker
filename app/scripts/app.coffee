if !app? then window.app = {}

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
  app.newPatterns= true
  app.newFuncts = true

  modesLoadet = app.ls.load()
  if modesLoadet? && modesLoadet isnt false then app.modes = modesLoadet
  else app.initDefaults()

  window.onbeforeunload = -> app.ls.save(app.modes)


  ######   TESTAREA  ######

  app.corrSteps = (ptns) ->
    i = ptns.length
    while i--
      modulo = ptns[i].steps
      srcNr = (step[i]+1)%modulo
      j = ptns.length
      while j--
        trgNr = (step[j]+1)%modulo
        if trgNr>srcNr then step[j] += (trgNr-srcNr)&modulo else if trgNr<srcNr then step[j] += (srcNr-trgNr)%modulo
    console.log step
