import AlloyFinger from 'alloyfinger'
import To from './utils/to'
import Transform from './utils/transform'
import ease from './utils/ease'

function noop () {}

const imgAlloyFinger = (el, options) => {
  const {
    pressMoveListener = noop,
    touchEndListener = noop,
    singleTapListener = noop,
    swipeListener = noop,
    doubleTapListener = noop,
    multipointEndListener = noop,
    multipointStartListener = noop,
    rotateListener = noop,
    pinchListener = noop
  } = options
  Transform(el)
  let initScale = 1
  // for trusted singleTab
  let disableSingleTab = false
  const alloyFinger = new AlloyFinger(el, {
    multipointStart: function () {
      To.stopAll()
      initScale = multipointStartListener()
    },
    rotate: function (evt) {
      disableSingleTab = true
      rotateListener(evt)
      evt.preventDefault()
      evt.stopPropagation()
    },
    pinch: function (evt) {
      disableSingleTab = true
      pinchListener(evt, initScale)
      evt.preventDefault()
      evt.stopPropagation()
    },
    multipointEnd: function () {
      To.stopAll()
      multipointEndListener()
    },
    pressMove: function (evt) {
      disableSingleTab = true
      pressMoveListener(evt)
      evt.preventDefault()
      evt.stopPropagation()
    },
    doubleTap: function (evt) {
      disableSingleTab = true
      To.stopAll()
      doubleTapListener(evt)
    },
    touchEnd: function (evt) {
      evt.stopPropagation()
      touchEndListener(evt)
      // // singleTab delay 250, so we delay more. true ended for me!!!!
      setTimeout(() => {
        disableSingleTab = false
      }, 500)
    },
    swipe: function (evt) {
      disableSingleTab = true
      swipeListener(evt)
    },
    singleTap: function () {
      if (!disableSingleTab) {
        singleTapListener()
      }
    }
  })
  alloyFinger.pressMoveListener = pressMoveListener
  return alloyFinger
}

export function triggerPointEnd (dom, imgMinScale, imgMaxScale) {
  if (!dom) return
  if (dom.scaleX < imgMinScale) {
    new To(dom, 'scaleX', imgMinScale, 500, ease)
    new To(dom, 'scaleY', imgMinScale, 500, ease)
    new To(dom, 'translateX', 0, 500, ease)
    new To(dom, 'translateY', 0, 500, ease)
  }
  if (dom.scaleX > imgMaxScale) {
    new To(dom, 'scaleX', imgMaxScale, 500, ease)
    new To(dom, 'scaleY', imgMaxScale, 500, ease)
    new To(dom, 'translateX', 0, 500, ease)
    new To(dom, 'translateY', 0, 500, ease)
  }
}

export function triggerRotateEnd (dom) {
  if (!dom) return
  let rotation = dom.rotateZ % 360
  if (rotation < 0) rotation = 360 + rotation
  dom.rotateZ = rotation
  if (rotation > 0 && rotation < 45) {
    new To(dom, 'rotateZ', 0, 500, ease)
  } else if (rotation >= 315) {
    new To(dom, 'rotateZ', 360, 500, ease)
  } else if (rotation >= 45 && rotation < 135) {
    new To(dom, 'rotateZ', 90, 500, ease)
  } else if (rotation >= 135 && rotation < 225) {
    new To(dom, 'rotateZ', 180, 500, ease)
  } else if (rotation >= 225 && rotation < 315) {
    new To(dom, 'rotateZ', 270, 500, ease)
  }
}

export function triggerDoubleTab (dom, evt, imgMinScale, imgMaxScale) {
  if (!dom) return
  if (dom.scaleX >= imgMaxScale) {
    new To(dom, 'scaleX', imgMinScale, 500, ease)
    new To(dom, 'scaleY', imgMinScale, 500, ease)
    new To(dom, 'translateX', 0, 500, ease)
    new To(dom, 'translateY', 0, 500, ease)
  } else {
    const { pageX, pageY } = evt.changedTouches[0]
    const box = dom.getBoundingClientRect()
    const topY = getImgDomTopY(dom)
    const leftX = getImgDomLeftX(dom)
    const y = box.height - (pageY - topY) * 2 - (box.height / 2 - (pageY - topY))
    const x = box.width - (pageX - leftX) * 2 - (box.width / 2 - (pageX - leftX))
    new To(dom, 'scaleX', imgMaxScale, 500, ease)
    new To(dom, 'scaleY', imgMaxScale, 500, ease)
    new To(dom, 'translateX', x, 500, ease)
    new To(dom, 'translateY', y, 500, ease)
  }
}

function getImgDomTopY (dom) {
  if (!dom) return 0
  const { translateY } = dom
  const box = dom.getBoundingClientRect()
  const topY = (window.innerHeight - box.height) / 2 + translateY
  if (box.height > window.innerHeight) {
    if (translateY > 0) {
      return topY + (box.height - window.innerHeight) / 2
    } else if (translateY < 0) {
      return topY - (box.height - window.innerHeight) / 2
    } else {
      return topY
    }
  } else {
    return topY
  }
}

function getImgDomLeftX (dom) {
  if (!dom) return 0
  const { translateX } = dom
  const box = dom.getBoundingClientRect()
  const leftX = (window.innerWidth - box.width) / 2 + translateX
  if (box.width > window.innerWidth) {
    if (translateX > 0) {
      return leftX + (box.width - window.innerWidth) / 2
    } else if (translateX < 0) {
      return leftX - (box.width - window.innerWidth) / 2
    } else {
      return leftX
    }
  } else {
    return leftX
  }
}

export default imgAlloyFinger
