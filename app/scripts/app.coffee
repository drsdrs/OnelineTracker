window.c = console
window.c.l = c.log
app = {}
window.app = app

########### MODELS ###################

event=
  Tpos: 0, pos: 0
  rstT: true, funct: "t*t>>18"
  oct: 0, note: 0, vel: 75
  AMspeed: 0, AMdepth: 0
  FMspeed: 0, FMdepth: 0
  DLYfeedback: 0, DLYdepth:0

pattern =
  name: "new pattern"
  color: "#f48"
  tPerRow: 0xff #255
  length: 4*4
  event:
    Tpos: 0, pos: 0
    rstT: true, funct: "t*t>>18"
    oct: 0, note: 0, vel: 75
    AMspeed: 0, AMdepth: 0
    FMspeed: 0, FMdepth: 0
    DLYfeedback: 0, DLYdepth:0
  data: [
    event
  ]

################ render pattern ####################

renderPattern= (ptn)->
  headers = [
    "Tpos", "pos", "rstT", "funct", "oct", "note", "vel",
    "AMspeed", "AMdepth", "FMspeed", "FMdepth", "DLYfeedback", "DLYdepth"
  ]
  COLS  = headers.length
  ROWS = ptn.length
  rows = ROWS
  cols  = COLS
  # build table
  fragment = document.createDocumentFragment()
  table = fragment.appendChild document.createElement("table")
  tableHead = table.appendChild document.createElement("thead")
  tableBody = table.appendChild document.createElement("tbody")
  #build header
  tr = tableHead.appendChild document.createElement("tr")
  while cols--
    th = tr.appendChild document.createElement("th")
    th.innerText = headers[COLS-cols-1]
  #build body
  while rows--
    tr = tableBody.appendChild document.createElement("tr")
    tr.id = ROWS-rows-1
    cols  = COLS
    while cols--
      td = tr.appendChild document.createElement("td")
      type = headers[COLS-cols-1]
      td.className = type
      if type=="pos"
        td.innerText = ROWS-rows-1
      else if type=="Tpos"
        td.innerText = (ROWS-rows-1)*ptn.tPerRow
      else if type=="rstT"
        if ptn.data[ROWS-rows-1]? && ptn.data[ROWS-rows-1][type]==true
          td.innerText= "yes"
        else
          td.innerText= "no"
      else
        if ptn.data[ROWS-rows-1]?
          td.innerText = ptn.data[ROWS-rows-1][type]
        else
          td.innerText= "=="


  document.querySelector("#pattern").appendChild fragment

renderPattern(pattern)

###################################

playBuffer =
  buff: new Float32Array(44100)
  buffLen: 44100
  t: 0
  process: (L, R) ->
    i=0
    while i<L.length
      L[i] = @buff[@t]
      R[i] = @buff[@t+1]
      if @t>@buffLen then @t = 0
      @t+=2
      i++
          
      
#pico.play(playBuffer)

worker = new Worker "workers/worker.js"

worker.postMessage("hulu")
worker.onmessage = (e)->
  playBuffer.buff = e.data
  playBuffer.buffLen = e.data.length


app.playBuffer = playBuffer
app.ptn = pattern
