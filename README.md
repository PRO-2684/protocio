<img src="./icons/icon.svg" align="right" style="width: 6em; height: 6em;"></img>

# Protocio

[LiteLoaderQQNT](https://github.com/mo-jinran/LiteLoaderQQNT) 插件，用于注册自定义协议，然后将链接交付给对应插件处理。

## 🪄 具体功能

TODO

## 🖼️ 截图

TODO

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

TODO

## 💻 调试

Debug 模式：若您想要调试**此插件本身**，可以使用 `--protocio-debug` 参数启动 QQNT，此时插件会在控制台输出更详细的调试信息。
