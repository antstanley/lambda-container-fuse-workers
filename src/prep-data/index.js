import processCSV from './processCSV.js'
import processCSVArray from './processCSVArray.js'
import chunkFiles from './chunkFiles.js'
import { join, dirname, basename } from 'path'

const prep = async options => {
  if (options.inputFile) {
    if (options.searchFile) {
      if (options.indexes) {
        console.time('Process CSV')
        const prepData = Array.isArray(options.inputFile) ? await processCSVArray(options.inputFile, options.indexes) : await processCSV(
          join(process.cwd(), options.inputFile),
          options.indexes
        )
        console.timeEnd('Process CSV')

        if (prepData) {
          for (const index in options.indexes) {
            if (options.indexes.hasOwnProperty(index)) {
              console.log(`Records processed for index ${index}: ${prepData[index].length}`)
            }
          }
          if (options.chunks) {
            for (const index in prepData) {
              if (prepData.hasOwnProperty(index)) {
                const { dir, namePrefix } = options.searchFile
                console.log(`Processing index: ${index}`)
                const chunkDest = join(process.cwd(), dir, `${namePrefix}-${index}`)
                const chunkSort = chunkFiles(
                  chunkDest,
                  prepData[index],
                  options.chunks,
                  prepData[index].length
                )
                if (chunkSort) {
                  console.log(`${index} - Chunks created: ${chunkSort.chunks}`)
                  console.log(`${index} - Chunk Size: ${chunkSort.chunkSize}`)
                  console.log(
                    `${index} - Total records chunked: ${chunkSort.counter}`
                  )
                }
              }
            }
          }
        }
      } else {
        console.log('Search Indexes not specified')
      }
    } else {
      console.log('No output file specified')
    }
  } else {
    console.log('No input file specified')
  }
}

const prepOptions = {
  //  inputFile: ["./data/ct.csv", "./data/ma.csv", "./data/me.csv", "./data/nh.csv", "./data/nj.csv", "./data/ny.csv", "./data/pa.csv", "./data/ri.csv", "./data/vt.csv"],
  inputFile: "./data/test.csv",
  searchFile: {
    dir: "./src/lambda-fuse/data/",
    namePrefix: "ne-address"
  },
  chunks: 6,
  results: 20,
  searchOptions: {
    threshold: 0.5,
    maxPatternLength: 64,
    keys: ["address"]
  },
  indexes: {
    addressIdx: {
      compoundKeys: ["NUMBER", "STREET", "UNIT", "CITY", "source", "POSTCODE"],
      keys: ["addressIdx", "NUMBER", "STREET", "UNIT", "CITY", "source", "POSTCODE"],
      fields: {
        id: "HASH",
        number: "NUMBER",
        street: "STREET",
        unit: "UNIT",
        city: "CITY",
        state: "source",
        zipcode: "POSTCODE",
        lon: "LON",
        lat: "LAT"
      }
    }
  }
}

prep(prepOptions)
