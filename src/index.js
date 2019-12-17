import * as imgViewer from './imgViewer'
import * as imgListViewer from './imgListViewer'

const viewer = {
  ...imgViewer,
  ...imgListViewer
}

export default viewer
export const showViewer = imgViewer.showViewer
export const hideViewer = imgViewer.hideViewer
export const showImgListViewer = imgListViewer.showImgListViewer
export const hideImgListViewer = imgListViewer.hideImgListViewer
export const setCurrentPage = imgListViewer.setCurrentPage
