const Lib = require('../index')

describe('Get an URL from its shortened version', () => {
    it('Get an URL from an non-existent shortened version', () => {
        let short = 'xxxxx'
        Lib.get(short)
            .catch((result) => {
                expect(result.error).toBe('The URL xxxxx is not matching anything.')
            })
    })
    it('Get an URL from an existent shortened version', () => {
        let short = 'WQ0ON'
        Lib.get(short)
            .then((result) => {
                expect(result.target).toBe('https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04')
            })
    })
})