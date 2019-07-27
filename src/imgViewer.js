import './main.less'
import imageLoaded from './utils/image_loaded'
import imgAlloyFinger from './imgAlloyFinger'
import orit from './utils/orientation'
import scrollThrough from './utils/scrollThrough'
import IMG_EMPTY from './utils/altImg'

const VIEWER_CONTAINER_ID = 'pobi_mobile_viewer_container_id'
const VIEWER_SINGLE_IMAGE_ID = 'pobi_mobile_viewer_single_image_id'

let containerDom = null
let imgDom = null
let orientation = orit.PORTRAIT
let viewerData = null
let alloyFinger = null

export const showViewer = (imgUrl, options) => {
  if (!imgUrl) return
  hideViwer()
  scrollThrough(true)
  orientation = orit.phoneOrientation()
  orit.removeOrientationChangeListener(userOrientationListener)
  orit.addOrientationChangeListener(userOrientationListener)
  viewerData = { imgUrl, options }
  function noop() {}
  let onFinish = noop
  let restDoms = []
  let altImg = null
  if(options) {
    onFinish = options.onFinish || noop
    restDoms = options.restDoms || []
    altImg = options.altImg
  }
  appendViewerContainer()
  appendSingleViewer(imgUrl, onFinish, altImg)
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

const userOrientationListener = () => {
  const newOrientation = orit.phoneOrientation()
  if(newOrientation !== orientation && viewerData) { // orientation changed
    // window.innerWidth, innerHeight变更会有延迟
    setTimeout(() => {
      showViewer(viewerData.imgUrl, viewerData.options)
    }, 300)
  }
}

/**
 * Hide image
 */
export const hideViwer = () => {
  scrollThrough(false)
  removeViewerContainer()
}

const handleAddition = additionDom => {
  containerDom.appendChild(additionDom)
}

const appendSingleViewer = (imageUrl, onFinish, altImg) => {
  const loadingDom = document.createElement('div')
  loadingDom.setAttribute('class', 'pobi_mobile_viewer_loading')
  containerDom.appendChild(loadingDom)
  loadingDom.style.top = (window.innerHeight/2 - loadingDom.offsetHeight/2)+'px'
  loadingDom.style.left = (window.innerWidth/2 - loadingDom.offsetWidth/2)+'px'
  loadingDom.style.position = 'absolute'

  imgDom = document.createElement('img')
  imgDom.setAttribute('id', VIEWER_SINGLE_IMAGE_ID)
  imgDom.setAttribute('src', imageUrl)
  containerDom.appendChild(imgDom)

  imgDom.addEventListener('click', imgClickListener)

  let topPx = 0
  imageLoaded(imgDom, (w, h) => {
    topPx = window.innerHeight/2 - (h*window.innerWidth/w)/2;
    imgDom.style.top = topPx + 'px';
  }, error => {
    onFinish(error)
    containerDom.removeChild(loadingDom)
    if(error) {
      if(altImg) {
        const src = altImg
        let img = new Image();
        img.onload = function() {
            topPx = window.innerHeight/2 - (this.height*window.innerWidth/this.width)/2;
            imgDom.style.top = topPx + 'px';
            img.onload = null;
            img = null;
        }
        img.onerror = function() {
          containerDom.removeChild(imgDom)
          img.onerror = null
        }
        img.src = src
        imgDom.src = src
      } else {
        imgDom.src = IMG_EMPTY
        const top = window.innerHeight/2 - (window.innerWidth*window.innerWidth/window.innerWidth)/2;
        imgDom.style.top = top + 'px';
        imgDom.style.width = window.innerWidth+'px'
        imgDom.style.height = window.innerWidth+'px'
      }
    }
  })
  alloyFinger = imgAlloyFinger(imgDom, {
    topPx,
    pressMoveListener: evt => {
      imgDom.translateX += evt.deltaX;
      imgDom.translateY += evt.deltaY;
    },
    singleTapListener: () => {
      hideViwer()
    }
  })
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
  hideViwer()
  e.stopPropagation()
}

const removeViewerContainer = () => {
  containerDom && document.body.removeChild(containerDom)
  orit.removeOrientationChangeListener(userOrientationListener)
  containerDom = null
  imgDom = null
  viewerData = null
  orientation = orit.PORTRAIT
  alloyFinger && alloyFinger.destroy()
  alloyFinger = null
}