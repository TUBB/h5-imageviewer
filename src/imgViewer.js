import './main.less'
import imageLoaded from './utils/image_loaded'
import imgAlloyFinger from './imgAlloyFinger'
import orit from './utils/orientation'
import scrollThrough from './utils/scrollThrough'

const VIEWER_CONTAINER_ID = 'pobi_mobile_viewer_container_id'
const VIEWER_SINGLE_IMAGE_ID = 'pobi_mobile_viewer_single_image_id'

let containerDom = null
let imgDom = null
let loadingDom = null
let orientation = orit.PORTRAIT
let viewerData = null
let alloyFinger = null

function noop() {}

export const showViewer = (imgUrl, options) => {
  if (!imgUrl) return
  hideViewer(false)
  scrollThrough(true)
  let wrapOptions = {}
  if(options) wrapOptions = {...options}
  const {
    altImg,
    onViewerHideListener = noop,
    restDoms = [],
    imgMoveFactor = 2,
    imgMinScale = 1,
    imgMaxScale = 2,
  } = wrapOptions
  viewerData = { imgUrl, options: { altImg, onViewerHideListener, restDoms, imgMoveFactor, imgMinScale, imgMaxScale } }
  orientation = orit.phoneOrientation()
  orit.removeOrientationChangeListener(userOrientationListener)
  orit.addOrientationChangeListener(userOrientationListener)
  appendViewerContainer()
  appendSingleViewer()
  handleRestDoms()
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
export const hideViewer = (notifyUser = true) => {
  if(notifyUser) {
    viewerData.options.onViewerHideListener()
  }
  scrollThrough(false)
  removeViewerContainer()
}

const handleRestDoms = () => {
  viewerData.options.restDoms.forEach(additionDom => {
    // Element
    if(additionDom.nodeType === 1) {
      containerDom.appendChild(additionDom)
    } else {
      console.warn('Ignore invalid dom', additionDom)
    }
  })
}

const appendSingleViewer = () => {
  const {
    imgUrl,
    options: {
      altImg,
      imgMoveFactor,
      imgMinScale,
      imgMaxScale
    }
  } = viewerData
  loadingDom = document.createElement('div')
  loadingDom.setAttribute('class', 'pobi_mobile_viewer_loading')
  containerDom.appendChild(loadingDom)

  imgDom = document.createElement('img')
  imgDom.setAttribute('id', VIEWER_SINGLE_IMAGE_ID)
  imgDom.setAttribute('src', imgUrl)
  containerDom.appendChild(imgDom)

  imgDom.addEventListener('click', imgClickListener)
  const resetImgDom = (w, h) => {
    let imgWidth = 0
    if(w > window.innerWidth) {
      imgWidth = window.innerWidth
    } else {
      imgWidth = w
    }
    imgDom.style.width = imgWidth + 'px'
    imgDom.style.height = 'auto'
  }
  imageLoaded(imgUrl, (w, h) => {
    resetImgDom(w, h)
  }, error => {
    if(error) {
      containerDom.removeChild(imgDom)
      if(altImg) {
        imageLoaded(altImg, (w, h) => {
          containerDom.appendChild(imgDom)
          imgDom.src = altImg
          resetImgDom(w, h)
        }, error => {
          containerDom.removeChild(loadingDom)
        })
      } else {
        containerDom.removeChild(loadingDom)
      }
    } else {
      containerDom.removeChild(loadingDom)
    }
  })
  alloyFinger = imgAlloyFinger(imgDom, {
    pressMoveListener: evt => {
      imgDom.translateX += evt.deltaX * imgMoveFactor;
      imgDom.translateY += evt.deltaY * imgMoveFactor;
    },
    singleTapListener: () => {
      hideViewer()
    },
    imgMinScale,
    imgMaxScale
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
  hideViewer()
  e.stopPropagation()
}

const removeViewerContainer = () => {
  containerDom && containerDom.removeEventListener('click', viewerContainerClickListener)
  containerDom && document.body.removeChild(containerDom)
  orit.removeOrientationChangeListener(userOrientationListener)
  imgDom && imgDom.removeEventListener('click', imgClickListener)
  containerDom = null
  imgDom = null
  loadingDom = null
  viewerData = null
  orientation = orit.PORTRAIT
  alloyFinger && alloyFinger.destroy()
  alloyFinger = null
}