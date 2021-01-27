import processCSV from './processCSV.js'
import { join, basename } from 'path'



const processCSVArray = async (csvPaths, indexes) => {
  let concatIndexData = {}
  let recordCount = {}
  for (const index in indexes) {
    if (indexes.hasOwnProperty(index)) {
      concatIndexData[index] = []
      recordCount[index] = 0
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
          recordCount[index] = concatIndexData[index].length
        }
      }
    } catch (error) {
      console.log(error)
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