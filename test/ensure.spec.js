import 'babel-polyfill';
import bluebird from 'bluebird';
import tmp from 'tmp';
import path from 'path';
import mkdirp from 'mkdirp';

import ensure from '../src';

const dir = bluebird.promisify(tmp.dir);
const makeDir = bluebird.promisify(mkdirp);

describe('ensure', function() {

    let tmpPath;

    this.timeout(30000)

    beforeEach(async function() {
        //tmpPath = path.join('/', 'home', 'ivarni', 'Downloads');
        tmpPath = path.join(await dir(), 'selenium');
        await makeDir(tmpPath);
    });

    after(() => {
        // get rid of the tmp dir
    });

    it('downloads selenium', async function() {
        await ensure(tmpPath);
    });

});
