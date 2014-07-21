##############################
##### KEYBOARD CONTROLLS #####
##############################

downKey = ""
keyUp = (e)->
  e.stopPropagation()
  k = e.keyCode


  if k is 111 then chMinus() # *
  else if k is 106 then chPlus() # /
  else if k is 104 then stepsMinus() # 8
  else if k is 105 then stepsPlus() # 9
  else if k is 101 then tStepMinus() # 5
  else if k is 102 then tStepPlus() # 6

  if downKey is "ctrl"
    if k is 37 then app.chMode "sng" # left
    else if k is 39 then app.chMode "funct" # right
    else if k is 38 then app.chMode "ptn" # top
    else if k is 40 then app.chMode "ptn" # bottom
    else if k is 13 then alert "you pressed strg+enter, WOW"
  
  else if downKey is "shift"
    el = document.getElementById("activePtnInput")
    if el?
      type = el.parentNode.className
      if k is 37 # left
        if type is "funct"
          el.parentElement.parentElement
            .getElementsByClassName("P-ModDepth").item().click()
        else el.parentElement.previousSibling.click()
      else if k is 39 #and type isnt "DLYdepth" # right
        nextEl = el.parentElement.nextSibling
        if nextEl? then nextEl.click()
        else
          el.parentElement.parentElement
            .getElementsByClassName("funct").item().click()
      else if k is 38  # top
        el = el.parentElement.parentElement.previousSibling
        if el? then el.getElementsByClassName(type)[0].click()
        else
          lastStep = app.getActivePattern().steps-1
          document.querySelector("#row"+lastStep+" ."+type).click()
      else if k is 40 # down
        el = el.parentElement.parentElement.nextSibling
        if el? then el.getElementsByClassName(type)[0].click()
        else document.querySelector("#row0 ."+type).click()
      else if k is 13 # enter key # should submit value
        el.click(e, false)
    else if k is 13# enter key # should select first funct row
      document.querySelector("#row0 .funct").click()

  if k is 16 or k is 17 then downKey = "none" # reset downKey

keyDown = (e)->
  e.stopPropagation()
  k = e.keyCode
  c.l k
  if k is 16 then downKey = "shift"
  else if k is 17 then downKey = "ctrl"


document.addEventListener "keyup", keyUp, true
document.addEventListener "keydown", keyDown, true

