export default function imageLoaded(imgDom, onload, onFinish) {
    var img = new Image();
    img.onload = function() {
        // real_width, real_height
        onload.call(imgDom, this.width, this.height);
        img.onload = null;
        img=null;
        onFinish()
    };
    const src = imgDom.getAttribute("src")
    img.onerror = function() {
        onFinish(new Error(`Load image src [${src}] onerror`))
    }
    img.src = src;
}