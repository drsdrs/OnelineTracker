if !app? then window.app = {}
Step = app.models.Step
#######################
##  render pattern    #
#######################
app.renderPattern = (ptn)->
  headers = [
    "Tpos", "pos", "hlp", "rstT", "funct", "oct"
    "note", "vel"
    #"AMspeed", "AMdepth", "PMspeed", "PMdepth"
  ]

  COLS  = headers.length
  ROWS = ptn.steps
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
    th.className = th.innerHTML = headers[COLS-cols-1]
  #build body
  while rows--
    tr = tableBody.appendChild document.createElement("tr")
    tr.id = "row"+(ROWS-rows-1)
    cols  = COLS
    while cols--
      td = tr.appendChild document.createElement("td")
      td.addEventListener "click", toggleInputEl
      type = headers[COLS-cols-1]
      td.className = type
      if type=="pos"
        td.innerHTML = ROWS-rows-1
      else if type=="Tpos"
        td.innerHTML = (ROWS-rows)*ptn.tPerStep
      else if type=="hlp"
        div1 = ROWS/2
        posCode = (rows+1)%div1
        txt = ""

        if (rows+1)%div1 is 0 then txt = "####"
        else if (rows+1)%(div1/2) is 0 then txt = "###"
        else if (rows+1)%(div1/4) is 0 then txt = "++"
        else if (rows+1)%(div1/8) is 0 then txt = "--"
        else if (rows+1)%(div1/16) is 0 then txt = "-"
        td.innerHTML = txt
      else if type=="rstT"
        if ptn.data[ROWS-rows-1]? && ptn.data[ROWS-rows-1][type]==true
          td.innerHTML= "X"
        else
          td.innerHTML= " "
      else
        if ptn.data[ROWS-rows-1]?
          td.innerHTML = ptn.data[ROWS-rows-1][type]
        else
          td.innerHTML= "="

  target = document.querySelector("#data")
  target.innerHTML = ""
  target.appendChild fragment

############################
escToStr = (str)-> str.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<")

parseInput = (val, max)->
  if val is "=" then return val
  val = parseInt(val)
  if isNaN(val) then return 0
  else if val>max then return max
  else if val<-max then return -max
  else return val

## test formula
elToSet = {}
stepToSet = 0
functToSet = "0"
removeInput = false
tester = new Worker "workers/testFormula.js"
testFormula = (formula)->
  ## build formula
  functs = app.modes.funct.data[0].data
  for key, val of functs
    formula = formula.replace new RegExp(key, 'gi'), "("+val+")"
  tester.postMessage(formula)
tester.onmessage = (e)->
  errorEl = document.getElementById "error"
  if e.data is false
    app.getActivePattern().data[stepToSet].funct = functToSet
    if removeInput is false then elToSet.parentNode.innerHTML = functToSet
    errorEl.innerHTML= ""
    app.newPatterns = true
    c.l "formula is cool!"
  else
    val = app.getActivePattern().data[stepToSet].funct
    if removeInput is false then elToSet.parentNode.innerHTML = val
    errorEl.innerHTML=
      "funct: '"+functToSet+"' at pos: "+stepToSet+"\nERROR: "+e.data


toggleInputEl = (e, close)->
  tagName = e.target.tagName
  if tagName isnt "TD" and tagName isnt "INPUT"
    return c.l "some went wrong", e
  el = document.getElementById("activePtnInput")
  typeE = e.target.className
  if typeE is "pos" or typeE is "Tpos" or typeE is "hlp" then return false
  # one input is active
  if el isnt null
    #c.l el.parentNode, e.target
    val = el.value
    step = el.parentNode.parentNode.id.split("row")[1]
    type = el.parentNode.className
    ptn = app.getActivePattern()
    if !ptn.data[step]? then ptn.data[step] = new Step()

    if type is "oct" or type is "note" then val = parseInput(val, 12)
    else if type is "vel" then val = parseInput(val, 100)

    if type is "funct" and val isnt "="
      stepToSet = step
      elToSet = el
      functToSet = val
      if el.parentNode isnt e.target.parentNode then removeInput = false
      else removeInput = true
      testFormula(val)
    else
      ptn.data[step][type] = val
      app.newPatterns = true
      if el? and el.parentNode is e.target.parentNode
        return false # only save...
      el.parentNode.innerHTML = val


  if typeE is "rstT"
    step = e.target.parentNode.id.split("row")[1]
    ptn = app.getActivePattern()
    if !ptn.data[step]? then ptn.data[step] = new Step()
    val = !ptn.data[step].rstT
    e.target.innerHTML = if val is true then "X" else " "
    app.newPatterns = true
    return ptn.data[step].rstT = val

  # create and set input
  val = escToStr e.target.innerHTML
  input = document.createElement("input")
  input.id = "activePtnInput"
  input.style.width = (e.target.clientWidth-2)+"px"
  input.value = val
  e.target.innerHTML= ""
  e.target.appendChild(input).select()
