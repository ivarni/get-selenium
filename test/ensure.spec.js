import 'babel-polyfill';
import bluebird from 'bluebird';
import tmp from 'tmp';
import path from 'path';

import ensure from '../src/ensure';

const dir = bluebird.promisify(tmp.dir);

describe('ensure', function() {

    this.timeout(30000) // slow wifi, yay

    let tmpPath;

    beforeEach(async function() {
        tmpPath = path.join('/', 'home', 'ivarni', 'Downloads');
        //tmpPath = path.join(await dir(), 'selenium');
    });

    afterEach(() => {
        tmp.setGracefulCleanup();
    });

    it('downloads selenium', async function() {
        const hash = await ensure(tmpPath);
        console.log('result', hash)
    });

});
