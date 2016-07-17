import path from 'path';
import request from 'request';
import fileExists from 'file-exists';

import {
    checkHash,
    getFile,
    unzip,
    unlink,
} from './util';

const filename = 'chromedriver';

const latestVersionUrl = 'http://chromedriver.storage.googleapis.com/LATEST_RELEASE';
const fallbackVersion = '2.22';

const getLatestVersion = () =>
    new Promise(resolve => {
        let version = fallbackVersion;
        request.get(latestVersionUrl)
            .on('data', data => { version = data.toString(); })
            .on('error', error => { throw new Error(error); })
            .on('end', () => resolve(version.trim()));
    });


const getArchitecture = () => {
    const platform = process.platform;
    const bitness = process.arch.substring(1);
    switch (platform) {
        case 'linux':
            return { platform, bitness };
        case 'darwin':
            return { platform: 'mac', bitness: '32' };
        case 'win32':
            return { platform: 'win', bitness: '32' };
        default:
            throw new Error(`Unsupported platform: ${platform}`);
    }
};

export default async function(targetFolder) {
    const { platform, bitness } = getArchitecture();
    const downloadFilename = `chromedriver_${platform}${bitness}.zip`;

    const version = await getLatestVersion();
    const url = `https://chromedriver.storage.googleapis.com/${version}/${downloadFilename}`;

    const exists = fileExists(path.join(targetFolder, filename));

    if (!exists) {
        const file = path.join(targetFolder, downloadFilename);
        const hash = await getFile(url, targetFolder, downloadFilename);
        await checkHash(file, hash);
        await unzip(file);
        await unlink(file);
    }
}
