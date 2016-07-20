import 'babel-polyfill';
import bluebird from 'bluebird';
import tmp from 'tmp';
import path from 'path';
import mkdirp from 'mkdirp';
import fs from 'fs';
import glob from 'glob';

import {
    ensure,
    update,
} from '../src';
import { rmDir } from '../src/util';

const dir = bluebird.promisify(tmp.dir);
const makeDir = bluebird.promisify(mkdirp);
const stat = bluebird.promisify(fs.stat);
const globber = bluebird.promisify(glob);

let tmpPath;

before(async function() {
    //tmpPath = path.join('/', 'home', 'ivarni', 'Downloads');
    tmpPath = path.join(await dir(), 'selenium');
    await makeDir(tmpPath);
});

describe('ensure', function() {

    this.timeout(60000)

    beforeEach(async function() {
        await ensure(tmpPath);
    });

    after(() => {
        // get rid of the tmp dir
    });

    it('downloads selenium and chromedriver', async function() {
        await stat(path.join(tmpPath, 'selenium.jar'));
        const files = await globber(path.join(tmpPath, 'chromedriver*'));
        expect(files.length).to.be(1);
    });

    it('deletes the chromedriver zip archive', async function() {
        const files = await globber(path.join(tmpPath, 'chromedriver*zip'));
        expect(files.length).to.be(0);
    });

});

describe('update', function() {

    this.timeout(120000);

    it('deletes and re-downloads binaries', async function() {
        await ensure(tmpPath);
        await update(tmpPath);
        console.log('test done')
    });

});
