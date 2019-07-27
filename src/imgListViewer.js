import './main.less'
import imageLoaded from './utils/image_loaded'
import Transform from './utils/transform'
import To from './utils/to'
import ease from './utils/ease'
import imgAlloyFinger from './imgAlloyFinger'
import orit from './utils/orientation'
import scrollThrough from './utils/scrollThrough'
import IMG_EMPTY from './utils/altImg'

const VIEWER_CONTAINER_ID = 'pobi_mobile_viewer_container_id'
const VIEWER_PANEL_ID = 'pobi_mobile_viewer_panel_id'
const VIEWER_SINGLE_IMAGE_ID = 'pobi_mobile_viewer_single_image_id'
const VIEWER_SINGLE_IMAGE_CONTAINER = 'pobi_mobile_viewer_single_image_container'

let containerDom = null
let panelDom = null
let pageCount = 0
let currPage = 0
const SCROLL_THRESHOLD = 0.1
const DAMPING_FACTOR = 0.9
const IMG_SCROLL_FACTOR = 1.5
const MIN_FINGER_SHAKE = 2
let orientation = orit.PORTRAIT
let viewerData = null
let alloyFingerList = []

export const showImgListViewer = (imageList=[], options) => {
  if (!Array.isArray(imageList) || imageList.length <= 0) return
  hideImgListViwer()
  scrollThrough(true)
  orientation = orit.phoneOrientation()
  orit.removeOrientationChangeListener(userOrientationListener)
  orit.addOrientationChangeListener(userOrientationListener)
  viewerData = { imageList, options }

  pageCount = imageList.length
  appendViewerContainer() 
  appendViewerPanel()
  Transform(panelDom)
  options = options || {}
  imageList.forEach((imgUrl, index) => {
    appendSingleViewer(imgUrl, index, options.onPageChanged, options.altImg)
  })
  handleDefaultPage(options.defaultPageIndex, options.onPageChanged)
  appendRestDoms(options.restDoms)
}

const userOrientationListener = () => {
  const newOrientation = orit.phoneOrientation()
  if(newOrientation !== orientation && viewerData) { // orientation changed
    // window.innerWidth, innerHeight变更会有延迟
    setTimeout(() => {
      showImgListViewer(viewerData.imageList, viewerData.options)
    }, 300)
  }
}

/**
 * Hide image
 */
export const hideImgListViwer = () => {
  scrollThrough(false)
  removeViewerContainer()
}

const handleDefaultPage = (defaultPageIndex, onPageChanged) => {
  if(Number.isInteger(defaultPageIndex) && defaultPageIndex >= 0 && defaultPageIndex < pageCount) {
    currPage = defaultPageIndex
    setTimeout(() => {
      new To(panelDom, "translateX", -defaultPageIndex * window.innerWidth , 300, ease);
    }, 300)
  }
  if(onPageChanged && typeof onPageChanged === 'function') {
    onPageChanged(currPage)
  }
}

const appendRestDoms = restDoms => {
  if (Array.isArray(restDoms) && restDoms.length > 0) {
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

const handleAddition = additionDom => {
  containerDom.appendChild(additionDom)
}

const genImgId = index => `${VIEWER_SINGLE_IMAGE_ID}_${index}` 

const scrollToPage = (dom, targetPage, prevPage, onPageChanged) => {
  // page changed, so we reset current page's translateX、scaleX、scaleY
  if(targetPage !== prevPage) {
    if(onPageChanged && typeof onPageChanged === 'function') {
      onPageChanged(targetPage)
    }
    if(dom.translateX !== 0)  new To(dom, "translateX", 0 , 300, ease);
    if(dom.translateY !== 0) new To(dom, "translateY", 0, 300, ease);
    if(dom.scaleX > 1) new To(dom, "scaleX", 1 , 300, ease);
    if(dom.scaleY > 1) new To(dom, "scaleY", 1 , 300, ease);
  }
  panelToX(targetPage)
}

const appendSingleViewer = (imageUrl, index, onPageChanged, altImg) => {
  const imgContainerDom = document.createElement('div')
  imgContainerDom.setAttribute('class', VIEWER_SINGLE_IMAGE_CONTAINER)
  imgContainerDom.style.width = window.innerWidth + 'px'
  panelDom.appendChild(imgContainerDom)

  const loadingDom = document.createElement('div')
  loadingDom.setAttribute('class', 'pobi_mobile_viewer_loading')
  imgContainerDom.appendChild(loadingDom)

  const imgDom = document.createElement('img')
  imgDom.setAttribute('id', genImgId(index))
  imgDom.setAttribute('src', imageUrl)
  imgContainerDom.appendChild(imgDom)

  imgDom.addEventListener('click', imgClickListener)

  let topPx = 0
  imageLoaded(imgDom, (w, h) => {
    imgContainerDom.style.display = 'block';
    let imgWidth = 0
    if(w > window.innerWidth) {
      imgWidth = window.innerWidth
    } else {
      imgWidth = w
    }
    imgDom.style.width = imgWidth + 'px'
    topPx = window.innerHeight/2 - (h*window.innerWidth/imgWidth)/2;
  }, error => {
    imgContainerDom.removeChild(loadingDom)
    if(error) {
      imgContainerDom.style.display = 'block';
      if(altImg) {
        imgDom.src = altImg
      } else {
        imgDom.src = IMG_EMPTY
        imgDom.style.width = window.innerWidth+'px'
        imgDom.style.height = window.innerWidth+'px'
      }
    }
  })
  const alloyFinger = imgAlloyFinger(imgDom, {
    topPx,
    pressMoveListener: evt => {
      const { scaleX, width, translateX } = imgDom
      const { deltaX, deltaY } = evt
      const panelDeltaX = DAMPING_FACTOR * deltaX
      const realWidth = scaleX * width
      const scaledWidth = Math.abs(realWidth - width) / 2
      const currTranslateX = translateX + deltaX * IMG_SCROLL_FACTOR
      if(Math.abs(deltaX) > Math.abs(deltaY)) {
        if(realWidth <= width) { // img shrinked
          if(Math.abs(panelDeltaX) > MIN_FINGER_SHAKE) {
            panelDom.translateX += panelDeltaX 
          }
        } else { // img enlarged
          if(Math.abs(currTranslateX) - scaledWidth <= 0) {
            imgDom.translateX += deltaX * IMG_SCROLL_FACTOR
          } else {
            if(Math.abs(panelDeltaX) > MIN_FINGER_SHAKE) {
              panelDom.translateX += panelDeltaX
            }
          }
        }
      } else {
        imgDom.translateY += deltaY;
      }
    },
    touchEndListener: evt => {
      const { translateX } = panelDom
      const scrollFactor = Math.abs(translateX) / window.innerWidth
      const page = Math.floor(scrollFactor)
      const factor = scrollFactor - page
      const fixedCurrPage = currPage
      if(page < currPage) { // to prev page
        if(factor <= (1-SCROLL_THRESHOLD)) {
          currPage -= 1 
        }
      } else { // to next page
        if(factor >= SCROLL_THRESHOLD) {
          if(currPage+1 !== pageCount && translateX < 0) {
            currPage += 1
          }
        }
      }
      scrollToPage(imgDom, currPage, fixedCurrPage, onPageChanged)
    },
    singleTapListener: () => {
      hideImgListViwer()
    },
    rotationAble: false
  })
  alloyFingerList.push(alloyFinger)
}

const panelToX = (page) => {
  new To(panelDom, "translateX", -page*window.innerWidth , 500, ease);
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

const appendViewerPanel = () => {
  panelDom = document.getElementById(VIEWER_PANEL_ID)
  if (!panelDom) {
    panelDom = document.createElement('div')
    panelDom.setAttribute('id', VIEWER_PANEL_ID)
    containerDom.appendChild(panelDom)
  }
}

const imgClickListener = e => {
  e.stopPropagation()
}

const viewerContainerClickListener = e => {
  e.stopPropagation()
  hideImgListViwer()
}

const removeViewerContainer = () => {
  containerDom && document.body.removeChild(containerDom)
  orit.removeOrientationChangeListener(userOrientationListener)
  containerDom = null
  panelDom = null
  pageCount = 0
  currPage = 0
  viewerData = null
  orientation = orit.PORTRAIT
  alloyFingerList.forEach(alloyFinger => {
    alloyFinger.destroy()
  })
  alloyFingerList = []
}