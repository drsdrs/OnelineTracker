if !app? then window.app = {}

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