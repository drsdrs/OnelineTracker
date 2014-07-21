if !app? then window.app = {}

ls =
  load: ->
    data = JSON.parse(localStorage.getItem(app.name+"SAVE")) || null
    if !data? then false else data

  save: (data) ->
    localStorage.setItem app.name+"SAVE", JSON.stringify(data)

app.ls = ls

