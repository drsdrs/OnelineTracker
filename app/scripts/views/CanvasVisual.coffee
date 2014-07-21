if !app? then window.app = {}

class app.CanvasVisual
  constructor: (el)->
    @canvas = document.getElementById(el)
    @context = @canvas.getContext("2d")
    @width = @canvas.width = 512
    @height = @canvas.height = 512
    @canvas.width = @width
    @zoom = 0.9
    @speed = 1
    @halt = false

    @canvas.addEventListener "mousedown", @haltVis.bind(@)
    @canvas.addEventListener "mouseup", @haltVis.bind(@)
    @canvas.ondblclick = @haltVis.bind(@)

    @initData()

  initData: ->
    if @context.createImageData?
      @imgd = @context.createImageData(@width, @height)
    else if @context.getImageData?
      @imgd = @context.getImageData(0, 0, @width, @height)
    else return c.warn "you browser sucks !"

  haltVis: -> @halt = !@halt

  worker: new Worker "workers/canvasWorker.js"

  clear: ->
    if @halt==false
      @context.fillStyle = "#FF0000FF"
      @context.fillRect 0, 0, width, height


  drawArea: (soundData) ->
    self = @
    if !@halt then @worker.postMessage soundData:soundData, imgd:@imgd

    @worker.onmessage = (e)->
      self.imgd = e.data
      self.context.putImageData e.data, 0, 0

