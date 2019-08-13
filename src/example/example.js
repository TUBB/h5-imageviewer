import React from 'react'
import ReactDOM from 'react-dom'
import './example.less'
import viewer from '../index'
import img_cover from '../assets/cover.jpg'
import img_close from '../assets/close.png'
import img_timg from '../assets/timg.jpg'
import img_uof from '../assets/uof.jpg'
import altImg from '../assets/img_loading_error.png'

class Example extends React.Component {

  onShowImgsClick() {
    viewer.showImgListViewer([img_uof, img_cover, 9, img_uof, img_cover, img_timg, img_uof, img_cover, img_timg], { 
      onPageChanged: pageIndex => {
        console.log('onPageChanged', pageIndex)
      },
      onViewerHideListener: () => {
        console.log('image list viewer hide')
      },
      altImg,
      defaultPageIndex: 1,
      limit: 3, 
    })
    setTimeout(() => {
      // go to the page
      viewer.setCurrentPage(0)
    }, 5000)
  } 

  onShowImgsClickWithDoms() {
    const el = document.createElement('img')
    el.src = img_close
    el.className = 'btnClose'

    const indicator = document.createElement('div')
    indicator.className = 'indicator'
    const imgs = [img_cover, img_uof, img_timg]
    const dotDoms = []
    imgs.forEach(() => {
      const dot = document.createElement('div')
      dot.className = 'dot'
      indicator.appendChild(dot)
      dotDoms.push(dot)
    })
    el.addEventListener('click', e => {
      e.stopPropagation()
      viewer.hideImgListViewer()
    })
    viewer.showImgListViewer([img_cover, img_uof, img_timg], {
      defaultPageIndex: 1,
      onPageChanged: pageIndex => {
        console.log(pageIndex)
        dotDoms.forEach((dotDom, index) => {
          if(pageIndex === index) {
            dotDom.className = 'dot dotSel'
          } else {
            dotDom.className = 'dot'
          }
        })
      },
      restDoms: [el, indicator],
      zIndex: 10,
      viewerBg: '#333333'
    })
  }

  onShowClick() {
    viewer.showViewer(img_cover, {
      onViewerHideListener: () => {
        console.log('image viewer hide')
      },
      // alt img
      altImg,
      zIndex: 666,
      viewerBg: '#000000'
    })
  }

  onShowClickWithDoms() {
    const el = document.createElement('img')
    el.src = img_close
    el.className = 'btnClose'
    el.addEventListener('click', e => {
      e.stopPropagation()
      viewer.hideViewer()
    })
    viewer.showViewer(img_uof, {
      restDoms: [el],
    })
  }

  onShowImgsXXXXL() {
    const imgs = []
    for (let index = 0; index < 999; index++) {
      imgs.push(img_cover)
    }
    viewer.showImgListViewer(imgs, {
      defaultPageIndex: 0,
      limit: 3
    })
  }

  render() {
    return (
      <div className='example'>
        <button className='btnShow' onClick={this.onShowClick}>Show image</button>
        <button className='btnShow2' onClick={this.onShowClickWithDoms}>Show image with addition doms</button>
        <button className='btnShow2' onClick={this.onShowImgsClick}>Show images</button>
        <button className='btnShow2' onClick={this.onShowImgsClickWithDoms}>Show images with addition doms</button>
        <button className='btnShow2' onClick={this.onShowImgsXXXXL}>Show images(a great number of images)</button>
      </div>
    )
  }
}

ReactDOM.render(
  <Example />,
  document.getElementById('root')
)