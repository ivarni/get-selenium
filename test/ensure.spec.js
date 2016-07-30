import 'babel-polyfill';
import bluebird from 'bluebird';
import tmp from 'tmp';
import path from 'path';
import mkdirp from 'mkdirp';
import fs from 'fs';
import glob from 'glob';
import rmrf from 'rimraf';

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
    tmpPath = path.join(await dir(), 'selenium');
    await makeDir(tmpPath);
});

after(done => {
    rmrf(tmpPath, done);
});

describe('ensure', function() {

    this.timeout(60000)

    describe('if target directory exists', async function() {

        beforeEach(async function() {
            await ensure(tmpPath, { verbose: false });
        });

        it('downloads selenium and chromedriver', async function() {
            await stat(path.join(tmpPath, 'selenium.jar'));

            const chromedriver = await globber(path.join(tmpPath, 'chromedriver*'));
            expect(chromedriver.length).to.be(1);

            const selenium = await(globber(path.join(tmpPath, 'selenium.jar')));
            expect(selenium.length).to.be(1);
        });

        it('deletes the chromedriver zip archive', async function() {
            const chromedriverZip = await globber(path.join(tmpPath, 'chromedriver*zip'));
            expect(chromedriverZip.length).to.be(0);
        });
    });

    describe('if target directory does not exist', async function() {

        it('creates it', async function() {
            await bluebird.promisify(rmrf)(tmpPath);
            await ensure(tmpPath, { verbose: false });
            const chromedriver = await globber(path.join(tmpPath, 'chromedriver*'));
            expect(chromedriver.length).to.be(1);

            const selenium = await(globber(path.join(tmpPath, 'selenium.jar')));
            expect(selenium.length).to.be(1);
        });
    });

});

describe('update', function() {

    this.timeout(120000);

    it('deletes and re-downloads binaries', async function() {
        await ensure(tmpPath, { verbose: false });
        await update(tmpPath, { verbose: false });

        const chromedriver = await globber(path.join(tmpPath, 'chromedriver*'));
        expect(chromedriver.length).to.be(1);

        const selenium = await(globber(path.join(tmpPath, 'selenium.jar')));
        expect(selenium.length).to.be(1);
    });

});
