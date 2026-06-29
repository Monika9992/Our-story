// ===== Star Canvas Background =====
function initStarCanvas() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    const STAR_COUNT = 200;
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.5,
            alpha: Math.random(),
            da: (Math.random() - 0.5) * 0.02
        });
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(function(s) {
            s.alpha += s.da;
            if (s.alpha <= 0.1 || s.alpha >= 1) s.da *= -1;
            s.alpha = Math.max(0.1, Math.min(1, s.alpha));
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, ' + s.alpha + ')';
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
}
// ===== Love Timer (real-time) =====
function startLoveTimer() {
    const togetherDate = new Date('2025-07-05');
    function update() {
        const now = new Date();
        let years = now.getFullYear() - togetherDate.getFullYear();
        let months = now.getMonth() - togetherDate.getMonth();
        let days = now.getDate() - togetherDate.getDate();
        if (days < 0) { months--; const prev = new Date(now.getFullYear(), now.getMonth(), 0); days += prev.getDate(); }
        if (months < 0) { years--; months += 12; }
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        var yEl = document.getElementById('timerYears');
        var mEl = document.getElementById('timerMonths');
        var dEl = document.getElementById('timerDays');
        var hEl = document.getElementById('timerHours');
        var miEl = document.getElementById('timerMinutes');
        var sEl = document.getElementById('timerSeconds');
        if (yEl) yEl.textContent = years;
        if (mEl) mEl.textContent = months;
        if (dEl) dEl.textContent = days;
        if (hEl) hEl.textContent = hours;
        if (miEl) miEl.textContent = minutes;
        if (sEl) sEl.textContent = seconds;
    }
    update();
    setInterval(update, 1000);
}

// ===== Calculate Days Together =====
function calculateDaysTogether() {
    const togetherDate = new Date('2025-07-05');
    const today = new Date();
    const diffDays = Math.ceil(Math.abs(today - togetherDate) / (1000 * 60 * 60 * 24));
    const el = document.getElementById('togetherDays');
    if (el) animateNumber(el, diffDays);
}

function updateHeroDays() {
    const togetherDate = new Date('2025-07-05');
    const today = new Date();
    const diffDays = Math.ceil(Math.abs(today - togetherDate) / (1000 * 60 * 60 * 24));
    const el = document.getElementById('heroDaysTogether');
    if (el) el.textContent = diffDays;
}

// ===== Calculate Married Days =====
function calculateMarriedDays() {
    const marriedDate = new Date('2026-01-19');
    const today = new Date();
    const diffDays = Math.ceil(Math.abs(today - marriedDate) / (1000 * 60 * 60 * 24));
    const el = document.getElementById('marriedDays');
    if (el) animateNumber(el, diffDays);
}

// ===== Calculate Ages =====
function calculateAges() {
    const wifeBirthday = new Date('1997-02-27');
    const today = new Date();
    let wifeAge = today.getFullYear() - wifeBirthday.getFullYear();
    const md = today.getMonth() - wifeBirthday.getMonth();
    if (md < 0 || (md === 0 && today.getDate() < wifeBirthday.getDate())) wifeAge--;
    const el = document.getElementById('wifeAge');
    if (el) animateNumber(el, wifeAge);
    const husbandBirthday = new Date('1998-01-11');
    let husbandAge = today.getFullYear() - husbandBirthday.getFullYear();
    const hd = today.getMonth() - husbandBirthday.getMonth();
    if (hd < 0 || (hd === 0 && today.getDate() < husbandBirthday.getDate())) husbandAge--;
    const el2 = document.getElementById('husbandAge');
    if (el2) animateNumber(el2, husbandAge);
}

// ===== Countdown =====
function updateCountdowns() {
    const today = new Date();
    const cy = today.getFullYear();
    let wb = new Date(cy, 1, 27); if (wb <= today) wb = new Date(cy + 1, 1, 27);
    var wd = Math.ceil((wb - today) / 86400000);
    var we = document.getElementById('wifeBdayCountdown'); if (we) we.textContent = wd;
    let ma = new Date(cy, 0, 19); if (ma <= today) ma = new Date(cy + 1, 0, 19);
    var mad = Math.ceil((ma - today) / 86400000);
    var mc = document.getElementById('marriedAnnivCountdown'); if (mc) mc.textContent = mad;
    let an = new Date(cy, 6, 5); if (an <= today) an = new Date(cy + 1, 6, 5);
    var ad = Math.ceil((an - today) / 86400000);
    var ac = document.getElementById('annivCountdown'); if (ac) ac.textContent = ad;
}

// ===== Number Animation =====
function animateNumber(element, target) {
    let current = 0;
    const duration = 2000;
    const stepTime = 50;
    const steps = duration / stepTime;
    const increment = Math.ceil(target / steps);
    const timer = setInterval(function() {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        element.textContent = current;
    }, stepTime);
}

// ===== Scroll Animations =====
function handleScrollAnimations() {
    const cards = document.querySelectorAll('.memorial-card, .countdown-card');
    cards.forEach(function(item, index) {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            setTimeout(function() { item.classList.add('visible'); }, index * 100);
        }
    });
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() { navLinks.classList.toggle('active'); });
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() { navLinks.classList.remove('active'); });
        });
    }
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^=\"#\"]').forEach(function(anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}
// ===== Gallery Lightbox =====
function initGalleryLightbox() {
    const items = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxText = document.getElementById('lightboxText');
    const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const prevBtn = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
    const nextBtn = lightbox ? lightbox.querySelector('.lightbox-next') : null;
    let currentIndex = 0;
    const captions = [];
    items.forEach(function(item, i) {
        const caption = item.querySelector('.photo-caption');
        if (caption) captions.push(caption.textContent);
        item.addEventListener('click', function() {
            currentIndex = i;
            if (lightbox && lightboxText) {
                lightboxText.textContent = captions[i] || '';
                lightbox.classList.add('active');
            }
        });
    });
    if (closeBtn) closeBtn.addEventListener('click', function() { if (lightbox) lightbox.classList.remove('active'); });
    if (prevBtn) prevBtn.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + captions.length) % captions.length;
        if (lightbox && lightboxText) lightboxText.textContent = captions[currentIndex] || '';
    });
    if (nextBtn) nextBtn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % captions.length;
        if (lightbox && lightboxText) lightboxText.textContent = captions[currentIndex] || '';
    });
    if (lightbox) lightbox.addEventListener('click', function(e) { if (e.target === lightbox) lightbox.classList.remove('active'); });
}

// ===== Typewriter Letter =====
function initLetter() {
    const letterText = '浜茬埍鐨勮€佸﹩锛歕\n\\n杩欐槸鎴戜滑淇╃殑鐖辨儏缃戠珯锛屾垜鎯虫妸瀹冨仛鎴愪竴涓彲浠ヤ竴鐩磋蛋涓嬪幓鐨勫湴鏂广€俓\n\\n浠?025骞?鏈?鏃ユ垜浠湪涓€璧风殑閭ｅぉ璧凤紝姣忎竴澶╅兘鍥犱负鏈変綘鑰屽彉寰楃壒鍒€俓\n\\n杩樿寰楁垜浠涓€娆＄害浼氬悧锛熶綘鐨勬墜濂藉皬锛屾垜鐨勬墜蹇冨叏鏄睏銆備絾浣犱竴绗戯紝鎴戝氨瑙夊緱浠€涔堥兘濂戒簡銆俓\n\\n鍚庢潵鎴戜滑缁撳浜嗭紝閭ｅぉ浣犺鎰挎剰鐨勬椂鍊欙紝鎴戣寰楄嚜宸辨槸鍏ㄤ笘鐣屾渶骞歌繍鐨勪汉銆俓\n\\n浣犵敓鏃ラ偅澶╋紝鎴戝伔鍋峰摥浜嗐€備笉鏄洜涓烘劅鍔紝鏄洜涓鸿寰楁椂闂磋繃寰楀お蹇簡銆傛兂鍜屼綘杩囩殑鏃ュ瓙杩樻湁濂藉濂藉銆俓\n\\n璋㈣阿浣犲寘瀹规垜鐨勪笉瀹岀編锛岃阿璋綘姣忓ぉ绛夋垜鍥炲锛岃阿璋綘璁╂垜鎴愪负浜嗘洿濂界殑浜恒€俓\n\\n鏈潵鐨勮矾杩樺緢闀匡紝浣嗗彧瑕佹湁浣犲湪锛屾垜灏变粈涔堥兘涓嶆€曘€俓\n\\n鎴戠埍浣狅紝涓嶆浠婂ぉ锛屾槸姣忎竴澶┿€俓\n\\n姘歌繙鐖变綘鐨勮€佸叕';
    const typewriter = document.getElementById('typewriter');
    const cursor = document.getElementById('cursor');
    const playBtn = document.getElementById('playLetter');
    if (!typewriter || !cursor) return;
    let charIndex = 0;
    let isPlaying = false;
    let timer = null;
    function type() {
        if (charIndex < letterText.length) {
            typewriter.textContent += letterText.charAt(charIndex);
            charIndex++;
            timer = setTimeout(type, 60);
        } else {
            cursor.style.display = 'none';
        }
    }
    function reset() {
        clearTimeout(timer);
        typewriter.textContent = '';
        charIndex = 0;
        cursor.style.display = 'inline-block';
    }
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            if (isPlaying) { reset(); playBtn.textContent = '鎾斁鎯呬功 鉂わ笍'; }
            else { type(); playBtn.textContent = '閲嶆柊鎾斁'; }
            isPlaying = !isPlaying;
        });
    }
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', function() {
    initStarCanvas();
    startLoveTimer();
    calculateDaysTogether();
    updateHeroDays();
    calculateMarriedDays();
    calculateAges();
    updateCountdowns();
    handleScrollAnimations();
    initMobileMenu();
    initSmoothScroll();
    initGalleryLightbox();
    initLetter();
    window.addEventListener('scroll', handleScrollAnimations);
});