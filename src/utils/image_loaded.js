export default function imageLoaded(imgDom, onload) {
    var img = new Image();
    img.onload = function() {
        // real_width, real_height
        onload.call(imgDom, this.width, this.height);
        img.onload = null;
        img=null;
    };
    img.src = imgDom.getAttribute("src");
}