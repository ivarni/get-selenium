[![Build Status](https://travis-ci.org/ivarni/get-selenium.svg?branch=master)](https://travis-ci.org/ivarni/get-selenium)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/ivarni/get-selenium/issues)
[![Coveralls](https://img.shields.io/coveralls/ivarni/get-selenium.svg?maxAge=2592000)](https://coveralls.io/github/ivarni/get-selenium)

# get-selenium

Inspired by [selenium-download](https://github.com/groupon/selenium-download) but written in ES6 instead of CoffeeScript. Motivation was problems getting the original module running on v6 of Node.js. The latest version of [selenium-download](https://github.com/groupon/selenium-download) now works with v6 so I encourage you to use to use that. I will, however, still maintain this module since I've already published it.

## Usage

Install with npm
```
npm install get-selenium --save-dev
```

```javascript
import { ensure } from 'get-selenium';

ensure('./selenium').then(
    () => console.log('selenium and chromedriver present')
);
```

## API

### ensure(path, options)
Downloads the latest version of selenium's jar and the appropriate chromedriver executable for your system. If the appropriate files already exist in the `path` then they are not downloaded again.

Returns a promise that resolves when the files are present.

### update(path, options)
Clears out the `path` directory and then calls `ensure`, thus forcing the binaries to be downloaded even if they already exist.

Returns a promise that resolves when the files are present.

## options

Optional parameter with default values
```
{
    verbose: true
}
```

### verbose
Logs progress to `console.log`. Set this to `false` if you don't want to clutter the shell.
