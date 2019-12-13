import './main.less'
import imageLoaded from './utils/image_loaded'
import imgAlloyFinger, {
  triggerDoubleTab,
  triggerPointEnd,
  triggerRotateEnd
} from './imgAlloyFinger'
import AlloyFinger from 'alloyfinger'
import orit from './utils/orientation'
import scrollThrough from './utils/scrollThrough'
import Transform from './utils/transform'

const VIEWER_CONTAINER_ID = 'pobi_mobile_viewer_container_id'
const VIEWER_SINGLE_IMAGE_ID = 'pobi_mobile_viewer_single_image_id'

let containerDom = null
let imgDom = null
let loadingDom = null
let orientation = orit.PORTRAIT
let viewerData = null
let alloyFinger = null
let containerAlloyFinger = null

function noop () {}

/**
 * Display image viewer
 * @param {Object} imgObj img element attr
 * @param {Object} options config options
 */
export const showViewer = (imgObj, options) => {
  if (!imgObj || !imgObj.src) return
  hideViewer(false)
  scrollThrough(true)
  let wrapOptions = {}
  if (options) wrapOptions = { ...options }
  const {
    errorPlh,
    onViewerHideListener = noop,
    restDoms = [],
    imgMoveFactor = 1.5,
    imgMinScale = 1,
    imgMaxScale = 2,
    zIndex = null,
    viewerBg = null,
    clickClosable = true
  } = wrapOptions
  viewerData = { imgObj, options: { errorPlh, onViewerHideListener, restDoms, imgMoveFactor, imgMinScale, imgMaxScale, zIndex, viewerBg, clickClosable } }
  orientation = orit.phoneOrientation()
  orit.removeOrientationChangeListener(userOrientationListener)
  orit.addOrientationChangeListener(userOrientationListener)
  appendViewerContainer()
  appendSingleViewer()
  handleRestDoms()
}

/**
 * Hide image viewer
 * @param {Boolean} notifyUser options.onViewerHideListener call or not
 */
export const hideViewer = (notifyUser = true) => {
  if (viewerData) {
    if (notifyUser) {
      viewerData.options.onViewerHideListener()
    }
    scrollThrough(false)
    removeViewerContainer()
  }
}

const handleRestDoms = () => {
  const { restDoms } = viewerData.options
  if (restDoms.length > 0) {
    let docfrag = document.createDocumentFragment()
    restDoms.forEach(additionDom => {
      if (additionDom.nodeType === 1) {
        docfrag.appendChild(additionDom)
      } else {
        console.warn('Ignore invalid dom', additionDom)
      }
    })
    containerDom.appendChild(docfrag)
    docfrag = null
  }
}

const appendSingleViewer = () => {
  const {
    imgObj,
    options: {
      errorPlh,
      imgMoveFactor,
      imgMinScale,
      imgMaxScale,
      clickClosable
    }
  } = viewerData
  let docfrag = document.createDocumentFragment()
  loadingDom = document.createElement('div')
  loadingDom.setAttribute('class', 'pobi_mobile_viewer_loading')
  docfrag.appendChild(loadingDom)

  imgDom = document.createElement('img')
  imgDom.setAttribute('id', VIEWER_SINGLE_IMAGE_ID)

  imgDom.setAttribute('src', imgObj.src)
  imgDom.setAttribute('alt', imgObj.alt || '')
  docfrag.appendChild(imgDom)

  imgDom.addEventListener('click', imgClickListener)
  const resetImgDom = (w, h) => {
    let imgWidth = 0
    if (w > window.innerWidth) {
      imgWidth = window.innerWidth
    } else {
      imgWidth = w
    }
    imgDom.style.width = imgWidth + 'px'
    imgDom.style.height = 'auto'
  }
  imageLoaded(imgObj.src, (w, h) => {
    resetImgDom(w, h)
  }, error => {
    if (error) {
      containerDom.removeChild(imgDom)
      if (errorPlh) {
        imageLoaded(errorPlh, (w, h) => {
          containerDom.appendChild(imgDom)
          imgDom.src = errorPlh
          resetImgDom(w, h)
        }, () => {
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
    multipointStartListener: () => imgDom.scaleX,
    rotateListener: (evt) => { imgDom.rotateZ += evt.angle },
    pinchListener: (evt, initScale) => { imgDom.scaleX = imgDom.scaleY = initScale * evt.zoom },
    pressMoveListener: evt => {
      imgDom.translateX += evt.deltaX * imgMoveFactor
      imgDom.translateY += evt.deltaY * imgMoveFactor
    },
    singleTapListener: () => {
      if(clickClosable) hideViewer()
    },
    doubleTapListener: evt => {
      triggerDoubleTab(imgDom, evt, imgMinScale, imgMaxScale)
    },
    multipointEndListener: () => {
      triggerPointEnd(imgDom, imgMinScale, imgMaxScale)
      triggerRotateEnd(imgDom)
    }
  })
  containerDom.appendChild(docfrag)
  docfrag = null
}

const appendViewerContainer = () => {
  containerDom = document.getElementById(VIEWER_CONTAINER_ID)
  if (!containerDom) {
    containerDom = document.createElement('div')
    containerDom.setAttribute('id', VIEWER_CONTAINER_ID)
    const { zIndex, viewerBg } = viewerData.options
    if (zIndex !== null) {
      containerDom.style['z-index'] = zIndex
    }
    if (viewerBg !== null) {
      containerDom.style.background = viewerBg
    }
    containerDom.addEventListener('click', viewerContainerClickListener)
    document.body.appendChild(containerDom)
    Transform(containerDom)
    containerAlloyFinger = new AlloyFinger(containerDom, {
      pressMove: function (evt) {
        alloyFinger.pressMoveListener(evt)
        evt.preventDefault()
        evt.stopPropagation()
      }
    })
    containerDom.style.transform = 'none'
  }
}

const imgClickListener = e => {
  e.stopPropagation()
  e.preventDefault()
}

const viewerContainerClickListener = e => {
  e.stopPropagation()
  if(viewerData.options.clickClosable) hideViewer()
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
  if (alloyFinger) {
    alloyFinger.destroy()
    alloyFinger.pressMoveListener = null
    alloyFinger = null
  }
  if (containerAlloyFinger) {
    containerAlloyFinger.destroy()
    containerAlloyFinger = null
  }
}

const userOrientationListener = () => {
  const newOrientation = orit.phoneOrientation()
  // orientation changed
  if (newOrientation !== orientation && viewerData) {
    // window.innerWidth and innerHeight changed not immediately
    setTimeout(() => {
      showViewer(viewerData.imgObj, viewerData.options)
    }, 300)
  }
}
