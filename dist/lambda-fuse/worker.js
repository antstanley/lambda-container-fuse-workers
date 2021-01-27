const Fuse = require('fuse.js')
const { parentPort, workerData, isMainThread } = require('worker_threads')

const fuseSearch = ({ cleanSearch, searchData, options }) => {
  const fuse = new Fuse(searchData, options)
  return fuse.search(cleanSearch)
}

if (!isMainThread) {
  if (workerData) {
    parentPort.postMessage(fuseSearch(workerData))
  }
}
