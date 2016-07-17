import download from 'download';
import path from 'path';
import fileExists from 'file-exists';
import { createHash } from 'crypto';
import fs from 'fs';

const minorVersion = '2.53';
const version = '2.53.0';
const filename = 'selenium.jar';

const seleniumPath = `http://selenium-release.storage.googleapis.com/${minorVersion}/selenium-server-standalone-${version}.jar`;
//const seleniumPath = 'https://raw.githubusercontent.com/facebook/react/master/LICENSE';

const parseHashes = rawHash => {
    // format: crc32c=qRiQ9g==, md5=AAQvmRLFWmGR17P+ASORNQ==
    const parse = (result, hash) => {
        const parts = hash.trim().split('=');
        const key = parts[0];
        const value = parts.splice(1).join('=');
        result[key] = value;
        return result;
    }

    const hashes = rawHash.split(',')
    return hashes.reduce(parse, {});
}

const getFile = savePath => {
    return new Promise((resolve, reject) => {
        let hash;
        const stream = download(seleniumPath, savePath);

        stream.on('response', response => {
            hash = parseHashes(response.headers['x-goog-hash']).md5;
        });
        stream.on('end', () => {
            const currentPath = path.join(
                savePath,
                'selenium-server-standalone-2.53.0.jar'
            );
            const filePath = path.join(savePath, filename);
            fs.renameSync(currentPath, filePath);
            resolve(hash);
        });
        stream.on('error', error => reject(error));
    });
}

const checkHash = (filePath, hash) => {
    return new Promise((resolve, reject) => {
        const fileHash = createHash('md5');
        const stream = fs.ReadStream(filePath);

        stream.on('data', data => fileHash.update(data));
        stream.on('end', () => {
            const digest = fileHash.digest('base64');
            if (hash === digest) {
                return resolve();
            }
            return reject('Checksum failed');
        });
    });
}

export default async function(targetFolder, callback) {
    const file = path.join(targetFolder, filename);
    const exists = fileExists(file);

    if (exists) {
        return file;
    }

    let hash = await getFile(targetFolder);
    //let hash = 'd07+LYSYf7Z58t6gOML6Mg==';
    await checkHash(file, hash);
    return file;
}
