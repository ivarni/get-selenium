import 'babel-polyfill';
import glob from 'glob';
import path from 'path';

import selenium from './selenium';
import chromedriver from './chromedriver';
import { unlink } from './util';

/* eslint-disable no-console, func-names */
const ensure = async function(path) {
    console.log('Getting selenium');
    await selenium(path);
    console.log('Got selenium');

    console.log('Getting chromedriver');
    await chromedriver(path);
    console.log('Got chromedriver');
};

const update = async function(target) {
    glob(path.resolve(target, '**/*') , async function(err, files) {
        // TODO: This doesn't quite work, files are being
        //       cleared too late and I dunno why :`(
        await Promise.all(files.map(file => unlink(file)));
        await ensure(target);
    });
};
/* eslint-enable no-console, func-names */

const api = {
    ensure,
    update,
};

module.exports = api;
