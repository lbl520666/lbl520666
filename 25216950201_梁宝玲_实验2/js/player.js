// 1. 获取DOM元素
const audio = document.getElementById('audio-player');
const playPauseBtn = document.querySelector('.play-pause-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const listBtn = document.querySelector('.list-btn');
const playList = document.querySelector('.play-list');
const songList = document.querySelector('.song-list');
const listItems = songList.querySelectorAll('.list-item');
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const currentTimeEl = document.querySelector('.current-time');
const totalTimeEl = document.querySelector('.total-time');
const songTitleEl = document.querySelector('.song-title h1');
const songSingerEl = document.querySelector('.song-title p');
const bgContainer = document.querySelector('.bg-container');
const coverImg = document.querySelector('.cover-img');
const volumeBtn = document.querySelector('.volume-btn');
const volumeSlider = document.querySelector('.volume-slider');
const volumeRange = document.querySelector('.volume-range');
const mvBtn = document.querySelector('.mv-btn');
const mvModal = document.querySelector('.mv-modal');
const closeModal = document.querySelector('.close-modal');
const mvPlayer = document.querySelector('.mv-player');
const speedEl = document.querySelector('.speed');
const modeBtn = document.querySelector('.mode-btn');

// 2. 全局变量
let currentIndex = 0;
let playMode = 0; // 0:顺序 1:循环 2:随机
let isMuted = false;

// 3. 工具函数：时间格式化
function formatTime(seconds) {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
}

// 4. 核心功能：播放当前歌曲
function playCurrentSong() {
    const currentItem = listItems[currentIndex];
    // 更新音频、封面、背景、标题
    audio.src = currentItem.dataset.src;
    coverImg.src = currentItem.dataset.cover;
    bgContainer.style.backgroundImage = `url(${currentItem.dataset.bg})`;
    songTitleEl.textContent = currentItem.dataset.title;
    songSingerEl.textContent = `作者：${currentItem.dataset.singer}`;
    // 更新MV源
    mvPlayer.src = currentItem.dataset.mv;
    // 列表高亮
    listItems.forEach(item => item.classList.remove('active'));
    currentItem.classList.add('active');
    // 播放音频
    audio.play();
    playPauseBtn.innerHTML = '<img src="./img/暂停.png" alt="暂停">';
}

// 5. 播放/暂停切换
playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.innerHTML = '<img src="./img/暂停.png" alt="暂停">';
    } else {
        audio.pause();
        playPauseBtn.innerHTML = '<img src="./img/继续播放.png" alt="继续播放">';
    }
});

// 6. 上一曲/下一曲
prevBtn.addEventListener('click', () => {
    switch (playMode) {
        case 0: // 顺序
            currentIndex = (currentIndex - 1 + listItems.length) % listItems.length;
            break;
        case 1: // 循环
            currentIndex = (currentIndex - 1 + listItems.length) % listItems.length;
            break;
        case 2: // 随机
            currentIndex = Math.floor(Math.random() * listItems.length);
            break;
    }
    playCurrentSong();
});
nextBtn.addEventListener('click', () => {
    switch (playMode) {
        case 0: // 顺序
            currentIndex = (currentIndex + 1) % listItems.length;
            break;
        case 1: // 循环
            currentIndex = (currentIndex + 1) % listItems.length;
            break;
        case 2: // 随机
            currentIndex = Math.floor(Math.random() * listItems.length);
            break;
    }
    playCurrentSong();
});

// 7. 播放列表控制
listBtn.addEventListener('click', () => {
    playList.classList.toggle('show');
});
// 列表项点击
listItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
        currentIndex = idx;
        playCurrentSong();
        playList.classList.remove('show'); // 关闭列表
    });
});

// 8. 进度条更新
audio.addEventListener('timeupdate', () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
});
// 加载完成显示总时长
audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
});
// 点击进度条跳转
progressBar.addEventListener('click', (e) => {
    const barWidth = progressBar.offsetWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / barWidth) * audio.duration;
});

// 9. 音量控制
volumeBtn.addEventListener('click', () => {
    volumeSlider.style.display = volumeSlider.style.display === 'none' ? 'block' : 'none';
    isMuted = !isMuted;
    audio.muted = isMuted;
    volumeBtn.innerHTML = isMuted ? '<img src="./img/静音.png" alt="静音">' : '<img src="./img/音量.png" alt="音量">';
});
volumeRange.addEventListener('input', () => {
    audio.volume = volumeRange.value;
});

// 10. MV播放
mvBtn.addEventListener('click', () => {
    mvModal.style.display = 'flex';
    mvPlayer.play();
});
closeModal.addEventListener('click', () => {
    mvModal.style.display = 'none';
    mvPlayer.pause();
});

// 11. 播放模式切换
modeBtn.addEventListener('click', () => {
    playMode = (playMode + 1) % 3;
    let modeImg = '';
    switch (playMode) {
        case 0: modeImg = 'mode1.png'; break;
        case 1: modeImg = 'mode2.png'; break;
        case 2: modeImg = 'mode3.png'; break;
    }
    modeBtn.innerHTML = `<img src="./img/${modeImg}" alt="播放模式">`;
});

// 12. 倍速切换（点击倍速文字）
speedEl.addEventListener('click', () => {
    const speeds = [0.5, 1.0, 1.5, 2.0];
    let currentSpeed = audio.playbackRate;
    let speedIndex = speeds.indexOf(currentSpeed);
    speedIndex = (speedIndex + 1) % speeds.length;
    audio.playbackRate = speeds[speedIndex];
    speedEl.textContent = `${speeds[speedIndex]}X`;
});

// 13. 初始化播放
playCurrentSong();