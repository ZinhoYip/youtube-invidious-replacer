# YouTube to Invidious Replacer (油猴脚本)

一个简单而强大的油猴脚本，它能将 YouTube 网站原生的视频播放器替换为 Invidious 的嵌入式 iframe 播放器。

This is a powerful Tampermonkey script that replaces the native YouTube player with an Invidious embed iframe.

---

## 解决的问题 (Features)

这个脚本是我们逐步调试的成果，旨在解决以下所有问题：
* **替换播放器**: 核心功能，使用 Invidious 作为播放核心，绕过googlevideo.com，屏蔽掉youtube的广告。
* **双重音频**: 解决了在网络环境良好时，YouTube 原生音频与 Invidious 音频同时播放的问题。
* **UI 遮挡**: 解决了 Invidious 播放器的进度条、暂停等控件被 YouTube 原生UI遮挡而无法点击的问题。
* **安全策略兼容**: 解决了现代浏览器和 YouTube 的 TrustedHTML 安全策略导致的脚本错误。
* **动态加载兼容**: 脚本能稳定地等待 YouTube 动态加载的播放器出现后再执行替换。
* **页面内导航兼容**: 支持在 YouTube 网站内切换视频（单页应用导航）时自动为新视频进行替换。

## 如何安装 (Installation)

1.  首先，请确保您的浏览器已经安装了 [Tampermonkey](https://www.tampermonkey.net/) 扩展。
2.  然后，**[点击此处直接安装脚本](https://github.com/ZinhoYip/youtube-invidious-replacer/raw/refs/heads/main/YT-Replacer.user.js)**。

## 自定义 (Configuration)

您可以编辑脚本，修改顶部的 `INVIDIOUS_INSTANCE_DOMAIN` 常量为您喜欢的、更快的 Invidious 公共实例地址。

```javascript
 const INVIDIOUS_INSTANCE_DOMAIN = 'https://inv.nadeko.net';// 在这里修改
```

## 许可证 (License)

本项目采用 [MIT License](./LICENSE) 开源。
