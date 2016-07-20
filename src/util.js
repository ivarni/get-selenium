import path from 'path';
import fs from 'fs';
import extract from 'extract-zip';
import { createHash } from 'crypto';
import request from 'request';

const latestChromedriverVersionUrl = 'http://chromedriver.storage.googleapis.com/LATEST_RELEASE';
const fallbackChromedriverVersion = '2.22';

const parseHashes = rawHash => {
    const parse = (memo, hash) => {
        const result = memo;
        const parts = hash.trim().split('=');
        const key = parts[0];
        const value = parts.splice(1).join('=');
        result[key] = value;
        return result;
    };

    const hashes = rawHash.split(',');
    return hashes.reduce(parse, {});
};

const getLatestChromedriverVersion = () =>
    new Promise(resolve => {
        let version = fallbackChromedriverVersion;
        request.get(latestChromedriverVersionUrl)
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

export async function getChromedriverUrl() {
    const { platform, bitness } = getArchitecture();
    const downloadFilename = `chromedriver_${platform}${bitness}.zip`;
    const version = await getLatestChromedriverVersion();
    return `https://chromedriver.storage.googleapis.com/${version}/${downloadFilename}`;
}

export const unzip = file =>
    new Promise((resolve, reject) => {
        extract(file, { dir: path.dirname(file) }, err => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });

export const getFile = (url, savePath, saveName) =>
    new Promise((resolve, reject) => {
        let hash;
        request(url)
            .on('response', response => {
                hash = parseHashes(response.headers['x-goog-hash']).md5;
            })
            .on('error', error => reject(error))
            .pipe(fs.createWriteStream(path.join(savePath, saveName)))
            .on('finish', () => {
                resolve(hash);
            });
    });

export const checkHash = (filePath, hash) =>
    new Promise((resolve, reject) => {
        const fileHash = createHash('md5');
        new fs.ReadStream(filePath)
            .on('data', data => fileHash.update(data))
            .on('end', () => {
                const digest = fileHash.digest('base64');
                if (hash === digest) {
                    return resolve();
                }
                return reject('Checksum failed');
            });
    });

export const unlink = filePath =>
    new Promise((resolve, reject) => {
        fs.unlink(filePath, err => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
