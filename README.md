# H5 image viewer
[![Build Status](https://travis-ci.org/TUBB/h5-imageviewer.svg?branch=master)](https://travis-ci.org/TUBB/h5-imageviewer)
[![Coverage Status](https://coveralls.io/repos/github/TUBB/h5-imageviewer/badge.svg)](https://coveralls.io/github/TUBB/h5-imageviewer)
[![node](https://img.shields.io/badge/node->%3D10.3.0-brightgreen)](https://www.npmjs.com/package/h5-imageviewer) 
[![npm](https://img.shields.io/badge/npm-v6.1.0-orange)](https://www.npmjs.com/package/h5-imageviewer)
[![Maintainability](https://codeclimate.com/github/TUBB/h5-imageviewer/badges/gpa.svg)](https://codeclimate.com/github/TUBB/h5-imageviewer)

> Image viewer for mobile browser, supported React/Vue/AngularJS.

# Features
* Supported rotate、pinch、move、swipe、scale and double tap gestures.
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

Or get it from CDN:

[https://unpkg.com/h5-imageviewer@0.7.7/umd/h5-imageviewer.js](https://unpkg.com/h5-imageviewer@0.7.7/umd/h5-imageviewer.js)

# Usage
Show single image viewer
```js
import * as viewer from 'h5-imageviewer'
viewer.showViewer(imgObj, options)
// hide image viewer
viewer.hideImgViewer()
```
Show image list viewer
```js
import * as viewer from 'h5-imageviewer'
viewer.showImgListViewer(imgObjList, options)
// hide image list viewer
viewer.hideImgListViewer()
```

Please check [EXAMPLE1](https://github.com/TUBB/h5-imageviewer/blob/master/src/example/example.js) or [EXAMPLE2](https://github.com/TUBB/h5-imageviewer/tree/master/public/cdn-test.html) for detail.

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
| options.clickClosable | boolean | `true` | no | hide the viewer if click |

### Show image list viewer(`viewer.showImgListViewer(imgObjList, options)`)
| Property         |  Type   | Default | Required | Description                                                               |
| :--------------- | :-----: | :-----: | :------: | :------------------------------------------------------------------------ |
| imgObj.src | string | | yes | img src attr (base64 also supported) |
| imgObj.alt | string | | no | img alt attr |
| options.defaultPageIndex | number | 0 | no | default page index |
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
| options.clickClosable | boolean | `true` | no | hide the viewer if click |

# Dependencies
* [AlloyFinger](https://github.com/AlloyTeam/AlloyFinger)

# License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
