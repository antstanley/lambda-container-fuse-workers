import search from './post/search.js'

const prepOptions = {
  searchFile: "../data/ne_address.json",
  chunks: 6,
  results: 20,
  searchOptions: {
    threshold: 0.5,
    maxPatternLength: 64,
    keys: ["name", "address"]
  },
  indexes: {
    nameIdx: {
      compoundKeys: ["Restaurant Name"],
      keys: ["nameIdx", "name", "address"],
      fields: {
        id: "Restaurant ID",
        name: "Restaurant Name",
        address: "Address",
        rating: "Aggregate rating"
      }
    }
  }
}