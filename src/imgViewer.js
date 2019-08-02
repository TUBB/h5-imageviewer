import './main.less'
import imageLoaded from './utils/image_loaded'
import imgAlloyFinger from './imgAlloyFinger'
import AlloyFinger from 'alloyfinger'
import orit from './utils/orientation'
import scrollThrough from './utils/scrollThrough'
import Transform from './utils/transform';

const VIEWER_CONTAINER_ID = 'pobi_mobile_viewer_container_id'
const VIEWER_SINGLE_IMAGE_ID = 'pobi_mobile_viewer_single_image_id'

let containerDom = null
let imgDom = null
let loadingDom = null
let orientation = orit.PORTRAIT
let viewerData = null
let alloyFinger = null
let containerAlloyFinger = null

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
    viewerData && viewerData.options.onViewerHideListener()
  }
  if(viewerData) {
    scrollThrough(false)
    removeViewerContainer()
  }
}

const handleRestDoms = () => {
  const {restDoms} = viewerData.options
  if(restDoms.length > 0) {
    let docfrag = document.createDocumentFragment()
    restDoms.forEach(additionDom => {
      if(additionDom.nodeType === 1) {
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
    imgUrl,
    options: {
      altImg,
      imgMoveFactor,
      imgMinScale,
      imgMaxScale
    }
  } = viewerData
  let docfrag = document.createDocumentFragment()
  loadingDom = document.createElement('div')
  loadingDom.setAttribute('class', 'pobi_mobile_viewer_loading')
  docfrag.appendChild(loadingDom)

  imgDom = document.createElement('img')
  imgDom.setAttribute('id', VIEWER_SINGLE_IMAGE_ID)
  imgDom.setAttribute('src', imgUrl)
  docfrag.appendChild(imgDom)

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
  containerDom.appendChild(docfrag)
  docfrag = null
}

const appendViewerContainer = () => {
  containerDom = document.getElementById(VIEWER_CONTAINER_ID)
  if (!containerDom) {
    containerDom = document.createElement('div')
    containerDom.setAttribute('id', VIEWER_CONTAINER_ID)
    containerDom.addEventListener('click', viewerContainerClickListener)
    document.body.appendChild(containerDom)
    Transform(containerDom)
    containerAlloyFinger = new AlloyFinger(containerDom, {
      pressMove: function(evt) {
        alloyFinger.pressMoveListener(evt)
        evt.preventDefault()
        evt.stopPropagation()
      }
    })
  }
}

const imgClickListener = e => {
  e.stopPropagation()
  e.preventDefault()
}

const viewerContainerClickListener = e => {
  hideViewer()
  e.stopPropagation()
  e.preventDefault()
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
  if(alloyFinger) {
    alloyFinger.destroy()
    alloyFinger.pressMoveListener = null
    alloyFinger = null
  }
  if(containerAlloyFinger) {
    containerAlloyFinger.destroy()
    containerAlloyFinger = null
  }
}