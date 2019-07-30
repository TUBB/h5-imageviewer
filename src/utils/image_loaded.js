export default function imageLoaded(imgUrl, onload, onFinish) {
    var img = new Image();
    img.onload = function() {
        // real_width, real_height
        onload && onload.call(null, this.width, this.height);
        onload = null
        onFinish && onFinish.call(null)
        onFinish = null
        img.onload = null;
    };
    img.onerror = function() {
        onFinish && onFinish.call(null, true)
        onFinish = null
        img.onerror = null
    }
    img.src = imgUrl;
}