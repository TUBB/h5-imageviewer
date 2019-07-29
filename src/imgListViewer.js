import './main.less'
import AlloyFinger from 'alloyfinger'
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
const DAMPING_FACTOR = 0.95
const IMG_SCROLL_FACTOR = 1.5
let orientation = orit.PORTRAIT
let viewerData = null
let alloyFingerList = []
let pannelAlloyFinger = null

export const showImgListViewer = (imageList=[], options) => {
  if (!Array.isArray(imageList) || imageList.length <= 0) return
  hideImgListViewer(false)
  scrollThrough(true)
  orientation = orit.phoneOrientation()
  orit.removeOrientationChangeListener(userOrientationListener)
  orit.addOrientationChangeListener(userOrientationListener)
  viewerData = { imageList, options }

  pageCount = imageList.length
  appendViewerContainer() 
  appendViewerPanel()
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
export const hideImgListViewer = (notifyUser = true) => {
  if(notifyUser 
    && viewerData 
    && viewerData.options 
    && viewerData.options.onViewerHideListener) {
    viewerData.options.onViewerHideListener()
  }
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

const appendSingleViewer = (imgUrl, index, onPageChanged, altImg) => {
  const imgContainerDom = document.createElement('div')
  imgContainerDom.setAttribute('class', VIEWER_SINGLE_IMAGE_CONTAINER)
  imgContainerDom.style.width = window.innerWidth + 'px'
  panelDom.appendChild(imgContainerDom)

  const loadingDom = document.createElement('div')
  loadingDom.setAttribute('class', 'pobi_mobile_viewer_loading')
  imgContainerDom.appendChild(loadingDom)

  const imgDom = document.createElement('img')
  imgDom.setAttribute('id', genImgId(index))
  imgDom.setAttribute('src', IMG_EMPTY)
  imgDom.style.width = window.innerWidth+'px'
  imgDom.style.height = window.innerWidth+'px'
  imgContainerDom.appendChild(imgDom)

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
    imgDom.src = imgUrl
    resetImgDom(w, h)
  }, error => {
    if(error) {
      if(altImg) {
        imageLoaded(altImg, (w, h) => {
          imgDom.src = altImg
          resetImgDom(w, h)
        }, error => {
          imgContainerDom.removeChild(loadingDom)
        })
      } else {
        imgContainerDom.removeChild(loadingDom)
      }
    } else {
      imgContainerDom.removeChild(loadingDom)
    }
  })
  const alloyFinger = imgAlloyFinger(imgDom, {
    pressMoveListener: (evt) => {
      const currPageTranslateStart = currPage * window.innerWidth
      const { scaleX, width, translateX } = imgDom
      const { deltaX, deltaY } = evt
      const panelTranslateX = DAMPING_FACTOR * deltaX + panelDom.translateX
      const realWidth = scaleX * width
      const scaledWidth = Math.abs(realWidth - width) / 2
      const imgTranslateX = translateX + deltaX * IMG_SCROLL_FACTOR
      if(Math.abs(deltaX) > Math.abs(deltaY)) {
        if(realWidth <= width) { // img shrinked
          panelDom.translateX = panelTranslateX 
        } else { // img enlarged
          if(Math.abs(imgTranslateX) - scaledWidth <= 0) {
            if(deltaX > 0) { // move to right
              if(Math.abs(panelDom.translateX) > currPageTranslateStart) {
                const panelReturnDis = panelTranslateX
                if(Math.abs(panelReturnDis) <  currPageTranslateStart) {
                  panelDom.translateX = -currPageTranslateStart
                } else {
                  panelDom.translateX = panelReturnDis
                }
              } else {
                imgDom.translateX = imgTranslateX
              }
            } else { // move to left
              if(Math.abs(panelDom.translateX) < currPageTranslateStart) {
                const panelReturnDis = panelTranslateX
                if(Math.abs(panelReturnDis) >  currPageTranslateStart) {
                  panelDom.translateX = -currPageTranslateStart
                } else {
                  panelDom.translateX = panelReturnDis
                }
              } else {
                imgDom.translateX = imgTranslateX
              }
            }
          } else {
            panelDom.translateX = panelTranslateX
          }
        }
      } else {
        imgDom.translateY += deltaY * IMG_SCROLL_FACTOR
      }
    },
    touchEndListener: () => {
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
      hideImgListViewer()
    },
    rotationAble: false
  })
  alloyFinger.imgDom = imgDom
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
    panelDom.style.width = (window.innerWidth*pageCount) + 'px'
    panelDom.style.height = window.innerHeight + 'px'
    containerDom.appendChild(panelDom)
    Transform(panelDom)
    const proxyFinger = () => {
      const imgAF = alloyFingerList[currPage]
      if(imgAF && imgAF.imgDom.scaleX === imgAF.MIN_SCALE
        && imgAF.imgDom.translateX === 0) {
        return imgAF
      } else {
        return null
      }
    }
    let disableSingleTab = false
    pannelAlloyFinger = new AlloyFinger(panelDom, {
      pressMove: function(evt) {
        const imgAF = proxyFinger()
        if(imgAF) {
          disableSingleTab = true
          imgAF && imgAF.pressMoveListener(evt)
          evt.preventDefault()
        }
      },
      touchEnd: function(evt) {
        const imgAF = proxyFinger()
        if(imgAF) {
          imgAF && imgAF.touchEndListener(evt)
          evt.preventDefault()
          setTimeout(() => {
            disableSingleTab = false
          }, 300)
        }
        
      },
      pinch: function() {
        const imgAF = proxyFinger()
        if(imgAF) {
          disableSingleTab = true
        }
      },
      rotate: function() {
        const imgAF = proxyFinger()
        if(imgAF) {
          disableSingleTab = true
        }
      },
      doubleTap: function() {
        const imgAF = proxyFinger()
        if(imgAF) {
          disableSingleTab = true
          To.stopAll();
        }
      },
      singleTap: function() {
        const imgAF = proxyFinger()
        if(imgAF && !disableSingleTab) {
          hideImgListViewer()
        }
      },
      multipointEnd: function () {
        To.stopAll()
      },
      multipointStart: function () {
        To.stopAll()
      },
    })
  }
}

const imgClickListener = e => {
  e.stopPropagation()
}

const viewerContainerClickListener = e => {
  e.stopPropagation()
  hideImgListViewer()
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
    alloyFinger.pressMoveListener = null
    alloyFinger.touchEndListener = null
    alloyFinger = null
  })
  alloyFingerList = []
  pannelAlloyFinger && pannelAlloyFinger.destroy()
  pannelAlloyFinger = null
}