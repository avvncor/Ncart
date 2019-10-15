const Request = require('request-promise')

module.exports = (short) => {
    return Request({
        method: 'GET',
        uri: `https://api.csurl.fr/api/${short}`
    })
}
