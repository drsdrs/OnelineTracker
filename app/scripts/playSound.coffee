window.initPlaySnd= ->
  audioCtx = new (window.AudioContext or window.webkitAudioContext)()
  calcPtn = new Worker "workers/calcPtn.js"
  cv = new app.CanvasVisual "canvasVisual"

  frameCount = audioCtx.sampleRate * 16
  channels = 2
  audioBuff = audioCtx.createBuffer(2, frameCount, audioCtx.sampleRate)



  preBuffer = []

  soundgen = (->
    bufferSize = 4096*2
    node = audioCtx.createScriptProcessor(bufferSize, 0, 2)
    output = []
    node.onaudioprocess = (e) ->
      app.play()
      c.l "huiiii"
      output[0] = e.outputBuffer.getChannelData(0)
      output[1] = e.outputBuffer.getChannelData(1)
      newBuff = preBuffer.shift() || null
      if newBuff is null then return c.l "no Buffer"

      len = newBuff.length
      while len-- then index = len%2; output[index][len] = newBuff[len]
      return
    node
  )()


  calcPtn.onmessage = (e)->
    preBuffer.push(e.data)
    if preBuffer.length>0 then soundgen.connect audioCtx.destination
  app.play = ()->
    ## TODO check if ActivePAttersn and functs have change else dont send
    jsonPtn = JSON.stringify app.getActivePatterns()
    jsonFuncts = JSON.stringify app.modes.funct.data[0].data
    if app.rstSteps is true then rst = true; app.rstSteps = false
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

