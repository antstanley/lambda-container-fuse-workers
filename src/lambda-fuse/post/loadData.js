import { join } from 'path'
import { createReadStream } from 'fs'
import * as JSONStream from 'JSONStream'

const loadData = (searchFile, chunks, indexes) => {
  // prep datachunks object
  const datachunks = []
  const { dir, namePrefix } = searchFile
  let verifyCount = 0
  for (let i = 0; i < chunks; i++) {
    for (const index in indexes) {
      if (indexes.hasOwnProperty(index)) {
        if (datachunks[i]) {
          datachunks[i][index] = []
        } else {
          const newChunkIndex = {}
          newChunkIndex[index] = []
          datachunks.push(newChunkIndex)
        }
        verifyCount++
      }
    }
  }

  return new Promise((resolve, reject) => {
    let processCount = 0
    for (let i = 0; i < chunks; i++) {
      for (const index in indexes) {
        if (indexes.hasOwnProperty(index)) {
          const chunkFile = join(process.cwd(), dir, `${namePrefix}-${index}.chunk${i}.json`)
          createReadStream(chunkFile)
            .pipe(JSONStream.parse('*'))
            .on('data', data => {
              datachunks[i][index].push(data)
            })
            .on('end', () => {
              processCount++
              if (processCount === verifyCount) {
                resolve(datachunks)
              }
            })
            .on('error', (error) => {
              return { error }
            })
        }
      }
    }
  })
}

export default loadData