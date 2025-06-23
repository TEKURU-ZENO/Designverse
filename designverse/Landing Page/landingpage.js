function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update toggle button icon
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
}

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'dark';
document.body.setAttribute('data-theme', savedTheme);

// Set initial toggle button icon
document.querySelector('.theme-toggle').textContent = savedTheme === 'dark' ? '🌙' : '☀️';

// Carousel Functionality
function slideCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    const cardWidth = carousel.querySelector('.carousel-card').offsetWidth;
    const scrollAmount = cardWidth * direction;
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(animateCounters, 1);
        } else {
            counter.innerText = target.toLocaleString();
        }
    });
}

// Intersection Observer for Scroll Animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Initialize counter animation only once when stats section appears
            if (entry.target.classList.contains('live-stats')) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        }
    });
}, { threshold: 0.1 });

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Initialize carousels - duplicate cards infinitely
function initializeCarousels() {
    const carousels = ['gamesCarousel', 'streamersCarousel'];
    
    carousels.forEach(id => {
        const carousel = document.getElementById(id);
        const cards = carousel.innerHTML;
        carousel.innerHTML = cards.repeat(3); // Creates an infinite loop effect
    });
}

initializeCarousels();

// Ripple Effect for Buttons
document.querySelectorAll('button, .cta-primary, .cta-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        this.appendChild(ripple);
        
        const x = e.clientX - e.target.getBoundingClientRect().left;
        const y = e.clientY - e.target.getBoundingClientRect().top;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        setTimeout(() => ripple.remove(), 500);
    });
});

// Custom Cursor (only for desktop)
if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
}

// Mobile Menu Toggle (for smaller screens)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Konami Code Easter Egg
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', e => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        
        if (konamiIndex === konamiCode.length) {
            // Easter egg triggered!
            document.body.classList.add('konami');
            konamiIndex = 0;
            setTimeout(() => document.body.classList.remove('konami'), 3000);
        }
    } else {
        konamiIndex = 0;
    }
});
// 3D Card Initialization
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
        card.querySelector('.flip-card-inner').classList.toggle('flipped');
    });
});

// Particle Background
function createParticles() {
    const container = document.querySelector('.particle-bg');
    if (!container) return;
    
    const particleCount = Math.floor(window.innerWidth / 10);
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 5 + 1;
        const posX = Math.random() * window.innerWidth;
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        container.appendChild(particle);
    }
}

// WebGL Detection
if (!WEBGL.isWebGLAvailable()) {
    document.documentElement.classList.add('no-webgl');
}

// Time-based Background
function updateTimeBasedBackground() {
    const hour = new Date().getHours();
    document.body.classList.toggle('night', hour < 6 || hour >= 18);
    document.body.classList.toggle('day', hour >= 6 && hour < 18);
}

// Initialize all effects
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    updateTimeBasedBackground();
    setInterval(updateTimeBasedBackground, 3600000); // Update hourly
    
    // Add sound wave to audio elements
    document.querySelectorAll('audio').forEach(audio => {
        const container = audio.closest('.has-sound');
        if (container) {
            const wave = document.createElement('div');
            wave.className = 'sound-wave';
            for (let i = 0; i < 5; i++) {
                const bar = document.createElement('div');
                bar.className = 'sound-wave-bar';
                wave.appendChild(bar);
            }
            container.appendChild(wave);
            
            audio.addEventListener('play', () => {
                container.classList.add('playing');
            });
            
            audio.addEventListener('pause', () => {
                container.classList.remove('playing');
            });
        }
    });
});

// Advanced scroll animations
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.scroll-animate').forEach(el => {
    scrollObserver.observe(el);
});
// Contact Form Validation and Submission
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Add loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span>Sending...</span>
            <div class="loading-spinner"></div>
        `;
        
        try {
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            formMessage.textContent = "Message sent successfully! We'll get back to you soon.";
            formMessage.className = "form-message success visible";
            
            // Reset form
            contactForm.reset();
            document.querySelectorAll('.form-group').forEach(group => {
                group.querySelector('label').style.top = '1rem';
                group.querySelector('label').style.fontSize = '1rem';
            });
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.classList.remove('visible');
            }, 5000);
            
        } catch (error) {
            // Show error message
            formMessage.textContent = "Something went wrong. Please try again later.";
            formMessage.className = "form-message error visible";
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.classList.remove('visible');
            }, 5000);
            
        } finally {
            // Remove loading state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
    
    // Form field validation
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(field => {
        field.addEventListener('blur', function() {
            this.value = this.value.trim();
            
            if (this.validity.valueMissing) {
                this.style.borderBottomColor = '#ef4444';
            } else if (this.type === 'email' && !this.validity.valid) {
                this.style.borderBottomColor = '#ef4444';
            } else {
                this.style.borderBottomColor = '';
            }
        });
        
        field.addEventListener('input', function() {
            if (!this.value) return;
            
            if (this.validity.valid) {
                this.style.borderBottomColor = '#10b981';
            }
        });
    });
}
