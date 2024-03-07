const fs = require('fs');
const path = require('path');
const shortid = require('shortid');
const Store = require('electron-store');
const { updater, deleter } = require('./dbHandel.js')
const { formatDate, chapterExtraction } = require('./uploadFile.js')

const settingsStore = new Store({ name: 'settings' })
const settings = settingsStore.get('settings')
let fileMetadata = {};

function creatNewFile(content, textName) {
    return new Promise(resolve => {
        let creatFileLogs = [];
        const randomStr = shortid.generate();
        const directory = path.join(settings.local.uploadPath, randomStr);

        fs.mkdir(directory, { recursive: true }, async (err) => {
            if (err)
                creatFileLogs.push('文件保存失败!');
            else {
                const writeFileLogs = await writeFile(content, randomStr, true, textName);
                creatFileLogs.push(...writeFileLogs);
            }
        })
        resolve({ 'creatFileLogs': creatFileLogs, 'fileKey': randomStr });
    })
}

function writeFile(content, fileKey, isFirstBuild, textName='untitled') {
    return new Promise(resolve => {
        let writeFileLogs = [];
        const directory = path.join(settings.local.uploadPath, fileKey);
        const writePath = path.join(directory, fileKey + '.txt');

        fs.writeFile(writePath, content, 'utf-8', async (err) => {
            if (err) {
                writeFileLogs.push(`文件写入失败!`);
            } else {
                const extractionResult = await chapterExtraction(writePath, fileKey);

                await fs.promises.stat(writePath)
                .then(stats => {
                    fileMetadata.fileSize = parseFloat((stats.size / (1024 * 1024)).toFixed(2));
                })
                .catch((err) => {
                    fileMetadata.fileSize = null;
                })
                fileMetadata.fileId = 'ID-' + fileKey
                fileMetadata.totalWordCount = content.length;
                fileMetadata.chapterName = extractionResult.textChapter;
                fileMetadata.chapterCount = extractionResult.chapterCount;
                fileMetadata.eachChapterWordCount = extractionResult.eachChapterWordCount;

                if (isFirstBuild) {
                    initMetadata(fileKey, textName)
                    .then(result => {
                        const metadataLogs = result;
                        writeFileLogs.push(...metadataLogs);
                    })
                } else {
                    updateMetadata()
                    .then(result => {
                        const metadataLogs = result;
                        writeFileLogs.push(...metadataLogs);
                    })
                }
                writeFileLogs.push(...extractionResult.extractionLogs);
            }
        });
        resolve(writeFileLogs);
    })
}

function updateMetadata() {
    return new Promise(async (resolve, reject) => {
        let metadataLogs = [];
        const currentTime = formatDate(new Date);
        try {
            let isSucceed = false;
            isSucceed = await updater(josonData => {
                josonData[fileMetadata.fileId]['fileSize'] = fileMetadata.fileSize;
                josonData[fileMetadata.fileId]['chapterName'] = fileMetadata.chapterName;
                josonData[fileMetadata.fileId]['chapterCount'] = fileMetadata.chapterCount;
                josonData[fileMetadata.fileId]['recentUpdateTime'] = fileMetadata.currentTime;
                josonData[fileMetadata.fileId]['totalWordCount'] = fileMetadata.totalWordCount;
                josonData[fileMetadata.fileId]['eachChapterWordCount'] = fileMetadata.eachChapterWordCount;
            })
            if (! isSucceed)
                metadataLogs.push(`文件‘${fileMetadata.fileName}’元数据上传失败!`);
        } catch(err) {
            reject(err)
        }
        resolve(metadataLogs)
    })
}

function initMetadata(fileKey, textName) {
    return new Promise(async (resolve, reject) => {
        let metadataLogs = [];
        const currentTime = formatDate(new Date);
        const filePath = path.join(settings.local.uploadPath, fileKey)
        try {
            let isSucceed = false;
            isSucceed = await updater(josonData => {
                josonData[fileMetadata.fileId] = {
                    'fileKey': fileKey,
                    'fileName': textName,
                    'fileSize': fileMetadata.fileSize,
                    'extensionName': '.txt',
                    'totalWordCount': fileMetadata.totalWordCount,
                    'chapterCount': fileMetadata.chapterCount,
                    'uploadDate': currentTime,
                    'filePath': filePath,
                    'fromUpload': false,
                    'isCollect': false,
                    'author': 'Yuxiaohang',
                    'description': null,
                    'readProgress': 0.0000,
                    'lastReadTime': null,
                    'totalReadTime': 0.00,
                    'lastReadPage': 1,
                    'lastReadChapter': 1,
                    'recentUpdateTime': currentTime,
                    'coverImage': {
                        "imgID": 1,
                        "name": null,
                        "imgSize": 0.00,
                        "uploadDate": null,
                        "imgPath": null,
                    },
                    'chapterName': fileMetadata.chapterName,
                    'eachChapterWordCount': fileMetadata.eachChapterWordCount,
                }
            })
            if (! isSucceed) metadataLogs.push(`文件‘${fileMetadata.fileName}’元数据上传失败!`);
        } catch(err) {
            reject(err)
        }
        resolve(metadataLogs)
    })
}

exports.writeFile = writeFile;
exports.creatNewFile = creatNewFile;
