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
viewer.showViewer(imgUrl)
// hide image viewer
viewer.hideImgViewer()
```
Show image list viewer
```js
import viewer from 'h5-imageviewer'
viewer.showImgListViewer(imgList)
// hide image list viewer
viewer.hideImgListViewer()
```

Please check [EXAMPLE](https://github.com/TUBB/h5-imageviewer/blob/master/src/example/example.js) for detail.

# Apis

### Show single image viewer(`viewer.showViewer(imgUrl, options)`)
| Property         |  Type   | Default | Required | Description                                                               |
| :--------------- | :-----: | :-----: | :------: | :------------------------------------------------------------------------ |
| imgUrl | string | | yes | image url list (base64 also supported) |
| options.altImg | string | | no | placeholder when image onerror |
| options.onViewerHideListener | function() | | no | listener for viewer hide |
| options.restDoms | array | | no |  | the attach dom array |
| options.imgMoveFactor | number | 1.5 | no | movement speed (imgMoveFactor * translateX or translateY) |
| options.imgMinScale | number | 1 | no | minimum scale of the image |
| options.imgMaxScale | number | 2 | no | maximum scale of the image |
| options.zIndex | number | 999 | no | the viewer `z-index` |
| options.viewerBg | string | #000000 | no | the viewer `background` |

### Show image list viewer(`viewer.showImgListViewer(imgList, options)`)
| Property         |  Type   | Default | Required | Description                                                               |
| :--------------- | :-----: | :-----: | :------: | :------------------------------------------------------------------------ |
| imgList | array | | yes | image url (base64 also support) |
| options.altImg | string | | no | placeholder when image onerror |
| options.onViewerHideListener | function() | | no | listener for viewer hide |
| options.restDoms | array | | no |  | the attach dom array |
| options.imgMoveFactor | number | 1.5 | no | movement speed (imgMoveFactor * translateX or translateY) |
| options.imgMinScale | number | 1 | no | minimum scale of the image |
| options.imgMaxScale | number | 2 | no | maximum scale of the image |
| options.zIndex | number | 999 | no | the viewer `z-index` |
| options.viewerBg | string | #000000 | no | the viewer `background` |
| options.onPageChanged | function(pageIndex) | | no | the page changed listener |
| options.limit | number | 11 | no | how many pages will be kept offscreen in an idle state |
| options.pageThreshold | number | 0.1 | no | threshold of go to next or prev page (window.innerWidth * pageThreshold) |
| options.pageDampingFactor | number | 0.9 | no | damping factor |

# Dependencies
* [AlloyFinger](https://github.com/AlloyTeam/AlloyFinger)

# License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
