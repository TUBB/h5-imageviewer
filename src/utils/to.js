(function () {
  var lastTime = 0
  var vendors = ['webkit', 'moz']
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
    window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame']
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
      var currTime = new Date().getTime()
      var timeToCall = Math.max(0, 16 - (currTime - lastTime))
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall)
      }, timeToCall)
      lastTime = currTime + timeToCall
      return id
    }
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id)
    }
  }
}())

export default function To (el, property, value, time, ease, onEnd, onChange) {
  var current = el[property]
  var dv = value - current
  var beginTime = new Date()
  var self = this
  var currentEase = ease || function (a) { return a }
  this.tickID = null
  var toTick = function () {
    var dt = new Date() - beginTime
    if (dt >= time) {
      el[property] = value
      onChange && onChange(value)
      onEnd && onEnd(value)
      window.cancelAnimationFrame(self.tickID)
      self.toTick = null
      return
    }
    el[property] = dv * currentEase(dt / time) + current
    self.tickID = window.requestAnimationFrame(toTick)
    onChange && onChange(el[property])
  }
  toTick()
  To.List.push(this)
}

To.List = []

To.stopAll = function () {
  for (var i = 0, len = To.List.length; i < len; i++) {
    window.cancelAnimationFrame(To.List[i].tickID)
  }
  To.List.length = 0
}

To.stop = function (to) {
  window.cancelAnimationFrame(to.tickID)
}
