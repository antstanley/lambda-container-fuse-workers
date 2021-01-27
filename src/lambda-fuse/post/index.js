import search from './search.js'

const searchOptions = {
  searchFile: {
    dir: "./src/lambda-fuse/data/",
    namePrefix: "ne-address"
  },
  chunks: 6,
  results: 20,
  searchOptions: {
    threshold: 0.5,
    maxPatternLength: 64,
    keys: ["name", "address"]
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

const requestHandler = async (event) => {
  let response = {
    statusCode: 500
  }
  try {


    const body = JSON.parse(event.body)

    const { searchTerm } = body

    const searchResponse = await search(searchOptions, searchTerm)

    if (!searchResponse.error) {
      response = {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchResponse)
      }
    } else {
      response = {
        statusCode: 500,
        body: `Failed with error ${error}`
      }
    }
  } catch (error) {
    console.error(error)
    response = {
      statusCode: 500,
      body: `Failed with error ${error}`
    }
  }
  return response
}

export default requestHandler