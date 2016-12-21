import 'babel-polyfill';
import bluebird from 'bluebird';
import glob from 'glob';
import path from 'path';
import mkdirp from 'mkdirp';

import selenium from './selenium';
import chromedriver from './chromedriver';
import { unlink } from './util';

const globber = bluebird.promisify(glob);
const makeDir = bluebird.promisify(mkdirp);

const defaultOptions = {
    verbose: true,
};

/* eslint-disable func-names */
const ensure = async function (target, options = defaultOptions) {
    await makeDir(target);
    await selenium(target, options);
    await chromedriver(target, options);
};

const update = async function (target, options = defaultOptions) {
    const files = await globber(path.join(target, '**/*'));
    await Promise.all(files.map(file => unlink(file)));
    await ensure(target, options);
};
/* eslint-enable func-names */

const api = {
    ensure,
    update,
};

module.exports = api;
