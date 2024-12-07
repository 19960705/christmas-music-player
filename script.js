document.addEventListener('DOMContentLoaded', () => {
    // DOM 元素
    const audioPlayer = document.createElement('audio');
    document.body.appendChild(audioPlayer);
    const fileInput = document.getElementById('file-upload');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const progress = document.getElementById('progress');
    const songTitle = document.getElementById('song-title');
    const artistName = document.getElementById('song-artist');
    const canvas = document.getElementById('coverCanvas');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeIcon = document.getElementById('volume-icon');
    const currentTimeSpan = document.getElementById('current-time');
    const totalTimeSpan = document.getElementById('total-time');
    const playlistContainer = document.getElementById('playlist');

    let songs = [];
    let currentSongIndex = 0;
    let isPlaying = false;
    let lastVolume = 1;

    let currentAnimation = 'flip'; // 可以是 'flip', 'slide', 或 'fade'

    function switchCoverAnimation() {
        const animations = ['flip', 'slide', 'fade'];
        const currentIndex = animations.indexOf(currentAnimation);
        currentAnimation = animations[(currentIndex + 1) % animations.length];
    }

    // 圣诞元素类
    class ChristmasElement {
        constructor(type, x, y, size, rotation = 0) {
            this.type = type;
            this.x = x;
            this.y = y;
            this.size = size;
            this.rotation = rotation;
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            switch(this.type) {
                case 'tree':
                    this.drawTree(ctx);
                    break;
                case 'gift':
                    this.drawGift(ctx);
                    break;
                case 'star':
                    this.drawStar(ctx);
                    break;
                case 'bell':
                    this.drawBell(ctx);
                    break;
                case 'candy':
                    this.drawCandy(ctx);
                    break;
                case 'wreath':
                    this.drawWreath(ctx);
                    break;
                case 'sock':
                    this.drawSock(ctx);
                    break;
            }

            ctx.restore();
        }

        drawTree(ctx) {
            ctx.fillStyle = '#2d5a3f';
            ctx.beginPath();
            ctx.moveTo(0, -this.size);
            ctx.lineTo(this.size * 0.6, this.size * 0.3);
            ctx.lineTo(-this.size * 0.6, this.size * 0.3);
            ctx.closePath();
            ctx.fill();

            // 树干
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(-this.size * 0.1, this.size * 0.3, this.size * 0.2, this.size * 0.3);

            // 装饰品
            ctx.fillStyle = '#ff0000';
            for(let i = 0; i < 3; i++) {
                let x = Math.sin(i * Math.PI/3) * this.size * 0.3;
                let y = -this.size * 0.5 + i * this.size * 0.3;
                ctx.beginPath();
                ctx.arc(x, y, this.size * 0.08, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        drawGift(ctx) {
            // 礼物盒
            ctx.fillStyle = '#ff4d4d';
            ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
            
            // 丝带
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(-this.size/6, -this.size/2, this.size/3, this.size);
            ctx.fillRect(-this.size/2, -this.size/6, this.size, this.size/3);

            // 蝴蝶结
            ctx.beginPath();
            ctx.arc(-this.size/6, -this.size/2, this.size/6, 0, Math.PI * 2);
            ctx.arc(this.size/6, -this.size/2, this.size/6, 0, Math.PI * 2);
            ctx.fill();
        }

        drawStar(ctx) {
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            for(let i = 0; i < 5; i++) {
                let angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                let x = Math.cos(angle) * this.size;
                let y = Math.sin(angle) * this.size;
                if(i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
        }

        drawBell(ctx) {
            // 铃铛主体
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.8, Math.PI, Math.PI * 2);
            ctx.lineTo(this.size * 0.8, this.size * 0.8);
            ctx.lineTo(-this.size * 0.8, this.size * 0.8);
            ctx.closePath();
            ctx.fill();

            // 铃铛顶部
            ctx.fillStyle = '#daa520';
            ctx.fillRect(-this.size * 0.2, -this.size, this.size * 0.4, this.size * 0.2);

            // 铃铛下的小球
            ctx.fillStyle = '#8b0000';
            ctx.beginPath();
            ctx.arc(0, this.size * 0.6, this.size * 0.2, 0, Math.PI * 2);
            ctx.fill();
        }

        drawCandy(ctx) {
            // 糖果主体
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = this.size * 0.4;
            ctx.beginPath();
            ctx.moveTo(-this.size * 0.5, 0);
            ctx.lineTo(this.size * 0.5, 0);
            ctx.stroke();

            // 白色条纹
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = this.size * 0.1;
            for(let i = -2; i <= 2; i++) {
                ctx.beginPath();
                ctx.moveTo(-this.size * 0.5 + i * this.size * 0.2, -this.size * 0.15);
                ctx.lineTo(-this.size * 0.3 + i * this.size * 0.2, this.size * 0.15);
                ctx.stroke();
            }
        }

        drawWreath(ctx) {
            // 花环主体
            ctx.strokeStyle = '#2d5a3f';
            ctx.lineWidth = this.size * 0.3;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.7, 0, Math.PI * 2);
            ctx.stroke();

            // 装饰
            ctx.fillStyle = '#ff0000';
            for(let i = 0; i < 8; i++) {
                let angle = (i * Math.PI) / 4;
                let x = Math.cos(angle) * this.size * 0.7;
                let y = Math.sin(angle) * this.size * 0.7;
                ctx.beginPath();
                ctx.arc(x, y, this.size * 0.15, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        drawSock(ctx) {
            // 袜子主体
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.moveTo(-this.size * 0.3, -this.size);
            ctx.lineTo(this.size * 0.3, -this.size);
            ctx.lineTo(this.size * 0.3, 0);
            ctx.quadraticCurveTo(this.size * 0.3, this.size * 0.5, 0, this.size * 0.5);
            ctx.quadraticCurveTo(-this.size * 0.3, this.size * 0.5, -this.size * 0.3, 0);
            ctx.closePath();
            ctx.fill();

            // 袜子口
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-this.size * 0.3, -this.size, this.size * 0.6, this.size * 0.2);
        }
    }

    function generateCoverLayout(songName) {
        // 使用歌名生成一个确定的随机数种子
        let seed = songName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const random = () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };

        const elements = [];
        const elementTypes = ['tree', 'gift', 'star', 'bell', 'candy', 'wreath', 'sock'];
        
        // 主要元素
        const mainType = elementTypes[Math.floor(random() * elementTypes.length)];
        elements.push(new ChristmasElement(mainType, 150, 150, 50, random() * Math.PI / 4));

        // 添加4-6个装饰元素
        const decorCount = Math.floor(random() * 3) + 4;
        for(let i = 0; i < decorCount; i++) {
            const type = elementTypes[Math.floor(random() * elementTypes.length)];
            const angle = (i * 2 * Math.PI) / decorCount;
            const distance = 80 + random() * 20;
            const x = 150 + Math.cos(angle) * distance;
            const y = 150 + Math.sin(angle) * distance;
            const size = 20 + random() * 15;
            const rotation = random() * Math.PI * 2;
            elements.push(new ChristmasElement(type, x, y, size, rotation));
        }

        return elements;
    }

    function drawChristmasCover(ctx, songName = '') {
        // 设置背景
        const gradient = ctx.createLinearGradient(0, 0, 300, 300);
        gradient.addColorStop(0, '#1a472a');  // 深绿色
        gradient.addColorStop(1, '#2d5a3f');  // 浅绿色
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 300, 300);

        // 添加雪花背景
        ctx.save();
        ctx.globalAlpha = 0.2;
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * 300;
            const y = Math.random() * 300;
            const size = Math.random() * 3 + 1;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // 生成并绘制圣诞元素
        const elements = generateCoverLayout(songName);
        elements.forEach(element => element.draw(ctx));

        // 添加装饰边框
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 5;
        ctx.strokeRect(10, 10, 280, 280);
    }

    function updateCoverArt(songName = '') {
        const container = document.querySelector('.cover-container');
        const oldCanvas = document.querySelector('#coverCanvas');
        
        // 创建新画布
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'coverCanvas';
        newCanvas.width = 300;
        newCanvas.height = 300;
        
        // 绘制新封面
        const ctx = newCanvas.getContext('2d');
        drawChristmasCover(ctx, songName);
        
        if (oldCanvas) {
            // 添加动画类
            oldCanvas.classList.add(`cover-${currentAnimation}-out`);
            newCanvas.classList.add(`cover-${currentAnimation}-in`);
            
            // 动画结束后移除旧画布
            setTimeout(() => {
                oldCanvas.remove();
                // 每切换3次歌曲随机改变一次动画效果
                if (Math.random() < 0.3) {
                    switchCoverAnimation();
                }
            }, 800);
        }
        
        // 添加新画布
        container.appendChild(newCanvas);
    }

    // 播放/暂停功能
    function togglePlay() {
        if (songs.length === 0) return;
        
        if (audioPlayer.paused) {
            audioPlayer.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        } else {
            audioPlayer.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
        }
    }

    // 播放指定歌曲
    function playSong(index) {
        if (index < 0 || index >= songs.length) return;
        
        currentSongIndex = index;
        const song = songs[currentSongIndex];
        
        audioPlayer.src = URL.createObjectURL(song);
        songTitle.textContent = song.name.replace(/\.[^/.]+$/, "");
        artistName.textContent = '本地音乐';
        
        audioPlayer.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        isPlaying = true;
        
        // 更新播放列表高亮
        updatePlaylistHighlight();
        // 生成新的封面
        updateCoverArt(song.name.replace(/\.[^/.]+$/, ""));
    }

    // 下一首
    function playNext() {
        let nextIndex = currentSongIndex + 1;
        if (nextIndex >= songs.length) nextIndex = 0;
        playSong(nextIndex);
    }

    // 上一首
    function playPrev() {
        let prevIndex = currentSongIndex - 1;
        if (prevIndex < 0) prevIndex = songs.length - 1;
        playSong(prevIndex);
    }

    // 更新播放列表高亮
    function updatePlaylistHighlight() {
        const items = playlistContainer.getElementsByClassName('playlist-item');
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('active');
            if (i === currentSongIndex) {
                items[i].classList.add('active');
            }
        }
    }

    // 事件监听器
    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);
    
    // 音量控制
    volumeSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        audioPlayer.volume = value / 100;
        updateVolumeSlider(value);
    });

    volumeIcon.addEventListener('click', () => {
        if (audioPlayer.volume > 0) {
            audioPlayer.volume = 0;
            volumeSlider.value = 0;
        } else {
            audioPlayer.volume = 0.7;
            volumeSlider.value = 70;
        }
        updateVolumeSlider(volumeSlider.value);
    });

    function updateVolumeSlider(value) {
        // 更新音量图标
        if (value == 0) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (value < 50) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
        
        // 更新滑块背景
        volumeSlider.style.background = `linear-gradient(to right, #ff4d4d 0%, #ff4d4d ${value}%, rgba(255, 255, 255, 0.15) ${value}%, rgba(255, 255, 255, 0.15) 100%)`;
    }

    // 初始化音量
    audioPlayer.volume = 0.7;
    volumeSlider.value = 70;
    updateVolumeSlider(70);

    // 时间格式化
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === null || seconds === undefined) {
            return '--:--';
        }
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        
        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return `${hours}:${String(remainingMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        }
        
        return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    // 进度条更新
    function updateProgress() {
        const { duration, currentTime } = audioPlayer;
        
        // 更新时间显示
        currentTimeSpan.textContent = formatTime(currentTime);
        totalTimeSpan.textContent = formatTime(duration);
        
        // 更新进度条
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progress.style.width = `${progressPercent}%`;
        } else {
            progress.style.width = '0%';
        }
    }

    // 设置进度
    function setProgress(e) {
        const width = progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        
        if (duration) {
            const newTime = (clickX / width) * duration;
            audioPlayer.currentTime = newTime;
            updateProgress();
        }
    }

    // 音频加载事件
    audioPlayer.addEventListener('loadedmetadata', () => {
        totalTimeSpan.textContent = formatTime(audioPlayer.duration);
        updateProgress();
    });

    // 音频播放事件
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', playNext);

    // 进度条事件
    progressBar.addEventListener('click', setProgress);

    // 文件上传处理
    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        songs = songs.concat(files);
        
        // 更新播放列表
        files.forEach(file => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.textContent = file.name.replace(/\.[^/.]+$/, "");
            item.addEventListener('click', () => {
                const index = songs.indexOf(file);
                playSong(index);
            });
            playlistContainer.appendChild(item);
        });

        // 如果是第一次添加歌曲，自动播放
        if (songs.length === files.length) {
            playSong(0);
        }
    });

    // 雪花类
    class Snowflake {
        constructor(canvas) {
            this.canvas = canvas;
            this.reset();
        }

        reset() {
            this.x = Math.random() * this.canvas.width;
            this.y = -10;
            this.size = Math.random() * 3 + 2;
            this.speed = Math.random() * 1 + 0.5;
            this.wind = Math.random() * 0.5 - 0.25;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = Math.random() * 0.02 - 0.01;
            this.type = Math.floor(Math.random() * 3); // 0: 圆形, 1: 星形, 2: 六边形
            this.opacity = Math.random() * 0.5 + 0.5;
        }

        update() {
            this.y += this.speed;
            this.x += this.wind;
            this.rotation += this.rotationSpeed;

            if (this.y > this.canvas.height + 10) {
                this.reset();
            }
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.beginPath();

            switch(this.type) {
                case 0: // 圆形雪花
                    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 1: // 星形雪花
                    for (let i = 0; i < 6; i++) {
                        ctx.moveTo(0, 0);
                        ctx.lineTo(0, this.size);
                        ctx.rotate(Math.PI / 3);
                    }
                    ctx.stroke();
                    break;
                case 2: // 六边形雪花
                    for (let i = 0; i < 6; i++) {
                        const angle = (Math.PI * 2 * i) / 6;
                        const x = Math.cos(angle) * this.size;
                        const y = Math.sin(angle) * this.size;
                        if (i === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.closePath();
                    ctx.stroke();
                    break;
            }

            ctx.restore();
        }
    }

    // 初始化雪花背景
    const snowCanvas = document.getElementById('snowCanvas');
    const snowCtx = snowCanvas.getContext('2d');
    const snowflakes = [];
    const SNOWFLAKE_COUNT = 100;

    function resizeSnowCanvas() {
        snowCanvas.width = window.innerWidth;
        snowCanvas.height = window.innerHeight;
    }

    function initSnowflakes() {
        for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
            snowflakes.push(new Snowflake(snowCanvas));
        }
    }

    function updateSnowflakes() {
        snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
        snowflakes.forEach(snowflake => {
            snowflake.update();
            snowflake.draw(snowCtx);
        });
        requestAnimationFrame(updateSnowflakes);
    }

    // 初始化雪花动画
    window.addEventListener('resize', resizeSnowCanvas);
    resizeSnowCanvas();
    initSnowflakes();
    updateSnowflakes();

    // 初始化封面
    updateCoverArt();
});
