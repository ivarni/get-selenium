import 'babel-polyfill';
import bluebird from 'bluebird';
import tmp from 'tmp';
import path from 'path';

import ensure from '..';

const dir = bluebird.promisify(tmp.dir);

describe('ensure', function() {

    let tmpPath;

    this.timeout(30000)

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
