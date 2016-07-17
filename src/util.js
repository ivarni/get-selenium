import download from 'download';
import path from 'path';
import fs from 'fs';
import extract from 'extract-zip';
import { createHash } from 'crypto';

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

export const unzip = file => {
    return new Promise((resolve, reject) => {
        extract(file, { dir: path.dirname(file) }, err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

export const getFile = (url, savePath, saveName) => {
    return new Promise((resolve, reject) => {
        let hash;
        download(url)
            .on('response', response => {
                hash = parseHashes(response.headers['x-goog-hash']).md5;
            })
            .on('error', error => reject(error))
            .pipe(fs.createWriteStream(path.join(savePath, saveName)))
            .on('finish', () => {
                resolve(hash);
            });
    });
}

export const checkHash = (filePath, hash) => {
    return new Promise((resolve, reject) => {
        const fileHash = createHash('md5');
        fs.ReadStream(filePath)
            .on('data', data => fileHash.update(data))
            .on('end', () => {
                const digest = fileHash.digest('base64');
                if (hash === digest) {
                    return resolve();
                }
                return reject('Checksum failed');
            });
    });
}
