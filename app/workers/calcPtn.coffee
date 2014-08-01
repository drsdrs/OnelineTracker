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
step = [0,0,0,0,0,0]
oct = [0,0,0,0,0,0]
note = [0,0,0,0,0,0]
vel = [100,100,100,100,100,100]
funct = ["1023","1023","1023","1023","1023","1023"]
minlength = 4096*4
arr = []
functs = {}
audioBuff = []

setDefaults = ->
  #step = [0,0,0,0,0,0]
  #oct = [0,0,0,0,0,0]
  #note = [0,0,0,0,0,0]
  #vel = [100,100,100,100,100,100]
  #funct = ["1023","1023","1023","1023","1023","1023"]


replaceShortcuts = (formula)->
  for key, val of functs
    formula = formula.replace new RegExp(key, 'gi'), "("+val+")"
  formula

setAndFill = (ptn, ch, offset)->
  data = ptn.data[step[ch]]
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
    smpl = (smpl&2047)-1023
    smpl = smpl/170.5
    smpl = smpl/10000*vel[ch]*ptn.volume
    if isNaN smpl then c.l "nan!"
    arr[ch][t] = smpl
    ++t
    ++ts[ch]
    ++tp[ch]
    if tp[ch]>=tPerStep and len>1
      tp[ch]=0
      ## maybe check step array and reset if 10x false ?!
      step[ch] = (++step[ch])%ptn.steps
      setAndFill ptn, ch, len
      len = 1

########################
### Start Processing ###
########################
self.addEventListener "message", ((e) ->
  ptns = JSON.parse e.data.ptns
  functs = JSON.parse e.data.functs

  if e.data.rst is true then setDefaults()
  # TODO find way to save reset Steps

  channels = 6
  while channels--
    arr[channels] = new Float32Array(minlength)
    t = 0
    #step = 0
    if ptns[channels].mute is false then setAndFill(ptns[channels], channels)

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