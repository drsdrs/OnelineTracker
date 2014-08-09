getMaxOfArray = (arr)-> Math.max.apply(null, arr)
getMinOfArray = (arr)-> Math.min.apply(null, arr)
c= console; c.l = c.log

arrs = []
#init = 0

self.addEventListener "message", ((e) ->
  #if init>3 then return
  #init++
  soundData = e.data.soundData
  imgd = e.data.imgd
  pix = new Uint8ClampedArray(soundData.length*4) #e.data.imgd.data
  width = imgd.width
  height = soundData.length/width

  #sub = imgd.data.subarray(0, imgd.data.length-(soundData.length*4))

  #analyse arra for min max, correct it to fit 0-255
  max = 0.2502443790435791#getMaxOfArray soundData
  min = -0.25#getMinOfArray soundData
  neg = if min<0 then -min else 0
  mul = 255/(max+neg)


  len = soundData.length
  at= 0
  while at<len
    smpl = ~~((soundData[at])*mul)
    if smpl<0 then smpl = -smpl

    pos = at*4
    pix[pos] = 0
    pix[pos+1] = 255
    pix[pos+2] = 0
    pix[pos+3] = smpl
    at++

  #imgd.data.set(sub, soundData.length*4)
  imgd.data.set(pix, 0)
  self.postMessage imgd
), false


  # y= 0
  # at= -1
  # while y<height
  #   x= 0
  #   while x<width/2
  #     smplL = ~~((soundData[at++])*mul)
  #     smplR = ~~((soundData[at++])*mul)


  #     posL = (y*width+x)*4
  #     pix[posL] = 0
  #     pix[posL+1] = 255
  #     pix[posL+2] = 0
  #     pix[posL+3] = smplL

  #     #posR = ((y+1)*width*4)-(posL) # from right to left
  #     posR = (width*2)+(posL)

  #     #c.l posL/4
  #     #c.l posR/4
  #     pix[posR] = 0
  #     pix[posR+1] = 255
  #     pix[posR+2] = 0
  #     pix[posR+3] = smplR
  #     x++
  #   y++