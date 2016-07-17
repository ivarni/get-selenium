import path from 'path';
import fileExists from 'file-exists';

import {
    checkHash,
    getChromedriverUrl,
    getFile,
    unzip,
    unlink,
} from './util';

const filename = 'chromedriver';

export default async function(targetFolder) {
    const url = await getChromedriverUrl();
    const downloadFilename = url.substring(
        url.lastIndexOf('/') + 1
    );

    const exists = fileExists(path.join(targetFolder, filename));

    if (!exists) {
        const file = path.join(targetFolder, downloadFilename);
        const hash = await getFile(url, targetFolder, downloadFilename);
        await checkHash(file, hash);
        await unzip(file);
        await unlink(file);
    }
}
