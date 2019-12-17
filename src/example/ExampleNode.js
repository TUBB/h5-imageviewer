import React from 'react'
import './example.less'
import * as viewer from '../index'
import img_cover from '../assets/cover.jpg'
import img_close from '../assets/close.png'
import img_timg from '../assets/timg.jpg'
import img_uof from '../assets/uof.jpg'
import errorPlh from '../assets/img_loading_error.png'

export default class ExampleNode extends React.Component {
  onShowImgsClick () {
    const imgs = [img_uof, img_cover, 9, img_uof, img_cover, img_timg, img_uof].map((url, index) => {
      return { src: url, alt: index }
    })
    viewer.showImgListViewer(imgs, {
      onPageChanged: pageIndex => {
        console.log('onPageChanged', pageIndex)
      },
      onViewerHideListener: () => {
        console.log('image list viewer hide')
      },
      errorPlh,
      defaultPageIndex: 1,
      limit: 3
    })
    setTimeout(() => {
      // go to the page
      viewer.setCurrentPage(0)
    }, 5000)
  }

  onShowImgsClickWithDoms () {
    const el = document.createElement('img')
    el.src = img_close
    el.alt = '地方'
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
      e.preventDefault()
      viewer.hideImgListViewer()
    })
    viewer.showImgListViewer([{ src: img_cover }, { src: img_uof }, { src: img_timg }], {
      defaultPageIndex: 1,
      onPageChanged: pageIndex => {
        dotDoms.forEach((dotDom, index) => {
          if (pageIndex === index) {
            dotDom.className = 'dot dotSel'
          } else {
            dotDom.className = 'dot'
          }
        })
      },
      restDoms: [el, indicator],
      viewerBg: '#333333',
      clickClosable: false
    })
  }

  onShowImgsXXXXL () {
    const imgs = []
    for (let index = 0; index < 999; index++) {
      imgs.push(index % 2 === 0 ? { src: img_cover } : { src: img_timg })
    }
    viewer.showImgListViewer(imgs, {
      defaultPageIndex: 0,
      limit: 3
    })
  }

  onShowClick () {
    viewer.showViewer(
      {
        src: img_cover,
        alt: 'beauty door'
      },
      {
        onViewerHideListener: () => {
          console.log('image viewer hide')
        },
        errorPlh,
        zIndex: 666,
        viewerBg: '#000000'
      }
    )
  }

  onShowClickWithDoms () {
    const el = document.createElement('img')
    el.src = img_close
    el.className = 'btnClose'
    el.addEventListener('click', e => {
      viewer.hideViewer()
    })
    viewer.showViewer(
      {
        src: img_uof
      },
      {
        restDoms: [el],
        clickClosable: false
      }
    )
  }

  render () {
    return (
      <div className='example'>
        <button className='btnShow' data-testid='btnShowImage' onClick={this.onShowClick}>Show image</button>
        <button className='btnShow2' data-testid='btnShowImageWithDoms' onClick={this.onShowClickWithDoms}>Show image with addition doms</button>
        <button className='btnShow2' data-testid='btnShowImageList' onClick={this.onShowImgsClick}>Show images</button>
        <button className='btnShow2' data-testid='btnShowImageListWithDoms' onClick={this.onShowImgsClickWithDoms}>Show images with addition doms</button>
        <button className='btnShow2' data-testid='btnShowImageListWithBig' onClick={this.onShowImgsXXXXL}>Show images(a great number of images)</button>
        <button style={{display: 'none'}} className='btnShow2' data-testid='btnHideImage' onClick={viewer.hideViewer}>Hide image viewer</button>
        <button style={{display: 'none'}} data-testid='btnHideImageList' onClick={viewer.hideImgListViewer}>Hide image list viewer</button>
      </div>
    )
  }
}
