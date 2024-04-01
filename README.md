<img src="./icons/icon.svg" align="right" style="width: 6em; height: 6em;"></img>

# 🚚 Protocio

[LiteLoaderQQNT](https://github.com/mo-jinran/LiteLoaderQQNT) 插件，用于注册自定义协议，然后将链接交付给对应插件处理。

## 🪄 具体功能

- 协议注册：注册 `llqqnt://` 协议，当在浏览器中点击这种链接时，便会唤起 QQ
- 链接交付：此插件得知 `llqqnt://<slug>/...` 链接被点击时，会调用链接指定的插件 (`slug`) 来处理此事件
- 内置处理器：此插件亦注册了一个处理器，用于处理 `llqqnt://protocio/` 链接
    - [`ping`](llqqnt://protocio/ping)：在控制台输出 `pong`，用于测试
    - `quit/<second>`：在指定秒数后退出 QQNT，未指定或小于等于 0 则立即退出 (e.g. [`llqqnt://protocio/quit/5`](llqqnt://protocio/quit/5))
    - `restart/<second>`：在指定秒数后重启 QQNT，未指定或小于等于 0 则立即重启 (e.g. [`llqqnt://protocio/restart/5`](llqqnt://protocio/restart/5))
    - [`register`](llqqnt://protocio/register)：注册 `llqqnt://` 协议 (通常来说没有用，因为要成功调用的话已经注册了，除非使用命令行 `QQ.exe llqqnt://protocio/register`)
    - [`unregister`](llqqnt://protocio/unregister)：注销 `llqqnt://` 协议 (由于实现原因，可能不生效；注销后若需再次注册则需要重启 QQNT 或使用上述命令行)
    - 其它：其它命令会在控制台输出 `Unknown command: <args>`，用于调试 (e.g. [`llqqnt://protocio/non/exist/command`](llqqnt://protocio/non/exist/command))

## 📥 安装

### 插件商店

在插件商店中找到 Protocio 并安装。

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

```javascript
app.whenReady().then(() => {
    LiteLoader.api.registerUrlHandler("<slug>", (rest, url) => {
        // rest: URL 剩余部分的数组，空值被过滤
        //     e.g. llqqnt://<slug>/a/b//c => ["a", "b", "c"]
        // url: 完整的 URL，通常不需要使用
        doSomething(); // 处理...
    }
});
```

## 💻 调试

Debug 模式：若您想要调试**此插件本身**，可以使用 `--protocio-debug` 参数启动 QQNT，此时插件会在控制台输出更详细的调试信息。
