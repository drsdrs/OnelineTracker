window.initPlaySnd= ->
  lastBuff = null
  window.lastBuff = lastBuff

  calcPtn = new Worker "workers/calcPtn.js"
  cv = new app.CanvasVisual "canvasVisual"
  dev = null
  app.recordObj = null

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
    return c.l "have to implement better way ..."
    if !dev? then return initDev()
    if app.recordObj==null then app.recordObj = dev.record()
    else
      app.recordObj.stop()
      #wav = 'data:audio/wav;base64,'+btoa(app.recordObj.toWav())
      wav = 'data:application/octet-stream,'+btoa(app.recordObj.toWav())
      newWindow = window.open(wav, "*.wav")






  ################################################

  dev= undefined
  swt= false
  initDev = ->
    channelCount= 2
    preBufferSize= 1024
    sampleRate= 44100
    app.play()
    tPerStep = app.getActivePattern().tPerStep/32
    dev = audioLib.Sink(null, channelCount, preBufferSize, sampleRate)
    app.dev = dev
    dev.on "audioprocess", (e)->
      #c.l @getPlaybackTime()
      if @getSyncWriteOffset()<(preBufferSize*4) and swt
        app.cv.drawArea(lastBuff)
        app.play()
        swt= false
      else if swt isnt true then swt = true


  app.dev = dev