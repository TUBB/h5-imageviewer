# Preview
![PREVIEW](https://github.com/TUBB/h5-imageviewer/blob/master/art/preview.gif)

# Install

You can install it via npm:

```html
npm install h5-imageviewer
```

# Usage

```js
import React from 'react'
import ReactDOM from 'react-dom'
import './example.less'
import { showViewer, hideViwer } from './viewer.js';
// import { showViewer, hideViwer } from 'h5-imageviewer';
import img_cover from './assets/cover.jpg'
import img_close from './assets/close.png'

class Example extends React.Component {

  onShowClick() {
    showViewer(img_cover)
  }

  onShowClick2() {
    const el = document.createElement('img')
    el.src = img_close
    el.className = 'btnClose'
    el.addEventListener('click', e => {
      e.stopPropagation()
      hideViwer()
    })
    showViewer(img_cover, el)
  }

  render() {
    return (
      <div className='example'>
        <button className='btnShow' onClick={this.onShowClick}>Show image</button>
        <button className='btnShow2' onClick={this.onShowClick2}>Show image with close button</button>
      </div>
    )
  }
}

ReactDOM.render(
  <Example />,
  document.getElementById('root')
)
```


# License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
