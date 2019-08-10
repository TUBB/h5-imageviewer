# H5 image viewer
H5 image viewer for mobile platform, support React/Vue/AngularJS.

# Features
* Rotate、pinch、move、swipe and double tap scale the image.
* Page turning.
* Support landscape and portrait screen.
* Support all web frameworks.
* Scroll through long figure.

# Demo
![QRCODE](https://i.loli.net/2019/07/28/5d3cfc6643ec611808.png)  
[Portrait screen video](http://tubb.github.io/h5-imageviewer/1564584324582171.mp4)  
[Landscape screen video](http://tubb.github.io/h5-imageviewer/1564587116005125.mp4)  
[Image viwer video](http://tubb.github.io/h5-imageviewer/1564587977275048.mp4)

# Install

You can install it via npm:

```html
npm install h5-imageviewer
```

# Usage
Show single image viewer
```js
import viewer from 'h5-imageviewer'
viewer.showViewer(
  imgUrl, // image url (base64 also support)
  {
    altImg, // placeholder when image onerror
    onViewerHideListener = ()=>{}, // listener for viewer hide
    restDoms = [], // config some addition dom elements
    imgMoveFactor = 2, // movement speed (imgMoveFactor * translateX or translateY)
    imgMinScale = 1, // minimum scale of the image
    imgMaxScale = 2, // maximum scale of the image
  }
)
// hide image viewer
viewer.hideImgViewer()
```
Show image list viewer
```js
import viewer from 'h5-imageviewer'
viewer.showImgListViewer(
  imgList, // image url list (base64 also supported)
  {
    defaultPageIndex = 0, // the default page index (start with 0)
    altImg,
    onPageChanged = pageIndex=>{}, // page changed listener
    onViewerHideListener = ()=>{},
    restDoms = [],
    pageThreshold = 0.1, // threshold of go to next or prev page (window.innerWidth * pageThreshold)
    pageDampingFactor = 0.9, // damping factor
    imgMoveFactor = 2,
    imgMinScale = 1,
    imgMaxScale = 2,
    limit = 11, // how many pages will be kept offscreen in an idle state
  }
)
// hide image list viewer
viewer.hideImgListViewer()
```

Please check [EXAMPLE](https://github.com/TUBB/h5-imageviewer/blob/master/src/example/example.js) for detail.

# Dependencies
* [AlloyFinger](https://github.com/AlloyTeam/AlloyFinger)

# License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
