function calculateDaysTogether() {
    const togetherDate = new Date('2025-07-05');
    const today = new Date();
    const diffTime = Math.abs(today - togetherDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const daysElement = document.getElementById('togetherDays');
    if (daysElement) animateNumber(daysElement, diffDays);
}

function updateHeroDays() {
    const togetherDate = new Date('2025-07-05');
    const today = new Date();
    const diffTime = Math.abs(today - togetherDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const heroEl = document.getElementById('heroDaysTogether');
    if (heroEl) heroEl.textContent = diffDays;
}

function calculateMarriedDays() {
    const marriedDate = new Date('2026-01-19');
    const today = new Date();
    const diffTime = Math.abs(today - marriedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const daysElement = document.getElementById('marriedDays');
    if (daysElement) animateNumber(daysElement, diffDays);
}

function calculateAges() {
    const wifeBirthday = new Date('1997-02-27');
    const today = new Date();
    let wifeAge = today.getFullYear() - wifeBirthday.getFullYear();
    const mDiff = today.getMonth() - wifeBirthday.getMonth();
    if (mDiff < 0 || (mDiff === 0 && today.getDate() < wifeBirthday.getDate())) wifeAge--;
    const wifeAgeEl = document.getElementById('wifeAge');
    if (wifeAgeEl) animateNumber(wifeAgeEl, wifeAge);

    const husbandBirthday = new Date('1998-01-11');
    let husbandAge = today.getFullYear() - husbandBirthday.getFullYear();
    const hDiff = today.getMonth() - husbandBirthday.getMonth();
    if (hDiff < 0 || (hDiff === 0 && today.getDate() < husbandBirthday.getDate())) husbandAge--;
    const husbandAgeEl = document.getElementById('husbandAge');
    if (husbandAgeEl) animateNumber(husbandAgeEl, husbandAge);
}

function animateNumber(element, target) {
    let current = 0;
    const duration = 2000;
    const stepTime = 50;
    const steps = duration / stepTime;
    const increment = Math.ceil(target / steps);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        element.textContent = current;
    }, stepTime);
}

function handleScrollAnimations() {
    const cards = document.querySelectorAll('.memorial-card');
    cards.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            setTimeout(() => item.classList.add('visible'), index * 150);
        }
    });
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function initGalleryLightbox() {
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            item.style.transform = 'scale(0.95)';
            setTimeout(() => { item.style.transform = ''; }, 200);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    calculateDaysTogether();
    updateHeroDays();
    calculateMarriedDays();
    calculateAges();
    handleScrollAnimations();
    initMobileMenu();
    initSmoothScroll();
    initGalleryLightbox();
    window.addEventListener('scroll', handleScrollAnimations);
});