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
declare const viewer: {
  showViewer(imgObj: ImgObj, options?: Options): void
  hideViewer(notifyUser?: boolean): void
  showImgListViewer(imgObjList: Array<ImgObj>, options?: ImgListOptions): void
  hideImgListViewer(notifyUser?: boolean): void
  setCurrentPage(pageIndex: number): void
}
export default viewer