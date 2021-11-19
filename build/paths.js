const path = require('path')

const srcPath = path.join(__dirname, '..', 'src')
const publicPath = path.join(__dirname, '..', 'public')
const distPath = path.join(__dirname, '..', 'dist')
const previewPath = path.join(__dirname, '..', 'preview')

module.exports = {
    srcPath,
    publicPath,
    distPath,
    previewPath,
}