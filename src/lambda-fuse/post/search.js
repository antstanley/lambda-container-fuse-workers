const loadData = require('./loadData.js')
const { join } = require('path')
const handleWorkers = require('./handleWorkers.js')

const cleanString = str => {
  return str
    .replace(/\s/g, '')
    .replace(
      /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
      ''
    )
}

let searchData

const search = async (
  { searchFile, searchOptions, chunks, indexes, results = 10 },
  searchTerm
) => {
  const searchResponse = {}
  try {
    if (!searchFile) {
      return 'Search file not specified'
    }

    if (!searchData) {
      searchData = await loadData(searchFile, chunks, indexes)
    }

    let options = {}
    const defaultOptions = {
      shouldSort: true,
      includeScore: true,
      threshold: 0.3,
      location: 0,
      distance: 3,
      maxPatternLength: 32,
      minMatchCharLength: 6
    }

    if (!searchOptions) {
      options = defaultOptions
    } else {
      options = Object.assign({}, defaultOptions, searchOptions)
    }

    const workerScript = join(__dirname, './worker.js')
    const cleanSearch = cleanString(searchTerm)

    for (const index in indexes) {
      if (indexes.hasOwnProperty(index)) {
        options.keys = indexes[index].keys
        const workerResponse = await handleWorkers(
          cleanSearch,
          searchData,
          options,
          chunks,
          index,
          workerScript
        )
        searchResponse[index] = workerResponse.slice(0, results)
      }
    }

  } catch (error) {
    console.log(error)
    searchResponse['error'] = error
  }
  return searchResponse
}

module.exports = search
