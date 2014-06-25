window.onload= ->
  ############ INIT Pattern ##############

  app.refreshPtnOptions(true)
  app.renderPattern(app.data.getActivePattern())
  app.renderPtnOptions(true)

  ############## INIT ############

  app.testFormula("t*t")
  app.testFormula("tc((t")

  app.initAnimation()
  #app.play()
  #app.animateRow()



