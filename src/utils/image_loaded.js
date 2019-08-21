export default function imageLoaded (imgUrl, onload, onFinish) {
  var img = new Image()
  img.onload = function () {
    // real_width, real_height
    onload && onload(this.width, this.height)
    onload = null
    onFinish && onFinish()
    onFinish = null
    img.onload = null
  }
  img.onerror = function () {
    onFinish && onFinish(true)
    onFinish = null
    img.onerror = null
  }
  img.src = imgUrl
}
