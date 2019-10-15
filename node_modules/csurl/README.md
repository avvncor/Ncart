# CSUrl

ChakSoft URL shortener API Access module.
Relying on [Bluebird](https://github.com/petkaantonov/bluebird)

## Prerequisities

* Node 6.9

## Usage

### Shorten an URL

```javascript
const CSUrl = require('csurl')

CSUrl.shorten('https://www.google.com/')
    .then((shortLink) => {
        console.log(shortLink)
        // >>> https://www.csurl.fr/#/Ex10aD
    })
```

### Get the URL from a shortened one

```javascript
const CSUrl = require('csurl')

CSUrl.get('Ex10aD')
    .then((fullUrl) => {
        console.log(fullUrl)
        // >>> https://www.google.com/
    })
```

## Run the tests

Be sure `jasmine` is installed as a global package :

```bash
$ npm install -g jasmine
```

Then just run the test suite :

```bash
$ jasmine
Started
...


3 specs, 0 failures
Finished in 0.015 seconds
```
