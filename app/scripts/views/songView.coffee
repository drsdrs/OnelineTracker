if !app? then window.app = {}

saveFunct = (e) -> checkFormula(e.target.value)

app.renderSong = ->
  dataEl = document.getElementById("data")
  dataEl.innerHTML = ""

  fragment = document.createDocumentFragment()
  wrap = fragment.appendChild document.createElement("div")
  wrap.className = "sngWrap"


  #### Render Rows
  rowEl = wrap.appendChild document.createElement("ul")
  rowEl.className = "draggarea"


  #### Render patterns in rows
  ptns = app.modes.ptn.data
  for ptn, i in ptns
    ptnEl = rowEl.appendChild document.createElement("li")
    #ptnEl.draggable = true
    ptnEl.className = "draggable"
    ptnEl.uid = ptn.id
    ptnEl.style.width = ((ptn.steps*ptn.tPerStep/400)-6)+"px"

    ptnEl.innerHTML = ptn.name

  wrap.appendChild document.createElement("hr")

  chWrap = wrap.appendChild document.createElement("div")
  chWrap.className = "chWrap"

  #### render dropable channel rows
  channels = 6
  cnt = 0
  sng = app.modes.sng.data[0].data
  while cnt<channels
    dragRow = chWrap.appendChild document.createElement("ul")
    dragRow.className = "dropable"
    dragRow.id = "sngChannel"+cnt
    #dragRow.draggable = true
    spanEl = dragRow.appendChild document.createElement("span")
    spanEl.innerHTML = cnt+":"

    #### Render patterns in channel rows
    for id, i in sng[cnt]
      ptn = app.getPatternById id
      ptnEl = dragRow.appendChild document.createElement("li")
      ptnEl.style.width = ((ptn.steps*ptn.tPerStep/400)-6)+"px"
      ptnEl.innerHTML = ptn.name
      ptnEl.uid = id
      ptnEl.className = "draggable"

    cnt++
  dataEl.appendChild fragment


  $(".draggarea li").draggable
    appendTo: "body"
    helper: "clone"

  $(".dropable").droppable(
    activeClass: "ui-state-default"
    hoverClass: "ui-state-hover"
    accept: ":not(.ui-sortable-helper)"
    drop: (event, ui) ->
      $(this).find(".placeholder").remove()
      clone = ui.helper.context.cloneNode(true)
      clone.uid = ui.helper.context.uid
      clone.onmousedown= (e)-> if e.button is 2 then $(e.target).remove()
      $(this).append clone
  ).sortable
    items: "li:not(.placeholder)"
    stop: (e, ui)->
      channel = e.target.id.split("sngChannel")[1]
      sngData = app.modes.sng.data[0].data
      for el, j in e.target.children
        if j isnt 0 then sngData[channel][j-1] = el.uid
      

  $(".dropable li").on "mousedown", (e)->
    if e.button is 2 then $(e.target).remove()



  #### event

  # selDragItem = null
  # selDropItem = null
    
  # handleDragStart = (e) -> selDragItem = e.target.cloneNode(true)

  # handleDragEnd = (e) ->
  #   if selDropItem?
  #     #selDragItem.draggable = false
  #     selDropItem.appendChild selDragItem

  #   selDragItem = null
  #   selDropItem = null


  # handleDragOver = (e) ->
  #   c.l "set"
  #   selDropItem = e.target
  #   e.target.classList.add "over"

  # handleDragLeave = (e) -> e.target.classList.remove "over"

  # cols = document.querySelectorAll(".dropable")
  # [].forEach.call cols, (col) ->
  #   col.addEventListener "dragenter", handleDragOver, false
  #   col.addEventListener "dragleave", handleDragLeave, false

  # cols = document.querySelectorAll(".draggable")
  # [].forEach.call cols, (col) ->
  #   col.addEventListener "dragstart", handleDragStart, false
  #   col.addEventListener "dragend", handleDragEnd, false



#$(".chWrap .dropable li").sortable()
