window.initPlaySnd= ->
  audioCtx = new (window.AudioContext or window.webkitAudioContext)()
  calcPtn = new Worker "workers/calcPtn.js"
  cv = new app.CanvasVisual "canvasVisual"

  frameCount = audioCtx.sampleRate * 16
  channels = 2
  audioBuff = audioCtx.createBuffer(2, frameCount, audioCtx.sampleRate)

  preBuffer = []
  
  soundgen = (->
    bufferSize = 4096
    node = audioCtx.createScriptProcessor(bufferSize, 0, 2)
    output = []
    node.onaudioprocess = (e) ->
      app.play()
      #c.l "buffer is stock >> ", preBuffer.length
      output[0] = e.outputBuffer.getChannelData(0)
      output[1] = e.outputBuffer.getChannelData(1)
      newBuff = preBuffer.shift() || null
      cv.drawArea newBuff
      if newBuff is null then return c.l "no Buffer"

      len = newBuff.length
      i = 0
      b = 0
      while len>i
        output[0][b] = newBuff[i]
        output[1][b] = newBuff[i]
        i+=2
        b++
      return
    node
  )()


  calcPtn.onmessage = (e)->
    preBuffer.push(e.data)
    soundgen.connect audioCtx.destination

  app.play = ()->
    if app.newPatterns is true
      jsonPtn = JSON.stringify app.getActivePatterns()
      app.newPatterns = false
    else jsonPtn = null

    if app.newFuncts is true
      jsonFuncts = JSON.stringify app.modes.funct.data[0].data
      app.newFuncts = false
    else jsonFuncts = null

    if app.rstSteps
      rst = app.rstSteps
      app.rstSteps = false
    else rst = false

    calcPtn.postMessage( ptns: jsonPtn, rst: rst, functs: jsonFuncts )

  ################################################

  app.rec = -> null

  saveWaveToFile= (filename, link) ->
    r = new XMLHttpRequest()
    r.open "GET", link, true
    r.onreadystatechange = ->
      return  if r.readyState isnt 4 or r.status isnt 200
      el = document.createElement("a")
      el.setAttribut "href", "data:audio/wav;charset=utf-8,"+(r.responseText)

      c.l r
      el.setAttribute "download", filename
      el.click()

    r.send()


  ################################################

