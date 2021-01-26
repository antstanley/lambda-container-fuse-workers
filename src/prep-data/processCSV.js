import { createReadStream } from 'fs'
import csv from 'csv-parser'

import createIndex from './createIndex.js'
import sortIndex from './sortIndex.js'



const streamCSV = (inputfile) => {
  let csvJson = []
  return new Promise((resolve, reject) => {
    createReadStream(inputfile)
      .pipe(csv())
      .on('data', (data) => csvJson.push(data))
      .on('end', () => {
        resolve(csvJson)
      })
      .on('error', (error) => { reject(error) })
  })
}

const processCSV = async (inputFile, indexes, source) => {
  try {

    const csvJson = await streamCSV(inputFile)
    const indexData = {}
    for (const index in indexes) {
      if (indexes.hasOwnProperty(index)) {
        indexData[index] = []
        for (let i = 0; i < csvJson.length; i++) {
          indexData[index].push(createIndex(index, csvJson[i], indexes[index], source))
        }
        indexData[index] = sortIndex(indexData[index], index)
      }
    }

    console.log(`Rows processed: ${csvJson.length}`)

    return {
      data: indexData,
      records: csvJson.length
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

export default processCSV
