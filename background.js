const { app, BrowserWindow } = require('electron')
const Winstate = require('electron-win-state').default
const { autoUpdater } = require("electron-updater");
const IpcMainEvent = require('./src/electron/ipcMain')
const path = require('node:path')

let myWindow = null;
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (myWindow) {
            if (myWindow.isMinimized()) {
                myWindow.restore()
            }
            if (!myWindow.isVisible()) {
                myWindow.show()
            }
            myWindow.focus()
        }
    })
}

const createWindow = () => {
    const winstate = new Winstate({
        defaultWidth: 800,
        defaultHeight: 530,
    })

    const win = new BrowserWindow({
        width: 800,
        height: 530,
        minWidth: 800,
        minHeight: 530,
        frame: false, // 取消默认头部
        useContentSize: false, // 窗口大小是否包括标题和菜单栏
        autoHideMenuBar: true, // 隐藏菜单栏
        minimizable: true, // 可否最小化
        maximizable: true, // 可否最大化
        closable: true, // 展示关闭按钮
        fullscreen: false, // MAC下是否可以全屏
        skipTaskbar: false, // 在任务栏中显示窗口
        acceptFirstMouse: true, // 是否允许单击页面来激活窗口
        transparent: false, // 是否启用透明背景
        movable: true, // 可否移动
        title: "YxiaohangReader 2.0",
        backgroundColor: '#fff',
        ...winstate.winOptions,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, './src/electron/preload.js')
        },
        className: 'window-class',
    })

    myWindow = win
    winstate.manage(win)
    process.env.DIST = path.join(__dirname, './')
    const indexHtml = path.join(process.env.DIST, 'dist/index.html')

    if (process.resourcesPath.indexOf('\\node_modules\\') !== -1)
        win.loadURL('http://localhost:5173/')
    else
        win.loadFile(indexHtml)

    win.once('ready-to-show', () => {
        win.show()
        if (process.resourcesPath.indexOf('\\node_modules\\') === -1) {
            autoUpdater.autoDownload = false
            autoUpdater.on('update-available', info => {
                win.webContents.send('check-update', info.version)
            });
            autoUpdater.checkForUpdatesAndNotify()
        }
    })

    IpcMainEvent(win, app)
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
