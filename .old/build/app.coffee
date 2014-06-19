define (require)->
  window.c = console; window.c.l = c.log;
  app = {}
  require "pico" 
  window.app = app

  worker = new Worker "worker.js"



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

  worker.postMessage("hulu")
  worker.onmessage = (e)->
    playBuffer.buff = e.data
    playBuffer.buffLen = e.data.length

 
