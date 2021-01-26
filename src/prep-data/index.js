import processCSV from './processCSV.js'
import chunkFiles from './chunkFiles.js'
import { join, basename } from 'path'

const processCSVArray = async (csvPaths, indexes) => {
  return Promise.all(csvPaths.map(async (csvPath) => {
    const source = basename(csvPath)
    return processCSV(
      join(process.cwd(), csvPath),
      indexes,
      source
    )
  }))
}

const prep = async options => {
  if (options.inputFile) {
    if (options.searchFile) {
      if (options.indexes) {
        console.time('Process CSV')
        const prepData = Array.isArray(options.inputFile) ? await processCSVArray(options.inputFile, options.indexes) : await processCSV(
          join(process.cwd(), options.inputFile, false),
          options.indexes
        )
        console.timeEnd('Process CSV')

        if (prepData) {
          const { data, records } = prepData
          console.log(`Records processed: ${records}`)
          if (options.chunks) {
            for (const index in data) {
              if (data.hasOwnProperty(index)) {
                console.log(`Processing index: ${index}`)
                const chunkSort = chunkFiles(
                  join(process.cwd(), options.searchFile),
                  data[index],
                  options.chunks,
                  records
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
  inputFile: ["./data/ct.csv", "./data/ma.csv", "./data/me.csv", "./data/nh.csv", "./data/nj.csv", "./data/ny.csv", "./data/pa.csv", "./data/ri.csv", "./data/ri.csv"],
  searchFile: "./src/lambda-fuse/data/ne_address.json",
  chunks: 4,
  results: 10,
  searchOptions: {
    threshold: 0.5,
    maxPatternLength: 64,
    keys: ["name", "address"]
  },
  indexes: {
    addressIdx: {
      compoundKeys: ["Address"],
      keys: ["addressIdx", "number", "street", "unit", "city", "source", "postcode"],
      fields: {
        ID: "Address ID",
        NUMBER: "Property Number",
        STREET: "Street",
        UNIT: "Unit",
        CITY: "City",
        source: "State",
        POSTCODE: "Postcode",
        LON: "Longitude",
        LAT: "Latitude"
      }
    }
  }
}

prep(prepOptions)
