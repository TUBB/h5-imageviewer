interface ImgObj {
  src: string
  alt?: string
}
interface Options {
  errorPlh?: string
  onViewerHideListener?(): void
  restDoms?: Array<HTMLElement>
  imgMoveFactor?: number
  imgMinScale?: number
  imgMaxScale?: number
  zIndex?: number,
  viewerBg?: string,
  clickClosable?: boolean
}
interface ImgListOptions extends Options {
  defaultPageIndex?: number
  onPageChanged?(pageIndex: number): void
  pageThreshold?: number
  pageDampingFactor?: number
  limit?: number
}
interface ShowViewerFunc {
  (imgObj: ImgObj, options?: Options): void
}
interface HideViewerFunc {
  (notifyUser?: boolean): void
}
interface ShowImgListViewerFunc {
  (imgObjList: Array<ImgObj>, options?: ImgListOptions): void
}
interface HideImgListViewerFunc {
  (notifyUser?: boolean): void
}
interface SetCurrentPageFunc {
  (pageIndex: number): void
}
declare const viewer: {
  showViewer: ShowViewerFunc
  hideViewer: HideViewerFunc
  showImgListViewer: ShowImgListViewerFunc
  hideImgListViewer: HideImgListViewerFunc
  setCurrentPage: SetCurrentPageFunc
}
export default viewer
export const showViewer: ShowViewerFunc
export const hideViewer: HideViewerFunc
export const showImgListViewer: ShowImgListViewerFunc
export const hideImgListViewer: HideImgListViewerFunc
export const setCurrentPage: SetCurrentPageFunc