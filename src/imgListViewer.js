import './main.less'
import imageLoaded from './utils/image_loaded'
import Transform from './utils/transform'
import To from './utils/to'
import ease from './utils/ease'
import imgAlloyFinger, {
  triggerDoubleTab,
  triggerPointEnd,
} from './imgAlloyFinger'
import orit from './utils/orientation'
import scrollThrough from './utils/scrollThrough'
import IMG_EMPTY from './utils/error_plh'

const VIEWER_CONTAINER_ID = 'pobi_mobile_viewer_container_id'
const VIEWER_PANEL_ID = 'pobi_mobile_viewer_panel_id'
const VIEWER_SINGLE_IMAGE_ID = 'pobi_mobile_viewer_single_image_id'
const VIEWER_SINGLE_IMAGE_CONTAINER = 'pobi_mobile_viewer_single_image_container'

let containerDom = null
let panelDom = null
let currPage = 0
let orientation = orit.PORTRAIT
let viewerData = null
let viewerAlloyFinger = null

function noop() {}

export const showImgListViewer = (imgList=[], options, screenRotation=false) => {
  if (!Array.isArray(imgList) || imgList.length <= 0) return
  const cachedCurrPage = currPage
  hideImgListViewer(false)
  scrollThrough(true)
  initParams(imgList, options, screenRotation, cachedCurrPage)
  appendViewerContainer() 
  appendViewerPanel()
  scrollToFixedPage(viewerData.options.defaultPageIndex)
  handleImgDoms()
  handleRestDoms()
  handleOrientationChange()
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

export const setCurrentPage = pageIndex => {
  if(viewerData === null 
    || pageIndex < 0 
    || pageIndex > viewerData.imgList.length - 1) {
    return
  }
  const {imgList, options:{limit}} = viewerData
  const lastIndex = imgList.length - 1
  const updateDom = (page) => {
    const currNode = panelDom.childNodes[page]
    if(currNode && !currNode.hasAttribute('class')) {
      panelDom.replaceChild(appendSingleViewer(imgList[page], page), currNode)
    }
  }
  if(pageIndex === 0) {
    let page = pageIndex
    while(page < limit) {
      updateDom(page)
      page++
    }
  } else if(pageIndex === lastIndex) {
    let page = pageIndex
    const endedIndex = pageIndex - limit
    while(page > endedIndex && page >= 0) {
      updateDom(page)
      page--
    }
  } else {
    const halfCount = Math.floor(limit / 2)
    let firstHalf = pageIndex
    const firstHalfEndedIndex = firstHalf - halfCount
    while(firstHalf >= firstHalfEndedIndex && firstHalf >= 0) {
      updateDom(firstHalf)
      firstHalf--
    }
    let secondHalf = pageIndex
    const secondHalfEndedIndex = secondHalf + halfCount
    while(secondHalf <= secondHalfEndedIndex && secondHalf <= lastIndex) {
      updateDom(secondHalf)
      secondHalf++
    }
  }
  const currImgDom = getCurrImgDom()
  if(currImgDom) {
    const { scaleX, scaleY, translateX, translateY } = currImgDom
    const { imgMinScale } = viewerData.options
    if(scaleX !== imgMinScale || scaleY !== imgMinScale) {
      new To(currImgDom, "scaleX", imgMinScale, 200, ease)
      new To(currImgDom, "scaleY", imgMinScale, 200, ease)
    }
    if(translateX !== 0) {
      new To(currImgDom, "translateX", 0, 200, ease)
    }
    if(translateY !== 0) {
      new To(currImgDom, "translateY", 0, 200, ease)
    }
  }
  scrollToFixedPage(pageIndex)
}

const initParams = (imgList, options, screenRotation, cachedCurrPage) => {
  let wrapOptions = {}
  if(options) wrapOptions = {...options}
  const {
    defaultPageIndex = 0,
    errorPlh,
    onPageChanged = noop,
    onViewerHideListener = noop,
    restDoms = [],
    pageThreshold = 0.1,
    pageDampingFactor = 0.9,
    imgMoveFactor = 1.5,
    imgMinScale = 1,
    imgMaxScale = 2,
    limit = 5,
    zIndex = null,
    viewerBg = null,
  } = wrapOptions
  if(!/^[0-9]+$/.test(limit) || limit < 3 || limit % 2 !== 1) {
    throw Error('limit must be odd number and greater than 3')
  }
  viewerData = { 
    imgList: [...imgList], 
    options: { 
      limit, 
      defaultPageIndex: screenRotation ? cachedCurrPage : defaultPageIndex, 
      errorPlh, 
      onPageChanged, 
      onViewerHideListener, 
      restDoms, 
      pageThreshold, 
      pageDampingFactor, 
      imgMoveFactor, 
      imgMinScale, 
      imgMaxScale,
      zIndex,
      viewerBg 
    } 
  }
  if(viewerData.options.defaultPageIndex < 0 
    || viewerData.options.defaultPageIndex > imgList.length - 1) {
    viewerData.options.defaultPageIndex = 0
  }
}

const registerViewerAlloyFinger = () => {
  const { 
    pageDampingFactor,
    imgMoveFactor,
    pageThreshold,
    imgMinScale,
    imgMaxScale
  } = viewerData.options
  const pageCount = viewerData.imgList.length
  viewerAlloyFinger = imgAlloyFinger(containerDom, {
    swipeListener: evt => {
      const { translateX } = panelDom
      const scrollFactor = Math.abs(translateX) / window.innerWidth
      const page = Math.floor(scrollFactor)
      const factor = scrollFactor - page
      const fixedCurrPage = currPage
      if(evt.direction === 'Left' 
        && currPage < pageCount - 1
        && (page >= currPage && factor >= pageThreshold)) {
        currPage += 1
        scrollToPage(getCurrImgDom(fixedCurrPage), currPage, fixedCurrPage)
      } else if(evt.direction === 'Right' 
        && currPage > 0
        && (page < currPage && factor <= (1-pageThreshold))) {
        currPage -= 1
        scrollToPage(getCurrImgDom(fixedCurrPage), currPage, fixedCurrPage)
      } else {
        scrollToPage(getCurrImgDom(), currPage, fixedCurrPage)
      }
    },
    pressMoveListener: evt => {
      const currPageTranslateStart = currPage * window.innerWidth
      const { scaleX, width, translateX } = getCurrImgDom()
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
                getCurrImgDom().translateX = imgTranslateX
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
                getCurrImgDom().translateX = imgTranslateX
              }
            }
          } else {
            panelDom.translateX = panelTranslateX
          }
        }
      } else {
        getCurrImgDom().translateY += deltaY * imgMoveFactor
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
        scrollToPage(getCurrImgDom(fixedCurrPage), fixedCurrPage, fixedCurrPage)
      }
    },
    singleTapListener: () => {
      hideImgListViewer()
    },
    doubleTapListener: evt => {
      triggerDoubleTab(getCurrImgDom(), evt, imgMinScale, imgMaxScale)
    },
    multipointEndListener: () => {
      triggerPointEnd(getCurrImgDom(), imgMinScale, imgMaxScale)
    },
    multipointStartListener: () => getCurrImgDom().scaleX,
    pinchListener: (evt, initScale) => getCurrImgDom().scaleX = getCurrImgDom().scaleY = initScale * evt.zoom,
  })
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

const scrollToFixedPage = (page) => {
  currPage = page
  setTimeout(() => {
    new To(panelDom, "translateX", -currPage * window.innerWidth , 300, ease, () => {
      viewerData.options.onPageChanged(currPage)
    })
  }, 300)
}

const handleImgDoms = () => {
  let docfrag = document.createDocumentFragment()
  const { imgList } = viewerData 
  const lastIndex = imgList.length - 1
  const { limit } = viewerData.options
  if(limit >= imgList.length) {
    imgList.forEach((imgObj, index) => {
      docfrag.appendChild(appendSingleViewer(imgObj, index))
    })
  } else {
    const plDom = createImgPl()
    imgList.forEach((imgObj, index) => {
      if(currPage === 0) {
        if(index < limit) {
          docfrag.appendChild(appendSingleViewer(imgObj, index))
        } 
        else {
          docfrag.appendChild(plDom.cloneNode())
        }
      } else if(currPage === lastIndex) {
        if(index > lastIndex - limit) {
          docfrag.appendChild(appendSingleViewer(imgObj, index))
        } 
        else {
          docfrag.appendChild(plDom.cloneNode())
        }
      } else {
        const halfCount = Math.floor(limit / 2)
        if(index === currPage || (index >= currPage - halfCount && index <= currPage + halfCount)) {
          docfrag.appendChild(appendSingleViewer(imgObj, index))
        } 
        else {
          docfrag.appendChild(plDom.cloneNode())
        }
      }
    })
  }
  panelDom.appendChild(docfrag)
  docfrag = null
}

const replaceImgDom = (prevPage) => {
  const { imgList, options: { limit } } = viewerData 
  const lastIndex = imgList.length - 1
  if(currPage === 0 
    || currPage === lastIndex 
    || currPage === prevPage
    || limit >= imgList.length) {
    return
  }
  setTimeout(() => {
    const imgContainerDoms = panelDom.childNodes
    const currNode = imgContainerDoms[currPage]
    if(!currNode.hasAttribute('class')) {
      panelDom.replaceChild(appendSingleViewer(imgList[currPage], currPage), currNode)
    }
    const halfCount = Math.floor(limit/2)
    if(currPage > prevPage) { // scrolled to next page
      const nextIndex = currPage + halfCount
      const nextNode = imgContainerDoms[nextIndex]
      if(!nextNode.hasAttribute('class')) {
        panelDom.replaceChild(appendSingleViewer(imgList[nextIndex], nextIndex), nextNode)
      }
      const ppIndex = currPage - halfCount - 1
      if(ppIndex >= 0) {
        const ppNode = imgContainerDoms[ppIndex]
        panelDom.replaceChild(createImgPl(), ppNode)
      }
    } else if(currPage < prevPage) { // scrolled to prev page
      const prevIndex = currPage - halfCount
      const prevNode = imgContainerDoms[prevIndex]
      if(!prevNode.hasAttribute('class')) {
        panelDom.replaceChild(appendSingleViewer(imgList[prevIndex], prevIndex), prevNode)
      }
      const nnIndex = prevPage + halfCount
      if(nnIndex <= lastIndex) {
        const nnNode = imgContainerDoms[nnIndex]
        panelDom.replaceChild(createImgPl(), nnNode)
      }
    }
  }, 0)
}

const createImgPl = () => {
  const pl = document.createElement('div')
  pl.style.width = window.innerWidth+'px'
  pl.style.visibility = 'hidden'
  return pl
}

const handleRestDoms = () => {
  const {restDoms} = viewerData.options
  if(restDoms.length > 0) {
    let docfrag = document.createDocumentFragment()
    restDoms.forEach(additionDom => {
      // element
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
    const { translateX, translateY, scaleX, scaleY } = dom
    if(translateX !== 0)  new To(dom, "translateX", 0 , 300, ease)
    if(translateY !== 0) new To(dom, "translateY", 0, 300, ease)
    if(scaleX > 1) new To(dom, "scaleX", 1 , 300, ease)
    if(scaleY > 1) new To(dom, "scaleY", 1 , 300, ease)
  }
  panelToX(targetPage, prevPage)
}

const panelToX = (targetPage, prevPage) => {
  const toX = -targetPage * window.innerWidth
  if(Math.abs(panelDom.translateX) !== Math.abs(toX)) {
    new To(panelDom, "translateX",  toX, 300, ease, replaceImgDom.bind(this, prevPage))
  }
}

const resetImgDom = (imgDom, w) => {
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
      errorPlh
    } = viewerData.options
    if(errorPlh) {
      const successListener = function(w, h) {
        img_onload(imgDom, w, h, errorPlh)
      }
      const errorListener = function() {
        imgContainerDom.removeChild(loadingDom)
      }
      imageLoaded.call(null, errorPlh, successListener, errorListener)
      imgDom.src = errorPlh
    } else {
      imgContainerDom.removeChild(loadingDom)
    }
  } else {
    imgContainerDom.removeChild(loadingDom)
  }
}

const appendSingleViewer = (imgObj, index) => {
  const imgContainerDom = document.createElement('div')
  imgContainerDom.setAttribute('class', VIEWER_SINGLE_IMAGE_CONTAINER)
  imgContainerDom.style.width = window.innerWidth + 'px'

  const loadingDom = document.createElement('div')
  loadingDom.setAttribute('class', 'pobi_mobile_viewer_loading')
  imgContainerDom.appendChild(loadingDom)

  const imgDom = document.createElement('img')
  imgDom.setAttribute('id', genImgId(index))
  imgDom.setAttribute('src', IMG_EMPTY)
  imgDom.setAttribute('alt', imgObj.alt || '')
  imgDom.style.width = window.innerWidth+'px'
  imgDom.style.height = window.innerWidth+'px'
  imgContainerDom.appendChild(imgDom)

  imageLoaded.call(null, imgObj.src, function(w, h) {
    img_onload(imgDom, w, h, imgObj.src)
  }, function(error) {
    img_onerror(imgContainerDom, imgDom, loadingDom, error)
  })

  Transform(imgDom)
  return imgContainerDom
}

const appendViewerContainer = () => {
  containerDom = document.getElementById(VIEWER_CONTAINER_ID)
  if (!containerDom) {
    containerDom = document.createElement('div')
    containerDom.setAttribute('id', VIEWER_CONTAINER_ID)
    containerDom.style.width = window.innerWidth+'px'
    containerDom.style.height = window.innerHeight+'px'
    const { zIndex, viewerBg } = viewerData.options
    if(zIndex !== null) {
      containerDom.style['z-index'] = zIndex
    }
    if(viewerBg !== null) {
      containerDom.style.background = viewerBg
    }
    containerDom.addEventListener('click', viewerContainerClickListener)
    document.body.appendChild(containerDom)
    registerViewerAlloyFinger()
  }
}

const getCurrImgDom = (page = currPage) => {
  return panelDom.childNodes[page].childNodes[0]
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
  if(viewerAlloyFinger) {
    viewerAlloyFinger.destroy()
    viewerAlloyFinger.pressMoveListener = null
    viewerAlloyFinger = null
  }
}