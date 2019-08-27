# H5 image viewer
Image slider for mobile platform, supported React/Vue/AngularJS.

# Features
* Rotate、pinch、move、swipe and double tap scale the image.
* Page turning.
* Supported landscape and portrait screen.
* Supported React/Vue/AngularJS.
* Scroll through long figure.

# Demo
![QRCODE](https://i.loli.net/2019/07/28/5d3cfc6643ec611808.png)  
[Image slider video](http://tubb.github.io/h5-imageviewer/1564587977275048.mp4)  
[Portrait screen video](http://tubb.github.io/h5-imageviewer/1564584324582171.mp4)  
[Landscape screen video](http://tubb.github.io/h5-imageviewer/1564587116005125.mp4)  

# Install

You can install it via npm:

```html
npm i h5-imageviewer
```

# Usage
Show single image viewer
```js
import viewer from 'h5-imageviewer'
viewer.showViewer(imgObj, options)
// hide image viewer
viewer.hideImgViewer()
```
Show image list viewer
```js
import viewer from 'h5-imageviewer'
viewer.showImgListViewer(imgObjList, options)
// hide image list viewer
viewer.hideImgListViewer()
```

Please check [EXAMPLE](https://github.com/TUBB/h5-imageviewer/blob/master/src/example/example.js) for detail.

# Apis

### Show single image viewer(`viewer.showViewer(imgObj, options)`)
| Property         |  Type   | Default | Required | Description                                                               |
| :--------------- | :-----: | :-----: | :------: | :------------------------------------------------------------------------ |
| imgObj.src | string | | yes | img src attr (base64 also supported) |
| imgObj.alt | string | | no | img alt attr |
| options.errorPlh | string | | no | placeholder when image onerror |
| options.onViewerHideListener | function() | | no | listener for viewer hide |
| options.restDoms | array | | no |  | the attach dom array |
| options.imgMoveFactor | number | 1.5 | no | movement speed (imgMoveFactor * translateX or translateY) |
| options.imgMinScale | number | 1 | no | minimum scale of the image |
| options.imgMaxScale | number | 2 | no | maximum scale of the image |
| options.zIndex | number | 999 | no | the viewer `z-index` |
| options.viewerBg | string | `#000000` | no | the viewer `background` |

### Show image list viewer(`viewer.showImgListViewer(imgObjList, options)`)
| Property         |  Type   | Default | Required | Description                                                               |
| :--------------- | :-----: | :-----: | :------: | :------------------------------------------------------------------------ |
| imgObj.src | string | | yes | img src attr (base64 also supported) |
| imgObj.alt | string | | no | img alt attr |
| options.errorPlh | string | | no | placeholder when image onerror |
| options.onViewerHideListener | function() | | no | listener for viewer hide |
| options.restDoms | array | | no |  | the attach dom array |
| options.imgMoveFactor | number | 1.5 | no | movement speed (imgMoveFactor * translateX or translateY) |
| options.imgMinScale | number | 1 | no | minimum scale of the image |
| options.imgMaxScale | number | 2 | no | maximum scale of the image |
| options.zIndex | number | 999 | no | the viewer `z-index` |
| options.viewerBg | string | `#000000` | no | the viewer `background` |
| options.onPageChanged | function(pageIndex) | | no | the page changed listener |
| options.limit | number | 5 | no | how many pages will be kept offscreen in an idle state |
| options.pageThreshold | number | 0.1 | no | threshold of go to next or prev page (window.innerWidth * pageThreshold) |
| options.pageDampingFactor | number | 0.9 | no | damping factor |

# Dependencies
* [AlloyFinger](https://github.com/AlloyTeam/AlloyFinger)

# License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
