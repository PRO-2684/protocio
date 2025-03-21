<img src="./icons/icon.svg" align="right" style="width: 6em; height: 6em;"></img>

# 🚚 Protocio

> [!NOTE]
> 最近风控较为严格，作者的账号也没有幸免，现在无法在电脑上登录与调试。因此此插件暂停维护。

[LiteLoaderQQNT](https://github.com/mo-jinran/LiteLoaderQQNT) 插件，用于注册自定义协议，然后将链接交付给对应插件处理。

## 🪄 具体功能

- 协议注册：注册 `llqqnt://` 协议，当在浏览器中点击这种链接时，便会唤起 QQ
- 链接交付：此插件得知 `llqqnt://<name>/...` 链接被点击时，会调用链接指定的 URL 处理器 `name` 来处理此事件。通常建议单个插件仅注册一个处理器，且使用插件标识符 `slug` 作为 `name`。
- 内置处理器：此插件亦注册了一个 URL 处理器，用于处理 `llqqnt://protocio/` 链接
    - [`ping`](llqqnt://protocio/ping)：在控制台输出 `pong`，用于测试
    - `quit/<second>`：在指定秒数后退出 QQNT，未指定或小于等于 0 则立即退出 (e.g. [`llqqnt://protocio/quit/5`](llqqnt://protocio/quit/5))
    - `restart/<second>`：在指定秒数后重启 QQNT，未指定或小于等于 0 则立即重启 (e.g. [`llqqnt://protocio/restart/5`](llqqnt://protocio/restart/5))
    - [`register`](llqqnt://protocio/register)：注册 `llqqnt://` 协议 (通常来说没有用，因为要成功调用的话已经注册了，除非使用命令行 `QQ.exe llqqnt://protocio/register`)
    - [`unregister`](llqqnt://protocio/unregister)：注销 `llqqnt://` 协议 (由于实现原因，可能不生效；注销后若需再次注册则需要重启 QQNT 或使用上述命令行)
    - [`list`](llqqnt://protocio/list)：列出所有已注册的 URL 处理器
    - 其它：其它命令会在控制台输出 `Unknown command: <command>`，用于调试 (e.g. [`llqqnt://protocio/bad-command`](llqqnt://protocio/bad-command))

## 📥 安装

### 自动安装

在 [插件安装器](https://github.com/xinyihl/LiteLoaderQQNT-PluginInstaller) 或 [插件列表查看](https://github.com/ltxhhz/LL-plugin-list-viewer) 中找到 Protocio 并安装。

### 手动安装

- 稳定版: 下载 Release 中的 `protocio-release.zip`，解压后放入[数据目录](https://github.com/mo-jinran/LiteLoaderQQNT-Plugin-Template/wiki/1.%E4%BA%86%E8%A7%A3%E6%95%B0%E6%8D%AE%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84#liteloader%E7%9A%84%E6%95%B0%E6%8D%AE%E7%9B%AE%E5%BD%95)下的 `plugins/protocio` 文件夹中即可。(若没有该文件夹请自行创建)
- CI 版: 若想体验最新的 CI 功能，可以下载源码后同上安装。(仅需下载下面列出的文件)

完成后的目录结构应该如下:

```
plugins (所有的插件目录)
└── protocio (此插件目录)
    ├── manifest.json (插件元数据)
    ├── main.js (插件脚本)
    └── icons/ (插件用到的图标)
```

## 🤔 使用方法

### 注册 URL 处理器

在您的插件主进程中，在 `app.whenReady` 后使用 `LiteLoader.api.registerUrlHandler(slug, handler, force)` 注册您的网址处理器。若直接使用 `LiteLoader.api.registerUrlHandler`，会导致注册是否成功取决于 Protocio 和您的插件的加载顺序。此函数接受三个参数：

- `slug` 为您的 URL 处理器名，通常建议直接使用您的插件的标识符。
- `handler: (rest, url) => {}` 为回调函数。传入两个参数，分别为 URL 剩余部分的数组和完整的 URL。通常只需要使用第一个参数。
- `force: boolean` 为可选参数。当 *尝试注册已经注册过的处理器* 时，若为 `true` 则强制覆盖，否则出错。默认为 `false`。

此函数的返回值为一个对象，通过 `success` 键表示注册是否成功，通过 `message` 键提供相关提示消息。具体会返回什么提示消息请参考 [`main.js`](https://github.com/PRO-2684/protocio/blob/main/main.js) 中 `LiteLoader.api.registerUrlHandler =` 开头的函数定义。以下是一段代码示例：

```javascript
const { app } = require("electron");
app.whenReady().then(() => {
    LiteLoader.api.registerUrlHandler("<slug>", (rest, url) => {
        // rest: URL 剩余部分的数组，空值被过滤
        //     e.g. llqqnt://<slug>/a/b//c => ["a", "b", "c"]
        // url: 完整的 URL，通常不需要使用
        doSomething(); // 处理...
    });
});
```

### 注销 URL 处理器

在您的插件主进程中，使用 `LiteLoader.api.unregisterUrlHandler(slug, ignore)` 注销您的网址处理器。此函数接受两个参数：

- `slug` 为您的 URL 处理器名，通常建议直接使用您的插件的标识符。
- `ignore: boolean` 为可选参数，若为 `true` 则忽略 *尝试注销不存在的处理器* 导致的错误。默认为 `false`。

此函数的返回值为一个对象，通过 `success` 键表示注销是否成功，通过 `message` 键提供相关提示消息。具体会返回什么提示消息请参考 [`main.js`](https://github.com/PRO-2684/protocio/blob/main/main.js) 中 `LiteLoader.api.unregisterUrlHandler =` 开头的函数定义。由于通常不需要注销处理器，此处不提供代码示例。

## ⚠️ 注意事项

- 关于多个 QQNT 实例的兼容性：此插件**允许运行多个 QQNT 实例**，但是**只有第一个实例**会响应 `llqqnt://` 链接。

## 💻 调试

Debug 模式：若您想要调试**此插件本身**，可以使用 `--protocio-debug` 参数启动 QQNT，此时插件会在控制台输出更详细的调试信息。

## ⭐ Star History

[![Stargazers over time](https://starchart.cc/PRO-2684/protocio.svg?variant=adaptive)](https://starchart.cc/PRO-2684/protocio)
