makeSampleFunction = (formula)-> new Function("t", "return "+formula)

t = 0
step = 0
oct = 0
note = 0
nm = 0
tPerStep = 8000
funct = "0"
smplFunct = "0"
data = {}

class Event
  constructor: (obj) ->
    @rstT= false; @funct= "="
    @oct= "="; @note= "="; @vel= "="
    @DLYfdb= "="; @DLYdepth= "="
    for key, val of obj then if @[key]? then @[key]=val

self.addEventListener "message", ((e) ->
  ptn = JSON.parse e.data
  getData = ->
    data = ptn.data[step]
    if !data? then data = new Event
    # for key, value of data
    #   if val is "="

    if data.oct isnt "=" then oct = data.oct
    if data.note isnt "=" then note = data.note
    if data.vel isnt "=" then vel = data.vel
    if data.funct isnt "=" then funct = data.funct
    if data.rstT is true then t= 0
    smplFunct = makeSampleFunction(funct)
    nm = (oct+(note/12))+1
    tPerStep = ptn.tPerStep
    
  steps = ptn.steps
  smplTotal = steps*tPerStep
  arr = new Float32Array(smplTotal)
  tTt = 0
  getData()

  fillArr = ->
    len = tPerStep
    while len--

      arr[tTt] = (smplFunct(t*nm)&255)/1024
      ++t
      ++tTt
    step = (++step)%steps; getData()
    if tTt<smplTotal then fillArr()
  fillArr()

  #console.log "Send To client >>"
  self.postMessage arr
), false