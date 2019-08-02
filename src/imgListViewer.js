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
let currPage = 0
let orientation = orit.PORTRAIT
let viewerData = null
let alloyFingerList = []
let pannelAlloyFinger = null

function noop() {}

export const showImgListViewer = (imgList=[], options, screenRotation=false) => {
  if (!Array.isArray(imgList) || imgList.length <= 0) return
  const cachedCurrPage = currPage
  hideImgListViewer(false)
  scrollThrough(true)
  initParams(imgList, options, screenRotation, cachedCurrPage)
  appendViewerContainer() 
  appendViewerPanel()
  handleDefaultPage()
  handleImgDoms()
  handleRestDoms()
  handleOrientationChange()
}

const initParams = (imgList, options, screenRotation, cachedCurrPage) => {
  let wrapOptions = {}
  if(options) wrapOptions = {...options}
  const {
    defaultPageIndex = 0,
    altImg,
    onPageChanged = noop,
    onViewerHideListener = noop,
    restDoms = [],
    pageThreshold = 0.1,
    pageDampingFactor = 0.9,
    imgMoveFactor = 2,
    imgMinScale = 1,
    imgMaxScale = 2,
  } = wrapOptions
  viewerData = { 
    imgList: [...imgList], 
    options: { limit: 3, defaultPageIndex: screenRotation ? cachedCurrPage : defaultPageIndex, altImg, onPageChanged, onViewerHideListener, restDoms, pageThreshold, pageDampingFactor, imgMoveFactor, imgMinScale, imgMaxScale } 
  }
  if(viewerData.options.defaultPageIndex < 0 
    || viewerData.options.defaultPageIndex > imgList.length - 1) {
    viewerData.options.defaultPageIndex = 0
  }
}

const handleOrientationChange = () => {
  orientation = orit.phoneOrientation()
  orit.removeOrientationChangeListener(userOrientationListener)
  orit.addOrientationChangeListener(userOrientationListener)
}

const userOrientationListener = () => {
  const newOrientation = orit.phoneOrientation()
  if(newOrientation !== orientation && viewerData) { // orientation changed
    // window.innerWidth, innerHeight变更会有延迟
    setTimeout(() => {
      showImgListViewer(viewerData.imgList, viewerData.options, true)
    }, 300)
  }
}

export const hideImgListViewer = (notifyUser = true) => {
  if(notifyUser) {
    viewerData && viewerData.options.onViewerHideListener()
  }
  if(viewerData) {
    scrollThrough(false)
    removeViewerContainer()
  }
}

const handleDefaultPage = () => {
  currPage = viewerData.options.defaultPageIndex
  setTimeout(() => {
    new To(panelDom, "translateX", -currPage * window.innerWidth , 300, ease, () => {
      viewerData.options.onPageChanged(currPage)
    });
  }, 300)
}

const handleImgDoms = () => {
  let docfrag = document.createDocumentFragment()
  const { imgList } = viewerData 
  const lastIndex = imgList.length - 1
  const { limit } = viewerData.options
  viewerData.imgList.forEach((imgUrl, index) => {
    if(currPage === 0) {
      if(index < limit) {
        docfrag.appendChild(appendSingleViewer(imgUrl, index))
      } else {
        docfrag.appendChild(createImgPl())
      }
    } else if(currPage === lastIndex) {
      if(index > lastIndex - limit) {
        docfrag.appendChild(appendSingleViewer(imgUrl, index))
      } else {
        docfrag.appendChild(createImgPl())
      }
    } else {
      if(index === currPage - 1 || index === currPage || index === currPage + 1) {
        docfrag.appendChild(appendSingleViewer(imgUrl, index))
      } else {
        docfrag.appendChild(createImgPl())
      }
    }
  })
  panelDom.appendChild(docfrag)
}

const replaceImgDom = () => {
  const { imgList } = viewerData 
  const lastIndex = imgList.length - 1
  if(currPage === 0 || currPage === lastIndex) return
  const imgContainerDoms = panelDom.childNodes
  const prevIndex = currPage-1
  const nextIndex = currPage+1
  const prevNode = imgContainerDoms[prevIndex]
  if(!prevNode.hasAttribute('class')) {
    prevNode.replaceWith(appendSingleViewer(imgList[prevIndex], prevIndex))
  }
  const nextNode = imgContainerDoms[nextIndex]
  if(!nextNode.hasAttribute('class')) {
    nextNode.replaceWith(appendSingleViewer(imgList[nextIndex], nextIndex))
  }
}

const createImgPl = () => {
  const pl = document.createElement('div')
  pl.style.width = window.innerWidth+'px'
  return pl
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

const genImgId = index => `${VIEWER_SINGLE_IMAGE_ID}_${index}` 

const scrollToPage = (dom, targetPage, prevPage) => {
  // page changed, so we reset current page's translateX、scaleX、scaleY
  if(targetPage !== prevPage) {
    viewerData.options.onPageChanged(targetPage)
    if(dom.translateX !== 0)  new To(dom, "translateX", 0 , 300, ease);
    if(dom.translateY !== 0) new To(dom, "translateY", 0, 300, ease);
    if(dom.scaleX > 1) new To(dom, "scaleX", 1 , 300, ease);
    if(dom.scaleY > 1) new To(dom, "scaleY", 1 , 300, ease);
  }
  panelToX(targetPage, replaceImgDom)
}

const resetImgDom = (imgDom, w, h) => {
  let imgWidth = 0
  if(w > window.innerWidth) {
    imgWidth = window.innerWidth
  } else {
    imgWidth = w
  }
  imgDom.style.width = imgWidth + 'px'
  imgDom.style.height = 'auto'
}

const img_onload = (imgDom, w, h, url) => {
  imgDom.src = url
  resetImgDom(imgDom, w, h)
}

const img_onerror = (imgContainerDom, imgDom, loadingDom, error) => {
  if(error) {
    const {
      altImg
    } = viewerData.options
    if(altImg) {
      const successListener = function(w, h) {
        img_onload(imgDom, w, h, altImg)
      }
      const errorListener = function() {
        imgContainerDom.removeChild(loadingDom)
      }
      imageLoaded.call(null, altImg, successListener, errorListener)
      imgDom.src = altImg
    } else {
      imgContainerDom.removeChild(loadingDom)
    }
  } else {
    imgContainerDom.removeChild(loadingDom)
  }
}

const appendSingleViewer = (imgUrl, index) => {
  const imgContainerDom = document.createElement('div')
  imgContainerDom.setAttribute('class', VIEWER_SINGLE_IMAGE_CONTAINER)
  imgContainerDom.style.width = window.innerWidth + 'px'

  const loadingDom = document.createElement('div')
  loadingDom.setAttribute('class', 'pobi_mobile_viewer_loading')
  imgContainerDom.appendChild(loadingDom)

  const imgDom = document.createElement('img')
  imgDom.setAttribute('id', genImgId(index))
  imgDom.setAttribute('src', IMG_EMPTY)
  imgDom.style.width = window.innerWidth+'px'
  imgDom.style.height = window.innerWidth+'px'
  imgContainerDom.appendChild(imgDom)

  const { 
    pageDampingFactor,
    imgMoveFactor,
    pageThreshold,
    imgMinScale,
    imgMaxScale
  } = viewerData.options
  const pageCount = viewerData.imgList.length
  imageLoaded.call(null, imgUrl, function(w, h) {
    img_onload(imgDom, w, h, imgUrl)
  }, function(error) {
    img_onerror(imgContainerDom, imgDom, loadingDom, error)
  })
  const alloyFinger = imgAlloyFinger(imgDom, {
    swipeListener: evt => {
      const { translateX } = panelDom
      const scrollFactor = Math.abs(translateX) / window.innerWidth
      const page = Math.floor(scrollFactor)
      const factor = scrollFactor - page
      const fixedCurrPage = currPage
      if(evt.direction === 'Left' 
        && evt.isTrusted 
        && currPage < pageCount - 1
        && (page >= currPage && factor >= pageThreshold)) {
        currPage += 1
        scrollToPage(imgDom, currPage, fixedCurrPage)
      } else if(evt.direction === 'Right' 
        && evt.isTrusted 
        && currPage > 0
        && (page < currPage && factor <= (1-pageThreshold))) {
        currPage -= 1
        scrollToPage(imgDom, currPage, fixedCurrPage)
      } else {
        scrollToPage(imgDom, currPage, fixedCurrPage)
      }
    },
    pressMoveListener: evt => {
      const currPageTranslateStart = currPage * window.innerWidth
      const { scaleX, width, translateX } = imgDom
      const { deltaX, deltaY } = evt
      const panelTranslateX = pageDampingFactor * deltaX + panelDom.translateX
      const realWidth = scaleX * width
      const scaledWidth = Math.abs(realWidth - width) / 2
      const imgTranslateX = translateX + deltaX * imgMoveFactor
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
        imgDom.translateY += deltaY * imgMoveFactor
      }
    },
    touchEndListener: () => {
      const { translateX } = panelDom
      const scrollFactor = Math.abs(translateX) / window.innerWidth
      const page = Math.floor(scrollFactor)
      const factor = scrollFactor - page
      const fixedCurrPage = currPage
      let newPage = currPage
      if(page < currPage) { // to prev page
        if(factor <= (1-pageThreshold)) {
          newPage -= 1 
        }
      } else { // to next page
        if(factor >= pageThreshold) {
          if(currPage+1 !== pageCount && translateX < 0) {
            newPage += 1
          }
        }
      }
      if(newPage === fixedCurrPage) {
        scrollToPage(imgDom, fixedCurrPage, fixedCurrPage)
      }
    },
    singleTapListener: () => {
      hideImgListViewer()
    },
    rotationAble: false,
    imgMinScale,
    imgMaxScale,
  })
  alloyFinger.imgDom = imgDom
  alloyFinger.loadingDom = loadingDom
  alloyFinger.imgContainerDom = imgContainerDom
  alloyFingerList.push(alloyFinger)
  return imgContainerDom
}

const panelToX = (page, onEnd) => {
  new To(panelDom, "translateX", -page*window.innerWidth , 500, ease, onEnd);
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
    panelDom.style.width = (window.innerWidth*viewerData.imgList.length) + 'px'
    panelDom.style.height = window.innerHeight + 'px'
    containerDom.appendChild(panelDom)
    Transform(panelDom)
    const proxyFinger = () => {
      const imgAF = alloyFingerList[currPage]
      if(imgAF && imgAF.imgDom.scaleX === viewerData.options.imgMinScale
        && imgAF.imgDom.translateX === 0) {
        return imgAF
      } else {
        return null
      }
    }
    let disableSingleTab = false
    pannelAlloyFinger = new AlloyFinger(panelDom, {
      swipe: function(evt) {
        const imgAF = proxyFinger()
        if(imgAF) {
          disableSingleTab = true
          imgAF && imgAF.swipeListener(evt)
        }
      },
      pressMove: function(evt) {
        const imgAF = proxyFinger()
        if(imgAF) {
          disableSingleTab = true
          imgAF && imgAF.pressMoveListener(evt)
          evt.preventDefault()
          evt.stopPropagation()
        }
      },
      touchEnd: function(evt) {
        const imgAF = proxyFinger()
        if(imgAF) {
          imgAF.touchEndListener(evt)
          evt.preventDefault()
          evt.stopPropagation()
          setTimeout(() => {
            disableSingleTab = false
          }, 500)
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

const viewerContainerClickListener = e => {
  e.stopPropagation()
  hideImgListViewer()
}

const removeViewerContainer = () => {
  containerDom && containerDom.removeEventListener('click', viewerContainerClickListener)
  containerDom && document.body.removeChild(containerDom)
  orit.removeOrientationChangeListener(userOrientationListener)
  orientation = orit.PORTRAIT
  containerDom = null
  panelDom = null
  currPage = 0
  viewerData = null
  alloyFingerList.forEach(alloyFinger => {
    alloyFinger.destroy()
    alloyFinger.imgDom = null
    alloyFinger.loadingDom = null
    alloyFinger.imgContainerDom = null
    alloyFinger.pressMoveListener = null
    alloyFinger.touchEndListener = null
    alloyFinger.swipeListener = null
    alloyFinger = null
  })
  alloyFingerList = []
  pannelAlloyFinger && pannelAlloyFinger.destroy()
  pannelAlloyFinger = null
}