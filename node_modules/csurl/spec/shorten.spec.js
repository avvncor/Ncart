const Lib = require('../index')

describe('Shorten an URL', () => {
    it('Shorten an URL', () => {
        let url = 'https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04'
        Lib.shorten(url)
            .then((result) => {
                expect(result.short).toBe('WQ0ON')
            })
    })
})
