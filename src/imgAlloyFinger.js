import AlloyFinger from 'alloyfinger'
import To from './utils/to'
import Transform from './utils/transform'
import ease from './utils/ease'

function noop() {}

const imgAlloyFinger = (el, options) => {
  const {
    topPx = 0, 
    pressMoveListener = noop, 
    rotationAble = true,
    touchEndListener = noop,
    singleTapListener = noop,
    imgMinScale,
    imgMaxScale,
    swipeListener = noop
  } = options
  Transform(el);
  let initScale = 1;
  // for trusted singleTab
  let disableSingleTab = false
  const alloyFinger = new AlloyFinger(el, {
    multipointStart: function () {
      To.stopAll();
      initScale = el.scaleX;
    },
    rotate: function (evt) {
      disableSingleTab = true
      if(rotationAble) {
        el.rotateZ += evt.angle;
      }
      evt.preventDefault()
      evt.stopPropagation()
    },
    pinch: function (evt) {
      disableSingleTab = true
      el.scaleX = el.scaleY = initScale * evt.zoom;
      evt.preventDefault()
      evt.stopPropagation()
    },
    multipointEnd: function () {
      To.stopAll();
      if (el.scaleX < imgMinScale) {
        new To(el, "scaleX", imgMinScale, 500, ease);
        new To(el, "scaleY", imgMinScale, 500, ease);
        new To(el, "translateX", 0, 500, ease);
        new To(el, "translateY", 0, 500, ease);
      }
      if (el.scaleX > imgMaxScale) {
        new To(el, "scaleX", imgMaxScale, 500, ease);
        new To(el, "scaleY", imgMaxScale, 500, ease);
        new To(el, "translateX", 0, 500, ease);
        new To(el, "translateY", 0, 500, ease);
      }
      if(rotationAble) {
        let rotation = el.rotateZ % 360;
        if (rotation < 0) rotation = 360 + rotation;
        el.rotateZ=rotation;
        if (rotation > 0 && rotation < 45) {
          new To(el, "rotateZ", 0, 500, ease);
        } else if (rotation >= 315) {
          new To(el, "rotateZ", 360, 500, ease);
        } else if (rotation >= 45 && rotation < 135) {
          new To(el, "rotateZ", 90, 500, ease);
        } else if (rotation >= 135 && rotation < 225) {
          new To(el, "rotateZ", 180, 500, ease);
        } else if (rotation >= 225 && rotation < 315) {
          new To(el, "rotateZ", 270, 500, ease);
        }
      }
    },
    pressMove: function (evt) {
      disableSingleTab = true
      pressMoveListener(evt)
      evt.preventDefault()
      evt.stopPropagation()
    },
    doubleTap: function (evt) {
      disableSingleTab = true
      To.stopAll();
      if (el.scaleX >= imgMaxScale) {
        new To(el, "scaleX", imgMinScale, 500, ease);
        new To(el, "scaleY", imgMinScale, 500, ease);
        new To(el, "translateX", 0, 500, ease);
        new To(el, "translateY", 0, 500, ease);
      } else {
        const box = el.getBoundingClientRect();
        const y = box.height - (( evt.changedTouches[0].pageY - topPx) * 2) - (box.height / 2 - ( evt.changedTouches[0].pageY - topPx));
        const x = box.width - (( evt.changedTouches[0].pageX) * 2) - (box.width / 2 - ( evt.changedTouches[0].pageX));
        new To(el, "scaleX", imgMaxScale, 500, ease);
        new To(el, "scaleY", imgMaxScale, 500, ease);
        new To(el, "translateX", x, 500, ease);
        new To(el, "translateY", y, 500, ease);
      }
    },
    touchEnd: function(evt) {
      evt.preventDefault()
      evt.stopPropagation()
      touchEndListener(evt)
      // // singleTab delay 250, so we delay more. true ended for me!!!!
      setTimeout(() => {
        disableSingleTab = false
      }, 300)
    },
    swipe: function(evt) {
      disableSingleTab = true
      swipeListener(evt)
    },
    singleTap: function(evt) {
      if(!disableSingleTab) {
        singleTapListener()
      }
    }
  })
  alloyFinger.pressMoveListener = pressMoveListener
  alloyFinger.touchEndListener = touchEndListener
  alloyFinger.swipeListener = swipeListener
  return alloyFinger
}

export default imgAlloyFinger