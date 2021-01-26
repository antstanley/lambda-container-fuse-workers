import post from './post/index.js'
import get from './get/index.js'

const lambdaHandler = async (event, context) => {
    let response = {
        statusCode: 500,
        body: 'Internal Server Error'
    }
    try {

        switch (event.httpMethod) {
            case 'POST':
                response = await post(event)
                break
            case 'GET':
                response = await get(event)
                break
            default:
        }
    } catch (err) {
        console.log(err);
    }

    return response
};

export { lambdaHandler }
