const { dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const shortid = require('shortid');
const Store = require('electron-store');
const { updater } = require('./dbHandel.js')

const settingsStore = new Store({ name: 'settings' })
const settings = settingsStore.get('settings')
let fileMetadata = {}
let currentRandomStr = ''

async function uploadHandle() {
    let uploadLogs = [];
    const selectResult = await selectFile();

    if (selectResult.canceled) {
        uploadLogs.push('上传已取消!')
        return uploadLogs;
    }

    for (filePath of selectResult.filePaths) {
        const checkResult = await filesCheck(filePath);
        uploadLogs.push(...checkResult.filesCheckLogs)

        if (checkResult.isLegal) {
            const copyFileLogs = await uploadFile(filePath)
            uploadLogs.push(...copyFileLogs)

            if (copyFileLogs.length === 0) {
                const extractionResult = await chapterExtraction(filePath, currentRandomStr);
                fileMetadata.chapterName = extractionResult.textChapter;
                fileMetadata.chapterCount = extractionResult.chapterCount;
                fileMetadata.eachChapterWordCount = extractionResult.eachChapterWordCount;
                uploadLogs.push(...extractionResult.extractionLogs);

                if (extractionResult.extractionLogs.length === 0) {
                    const metadataLogs = await metadataUpload()
                    uploadLogs.push(...metadataLogs)
                }
            }
        }
    }
    return uploadLogs
}

function selectFile() {
    return dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [
            { name: '文本文件', extensions: ['txt',] },
        ]
    });
}

async function filesCheck(filePath)  {
    let filesCheckLogs = [];
    let isLegal = true;

    const fileName = path.basename(filePath);
    const fileExtension = path.extname(filePath);

    try {
        const stats = await fs.promises.stat(filePath);

        if (! fileTypeCheck(fileExtension)) {
            isLegal = false
            filesCheckLogs.push(`文件‘${ fileName }’格式错误`);
        } else if (! fileSizeCheck(stats.size)) {
            isLegal = false
            filesCheckLogs.push(`文件‘${ fileName }’大小超出限制`);
        }
    } catch(err) {
        isLegal = false
        filesCheckLogs.push(`文件‘${ fileName }’信息解析错误`);
    }

    return {'isLegal': isLegal, 'filesCheckLogs': filesCheckLogs};
};

function fileTypeCheck(fileExtension) {
    const allowedTypes = ['.txt',];
    if (allowedTypes.includes(fileExtension)) {
        fileMetadata.extensionName = fileExtension
        return true;
    } else
        return false;
}

function fileSizeCheck(fileSize) {
    const allowedSize = 5 * 1024 * 1024;
    if (fileSize <= allowedSize) {
        fileSize = parseFloat((fileSize / (1024 * 1024)).toFixed(2))
        fileMetadata.fileSize = fileSize
        return true;
    } else
        return false;
}

function uploadFile(filePath) {
    return new Promise(resolve => {
        let copyFileLogs = []
        const fileName = path.basename(filePath)
        const fileExtension = path.extname(filePath);

        currentRandomStr = shortid.generate()
        const newFileName = currentRandomStr + fileExtension
        const directory = path.join(settings.local.uploadPath, currentRandomStr);
        const targetFilePath = path.join(directory, newFileName);

        fs.mkdir(directory, { recursive: true }, (err) => {
            if (err) {
                copyFileLogs.push(`文件‘${ fileName }’完整内容转存失败`)
            } else {
                fs.copyFile(filePath, targetFilePath, (err) => {
                    if (err) {
                        copyFileLogs.push(`文件‘${ fileName }’完整内容转存失败`)
                    } else {
                        fs.promises.stat(targetFilePath)
                        .then(stats => {
                            fileMetadata.fileId = 'ID-' + currentRandomStr
                            fileMetadata.fileKey = currentRandomStr
                            fileMetadata.fileName = fileName.split('.')[0]
                            fileMetadata.filePath = directory
                            fileMetadata.uploadDate = formatDate(stats.birthtime)
                        })
                        .catch((err) => {})
                    }
                });
            }
        })
        resolve(copyFileLogs)
    });
}

function formatDate(data) {
    const originalDate = new Date(data);
    const year = originalDate.getFullYear();
    const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
    const date = originalDate.getDate().toString().padStart(2, '0');
    const hours = originalDate.getHours().toString().padStart(2, '0');
    const minutes = originalDate.getMinutes().toString().padStart(2, '0');
    const seconds = originalDate.getSeconds().toString().padStart(2, '0');

    return `${year}.${month}.${date}/${hours}:${minutes}:${seconds}`;
}

function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
            fileMetadata.totalWordCount = data.length;
        });
    });
}

function metadataUpload() {
    return new Promise(async (resolve, reject) => {
        let metadataLogs = [];
        try {
            let isSucceed = false;
            isSucceed = await updater(josonData => {
                josonData[fileMetadata.fileId] = {
                    'fileKey': fileMetadata.fileKey,
                    'fileName': fileMetadata.fileName,
                    'fileSize': fileMetadata.fileSize,
                    'extensionName': fileMetadata.extensionName,
                    'totalWordCount': fileMetadata.totalWordCount,
                    'chapterCount': fileMetadata.chapterCount,
                    'uploadDate': fileMetadata.uploadDate,
                    'filePath': fileMetadata.filePath,
                    'fromUpload': true,
                    'isCollect': false,
                    'author': null,
                    'description': null,
                    'readProgress': 0.0000, // %
                    'lastReadTime': null,
                    'totalReadTime': 0.00, // 分钟
                    'lastReadPage': 1, // 页
                    'lastReadChapter': 1, // 章
                    'recentUpdateTime': null,
                    'coverImage': {
                        "imgID": 1, // 
                        "name": null,
                        "imgSize": 0.00, // MB
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

function writeFile(filePath , content) {
    let writeFileLogs = [];
    const fileName = path.basename(filePath);
    fs.writeFile(filePath, content, 'utf-8', (err) => {
        if (err) {
            writeFileLogs.push(`文件‘${ fileName }’按章节拆分转存失败`)
        }
    });
    return writeFileLogs
}

const chapterRegex = () => {
    const chapterRegex0 = /^(引子|引言|楔子|前言|前奏|题记|序言|序章|序幕|序|导读|导语).*/ // 引子 楔子...
    const chapterRegex1 = /^(引 子|引 言|楔 子|前 言|前 奏|题 记|序 言|序 章|序 幕|序|导 读|导 语).*/ // 引 子 楔 子...
    const chapterRegex2 = /^第\d+(章|节|部|卷|集|回|篇|幕|部分).*/ // 第1章 第2卷...
    const chapterRegex3 = /^第[零一二三四五六七八九十百千万]+(章|节|部|卷|集|回|篇|幕|部分).*/ // 第一章 第二节...
    const chapterRegex4 = /^\([零一二三四五六七八九十百千万]+\)|\(\p{N}+\).*/ // (一) (1)...
    const chapterRegex5 = /^([零一二三四五六七八九十百千万]+、|\p{N}+、).*/ // 一、2、...
    const chapterRegex6 = /^([零一二三四五六七八九十百千万]+|\p{N}+)$/ // 一  2  ...

    return [chapterRegex0, chapterRegex1, chapterRegex2, chapterRegex3, chapterRegex4, chapterRegex5, chapterRegex6,];
}

async function chapterExtraction(filePath, fileKey) { // 目录提取这个函数写得特别烂, 改了很多很多遍...(莫名想笑)
    let fileContent = null;
    let extractionLogs = [];

    const fileName = path.basename(filePath);
    let textChapter = {};

    try {
        fileContent = await readFile(filePath);
    } catch(err) {
        extractionLogs.push(`文件‘${ fileName }’内容读取失败`);
        return extractionLogs;
    }

    let currentChapterCount = 0;
    let currentChapterContent = '';
    let isCurrentChapterEnd = false;
    let chapterPath = '';
    let haveZeroChapter = false;
    let eachChapterWordCount = [];

    const fileContentArray = fileContent.split('\n');
    await fileContentArray.forEach((line, index) => { // 这里有Bug, 如果文本中本身没有'\n'则拆分无效
        for (const regex of chapterRegex()) {
            if (regex.test(line)) {
                currentChapterCount += 1 // 记录当前章节数

                if (haveZeroChapter) {
                    textChapter["chapter_" + (currentChapterCount + 1)] = line.trim();
                    chapterPath = path.join(settings.local.uploadPath, fileKey, ('chapter_' + currentChapterCount + '.txt'))
                } else {
                    textChapter["chapter_" + currentChapterCount] = line.trim();
                    chapterPath = path.join(settings.local.uploadPath, fileKey, ('chapter_' + (currentChapterCount - 1) + '.txt'))
                }

                if (currentChapterContent !== '') {
                    isCurrentChapterEnd = true; // 当前章节内容为空说明第一个章节刚开始, 不为空说明此前currentChapterContent已经记录满一整个章节
                }

                break;
            }
        }

        if (index === fileContentArray.length - 1) {
            currentChapterCount += 1; // 最后一个章节数此处"手动" + 1, 否则它就会覆盖前一个章节内容
            currentChapterContent += line; // 最后一章节"手动"补齐最后一行

            if (haveZeroChapter || currentChapterCount === 1) { // 第二判断式处理文本内容一共只有一行的情况
                chapterPath = path.join(settings.local.uploadPath, fileKey, ('chapter_' + currentChapterCount + '.txt'))
            } else {
                chapterPath = path.join(settings.local.uploadPath, fileKey, ('chapter_' + (currentChapterCount - 1) + '.txt'))
            }

            if (currentChapterCount === 1) {
                textChapter["chapter_1"] = null; // 判断章节提取失败或者文本内容一共只有一行的情况
            }
        }

        if ((index === fileContentArray.length - 1) || isCurrentChapterEnd) { // 遍历处于最后一行, 或者currentChapterContent已经记录满一整个章节(标志为true)
            const writeFileLogs = writeFile(chapterPath, currentChapterContent); // 新建章节文件
            extractionLogs.push(...writeFileLogs); // 日志记录
            
            eachChapterWordCount.push(currentChapterContent.length) // 记录每个章节的字数, 方便进度统计
            
            currentChapterContent = '' // 重新初始化
            isCurrentChapterEnd = false // 重新初始化标志物
            currentChapterContent += line // 从新的章节名开始重新记录
        } else {
            currentChapterContent += line // 标志物为false表示当前章节记录尚未结束, 则继续记录当前章节内容
        }

        if (currentChapterCount === 0 && currentChapterContent !== '' && Object.keys(textChapter).length === 0) { // 判断无章节名之前已有内容的情况
            haveZeroChapter = true;
            textChapter["chapter_1"] = '...';
        }
    });

    if (textChapter) {
        return {
            'extractionLogs': extractionLogs,
            'textChapter': textChapter,
            'chapterCount': Object.keys(textChapter).length,
            'eachChapterWordCount': eachChapterWordCount,
        };
    } else {
        extractionLogs.push(`文件‘${ fileName }’章节提取结果为空`);
        return {
            'extractionLogs': extractionLogs,
        };
    }
}

exports.uploadHandle = uploadHandle;
exports.chapterExtraction = chapterExtraction;
exports.formatDate = formatDate;
