const Request = require('request-promise')

module.exports = (link) => {
    return Request({
        method: 'POST',
        uri: 'https://api.csurl.fr/api/',
        body: {
            origin: link
        },
        json: true
    })
}