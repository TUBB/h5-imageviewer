export default function imageLoaded(imgUrl, onload, onFinish) {
    var img = new Image();
    img.onload = function() {
        // real_width, real_height
        onload(this.width, this.height);
        img.onload = null;
        img = null;
        onFinish && onFinish()
    };
    img.onerror = function() {
        onFinish && onFinish(new Error(`Load image src [${imgUrl}] onerror`))
        img.onerror = null
    }
    img.src = imgUrl;
}