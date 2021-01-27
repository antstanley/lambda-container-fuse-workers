const workerThreads = require('worker_threads')

const { Worker } = workerThreads

const handleWorkers = (
  cleanSearch,
  searchData,
  options,
  chunks,
  index,
  workerScript
) => {
  return new Promise((resolve, reject) => {
    let resultArray = []
    let workerCounter = 0
    const errors = {
      count: 0,
      messages: []
    }
    for (let i = 0; i < chunks; i++) {
      const workerData = {
        cleanSearch,
        searchData: searchData[i][index],
        options
      }
      const worker = new Worker(workerScript, { workerData })

      worker.on('message', sortedArray => {
        resultArray.push(sortedArray)
      })
      worker.on('error', error => {
        errors.count++
        errors.messages.push(error)
        console.error(`error in chunk ${1}`, error)
        if (errors.count == chunks) reject(errors)
      })
      worker.on('exit', () => {
        workerCounter++
        if (workerCounter === chunks) {
          if (resultArray.length === chunks) {
            const searchResults = resultArray
              .reduce((newArray, workerArray) => {
                return newArray.concat(workerArray)
              })
              .map(responseItem => {
                const { item, score } = responseItem
                const { ...fields } = item
                return { ...fields, score }
              })
              .sort((a, b) => {
                if (a.score == b.score) {
                  const aKeys = Object.keys(a)
                  const bKeys = Object.keys(b)

                  if (a[aKeys[0]] > b[bKeys[0]]) {
                    return 1
                  } else {
                    return -1
                  }
                } else {
                  if (a.score > b.score) {
                    return 1
                  } else {
                    return -1
                  }
                }
              })

            resolve(searchResults)
          }
        }
      })
    }
  })
}

module.exports = handleWorkers
