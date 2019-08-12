function getScrollTop() {
  return document.body.scrollTop || document.documentElement.scrollTop
}
function getScrollLeft() {
  return document.body.scrollLeft || document.documentElement.scrollLeft
}
const toggleForbidScrollThrough = (function toggleForbidScrollThrough() {
  let scrollTop
  let scrollLeft
  const bodyPosition = document.body.style.position || 'static'
  return function toggleForbidScrollThroughInner(isForbide) {
    if (isForbide) {
      scrollTop = getScrollTop()
      scrollLeft = getScrollLeft()
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollTop}px`
      document.body.style.left = `-${scrollLeft}px`
    } else {
      document.body.style.position = bodyPosition
      document.body.style.top = '0px'
      document.body.style.left = '0px'
      window.scrollTo(scrollLeft, scrollTop)
    }
  }
}())

export default toggleForbidScrollThrough
