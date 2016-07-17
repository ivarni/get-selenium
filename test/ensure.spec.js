import 'babel-polyfill';
import bluebird from 'bluebird';
import tmp from 'tmp';
import path from 'path';
import mkdirp from 'mkdirp';
import fs from 'fs';
import glob from 'glob';

import ensure from '../src';

const dir = bluebird.promisify(tmp.dir);
const makeDir = bluebird.promisify(mkdirp);
const stat = bluebird.promisify(fs.stat);
const globber = bluebird.promisify(glob);

describe('ensure', function() {

    let tmpPath;

    this.timeout(30000)

    beforeEach(async function() {
        //tmpPath = path.join('/', 'home', 'ivarni', 'Downloads');
        tmpPath = path.join(await dir(), 'selenium');
        await makeDir(tmpPath);
        await ensure(tmpPath);
    });

    after(() => {
        // get rid of the tmp dir
    });

    it('downloads selenium and chromedriver', async function() {
        await stat(path.join(tmpPath, 'selenium.jar'));
        await stat(path.join(tmpPath, 'chromedriver'));
    });

    it('deletes the chromedriver zip archive', async function() {
        const files = await globber(path.join(tmpPath, 'chromedriver*zip'));
        expect(files.length).to.be(0);
    });

});
