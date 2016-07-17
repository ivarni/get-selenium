import path from 'path';
import request from 'request';
import fileExists from 'file-exists';

import {
    checkHash,
    getFile,
    unzip,
} from './util';

const filename = 'chromedriver_linux64.zip';
const unzipFilename = 'chromedriver';

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
    const file = path.join(targetFolder, filename);

    const version = await getLatestVersion();
    const { platform, bitness } = getArchitecture();
    const url = `https://chromedriver.storage.googleapis.com/${version}/chromedriver_${platform}${bitness}.zip`;

    const exists = fileExists(path.join(targetFolder, unzipFilename));

    if (!exists) {
        const hash = await getFile(url, targetFolder, filename);
        await checkHash(file, hash);
        await unzip(file);
    }
}
