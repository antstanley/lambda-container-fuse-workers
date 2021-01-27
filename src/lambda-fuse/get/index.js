
const getResponse = async (event) => {

  const styles = `
        <style>
            .w-100 {
                width: 100%;
            }

            .form-container {
                width: 16rem;
                margin-top: 8rem;
                margin-left: auto;
                margin-right: auto;
                border-radius: 2px;
                border-color: transparent;
                padding: 1.5rem;
                background: #dfdfdf
            }
        </style>
    `

  const searchForm = `
        <div class="form-container">
            <form id="searchForm">
                <div>
                    <label for="search">Search</label>
                    <input id="search" name="search" type="text" />
                </div>
                <div>
                    <input type="submit"/>
                </div>
            </form>
        </div>
    `

  const searchResults = ``

  const html = `
    <html>
        <head>
            ${styles}
        </head>
        <body>
            <div class="w-100">
                ${searchForm}
            </div>
        </body>
    </html>
    `

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html'
    },
    body: html
  }
}


module.exports = getResponse