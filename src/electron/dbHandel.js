const fs = require('fs-extra');
const path = require('path');
const Store = require('electron-store');
const settingsStore = new Store({ name: 'settings' });
const settings = settingsStore.get('settings');
const dbPath = settings.local.dbPath;
const uploadPath = settings.local.uploadPath;
const eachPageWords = settings.textRead.eachPageWords;

function deleter(fileKey) {
    return new Promise(resolve => {
        getJsonObj()
        .then(jsonObjMain => {
            let deleteLogs = []
            const filePath = jsonObjMain['ID-' + fileKey]['filePath']
            const fileName = jsonObjMain['ID-' + fileKey]['fileName']

            fs.removeSync(filePath, { recursive: true, force: false,}, (err) => {
                if (err) deleteLogs.push(`文件‘${ fileName }’删除失败!`)
            })

            let isSucceed = false;
            isSucceed = updater((jsonData) => {
                delete jsonData['ID-' + fileKey]
            })
            if (! isSucceed) deleteLogs.push(`文件‘${ fileName }’元数据删除失败!`)
            resolve(deleteLogs)
        })
    })
}

function updater(callback) {
    return new Promise(resolve => {
        const readStream = fs.createReadStream(dbPath);
        let rawData = '';

        readStream.on('data', chunk => {  
            rawData += chunk;
        });

        readStream.on('end', () => {
            const jsonData = JSON.parse(rawData);
            callback(jsonData);

            const writeStream = fs.createWriteStream(dbPath);
            const jsonStr = JSON.stringify(jsonData, null, 4)
            writeStream.write(jsonStr, 'utf-8')
            writeStream.end();

            writeStream.on('finish', () => {
                resolve(true)
            })
        });
    })
}

// function preciseUpdater(fileKey, targetKey, newValue) {
//     return new Promise(resolve => {
//         updater((jsonData => {
//             jsonData[`ID-${fileKey}`][targetKey] = newValue;
//         }))
//         .then(result => {
//             resolve(result);
//         })
//     })
// }

/** 说明: 传入值, 得到符合匹配的所有json对象 */
function sameNameMatcher(target) {
    return new Promise(resolve => {
        let result = []
        getJsonObj()
        .then(jsonObj => {
            for (const childJsonObj of Object.values(jsonObj)) {
                for (const value of Object.values(childJsonObj)) {
                    if (value === target) {
                        result.push(childJsonObj)
                        break;
                    }
                }
            }
            resolve(result)
        })
    })
}

function preciseMatcher(fileKey) {
    return new Promise(resolve => {
        getJsonObj()
        .then(jsonObj => {
            for (const key of Object.keys(jsonObj)) {
                if (key === 'ID-' + fileKey) {
                    resolve(jsonObj['ID-' + fileKey])
                    break;
                }
            }
        })
    })
}

/** 说明: 传入目标键名, 得到所有键名对应的值, 对应的fileKey */
function searcher(target) {
    return new Promise(resolve => {
        let result = []
        getJsonObj()
        .then(jsonObj => {
            for (const childJsonObj of Object.values(jsonObj)) {
                const el = { 'fileKey': childJsonObj['fileKey'], [target]: childJsonObj[target], }
                result.push(el)
            }
            resolve(result)
        })
    }) 
}

function handleSearch(userInput) {
    return new Promise(resolve => {
        if (userInput) {
            const inputArray = userInput.split("");
            const inputLength = inputArray.length;
            const regularStr = inputArray.join('|');
            const matchedDegree = Math.max(1, inputLength / 2);
    
            let matchResult = [];
            searcher('fileName')
            .then(objArray => {
                objArray.forEach(obj => {
                    const regular = new RegExp(regularStr, 'g')
                    const matches = obj['fileName'].match(regular);
                    if (matches !== null) {
                        if (matches.length >= matchedDegree) { 
                            matchResult.push(obj['fileKey']);
                        }
                    }
                })
    
                if (matchResult.length >= 4) { // 如果结果 >= 4 , 则随机删去一半, 请原谅我笑出了声~
                    randomRemoveElement(matchResult, 0.5); // 属实过于扯蛋的操作~
                }
    
                resolve(matchResult);
            })
        }
    })
}

function allFileInf() {
    return new Promise(resolve => {
        let result = []
        getJsonObj()
        .then(jsonObj => {
            for (const childJsonObj of Object.values(jsonObj)) {
                result.push(childJsonObj)
            }
            resolve(result)
        })
    })
}

function allFileBasicInf() {
    return new Promise(resolve => {
        let result = []
        getJsonObj()
        .then(jsonObj => {
            for (const childJsonObj of Object.values(jsonObj)) {
                const newJsonData = {
                    fileKey: childJsonObj['fileKey'],
                    fileName: childJsonObj['fileName'],
                    author: childJsonObj['author'],
                    uploadDate: childJsonObj['uploadDate'],
                    isCollect: childJsonObj['isCollect'],
                };
                result.push(newJsonData)
            }
            resolve(result)
        })
    })
}

function allCollect() {
    return new Promise(resolve => {
        let result = []
        getJsonObj()
        .then(jsonObj => {
            for (const childJsonObj of Object.values(jsonObj)) {
                if (childJsonObj['isCollect'] == true) {
                    const newJsonData = {
                        fileKey: childJsonObj['fileKey'],
                        fileName: childJsonObj['fileName'],
                        author: childJsonObj['author'],
                    };
                    result.push(newJsonData);
                }
            }
            resolve(result)
        })
    })
}

/** 最近一个星期阅读的文本 */
function recentRead() {
    return new Promise(resolve => {
        let result = []
        let _ = {}
        getJsonObj()
        .then(jsonObj => {
            for (const childJsonObj of Object.values(jsonObj)) {
                const lastReadTime = childJsonObj['lastReadTime']
                const timeInterval = filterDates(lastReadTime)
                if (timeInterval) {
                    const newJsonData = {
                        fileKey: childJsonObj['fileKey'],
                        fileName: childJsonObj['fileName'],
                        isCollect: childJsonObj['isCollect'],
                        lastReadTime: timeInterval.dayDiff,
                    };
                    _[timeInterval.millisecond] = newJsonData; // 将毫秒时间与对象形成映射关系
                }
            }

            const afterSort = Object.keys(_).sort((a, b) => b - a); // 将毫秒时间从早到晚排序
            afterSort.forEach(millisecond => {
                const jsonObj = _[millisecond]; // 利用映射关系完成对象排序
                result.push(jsonObj)
            })

            resolve(result)
        })
    })
}

function recentUpload() {
    return new Promise(resolve => {
        let result = []
        getJsonObj()
        .then(jsonObj => {
            for (const childJsonObj of Object.values(jsonObj)) {
                const uploadDate = childJsonObj['uploadDate']
                if (filterDates(uploadDate)) {
                    const newJsonData = {
                        fileKey: childJsonObj['fileKey'],
                        fileName: childJsonObj['fileName'],
                        uploadDate: uploadDate,
                    };
                    result.push(newJsonData)
                }
            }
            resolve(result)
        })
    })
}

function recentUpdate() {
    return new Promise(resolve => {
        let result = []
        getJsonObj()
        .then(jsonObj => {
            for (const childJsonObj of Object.values(jsonObj)) {
                const recentUpdateTime = childJsonObj['recentUpdateTime']
                if (filterDates(recentUpdateTime)) {
                    const newJsonData = {
                        fileKey: childJsonObj['fileKey'],
                        fileName: childJsonObj['fileName'],
                        author: childJsonObj['author'],
                        recentUpdateTime: recentUpdateTime,
                    };
                    result.push(newJsonData)
                }
            }
            resolve(result)
        })
    })
}

function totalUploadCount() {
    return new Promise(resolve => {
        let uploadCount = [];
        searcher('fromUpload')
        .then(values => {
            values.forEach(value => {
                if (value['fromUpload']) {
                    uploadCount.push(value['fromUpload']);
                }
            })
            resolve(uploadCount.length);
        })
    })
}

function totalCreateCount() {
    return new Promise(resolve => {
        getJsonObj()
        .then(jsonObj => {
            const totalFileCount = Object.keys(jsonObj).length
            totalUploadCount()
            .then(value => {
                const result = totalFileCount - value
                resolve(result)
            })
        })
    })
}

function textTotalReadTime(fileKey) {
    return new Promise(resolve => {
        preciseMatcher(fileKey)
        .then(jsonObj => {
            let totalReadTime = jsonObj['totalReadTime']
            totalReadTime = parseFloat(totalReadTime.toFixed(2))
            resolve(totalReadTime)
        })
    })
}

function allTextTotalReadTime() {
    return new Promise(resolve => {
        let totalTime = 0
        searcher('totalReadTime')
        .then(array => {
            array.forEach(element => {
                totalTime += element['totalReadTime']
            });
            resolve(totalTime.toFixed(2))
        })
    })
}

function catalog(fileKey) {
    return new Promise(resolve => {
        preciseMatcher(fileKey)
        .then(jsonObj => {
            resolve(jsonObj['chapterName'])
        })
    })
}

function chapterContent(chapterId=1, fileKey) {
    return new Promise(resolve => {
        const filePath = path.join(uploadPath, fileKey, `chapter_${chapterId}.txt`)
        readFile(filePath)
        .then(result => {
            const pagesArray = splitChapterIntoPage(result)
            resolve(pagesArray)
        })
    })
}

function completeContent(fileKey) {
    return new Promise(resolve => {
        const filePath = path.join(uploadPath, fileKey, `${fileKey}.txt`)
        readFile(filePath)
        .then(result => {
            resolve(result);
        })
    })
}

function readMemory(fileKey) {
    return new Promise(resolve => {
        let jsonData = {}
        preciseMatcher(fileKey)
        .then(jsonObj => {
            jsonData['lastReadPage'] = jsonObj['lastReadPage']
            jsonData['lastReadChapter'] = jsonObj['lastReadChapter']
            jsonData['eachChapterWordCount'] = jsonObj['eachChapterWordCount']
            resolve(jsonData)
        })
    })
}

function splitChapterIntoPage(chapter) {
    let pagesArray = [];
    let pageWords = eachPageWords;
    for (let i = 0; i < chapter.length; i += eachPageWords) {
        pagesArray.push(chapter.substring(i, pageWords));
        pageWords += eachPageWords;
    }
    return pagesArray;
}

const turnToDateObj = (date) => {
    const parts = date.split('/');
    const partDate = parts[0].split('.');
    const year = parseInt(partDate[0]);
    const month = parseInt(partDate[1]) - 1;
    const day = parseInt(partDate[2]);
    const time = parts[1].split(':');
    const hour = parseInt(time[0]);
    const minute = parseInt(time[1]);
    const second = parseInt(time[2]);
    return new Date(year, month, day, hour, minute, second);
}

function filterDates(date) { // 筛选出最近7天Text
    if (! date) return false;

    const now = new Date();
    const dateObj = turnToDateObj(date);
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const oneDaysAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    if (dateObj < now) {
        if (dateObj > oneMinuteAgo) {
            const dayDiff = Math.ceil((now.getTime() - dateObj.getTime()) / 1000);
            return {'dayDiff': `${dayDiff}秒钟前`, 'millisecond': dateObj.getTime()}
        } else if (dateObj > oneHourAgo) {
            const dayDiff = Math.ceil((now.getTime() - dateObj.getTime()) / (1000 * 60));
            return {'dayDiff': `${dayDiff}分钟前`, 'millisecond': dateObj.getTime()}
        } else if (dateObj > oneDaysAgo) {
            const dayDiff = Math.ceil((now.getTime() - dateObj.getTime()) / (1000 * 3600));
            return {'dayDiff': `${dayDiff}小时前`, 'millisecond': dateObj.getTime()}
        } else if (dateObj > sevenDaysAgo) {
            const dayDiff = Math.ceil((now.getTime() - dateObj.getTime()) / (1000 * 3600 * 24));
            return {'dayDiff': `${dayDiff}天前`, 'millisecond': dateObj.getTime()}
        }
    } else {
        return false
    }
}

/** 以第二个参数为比率, 随机删去第一个数组参数中的元素 */
function randomRemoveElement(array, percentage) {
    const numElementsToRemove = Math.floor(array.length * percentage);
    for (let i = 0; i < numElementsToRemove; i++) {
        const randomIndex = Math.floor(Math.random() * array.length);
        array.splice(randomIndex, 1);
    }
    return array;
}

function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}

function getJsonObj() {
    return new Promise(resolve => {
        readFile(dbPath)
        .then(data => {
            const jsonObj = JSON.parse(data);
            resolve(jsonObj);
        })
        .catch(err => {
            return {};
        })
    })
}

exports.deleter = deleter
exports.updater = updater
// exports.preciseUpdater = preciseUpdater
exports.sameNameMatcher = sameNameMatcher
exports.preciseMatcher = preciseMatcher
exports.searcher = searcher
exports.handleSearch = handleSearch
exports.allFileInf = allFileInf
exports.allFileBasicInf = allFileBasicInf
exports.allCollect = allCollect
exports.recentRead = recentRead
exports.recentUpload = recentUpload
exports.recentUpdate = recentUpdate
exports.totalUploadCount = totalUploadCount
exports.totalCreateCount = totalCreateCount
exports.textTotalReadTime = textTotalReadTime
exports.allTextTotalReadTime = allTextTotalReadTime
exports.catalog = catalog
exports.chapterContent = chapterContent
exports.completeContent = completeContent
exports.readMemory = readMemory
