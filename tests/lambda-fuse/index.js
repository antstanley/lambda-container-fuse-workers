import { lambdaHandler } from '../../src/lambda-fuse/index.js'

const event = {
  httpMethod: 'POST',
  body: '{ "searchTerm": "3750 Quacker Lane" }'
}

const runFunction = async (event, context) => {
  const response = await lambdaHandler(event)
  console.log(JSON.stringify(response, null, 2))
}

runFunction(event)