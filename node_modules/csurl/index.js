/**
 * ChakSoft URL Shortener API access
 * 
 * Utility to easily shorten your URLs from your JavaScript code.
 * Licensed with GPLv3 to Michael Chacaton.
 * 
 * See that on GitHub https://github.com/Choko256/csurl
 * Visit the web URL Shortener at https://www.csurl.fr/
 */

module.exports = {
    get: require('./lib/get'),
    shorten: require('./lib/shorten')
}
