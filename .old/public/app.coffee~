define (require)->
  window.c = console; window.c.l = c.log;
  app = {}
  require "pico" 
  window.app = app

########### MODELS ###################

  pattern =
    name: "new pattern"
    color: "#f48"
    tPerRow: 0xff


####################################


  headers = ["tPos", "pos", "resetT", "funct", "oct", "note", "vel", "amSpeed", "amAmount", "amSpeed", "amAmount"]
  COLS  = headers.length
  ROWS = 128
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
    data = tr.appendChild document.createElement("th")
    data.innerText = headers[COLS-cols-1]
  #build body
  while rows--
    tr = tableBody.appendChild document.createElement("tr")
    cols  = COLS
    while cols--
      data = tr.appendChild document.createElement("td")
      data.innerText = (ROWS-rows)+":"+(COLS-cols)

  document.querySelector("#pattern").appendChild fragment


###################################

  playBuffer = 
    buff: new Float32Array(44100);
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
            
        
  app.playBuffer = playBuffer
  #pico.play(playBuffer);

  worker = new Worker "worker.js"
  worker.postMessage("hulu")
  worker.onmessage = (e)->
    playBuffer.buff = e.data
    playBuffer.buffLen = e.data.length



########################### 
  require "raphael"

  # paper = Raphael(0, window.innerHeight/2, window.innerWidth, window.innerHeight/2);

  # circle = paper.circle(10, 10, 10)



