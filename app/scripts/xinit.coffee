window.onload= ->
  window.c = console; c.l = c.log

  initApp()
  initPlaySnd()
  app.chMode()
  app.fs = new app.helpers.FileStorrage()

  #app.play()



