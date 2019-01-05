/*主进程*/
//用于维护electron声明周期的组件
const { app } = require('electron');
const logger = require('./common/Logger');
const helper = require('./process/MainProcessHelper');

/* ↓app对象生命周期维护开始↓ */

/**
 * app对象生命周期及事件
 * @see https://electronjs.org/docs/api/app
 */

// 这个方法将会在electron初始化完成后被调用
// 某些API只能在初始化之后(此状态之后)被调用
app.on('ready', helper.createWindow)

// 当所有窗口关闭时关闭应用程序
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        logger.info("点击窗口关闭按钮");
        app.quit();
    }
})

//当应用程序准备退出时执行动作
app.on('will-quit', () => {
    logger.info("程序即将退出");
});

//当应用程序激活时，通常在macOS下
app.on('activate', function () {
    //如果当前没有窗口被激活，则创建窗口
    if (helper.getMainWindow() === null) {
        helper.createWindow()
    }
})

/* ↑app对象生命周期维护结束↑ */