c= console; c.l = c.log

makeSampleFunction = (formula)-> new Function("t", "return "+formula)

getNm = (octave, note) ->
  if octave >= 0 then multiplicator = 1 << octave
  else multiplicator = 1 / (1 << -octave)
  multiplicator + ((multiplicator / 12) * note)

class Step
  constructor: (obj) ->
    @rstT= false
    @funct= "="
    @oct= "="
    @note= "="
    @vel= "="
    @aModSpeed= "="
    @aModDepth= "="
    @pModSpeed= "="
    @pModDepth= "="
    for key, val of obj then if @[key]? then @[key]= val

t = 0
ts = [0,0,0,0,0,0]
tp = [0,0,0,0,0,0]
step = [-1,-1,-1,-1,-1,-1]
oct = [0,0,0,0,0,0]
note = [0,0,0,0,0,0]
vel = [100,100,100,100,100,100]
funct = ["1023","1023","1023","1023","1023","1023"]
minlength = 4096*2
arr = []
functs = {}
ptns = {}
audioBuff = []

corrSteps = (ptns, ch) ->
  i = ptns.length
  while i--
    modulo = ptns[i].steps
    srcNr = (step[i]+1)%modulo
    j = ptns.length
    while j--
      trgNr = (step[j]+1)%modulo
      if trgNr>srcNr then step[j] += (trgNr-srcNr)&modulo else if trgNr<srcNr then step[j] += (srcNr-trgNr)%modulo

setDefaults = ->
  step = [0,0,0,0,0,0]
  #oct = [0,0,0,0,0,0]
  #note = [0,0,0,0,0,0]
  #vel = [100,100,100,100,100,100]
  #funct = ["1023","1023","1023","1023","1023","1023"]


replaceShortcuts = (formula)->
  for key, val of functs
    formula = formula.replace new RegExp(key, 'gi'), "("+val+")"
  formula

setAndFill = (ptn, ch, offset, mute)->
  data = ptn.data[step[ch]]
  #if mute is false then mute = 1 else mute = 0
  if offset?
    if !data? then data = new Step
    if data.oct isnt "=" then oct[ch] = data.oct
    if data.note isnt "=" then note[ch] = data.note
    if data.vel isnt "=" then vel[ch] = data.vel
    if data.funct isnt "="
      funct[ch] = replaceShortcuts data.funct
    if data.rstT is true then ts[ch] = 0
  smplFunct = makeSampleFunction(funct[ch])
  tPerStep = ptn.tPerStep
  nm = getNm oct[ch], note[ch]
  ml = if tPerStep>minlength then tPerStep else minlength
  len = offset || minlength
  #c.l ch
  while len--
    smpl = (smplFunct(ts[ch]*nm))
    smpl = if mute is false then ((smpl&2047))-1023 else 0
    smpl = smpl/170.5 ## wrong typeArrayType hack
    smpl = smpl/10000*vel[ch]*ptn.volume
    if isNaN smpl then c.l "nan!"
    arr[ch][t] = smpl
    ++t
    ++ts[ch]
    ++tp[ch]
    if tp[ch]>=tPerStep and len>1
      tp[ch]= 0
      ## maybe check step array and reset if 10x false ?!
      step[ch] = (++step[ch])%ptn.steps
      #if step[ch] is 0 and ch is 0 then console.log ch+"/"+step
      setAndFill ptn, ch, len, mute
      len = 1

########################
### Start Processing ###
########################
self.addEventListener "message", ((e) ->
  ptnsNew = JSON.parse e.data.ptns
  functsNew = JSON.parse e.data.functs
  if ptnsNew isnt null then ptns = ptnsNew
  if functsNew isnt null then functs = functsNew
  if e.data.rst then step = [0,0,0,0,0,0]; tp = [0,0,0,0,0,0]; ts = [0,0,0,0,0,0]; console.log "RST"
  # TODO find way to save reset Steps

  channels = ptns.length
  while channels--
    arr[channels] = new Float32Array(minlength)
    t = 0
    #step = 0
    setAndFill(ptns[channels], channels, null, ptns[channels].mute)

  #merge arrays
  newArr = new Float32Array(minlength)
  len = minlength
  while len--
    index = len%2
    newArr[len] = (
      arr[0][len]+arr[1][len]+arr[2][len]+
      arr[3][len]+arr[4][len]+arr[5][len]
    )/6


  self.postMessage newArr
), false