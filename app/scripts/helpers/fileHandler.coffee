if !app? then window.app = {}
if !app.helpers? then app.helpers = {}

#////////// FILE HANDLER //////////////

class app.helpers.FileStorrage
  constructor: (elId, dataObj) ->
    elId = if !elId? then "fileInput"
    document.getElementById(elId)
      .addEventListener('change', @handleFileSelect, false)

  handleFileSelect: (e) ->
    file = e.target.files[0]
    c.l file

    if file.size < 90000
      reader = new FileReader()
      # Closure to capture the file information.
      reader.onload = ((e) ->
        (e) ->
          data = JSON.parse e.target.result
          c.l data
          app.modes = data
          app.chMode()
      )(file)
      reader.readAsText file
    else alert "file to big..."

  download: (filename, text) ->
    json = JSON.stringify app.modes
    el = document.createElement("a")
    el.setAttribute(
      "href", "data:text/plain;charset=utf-8,"+encodeURIComponent(json)
    )
    el.setAttribute "download", filename
    el.click()

  save: ->
    data = JSON.stringify app.modes
    c.l data
    location.href = 'data:application/octet-stream,' + encodeURIComponent(data)
    #newWindow= window.open(dataUri, 'song', "song")
