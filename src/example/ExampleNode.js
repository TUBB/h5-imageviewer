import React from 'react'
import './example.less'
import * as viewer from '../index'
// import * as viewer from 'h5-imageviewer'
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
  }

  onShowImgsClickWithDoms () {
    const el = document.createElement('img')
    el.src = img_close
    el.alt = 'image'
    el.className = 'btnClose'
    const indicator = document.createElement('div')
    indicator.className = 'indicator'
    const imgs = [
      {src: 'https://ss1.baidu.com/-4o3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/78310a55b319ebc4cbd4c3e68226cffc1e171624.jpg'},
      {src: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.yxbao.com%2Fpic%2F201304%2F27%2F1367051246_775420415_2c.jpg&refer=http%3A%2F%2Fimg.yxbao.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1630825813&t=6071ac7ff2a42786d351d2c3cb3fa9f5'},
      {src: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi1.3conline.com%2Fimages%2Fpiclib%2F201112%2F04%2Fbatch%2F1%2F119563%2F1322963981983hakv2357a0_medium.jpg&refer=http%3A%2F%2Fi1.3conline.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1631761900&t=bd96a7e6003f7bc726f36e85a8f7facd'},
      {src: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201509%2F16%2F20150916220509_UsBKS.thumb.700_0.png&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1631761900&t=2924cb60f4d52b59b38096969d50ba05'},
      {src: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimage.biaobaiju.com%2Fuploads%2F20180802%2F00%2F1533141344-JZwHgMeNtC.jpg&refer=http%3A%2F%2Fimage.biaobaiju.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1631761900&t=28f89aa6d435b5064787e336d8b96241'}
    ]
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
    viewer.showImgListViewer(
      imgs,
      {
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
        clickClosable: false,
        limit: 3
      }
    )
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
