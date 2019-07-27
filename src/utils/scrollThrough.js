function getScrollTop() {
  return document.body.scrollTop || document.documentElement.scrollTop;
}
// 解决弹层滚动穿透问题（打开弹层传true，弹层关闭传false）
const toggleForbidScrollThrough = (function toggleForbidScrollThrough() {
  let scrollTop;
  return function toggleForbidScrollThroughInner(isForbide) {
      if (isForbide) {
          scrollTop = getScrollTop();
          // position fixed会使滚动位置丢失，所以利用top定位
          document.body.style.position = 'fixed';
          document.body.style.top = `-${scrollTop}px`;
      } else {
          // 恢复时，需要还原之前的滚动位置
          document.body.style.position = 'static';
          document.body.style.top = '0px';
          window.scrollTo(0, scrollTop);
      }
  };
}());

export default toggleForbidScrollThrough
