import download from 'download';
import path from 'path';
import fs from 'fs';
import extract from 'extract-zip';
import { createHash } from 'crypto';

const parseHashes = rawHash => {
    // format: crc32c=qRiQ9g==, md5=AAQvmRLFWmGR17P+ASORNQ==
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

