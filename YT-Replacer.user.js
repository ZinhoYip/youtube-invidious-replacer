// ==UserScript==
// @name         (v1.0) YouTube to Invidious Iframe Replacer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将 YouTube 播放器替换为 Invidious iframe
// @author       Zinho
// @match        *://www.youtube.com/watch*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const INVIDIOUS_INSTANCE_DOMAIN = 'https://inv.nadeko.net';
    let currentVideoId = null;

    function waitForElement(selector) {
        return new Promise(resolve => {
            const element = document.querySelector(selector);
            if (element) { return resolve(element); }
            const observer = new MutationObserver(() => {
                const targetNode = document.querySelector(selector);
                if (targetNode) {
                    observer.disconnect();
                    resolve(targetNode);
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        });
    }

    async function replacePlayer() {
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get('v');

        // 检查视频ID是否变化，防止不必要的重载
        if (!videoId || videoId === currentVideoId) {
            // 如果ID没变，但可能只是时间戳变了（比如用户点击了带时间的评论），则不处理
            // 一个更完整的方案会很复杂，目前我们只在视频切换时重载
            return;
        }

        console.log(`[YT-Replacer-v1.0] 检测到新视频页面。ID: ${videoId}`);
        currentVideoId = videoId;

        try {
            const moviePlayer = await waitForElement('#movie_player');

            if (typeof moviePlayer.mute === 'function') {
                moviePlayer.mute();
                moviePlayer.pauseVideo();
            }

            moviePlayer.replaceChildren();

            const iframe = document.createElement('iframe');
            iframe.id = 'invidious-iframe-player';

            // --- 核心改动在这里 ---
            // 1. 构造基础的 embed 链接
            let iframeSrc = `${INVIDIOUS_INSTANCE_DOMAIN}/embed/${videoId}?autoplay=1`;

            // 2. 检查URL中是否存在 't' (时间) 参数
            const timeParam = urlParams.get('t');
            if (timeParam) {
                // parseInt 会自动忽略末尾的 's' 字符，例如 '3256s' -> 3256
                const startTime = parseInt(timeParam, 10);
                if (!isNaN(startTime) && startTime > 0) {
                    // 3. 如果存在有效的时间参数，就把它附加到链接后面
                    iframeSrc += `&t=${startTime}`;
                    console.log(`[YT-Replacer-v1.0] 发现时间戳，将从 ${startTime} 秒开始播放。`);
                }
            }

            iframe.src = iframeSrc;

            iframe.style.position = 'absolute';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.zIndex = '9999';
            iframe.setAttribute('allowfullscreen', 'true');
            iframe.setAttribute('allow', 'autoplay; fullscreen');
            moviePlayer.style.position = 'relative';
            moviePlayer.appendChild(iframe);

            console.log(`[YT-Replacer-v1.0] Iframe 替换成功！最终链接: ${iframe.src}`);

        } catch (error) {
            console.error('[YT-Replacer-v1.0] 在替换播放器时发生错误:', error);
        }
    }

    let lastUrl = location.href;
    console.log('[YT-Replacer-v1.0] 脚本已启动，正在监听URL变化...');
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if (url.includes('/watch')) {
                currentVideoId = null;
                replacePlayer();
            }
        }
    }).observe(document, { subtree: true, childList: true });

    if (location.href.includes('/watch')) {
        replacePlayer();
    }

})();