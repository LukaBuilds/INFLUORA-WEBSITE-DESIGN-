// ===================================
// INFLUORA LANDING PAGE
// Interactive Features & Animations
// ===================================

console.log('Influora loaded ✨');

// ===================================
// CUSTOM CURSOR
// ===================================

const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    // Smooth cursor following
    cursorX += (mouseX - cursorX) * 0.3;
    cursorY += (mouseY - cursorY) * 0.3;
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;

    requestAnimationFrame(animateCursor);
}

animateCursor();

// Magnetic effect on buttons
const magneticButtons = document.querySelectorAll('.magnetic-btn');

magneticButtons.forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
        cursor.style.width = '50px';
        cursor.style.height = '50px';
        cursor.style.background = 'rgba(99, 102, 241, 0.5)';
    });

    btn.addEventListener('mouseleave', () => {
        cursor.style.width = '12px';
        cursor.style.height = '12px';
        cursor.style.background = '#6366f1';
    });

    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ===================================
// 3D PHONE PARALLAX (SMOOTH)
// ===================================

const phoneMockup = document.getElementById('phone-mockup');
let targetRotateX = 0;
let targetRotateY = 0;
let currentRotateX = 0;
let currentRotateY = 0;

if (phoneMockup) {
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        // Set target rotation values (very subtle movement)
        targetRotateY = x * 4;
        targetRotateX = -y * 4;
    });

    // Smooth animation loop for phone parallax
    function animatePhone() {
        // Smooth interpolation with higher damping for stability
        const dampingFactor = 0.1;
        currentRotateX += (targetRotateX - currentRotateX) * dampingFactor;
        currentRotateY += (targetRotateY - currentRotateY) * dampingFactor;

        // Apply transform with smooth values
        phoneMockup.style.transform = `
            perspective(1500px)
            rotateY(${currentRotateY}deg)
            rotateX(${currentRotateX}deg)
            translateZ(50px)
        `;

        requestAnimationFrame(animatePhone);
    }

    // Start phone animation
    animatePhone();
}

// ===================================
// THREE.JS PARTICLE BACKGROUND
// ===================================

const heroCanvas = document.getElementById('hero-canvas');
const demoCanvas = document.getElementById('demo-canvas');
let scene, camera, renderer, particles;
let demoScene, demoCamera, demoRenderer, demoParticles;

function initThreeJS() {
    const canvas = heroCanvas || demoCanvas;
    if (!canvas) return;

    const isDemo = canvas.id === 'demo-canvas';

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x6366f1,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    animateParticles();
}

function animateParticles() {
    if (!particles) return;

    particles.rotation.y += 0.0005;
    particles.rotation.x += 0.0002;

    renderer.render(scene, camera);
    requestAnimationFrame(animateParticles);
}

// Handle resize
window.addEventListener('resize', () => {
    if (!camera || !renderer) return;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

initThreeJS();

// ===================================
// ANIMATED COUNTERS
// ===================================

function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (target - start) * easeOutQuart;

        if (target % 1 === 0) {
            element.textContent = Math.floor(current).toLocaleString();
        } else {
            element.textContent = current.toFixed(1);
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (target % 1 === 0) {
                element.textContent = target.toLocaleString();
            } else {
                element.textContent = target.toFixed(1);
            }
        }
    }

    requestAnimationFrame(update);
}

// Trigger counters when visible
const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target.textContent === '0') {
                animateCounter(entry.target);
            }
        });
    },
    { threshold: 0.5 }
);

counters.forEach((counter) => counterObserver.observe(counter));

// ===================================
// MINI CHART ANIMATION
// ===================================

const miniChart = document.getElementById('mini-chart');

function drawMiniChart() {
    if (!miniChart) return;

    const ctx = miniChart.getContext('2d');
    const width = miniChart.width = 280;
    const height = miniChart.height = 100;

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.8)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.1)');

    const data = [30, 45, 35, 60, 50, 75, 85];
    const padding = 10;
    const maxValue = Math.max(...data);
    const segmentWidth = (width - padding * 2) / (data.length - 1);

    ctx.clearRect(0, 0, width, height);

    // Draw area
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);

    data.forEach((value, index) => {
        const x = padding + index * segmentWidth;
        const y = height - padding - (value / maxValue) * (height - padding * 2);
        if (index === 0) {
            ctx.lineTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    data.forEach((value, index) => {
        const x = padding + index * segmentWidth;
        const y = height - padding - (value / maxValue) * (height - padding * 2);
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.stroke();
}

drawMiniChart();

// ===================================
// GSAP SCROLL ANIMATIONS
// ===================================

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Fade in sections
    gsap.utils.toArray('.problem-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out'
        });
    });

    // Feature cards
    gsap.utils.toArray('.feature-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 80,
            opacity: 0,
            duration: 1,
            delay: index * 0.15,
            ease: 'power3.out'
        });
    });

    // Testimonials
    gsap.utils.toArray('.testimonial-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            scale: 0.9,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'back.out(1.7)'
        });
    });

    // Section titles
    gsap.utils.toArray('.section-title').forEach((title) => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // CTA section
    gsap.from('.cta-content', {
        scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 70%',
            toggleActions: 'play none none none'
        },
        scale: 0.95,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
    });
}

// ===================================
// 3D TILT EFFECT ON CARDS (SMOOTH)
// ===================================

const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach((card) => {
    let cardRotateX = 0;
    let cardRotateY = 0;
    let targetCardRotateX = 0;
    let targetCardRotateY = 0;
    let isHovering = false;
    let animationId = null;

    function animateCardTilt() {
        // Smooth interpolation
        cardRotateX += (targetCardRotateX - cardRotateX) * 0.12;
        cardRotateY += (targetCardRotateY - cardRotateY) * 0.12;

        card.style.transform = `
            perspective(1000px)
            rotateX(${cardRotateX}deg)
            rotateY(${cardRotateY}deg)
            translateZ(10px)
        `;

        if (isHovering || Math.abs(targetCardRotateX - cardRotateX) > 0.1 || Math.abs(targetCardRotateY - cardRotateY) > 0.1) {
            animationId = requestAnimationFrame(animateCardTilt);
        }
    }

    card.addEventListener('mouseenter', () => {
        isHovering = true;
        if (!animationId) {
            animateCardTilt();
        }
    });

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Reduced intensity for smoother feel
        targetCardRotateX = ((y - centerY) / centerY) * -8;
        targetCardRotateY = ((x - centerX) / centerX) * 8;
    });

    card.addEventListener('mouseleave', () => {
        isHovering = false;
        targetCardRotateX = 0;
        targetCardRotateY = 0;

        // Continue animation until card returns to rest position
        if (!animationId) {
            animateCardTilt();
        }
    });
});

// ===================================
// SMOOTH SCROLL (OPTIONAL)
// ===================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
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

// ===================================
// HOVER EFFECTS ON LINKS
// ===================================

const links = document.querySelectorAll('a, button');

links.forEach((link) => {
    link.addEventListener('mouseenter', () => {
        cursor.style.width = '40px';
        cursor.style.height = '40px';
    });

    link.addEventListener('mouseleave', () => {
        cursor.style.width = '12px';
        cursor.style.height = '12px';
    });
});

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// ===================================
// MOBILE NOTIFICATIONS ANIMATION
// ===================================

const notificationStack = document.querySelector('.notification-stack');
const mobileNotifications = document.getElementById('mobile-notifications');

const notifications = [
    {
        app: '📱',
        title: 'TikTok',
        body: 'Your post <strong>"Morning Routine"</strong> hit 10K views in 2 hours!',
        time: '2m ago'
    },
    {
        app: '📷',
        title: 'Instagram',
        body: '<strong>482 new likes</strong> on your latest Reel. Keep it up!',
        time: '5m ago'
    },
    {
        app: '▶️',
        title: 'YouTube',
        body: 'Your video is <strong>trending!</strong> +2.4K subscribers today',
        time: '8m ago'
    },
    {
        app: '💡',
        title: 'Influora AI',
        body: 'Post tutorial content <strong>Tuesday 6PM</strong> for +35% engagement',
        time: '12m ago'
    },
    {
        app: '🔥',
        title: 'TikTok',
        body: 'Viral alert! Your post reached <strong>50K views</strong>',
        time: '15m ago'
    },
    {
        app: '⚡',
        title: 'Influora AI',
        body: 'Algorithm change detected. Adjust your <strong>posting time</strong>',
        time: '18m ago'
    }
];

let notificationIndex = 0;
const maxNotifications = 3;

function createNotification(data) {
    const notification = document.createElement('div');
    notification.className = 'notification-item';
    notification.innerHTML = `
        <div class="notification-header">
            <div class="notification-app">${data.app}</div>
            <div class="notification-title">${data.title}</div>
            <div class="notification-time">${data.time}</div>
        </div>
        <div class="notification-body">${data.body}</div>
    `;
    return notification;
}

function showNotification() {
    if (!notificationStack) return;

    // Get current notification
    const data = notifications[notificationIndex];
    const notification = createNotification(data);

    // Add to top of stack
    notificationStack.insertBefore(notification, notificationStack.firstChild);

    // Remove old notifications if more than max
    const currentNotifications = notificationStack.querySelectorAll('.notification-item');
    if (currentNotifications.length > maxNotifications) {
        // Fade out and remove oldest notification
        const oldest = currentNotifications[currentNotifications.length - 1];
        oldest.style.animation = 'slideOutNotification 0.3s ease forwards';
        setTimeout(() => {
            oldest.remove();
        }, 300);
    }

    // Move to next notification
    notificationIndex = (notificationIndex + 1) % notifications.length;
}

// Add slideOut animation to CSS via style injection
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutNotification {
        to {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
        }
    }
`;
document.head.appendChild(style);

// Start notification cycle
if (mobileNotifications) {
    // Show first notification immediately
    setTimeout(() => showNotification(), 1000);

    // Then show new notifications every 3 seconds
    setInterval(showNotification, 3000);
}

// Add subtle mouse parallax to mobile notifications
if (mobileNotifications) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        targetX = x * 15;
        targetY = y * 15;
    });

    function animateMobileNotifications() {
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        mobileNotifications.style.transform = `translate(${currentX}px, ${currentY}px)`;

        requestAnimationFrame(animateMobileNotifications);
    }

    animateMobileNotifications();
}

// ===================================
// DYNAMIC STAT BUBBLES
// ===================================

const statBubbles = document.querySelectorAll('.stat-bubble');

// Icon options for different stats
const statVariations = [
    { icon: '🔥', color: 'rgba(239, 68, 68, 0.8)', range: [100, 999], prefix: '+' },
    { icon: '💬', color: 'rgba(99, 102, 241, 0.8)', range: [50, 500], prefix: '+' },
    { icon: '❤️', color: 'rgba(236, 72, 153, 0.8)', range: [200, 1500], prefix: '+' },
    { icon: '👀', color: 'rgba(139, 92, 246, 0.8)', range: [500, 2000], prefix: '+' },
    { icon: '📈', color: 'rgba(16, 185, 129, 0.8)', range: [10, 99], prefix: '+' },
    { icon: '⚡', color: 'rgba(245, 158, 11, 0.8)', range: [100, 800], prefix: '+' }
];

function getRandomStat() {
    const variation = statVariations[Math.floor(Math.random() * statVariations.length)];

    // 85% chance of positive (green), 15% chance of negative (red)
    const isPositive = Math.random() < 0.85;

    const min = variation.range[0];
    const max = variation.range[1];
    const value = Math.floor(Math.random() * (max - min + 1)) + min;

    return {
        icon: variation.icon,
        value: isPositive ? `+${value}` : `-${Math.floor(value * 0.3)}`,
        color: isPositive ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
        borderColor: isPositive ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)',
        isPositive
    };
}

function updateStatBubble(bubble) {
    const stat = getRandomStat();
    const iconEl = bubble.querySelector('.stat-icon');
    const valueEl = bubble.querySelector('.stat-value');

    // Fade out
    bubble.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    bubble.style.opacity = '0';
    bubble.style.transform = 'scale(0.9)';

    setTimeout(() => {
        // Update content
        iconEl.textContent = stat.icon;
        valueEl.textContent = stat.value;

        // Update colors
        bubble.style.background = `linear-gradient(135deg, ${stat.color.replace('0.9', '0.2')} 0%, ${stat.color.replace('0.9', '0.15')} 100%)`;
        bubble.style.borderColor = stat.borderColor;
        bubble.style.boxShadow = `0 8px 32px ${stat.color.replace('0.9', '0.3')}`;

        // Update value color
        valueEl.style.color = stat.isPositive ? 'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 1)';
        valueEl.style.textShadow = stat.isPositive
            ? '0 0 10px rgba(16, 185, 129, 0.5)'
            : '0 0 10px rgba(239, 68, 68, 0.5)';

        // Fade in
        bubble.style.opacity = '1';
        bubble.style.transform = 'scale(1)';
    }, 300);
}

// Update each stat bubble on different intervals
if (statBubbles.length > 0) {
    statBubbles.forEach((bubble, index) => {
        // Initial random delay
        setTimeout(() => {
            updateStatBubble(bubble);

            // Then update every 3-5 seconds with random interval
            setInterval(() => {
                updateStatBubble(bubble);
            }, 3000 + Math.random() * 2000);
        }, index * 800);
    });
}

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause expensive operations
        if (renderer) renderer.setAnimationLoop(null);
    } else {
        // Resume
        if (renderer) animateParticles();
    }
});

console.log('All interactive features loaded! 🚀');
