// ===== Star Canvas Background =====
function initStarCanvas() {
    var canvas = document.getElementById("starCanvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var stars = [];
    var STAR_COUNT = 200;
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    for (var i = 0; i < STAR_COUNT; i++) {
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
            ctx.fillStyle = "rgba(255, 255, 255, " + s.alpha + ")";
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
}

// ===== Cherry Blossom Petals (mouse trail) =====
function initCherryBlossoms() {
    var canvas = document.createElement("canvas");
    canvas.id = "petalCanvas";
    canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999;";
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var petals = [];
    var MAX_PETALS = 40;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    document.addEventListener("mousemove", function(e) {
        for (var i = 0; i < 2; i++) {
            if (petals.length < MAX_PETALS) {
                petals.push({
                    x: e.clientX + (Math.random() - 0.5) * 20,
                    y: e.clientY + (Math.random() - 0.5) * 20,
                    size: Math.random() * 8 + 4,
                    rotation: Math.random() * Math.PI * 2,
                    rotSpeed: (Math.random() - 0.5) * 0.05,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: Math.random() * 1 + 0.5,
                    alpha: 0.8,
                    decay: Math.random() * 0.008 + 0.005
                });
            }
        }
    });

    function drawPetals() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = petals.length - 1; i >= 0; i--) {
            var p = petals[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.02;
            p.rotation += p.rotSpeed;
            p.alpha -= p.decay;
            if (p.alpha <= 0) {
                petals.splice(i, 1);
                continue;
            }
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = "#ffb7c5";
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#ff9eb5";
            ctx.beginPath();
            ctx.ellipse(p.size * 0.3, -p.size * 0.2, p.size * 0.5, p.size * 0.3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        requestAnimationFrame(drawPetals);
    }
    drawPetals();
}

// ===== Love Timer (real-time) =====
function startLoveTimer() {
    var togetherDate = new Date("2025-07-05");
    function update() {
        var now = new Date();
        var years = now.getFullYear() - togetherDate.getFullYear();
        var months = now.getMonth() - togetherDate.getMonth();
        var days = now.getDate() - togetherDate.getDate();
        if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
        if (months < 0) { years--; months += 12; }
        var h = String(now.getHours()).padStart(2, "0");
        var m = String(now.getMinutes()).padStart(2, "0");
        var s = String(now.getSeconds()).padStart(2, "0");
        var ye = document.getElementById("timerYears"); if (ye) ye.textContent = years;
        var me = document.getElementById("timerMonths"); if (me) me.textContent = months;
        var de = document.getElementById("timerDays"); if (de) de.textContent = days;
        var he = document.getElementById("timerHours"); if (he) he.textContent = h;
        var mie = document.getElementById("timerMinutes"); if (mie) mie.textContent = m;
        var se = document.getElementById("timerSeconds"); if (se) se.textContent = s;
    }
    update();
    setInterval(update, 1000);
}

// ===== Flip Calendar Effect =====
function flipNumber(element, target) {
    if (!element) return;
    var current = 0;
    var duration = 1500;
    var steps = 30;
    var increment = Math.ceil(target / steps);
    var interval = duration / steps;
    var timer = setInterval(function() {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        element.textContent = current;
    }, interval);
}

// ===== Calculate Days =====
function calcDays(id, ds) {
    var d = Math.ceil(Math.abs(new Date() - new Date(ds)) / 86400000);
    var el = document.getElementById(id);
    flipNumber(el, d);
}

function updateHeroDays() {
    var d = Math.ceil(Math.abs(new Date() - new Date("2025-07-05")) / 86400000);
    var el = document.getElementById("heroDaysTogether");
    flipNumber(el, d);
}

// ===== Ages =====
function calcAge(id, bs) {
    var now = new Date();
    var age = now.getFullYear() - new Date(bs).getFullYear();
    var md = now.getMonth() - new Date(bs).getMonth();
    if (md < 0 || (md === 0 && now.getDate() < new Date(bs).getDate())) age--;
    var el = document.getElementById(id);
    flipNumber(el, age);
}

// ===== Countdown =====
function updateCountdowns() {
    var today = new Date();
    var cy = today.getFullYear();
    var wb = new Date(cy, 1, 27);
    if (wb <= today) wb = new Date(cy + 1, 1, 27);
    var wd = Math.ceil((wb - today) / 86400000);
    var we = document.getElementById("wifeBdayCountdown"); if (we) we.textContent = wd;
    var ma = new Date(cy, 0, 19);
    if (ma <= today) ma = new Date(cy + 1, 0, 19);
    var mad = Math.ceil((ma - today) / 86400000);
    var mc = document.getElementById("marriedAnnivCountdown"); if (mc) mc.textContent = mad;
    var an = new Date(cy, 6, 5);
    if (an <= today) an = new Date(cy + 1, 6, 5);
    var ad = Math.ceil((an - today) / 86400000);
    var ac = document.getElementById("annivCountdown"); if (ac) ac.textContent = ad;
}

// ===== Scroll Animations =====
function handleScrollAnimations() {
    var cards = document.querySelectorAll(".memorial-card, .countdown-card");
    cards.forEach(function(item, index) {
        var rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            setTimeout(function() { item.classList.add("visible"); }, index * 100);
        }
    });
}

// ===== Mobile Menu =====
function initMobileMenu() {
    var hamburger = document.querySelector(".hamburger");
    var navLinks = document.querySelector(".nav-links");
    if (hamburger && navLinks) {
        hamburger.addEventListener("click", function() { navLinks.classList.toggle("active"); });
        navLinks.querySelectorAll("a").forEach(function(link) {
            link.addEventListener("click", function() { navLinks.classList.remove("active"); });
        });
    }
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute("href"));
            if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
}

// ===== Gallery Lightbox =====
function initGalleryLightbox() {
    var items = document.querySelectorAll(".gallery-item");
    var lightbox = document.getElementById("lightbox");
    var lightboxText = document.getElementById("lightboxText");
    var closeBtn = lightbox ? lightbox.querySelector(".lightbox-close") : null;
    var prevBtn = lightbox ? lightbox.querySelector(".lightbox-prev") : null;
    var nextBtn = lightbox ? lightbox.querySelector(".lightbox-next") : null;
    var currentIndex = 0;
    var captions = [];
    items.forEach(function(item, i) {
        var caption = item.querySelector(".photo-caption");
        if (caption) captions.push(caption.textContent);
        item.addEventListener("click", function() {
            currentIndex = i;
            if (lightbox && lightboxText) {
                lightboxText.textContent = captions[i] || "";
                lightbox.classList.add("active");
            }
        });
    });
    if (closeBtn) closeBtn.addEventListener("click", function() { if (lightbox) lightbox.classList.remove("active"); });
    if (prevBtn) prevBtn.addEventListener("click", function() {
        currentIndex = (currentIndex - 1 + captions.length) % captions.length;
        if (lightbox && lightboxText) lightboxText.textContent = captions[currentIndex] || "";
    });
    if (nextBtn) nextBtn.addEventListener("click", function() {
        currentIndex = (currentIndex + 1) % captions.length;
        if (lightbox && lightboxText) lightboxText.textContent = captions[currentIndex] || "";
    });
    if (lightbox) lightbox.addEventListener("click", function(e) { if (e.target === lightbox) lightbox.classList.remove("active"); });
}

// ===== Typewriter Letter =====
function initLetter() {
    var letterText = "亲爱的老婆：\n\n这是我们俩的爱情网站，我想把它做成一个可以一直走下去的地方。\n\n从2025年7月5日我们在一起的那天起，每一天都因为有你而变得特别。\n\n还记得我们第一次约会吗？你的手好小，我的手心全是汗。但你一笑，我就觉得什么都好了。\n\n后来我们结婚了，那天你说愿意的时候，我觉得自己是全世界最幸运的人。\n\n谢谢你包容我的不完美，谢谢你每天等我回家，谢谢你让我成为了更好的人。\n\n未来的路还很长，但只要有你在，我就什么都不怕。\n\n我爱你，不止今天，是每一天。\n\n永远爱你的老公";
    var typewriter = document.getElementById("typewriter");
    var cursor = document.getElementById("cursor");
    var playBtn = document.getElementById("playLetter");
    if (!typewriter || !cursor) return;
    var charIndex = 0;
    var isPlaying = false;
    var timer = null;
    function type() {
        if (charIndex < letterText.length) {
            typewriter.textContent += letterText.charAt(charIndex);
            charIndex++;
            timer = setTimeout(type, 60);
        } else {
            cursor.style.display = "none";
        }
    }
    function reset() {
        clearTimeout(timer);
        typewriter.textContent = "";
        charIndex = 0;
        cursor.style.display = "inline-block";
    }
    if (playBtn) {
        playBtn.addEventListener("click", function() {
            if (isPlaying) { reset(); playBtn.textContent = "\u64ad\u653e\u60c5\u4e66 \u2764\ufe0f"; }
            else { type(); playBtn.textContent = "\u91cd\u65b0\u64ad\u653e"; }
            isPlaying = !isPlaying;
        });
    }
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", function() {
    initStarCanvas();
    initCherryBlossoms();
    startLoveTimer();
    calcDays("togetherDays", "2025-07-05");
    updateHeroDays();
    calcDays("marriedDays", "2026-01-19");
    calcAge("wifeAge", "1997-02-27");
    calcAge("husbandAge", "1998-01-11");
    updateCountdowns();
    handleScrollAnimations();
    initMobileMenu();
    initSmoothScroll();
    initGalleryLightbox();
    initLetter();
    window.addEventListener("scroll", handleScrollAnimations);
});
