import path from 'path';
import fileExists from 'file-exists';

import {
    checkHash,
    getChromedriverUrl,
    getFile,
    unzip,
    unlink,
    logger,
} from './util';

const filename = 'chromedriver';

let log = logger;

export default async function(targetFolder, options) {
    if (!options.verbose) {
        log = f => f;
    }
    log(`Checking if ${filename} is present in ${targetFolder}`);
    const targetFile = path.join(targetFolder, filename);
    const exists = fileExists(targetFile);

    if (!exists) {
        const url = await getChromedriverUrl();
        log(`Downloading from ${url}`);
        const downloadFilename = url.substring(url.lastIndexOf('/') + 1);
        const downloadPath = path.join(targetFolder, downloadFilename);
        const hash = await getFile(url, targetFolder, downloadFilename);
        log(`Downloaded ${downloadFilename}`);
        await checkHash(downloadPath, hash);
        await unzip(downloadPath);
        log(`Unzipped ${downloadFilename}`);
        await unlink(downloadPath);
        return targetFile;
    }
    return log('File found');
}
