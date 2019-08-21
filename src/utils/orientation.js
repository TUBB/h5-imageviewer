const PORTRAIT = 'portrait'
const LANDSCAPE = 'landscape'

const phoneOrientation = () => {
  if (window.orientation === 180 || window.orientation === 0) {
    return PORTRAIT
  } else {
    return LANDSCAPE
  }
}

const addOrientationChangeListener = (listener) => {
  window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', listener)
}

const removeOrientationChangeListener = (listener) => {
  window.removeEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', listener)
}

export default {
  PORTRAIT,
  LANDSCAPE,
  phoneOrientation,
  addOrientationChangeListener,
  removeOrientationChangeListener
}
