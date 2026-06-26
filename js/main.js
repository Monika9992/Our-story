// ===== 计算在一起的天数 =====
function calculateDaysTogether() {
    // TODO: 修改这里为你们真正的在一起日期
    const togetherDate = new Date('2024-02-14');
    const today = new Date();
    const diffTime = Math.abs(today - togetherDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const daysElement = document.getElementById('daysTogether');
    if (daysElement) {
        animateNumber(daysElement, diffDays);
    }
}

// ===== 数字滚动动画 =====
function animateNumber(element, target) {
    let current = 0;
    const duration = 2000;
    const stepTime = 50;
    const steps = duration / stepTime;
    const increment = Math.ceil(target / steps);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current;
    }, stepTime);
}

// ===== 滚动显示动画 =====
function handleScrollAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight * 0.8) {
            item.classList.add('visible');
        }
    });
}

// ===== 移动端导航菜单 =====
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // 点击链接后关闭菜单
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

// ===== 平滑滚动到锚点 =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== 照片点击放大效果 =====
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // TODO: 可以扩展为完整的灯箱效果
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = '';
            }, 200);
        });
    });
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    calculateDaysTogether();
    handleScrollAnimations();
    initMobileMenu();
    initSmoothScroll();
    initGalleryLightbox();
    
    // 监听滚动事件
    window.addEventListener('scroll', handleScrollAnimations);
});
