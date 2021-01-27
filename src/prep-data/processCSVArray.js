import processCSV from './processCSV.js'
import { join, basename } from 'path'



const processCSVArray = async (csvPaths, indexes) => {
  // prep target argument to concatenant multiple indexes into one object per index
  let concatIndexData = {}
  for (const index in indexes) {
    if (indexes.hasOwnProperty(index)) {
      concatIndexData[index] = []
    }
  }
  console.log(`concatIndexData: ${JSON.stringify(concatIndexData, ' ', 2)}`)

  for (let i = 0; i > csvPaths.length; i++) {
    const csvPath = csvPaths[i]
    const filename = basename(csvPath)
    const fileExt = filename.indexOf('.')
    const source = filename.substr(0, fileExt)
    try {
      fileIndex = await processCSV(
        join(process.cwd(), csvPath),
        indexes,
        source
      )
      for (const index in indexes) {
        if (indexes.hasOwnProperty(index)) {
          concatIndexData[index] = concatIndexData[index].concat(fileIndex[index])
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // sort the concatenated indexes
  for (const index in indexes) {
    if (indexes.hasOwnProperty(index)) {
      concatIndexData[index] = sortIndex(concatIndexData[index], index)
    }
  }
  // await Promise.all(csvPaths.flatMap(async (csvPath) => {
  //   const filename = basename(csvPath)
  //   const fileExt = filename.indexOf('.')
  //   const source = filename.substr(0, fileExt)
  // 
  //   fileIndex = await processCSV(
  //     join(process.cwd(), csvPath),
  //     indexes,
  //     source
  //   )
  //   for (const index in indexes) {
  //     if (indexes.hasOwnProperty(index)) {
  //       concatIndexData[index] = concatIndexData[index].concat(fileIndex[index])
  //     }
  //   }
  // }))

  console.log(`concatIndexData: ${JSON.stringify(concatIndexData, ' ', 2)}`)
  return concatIndexData
}

export default processCSVArray