import path from 'path';
import fileExists from 'file-exists';

import {
    getFile,
    checkHash,
    logger,
} from './util';

const filename = 'selenium.jar';

const minorVersion = '2.53';
const version = '2.53.0';
const url = `http://selenium-release.storage.googleapis.com/${minorVersion}/selenium-server-standalone-${version}.jar`;

let log = logger;

export default async function(targetFolder, options) {
    if (!options.verbose) {
        log = f => f;
    }
    log(`Checking if ${filename} is present in ${targetFolder}`);
    const targetFile = path.join(targetFolder, filename);
    const exists = fileExists(targetFile);

    if (!exists) {
        log(`Downloading from ${url}`);
        const hash = await getFile(url, targetFolder, filename);
        await checkHash(targetFile, hash);
        log(`Downloaded ${targetFile}`);
        return targetFile;
    }
    return log('File found');
}
