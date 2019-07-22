import './main.less'
import imageLoaded from './utils/image_loaded'
import To from './utils/to'
import Transform from './utils/transform'
import AlloyFinger from 'alloyfinger'

const VIEWER_CONTAINER_ID = 'pobi_mobile_viewer_container_id'
const VIEWER_SINGLE_IMAGE_ID = 'pobi_mobile_viewer_single_image_id'

let containerDom = null
let imgDom = null

export const showViewer = (imgUrl, options) => {
  if (!imgUrl) return
  function noop() {}
  let onFinish = noop
  let restDoms = []
  if(options) {
    onFinish = options.onFinish || noop
    restDoms = options.restDoms || []
  }
  appendViewerContainer()
  appendSingleViewer(imgUrl, onFinish)
  if (restDoms && restDoms.length > 0) {
    restDoms.forEach(additionDom => {
      // Element
      if(additionDom.nodeType === 1) {
        handleAddition(additionDom)
      } else {
        console.warn('Ignore invalid dom', additionDom)
      }
    })
  }
}

/**
 * Hide image
 */
export const hideViwer = () => {
  removeViewerContainer()
}

const handleAddition = additionDom => {
  containerDom.appendChild(additionDom)
}

const appendSingleViewer = (imageUrl, onFinish) => {
  imgDom = document.createElement('img')
  imgDom.setAttribute('id', VIEWER_SINGLE_IMAGE_ID)
  imgDom.setAttribute('src', imageUrl)
  document.getElementById(VIEWER_CONTAINER_ID).appendChild(imgDom)

  imgDom.addEventListener('click', imgClickListener)

  let topPx = 0
  imageLoaded(imgDom, (w, h) => {
    containerDom.style.display = 'block';
    topPx = window.innerHeight/2 - (h*window.innerWidth/w)/2;
    imgDom.style.top = topPx + 'px';
  }, onFinish)

  function ease(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
  }

  const el = imgDom;
  Transform(el);
  let initScale = 1;
  new AlloyFinger(el, {
    multipointStart: function () {
      To.stopAll();
      initScale = el.scaleX;
    },
    rotate: function (evt) {
      el.rotateZ += evt.angle;
    },
    pinch: function (evt) {
      el.scaleX = el.scaleY = initScale * evt.zoom;
    },
    multipointEnd: function () {
      To.stopAll();
      if (el.scaleX < 1) {
        new To(el, "scaleX", 1, 500, ease);
        new To(el, "scaleY", 1, 500, ease);
      }
      if (el.scaleX > 2) {
        new To(el, "scaleX", 2, 500, ease);
        new To(el, "scaleY", 2, 500, ease);
      }
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
    },
    pressMove: function (evt) {
      el.translateX += evt.deltaX;
      el.translateY += evt.deltaY;
      evt.preventDefault();
    },
    doubleTap: function (evt) {
      To.stopAll();
      if (el.scaleX > 1.5) {
        new To(el, "scaleX", 1, 500, ease);
        new To(el, "scaleY", 1, 500, ease);
        new To(el, "translateX", 0, 500, ease);
        new To(el, "translateY", 0, 500, ease);
      } else {
        const box = el.getBoundingClientRect();
        const y = box.height - (( evt.changedTouches[0].pageY - topPx) * 2) - (box.height / 2 - ( evt.changedTouches[0].pageY - topPx));

        const x = box.width - (( evt.changedTouches[0].pageX) * 2) - (box.width / 2 - ( evt.changedTouches[0].pageX));
        new To(el, "scaleX", 2, 500, ease);
        new To(el, "scaleY", 2, 500, ease);
        new To(el, "translateX", x, 500, ease);
        new To(el, "translateY", y, 500, ease);
      }
    },
  });
}

const appendViewerContainer = () => {
  containerDom = document.getElementById(VIEWER_CONTAINER_ID)
  if (!containerDom) {
    containerDom = document.createElement('div')
    containerDom.setAttribute('id', VIEWER_CONTAINER_ID)
    containerDom.addEventListener('click', viewerContainerClickListener)
    document.body.appendChild(containerDom)
  }
}

const imgClickListener = e => {
  e.stopPropagation()
}

const viewerContainerClickListener = e => {
  e.stopPropagation()
  hideViwer()
}

const removeViewerContainer = () => {
  containerDom && document.body.removeChild(containerDom)
  containerDom && containerDom.removeEventListener('click', viewerContainerClickListener)
  imgDom && imgDom.removeEventListener('click', imgClickListener)
  containerDom = null
  imgDom = null
}