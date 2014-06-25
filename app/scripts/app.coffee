window.c = console
window.c.l = c.log
app = {}
window.app = app

########### MODELS ###################
class Event
  constructor: (obj) ->
    @rstT= false; @funct= "="
    @oct= "="; @note= "="; @vel= "="
    @DLYfdb= "="; @DLYdepth= "="
    for key, val of obj then if @[key]? then @[key]=val

class Pattern
  constructor: (obj) ->
    @name= "new pattern"
    @color= "#f48"
    @tPerStep= 8192
    @steps= 16
    @data= [
      new Event note: 0, funct: "17999999/t", rstT: true
      new Event note: 0, funct: "t|t>>2"
      new Event note: 1
      new Event note: 0
      new Event note: 0, funct: "7999999/t", rstT: true
      new Event note: 0, funct: "t|t>>2"
      new Event note: 0
      new Event note: 0
      new Event note: 2, funct: "17999999/t", rstT: true
      new Event note: 0, funct: "t|t>>2"
      new Event note: 0
      new Event note: 0
      new Event note: 0, funct: "7999999/t", rstT: true
      new Event note: 0, funct: "t|t>>2"
      new Event note: 0
      new Event note: 0

    ]
    for key, val of obj then if @[key]? then @[key]=val

app.data =
  mode: "pattern"
  activeCh: 0
  selPatterns:[ 0, 1, 2, 3, 4, 5 ]
  patterns: [
    new Pattern, new Pattern, new Pattern
    new Pattern, new Pattern, new Pattern
  ]
  getActivePattern: -> @patterns[@selPatterns[@activeCh]]
  songView: null
  songs: [ null, null]

####################################
##  render pattern load options    #
####################################
app.renderPtnOptions = (pattOrSong)->
  if pattOrSong==true
    type= "PATTERN"
    data= "patterns"
  else
    type= "SONG"
    data= "songs"

  sel = document.getElementById "selectItems"
  options = "<option>SELECT "+type+"</option>"
  for item in app.data[data] then options += "<option>"+item.name+"</option>"
  sel.innerHTML = options


###################################

# playBuffer =
#   rst: ->
#     ptn = app.data.getActivePattern()
#     @t = 0
#     @tPerStep = ptn.tPerStep
#     @steps = ptn.steps
#     @buff = @buffNext||@buff
#     @buffLen = @tPerStep*@steps
#     #@setNextRowActive(ptn.steps-1)
    
#   tPerStep: app.data.getActivePattern().tPerStep
#   steps: app.data.getActivePattern().steps
#   activeRow: 0
#   buffLen: @tPerStep*@steps
#   buff: new Float32Array(@buffLen)
#   buffNxt: null
#   t: 0
#   nextRound: ->
#     @t = 0
#     @buff = @buffNxt || @buff
#     @buffLen = @buff.length
#     calcPtn.postMessage(JSON.stringify app.data.getActivePattern())
#     animateRow(@buff.length)
    
#   process: (L, R) ->
#     i= 0
#     while i<L.length
#       L[i] = @buff[@t]
#       R[i] = @buff[@t+1]
#       L[i] = R[i] = 0
#       if @t>@buffLen then return @nextRound()
#       @t+=2
#       i++
          
# pico.setup({samplerate:8000})

#########  animation  #############
ptnPos= null
ptnTable= null
offset = 0
height = 0
oldLen = 99990
app.initAnimation = ->
  ptnPos= document.getElementById("ptnPosition")
  ptnTable= document.getElementsByClassName("data")[0].childNodes[0]
  offset =  ptnTable.childNodes[0].offsetHeight
  height =  ptnTable.childNodes[1].offsetHeight
  rules = document.styleSheets[0].rules
  animateRow()

activeRow = 0
animateRow = (len)->
  activeEls = document.getElementsByClassName "active"
  if activeEls.length>0 then activeEls[0].className = ""
  activeEl = document.getElementById "row"+activeRow
  activeEl.className = "active"
  activeRow = (++activeRow%16)
  # if oldLen is len then return false
  # oldLen = len
  # ptnPos.parentNode.replaceChild(ptnPos.cloneNode(true), ptnPos)
  # ptnPos.style.webkitAnimationName = "none"
  # ptnPos.style.animationName = "none"
  # ptnPos.style.webkitAnimationDuration = (len/44100)+"s"
  # ptnPos.style.animationDuration = (len/44100)+"s"
  # setTimeout (->
  #   keyframes = findKeyframesRule("ptnPosAni")
  #   keyframes.deleteRule("0%")
  #   keyframes.deleteRule("100%")
  #   keyframes.insertRule("0% {top: "+offset+"px;}")
  #   keyframes.insertRule("100% {top: "+(offset+height)+"px;}")
  #   c.l height
  #   ptnPos.style.webkitAnimationName = "ptnPosAni"
  #   ptnPos= document.getElementById("ptnPosition")

  # ), 0
  # window.requestAnimationFrame (time) -> animateRow()
########## workers #################

calcPtn = new Worker "workers/calcPtn.js"
tester = new Worker "workers/testFormula.js"

app.testFormula = (formula)-> tester.postMessage(formula)

tester.onmessage = (e)->
  c.l "tester says: "+e.data

############################

calcPtn.onmessage = (e)->
  if !dev? then return initDev()
  dev.writeBufferSync e.data

app.play = ->
  jsonPtn = JSON.stringify app.data.getActivePattern()
  calcPtn.postMessage(jsonPtn)

app.stop = ->
  dev.kill()

################################################

dev= undefined
swt= false
initDev = ->
  tPerStep= app.data.getActivePattern().tPerStep
  c.l tPerStep
  dev = audioLib.Sink null
  app.dev = dev
  timeDiff= dev.getPlaybackTime()
  dev.on "audioprocess", (e)->
    time = dev.getPlaybackTime()
    if time>(timeDiff+(tPerStep/16))
      animateRow()
      timeDiff = time
    if @getSyncWriteOffset()<1024 && swt
      #'animateRow(playBuffer.buffLen)
      app.play()
      swt= false
    else if swt isnt true then swt = true

playBuffer =
  tPerStep: app.data.getActivePattern().tPerStep
  steps: app.data.getActivePattern().steps
  activeRow: 0
  buffLen: @tPerStep*@steps
  buff: new Float32Array(@buffLen)
  buffNxt: null
  t: 0
  swt: true


###################################
  
app.initDev = initDev
app.playBuffer = playBuffer
app.animateRow = animateRow