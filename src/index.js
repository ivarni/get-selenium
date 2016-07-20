import 'babel-polyfill';
import bluebird from 'bluebird';
import glob from 'glob';
import path from 'path';

import selenium from './selenium';
import chromedriver from './chromedriver';
import { unlink } from './util';

const globber = bluebird.promisify(glob);

/* eslint-disable no-console, func-names */
const ensure = async function(target) {
    console.log('Getting selenium');
    await selenium(target);
    console.log('Got selenium');

    console.log('Getting chromedriver');
    await chromedriver(target);
    console.log('Got chromedriver');
};

const update = async function(target) {
    const files = await globber(path.join(target, '**/*'));
    await Promise.all(files.map(file => unlink(file)));
    await ensure(target);
};
/* eslint-enable no-console, func-names */

const api = {
    ensure,
    update,
};

module.exports = api;
