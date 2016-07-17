import path from 'path';
import fileExists from 'file-exists';

import {
    getFile,
    checkHash,
} from './util';

const minorVersion = '2.53';
const version = '2.53.0';
const filename = 'selenium.jar';
const seleniumUrl = `http://selenium-release.storage.googleapis.com/${minorVersion}/selenium-server-standalone-${version}.jar`;

export default async function(targetFolder) {
    const file = path.join(targetFolder, filename);
    const exists = fileExists(file);

    if (exists) {
        return file;
    }

    const hash = await getFile(seleniumUrl, targetFolder, filename);
    await checkHash(file, hash);
    return file;
}
