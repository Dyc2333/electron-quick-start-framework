//用于创建原生浏览器窗口的组件对象
const { BrowserWindow } = require('electron')//引入electron
const path = require('path');//原生库path模块

const logger = require('../common/Logger');//引入全局日志组件
const config = require('../common/Config');//引入全局配置组件

// 为了保证一个对全局windows对象的引用，就必须在方法体外声明变量
// 否则当方法执行完成时就会被JavaScript的垃圾回收机制清理
let mainWindow

function createWindow() {
    logger.info("[MainProcessHelper][createWindow]初始化渲染窗口");

    // 创建浏览器窗口
    mainWindow = new BrowserWindow({ width: config.getConfigVal("window").width, height: config.getConfigVal("window").height, frame: true })//TODO 页面宽高改为配置项

    // 引入主入口界面
    mainWindow.loadFile(config.getConfigVal("firstview") + ".html");//TODO 主入口改为配置项

    if (config.getConfigVal("debug")) {
        // 打开开发者工具
        mainWindow.webContents.openDevTools();//TODO 改为调试模式配置项
    }


    // 当窗口关闭时触发
    mainWindow.on('closed', function () {
        logger.info("[MainProcessHelper][_mainWindow_.on._closed_]渲染窗口关闭");

        //将全局mainWindow置为null
        mainWindow = null
    });
}

/**
 * 返回全局mainWindow对象
 */
function getMainWindow() {
    return mainWindow;
}


/* ↓全局变量配置区开始↓ */

//全局路由参数传递缓冲区
global.sharedObject = {
    args: {
        default: 'default_arg',
    }
}

//全局状态机共享区
let statusMap = new Map();
statusMap.set('default', 'default_value');
global.sharedStatus = {
    statusMap: statusMap//全局状态对象
}

/* ↑全局变量配置区结束↑ */

/* ↓路由功能开始↓ */


/**
 * 打开新窗口并传递参数
 * @kind MainProcessOnly [仅能主进程调用]
 * @param {string} view 视图名称
 * @param {any} args 传递给新的视图的参数对象
 */
function openNewWindow(view, args) {
    if (args != null) {
        global.sharedObject.args.default = args;//保存路由传递参数到缓冲区
    }
    const modalPath = path.join('file://', __dirname, '/src/view/' + view + '.html');
    logger.info("[MainProcessHelper][openNewWindow]新视图 " + view + " 已加载");
    mainWindow.loadURL(modalPath);//使用loadFile方法动态修改渲染进程容器中的视图
}



/**
 * 获取传递给当前窗口的参数
 * @kind MainProcessOnly [仅能主进程调用]
 * @return any 路由变量
 */
function getRouterArgs() {
    return global.sharedObject.args.default;//返回全局
}


const ipcMain = require('electron').ipcMain;//ipcMain进程对象

//ipcMain收到router信号
ipcMain.on('router', function (sys, view) {
    logger.info("[MainProcessHelper][_router_]主进程main.js收到跳转指令信号 目标视图 " + view);
    openNewWindow(view);
});

/**
 * 注册主进程收到特定信号的回调函数
 * @kind MainProcessOnly [仅主进程]
 * @param {string} signal 收到的信号量
 * @param {function} callback 回调函数
 */
function registeCallback(signal, callback) {
    if (typeof callback === "function") {
        ipcMain.on(signal, (sys, args) => {
            callback(args, sys);
        });
    }
}

module.exports = { createWindow, getMainWindow, openNewWindow }