import 'babel-polyfill';
import selenium from './selenium';
import chromedriver from './chromedriver';

/* eslint-disable no-console, func-names */
const ensure = async function(path) {
    console.log('Getting selenium');
    await selenium(path);
    console.log('Got selenium');

    console.log('Getting chromedriver');
    await chromedriver(path);
    console.log('Got chromedriver');
};
/* eslint-enable no-console, func-names */

const api = {
    ensure,
};

module.exports = api;
