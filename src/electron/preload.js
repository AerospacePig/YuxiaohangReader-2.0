const { contextBridge, ipcRenderer } = require('electron')

function windowMin() {
    ipcRenderer.send('window-min')
}

function windowMax() {
    ipcRenderer.send('window-max')
}

function windowMaximized(eventAddCount, callback) {
    ipcRenderer.on('window-maximized', callback) // 这是项目最开始时候写的, 现在项目快结束了, 回看这代码好蠢
    if (eventAddCount > 1) ipcRenderer.removeListener('window-maximized', callback);
}

function windowResize() {
    ipcRenderer.send('window-resize')
}

function windowClose() {
    ipcRenderer.send('window-close')
}

function dbUpdateMonitor(callback) {
    ipcRenderer.on('db-update-monitor', callback)
}

function removeAllDbUpdateMonitor() {
    ipcRenderer.removeAllListeners('db-update-monitor')
}

function setSettings(settings) {
    ipcRenderer.send('set-settings', settings)
}

contextBridge.exposeInMainWorld('windowApi', {
    windowMin,
    windowMax,
    windowMaximized,
    windowResize,
    windowClose,
    dbUpdateMonitor,
    removeAllDbUpdateMonitor,
    setSettings,
    getSettings: () => ipcRenderer.invoke('get-settings'),
    updateFile: (content, fileKey, isFirstBuild) => ipcRenderer.invoke('update-file', content, fileKey, isFirstBuild),
    creatNewFile: (content, textName) => ipcRenderer.invoke('creat-new-file', content, textName),
    uploadFile: () => ipcRenderer.invoke('upload-file'),
    useUpdater: (fileKey, arg1, arg2) => ipcRenderer.invoke('use-updater', fileKey, arg1, arg2),
    useDeleter: (fileKey) => ipcRenderer.invoke('use-deleter', fileKey),
    useSameNameMatcher: (value) => ipcRenderer.invoke('use-same-name-matcher', value),
    usePreciseMatcher: (fileKey) => ipcRenderer.invoke('use-precise-matcher', fileKey),
    useSearcher: (keyName) => ipcRenderer.invoke('use-searcher', keyName),
    handleSearch: (matchResult) => ipcRenderer.invoke('handle-search', matchResult),
    getAllFileInf: () => ipcRenderer.invoke('get-all-file-inf'),
    getAllFileBasicInf: () => ipcRenderer.invoke('get-all-file-basic-inf'),
    getAllCollect: () => ipcRenderer.invoke('get-all-collect'),
    getTextTotalReadTime: (fileKey) => ipcRenderer.invoke('get-text-total-read-time', fileKey),
    getAllTextTotalReadTime: () => ipcRenderer.invoke('get-all-text-total-read-time'),
    getTotalCreateCount: () => ipcRenderer.invoke('get-total-create-count'),
    getTotalUploadCount: () => ipcRenderer.invoke('get-total-upload-count'),
    getRecentUpdate: () => ipcRenderer.invoke('get-recent-update'),
    getRecentUpload: () => ipcRenderer.invoke('get-recent-upload'),
    getRecentRead: () => ipcRenderer.invoke('get-recent-read'),
    getCatalog: (fileKey) => ipcRenderer.invoke('get-catalog', fileKey),
    getChapterContent: (chapterId, fileKey) => ipcRenderer.invoke('get-chapter-content', chapterId, fileKey),
    getCompleteContent: (fileKey) => ipcRenderer.invoke('get-complete-content', fileKey),
    getReadMemory: (fileKey) => ipcRenderer.invoke('get-read-memory', fileKey),
    getSettings: () => ipcRenderer.invoke('get-settings'),
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    getLocalBookImage: (filePath) => ipcRenderer.invoke('get-image-base64', filePath),
    getLastPlaylist: () => ipcRenderer.invoke('get-last-playlist'),
    getRequestData: (request) => ipcRenderer.invoke('get-request-data', request),
    bookTextIsExists: (obj) => ipcRenderer.invoke('book-text-isexists', obj),
    deleteBookText: (id) => ipcRenderer.invoke('delete-book-text', id),
})
