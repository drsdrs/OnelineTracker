if !app? then window.app = {}

app.models= {}

class app.models.Step
  constructor: (obj) ->
    @rstT= false
    @funct= "="
    @oct= "="
    @note= "="
    @vel= "="
    @AMspeed= "="
    @AMdepth= "="
    @PMspeed= "="
    @PMdepth= "="
    for key, val of obj then if @[key]? then @[key]= val

class app.models.Pattern
  constructor: (obj) ->
    @id= Date.now()+"."+~~(Math.random()*666666)
    @name= "new pattern"
    @tPerStep= 8192
    @steps= 4
    @volume= 25
    @mute = false
    @solo = false
    @data= []
    for key, val of obj then if @[key]? then @[key]=val

class app.models.Funct
  constructor: (obj) ->
    @data=
      bd: "15999999/t"
      sd: "99999999/(t^t<<3)*t>>4"
      hho: "1822111/t*Math.random()"
      hhc: "622111/t*Math.random()"
      sn: "999999999/(t^t>>4)*t>>1"
      ld: "(t^t>>1)^t<<1"
      bs: "(t+t*0.99999)"
      chR: "t&1"
      chL: "t&1^1"
    for key, val of obj then if @[key]? then @[key]=val

class app.models.Song
  constructor: (obj) ->
    @data=[ [0,0,0,0], [1,2,1,2], [3,4], [5], [], [] ]
