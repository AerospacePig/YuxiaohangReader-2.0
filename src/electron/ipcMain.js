const { ipcMain } = require('electron');
const Store = require('electron-store');
const {
    updater,
    deleter,
    sameNameMatcher,
    preciseMatcher,
    searcher,
    handleSearch,
    allFileInf,
    allFileBasicInf,
    allCollect,
    recentRead,
    recentUpload,
    recentUpdate,
    totalUploadCount,
    totalCreateCount,
    textTotalReadTime,
    allTextTotalReadTime,
    catalog,
    chapterContent,
    completeContent,
    readMemory,
} = require('./dbHandel');
const { writeFile, creatNewFile } = require('./editText');
const { uploadHandle } = require('./uploadFile');

module.exports = IpcMainEvent = (win, app) => {
    const settingsStore = new Store({ name: 'settings' })

    ipcMain.on('window-min', () => {
        win.minimize()
    })

    ipcMain.on('window-max', () => {
        if (win.isMaximized()) {
            win.restore();
        } else {
            win.maximize();
            win.webContents.send('window-resize', true);
        }
    })

    ipcMain.on('window-resize', (event, value) => {
        if (win.isMaximized()) {
            event.reply('window-maximized', true);
        } else {
            event.reply('window-maximized', false);
        }
    })

    ipcMain.on('window-close', async () => {
        const settings = await settingsStore.get('settings')
        if (settings.other.quitApp == 'quit') {
            win.close()
        } else if (settings.other.quitApp == 'minimize') {
            win.hide()
        }
    })

    ipcMain.handle('update-file', async (event, content, fileKey, isFirstBuild) => {
        const writeFileLogs = await writeFile(content, fileKey, isFirstBuild)
        win.webContents.send('db-update-monitor')
        return writeFileLogs;
    })

    ipcMain.handle('creat-new-file', async (event, content, textName) => {
        const creatFileLogs = await creatNewFile(content, textName)
        win.webContents.send('db-update-monitor')
        return creatFileLogs;
    })

    ipcMain.handle('upload-file', async (event) => {
        const uploadLogs = await uploadHandle()
        win.webContents.send('db-update-monitor')
        return uploadLogs;
    })

    ipcMain.handle('use-updater', async (event, fileKey, targetKeyArray, newValueArray) => {
        const result = await updater((jsonData) => {
            targetKeyArray.forEach((targetKey, index) => { // 双数组同步遍历
                const newValue = newValueArray[index];
                jsonData['ID-' + fileKey][targetKey] = newValue;
            })
        })
        win.webContents.send('db-update-monitor')
        return result
    })

    ipcMain.handle('use-deleter', async (event, fileKey) => {
        const deleteLogs = await deleter(fileKey)
        win.webContents.send('db-update-monitor')
        return deleteLogs
    })

    ipcMain.handle('use-same-name-matcher', async (event, value) => {
        const jsonObjArray = await sameNameMatcher(value)
        return jsonObjArray
    })

    ipcMain.handle('use-precise-matcher', async (event, fileKey) => {
        const jsonObj = await preciseMatcher(fileKey)

        function dataFilter(jsonObj) {
            delete jsonObj['extensionName'];
            delete jsonObj['filePath'];
            delete jsonObj['chapterName'];
            delete jsonObj['lastReadPage'];
            delete jsonObj['lastReadChapter'];
            delete jsonObj['eachChapterWordCount'];
            return jsonObj
        }

        return dataFilter(jsonObj);
    })

    ipcMain.handle('use-searcher', async (event, keyName) => {
        const valueArray = await searcher(keyName)
        return valueArray
    })

    ipcMain.handle('handle-search', async (event, userInput) => {
        const matchResult = await handleSearch(userInput)
        return matchResult
    })

    ipcMain.handle('get-all-file-inf', async (event) => {
        const result = await allFileInf()
        return result
    })

    ipcMain.handle('get-all-file-basic-inf', async (event) => {
        const result = await allFileBasicInf()
        return result
    })

    ipcMain.handle('get-all-collect', async (event) => {
        const result = await allCollect()
        return result
    })

    ipcMain.handle('get-recent-read', async (event) => {
        const result = await recentRead()
        return result
    })

    ipcMain.handle('get-recent-upload', async (event) => {
        const result = await recentUpload()
        return result
    })

    ipcMain.handle('get-recent-update', async (event) => {
        const result = await recentUpdate()
        return result
    })

    ipcMain.handle('get-total-upload-count', async (event) => {
        const result = await totalUploadCount()
        return result
    })

    ipcMain.handle('get-total-create-count', async (event) => {
        const result = await totalCreateCount()
        return result
    })

    ipcMain.handle('get-text-total-read-time', async (event, fileKey) => {
        const result = await textTotalReadTime(fileKey)
        return result
    })

    ipcMain.handle('get-all-text-total-read-time', async (event) => {
        const result = await allTextTotalReadTime()
        return result
    })

    ipcMain.handle('get-catalog', async (event, fileKey) => {
        const result = await catalog(fileKey)
        return result
    })

    ipcMain.handle('get-chapter-content', async (event, chapterId, fileKey) => {
        const result = await chapterContent(chapterId, fileKey)
        return result
    })

    ipcMain.handle('get-complete-content', async (event, fileKey) => {
        const result = await completeContent(fileKey)
        return result
    })

    ipcMain.handle('get-read-memory', async (event, fileKey) => {
        const result = await readMemory(fileKey)
        return result
    })

    ipcMain.on('set-settings', (e, settings) => {
        settingsStore.set('settings', JSON.parse(settings))
    })

    ipcMain.handle('get-settings', async () => {
        const settings = await settingsStore.get('settings')
        if (settings) {
            return settings;
        } else {
            let initSettings = {
                local: {
                    uploadPath: './././src/assets/text', // 路径不允许用户修改
                    dbPath: './././src/assets/db/db_1.json',
                },
                textRead: {
                    fontSize: 14, // 用户自定义设置, 允许用户修改
                    lineHeight: 1.5,
                    letterSpacing: 1,
                    fontFamily: 'Arial',
                    fontColor: 'rgba(0, 0, 0, 1)',
                    eachPageWords: 1000,
                    readBackground: true,
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',

                    defaultFontSize: 14, // 默认出厂设置, 不应该变动
                    defaultLineHeight: 1.5,
                    defaultletterSpacing: 1,
                    defaultFontFamily: 'Arial',
                    defaultFontColor: 'rgba(0, 0, 0, 1)',
                    defaultEachPageWords: 1000,
                    defaultReadBackground: true,
                    defaultBackgroundColor: 'rgba(255, 255, 255, 0.6)',
                },
                other: {
                    writeSpread: false, // 用户自定义设置, 允许用户修改
                    readSpread: true,
                    isDispalyBackgroundImage: true,
                    quitApp: 'quit',

                    defaultReadBarSpread: true, // 默认出厂设置, 不应该变动
                    defaultWriteBarSpread: false,
                    defaultDispalyBackgroundImage: true,
                    defaultQuitApp: 'quit',
                }
            }
            settingsStore.set('settings', initSettings)
            return initSettings;
        }
    })
}
