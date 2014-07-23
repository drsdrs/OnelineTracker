window.initPlaySnd= ->
  lastBuff = null
  window.lastBuff = lastBuff

  calcPtn = new Worker "workers/calcPtn.js"
  cv = new app.CanvasVisual "canvasVisual"
  dev = null
  recordObj = null
  app.stop = false

  app.cv = cv
  calcPtn.onmessage = (e)->
    if !dev? then return initDev()
    dev.writeBufferSync e.data
    lastBuff = e.data
    #cv.clear().draw(e.data, 2, "#f00")

  app.play = ()->
    jsonPtn = JSON.stringify app.getActivePatterns()
    jsonFuncts = JSON.stringify app.modes.funct.data[0].data
    if app.rstSteps is true then rst = true; app.rstSteps = false
    else rst = false
    calcPtn.postMessage( ptns: jsonPtn, rst: rst, functs: jsonFuncts)

  ################################################

  app.rec = ->
    if !dev? then return initDev()
    if recordObj?.active
      recordObj.stop()
      recordObj.exportWav ((blob) ->
        saveWaveToFile "newWave.wav", Sink.createDynURL.createBlob(blob)
        recordObj.clear()
        @disabled = false
        return
      ).bind(this)
      @disabled = true
    else
      if recordObj==null then recordObj= dev.createRecorder()
      recordObj.start()

  saveWaveToFile= (filename, link) ->

    r = new XMLHttpRequest()
    r.open "GET", link, true
    r.onreadystatechange = ->
      return  if r.readyState isnt 4 or r.status isnt 200
      el = document.createElement("a")
      el.setAttribute(
        "href", "data:audio/wav;charset=utf-8,"+(r.responseText)
      )
      c.l r
      el.setAttribute "download", filename
      el.click()

    r.send()


  ################################################

  dev= undefined
  swt= false
  initDev = ->
    channelCount= 2
    preBufferSize= 1024
    sampleRate= 44100
    app.play()
    tPerStep = app.getActivePattern().tPerStep/32
    dev = Sink(null, channelCount, preBufferSize, sampleRate)
    app.dev = dev
    dev.on "audioprocess", (e)->
      #c.l @getPlaybackTime()
      if @getSyncWriteOffset()<(preBufferSize*4) and swt
        app.cv.drawArea(lastBuff)
        if app.stop is false then app.play()
        swt= false
      else if swt isnt true then swt = true


  app.dev = dev