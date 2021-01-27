const Fuse = require('fuse.js')
const workerThreads = require('worker_threads')

const { parentPort, workerData, isMainThread } = workerThreads

const fuseSearch = ({ cleanSearch, searchData, options }) => {
  const fuse = new Fuse(searchData, options)
  return fuse.search(cleanSearch)
}

if (!isMainThread) {
  if (workerData) {
    parentPort.postMessage(fuseSearch(workerData))
  }
}
