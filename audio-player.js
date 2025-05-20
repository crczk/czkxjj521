// audio-player.js
(function() {
    // 1. 获取页面中的 <audio> 元素
    const audio = document.getElementById('bgm-audio');
    if (!audio) return;

    // 2. 从 localStorage 读取上次保存的播放进度（秒）
    const savedTime = parseFloat(localStorage.getItem('bgm_currentTime')) || 0;

    // 3. 在音频元数据加载完毕后，设置 currentTime 并尝试播放
    audio.addEventListener('loadedmetadata', function() {
        // 只有当 savedTime 在合法范围内时才赋值
        if (savedTime > 0 && savedTime < audio.duration) {
            audio.currentTime = savedTime;  // 恢复进度:contentReference[oaicite:0]{index=0}
        }
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.warn('音频自动播放被阻止：', err);
            });
        }
    });

    // 4. 监听 timeupdate 事件，将 currentTime 写入 localStorage
    audio.addEventListener('timeupdate', function() {
        localStorage.setItem('bgm_currentTime', audio.currentTime);
    });

    // 5. 监听用户首次交互，解除静音并继续播放
    function attemptUnmute() {
        if (audio.muted) {
            audio.muted = false;              // 解除静音:contentReference[oaicite:1]{index=1}
            audio.play().catch(err => {
                console.warn('解除静音后播放失败：', err);
            });
        }
        window.removeEventListener('click', attemptUnmute);
        window.removeEventListener('touchstart', attemptUnmute);
    }
    window.addEventListener('click', attemptUnmute);
    window.addEventListener('touchstart', attemptUnmute);
})();
