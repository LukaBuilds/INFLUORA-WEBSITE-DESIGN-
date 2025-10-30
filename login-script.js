// DOM Elements
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const showSignupBtn = document.getElementById('show-signup');
const showSigninBtn = document.getElementById('show-signin');
const alertMessage = document.getElementById('alert-message');

// Animated Background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function initBackground() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
        particles.forEach((a, i) => {
            particles.slice(i + 1).forEach(b => {
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 120)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

initBackground();

// Check if user is already logged in
async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        // User is logged in, redirect to dashboard
        window.location.href = '/dashboard';
    }
}

checkAuth();

// Show Alert
function showAlert(message, type = 'error') {
    alertMessage.textContent = message;
    alertMessage.className = `alert-message ${type}`;
    alertMessage.classList.remove('hidden');

    setTimeout(() => {
        alertMessage.classList.add('hidden');
    }, 5000);
}

// Toggle Forms
showSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signinForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    alertMessage.classList.add('hidden');
});

showSigninBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.add('hidden');
    signinForm.classList.remove('hidden');
    alertMessage.classList.add('hidden');
});

// Sign In
signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('signin-email').value.trim();
    const password = document.getElementById('signin-password').value;

    if (!email || !password) {
        showAlert('Please fill in all fields');
        return;
    }

    const btn = document.getElementById('signin-btn');
    btn.classList.add('loading');
    btn.disabled = true;

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            showAlert(error.message || 'Login failed');
            btn.classList.remove('loading');
            btn.disabled = false;
            return;
        }

        if (data.session) {
            // Store user data for profile
            localStorage.setItem('influora_user', JSON.stringify(data.user));

            showAlert('Login successful! Redirecting...', 'success');

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('An unexpected error occurred');
        btn.classList.remove('loading');
        btn.disabled = false;
    }
});

// Sign Up
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-password-confirm').value;

    if (!email || !password || !confirmPassword) {
        showAlert('Please fill in all required fields');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        showAlert('Password must be at least 6 characters');
        return;
    }

    const btn = document.getElementById('signup-btn');
    btn.classList.add('loading');
    btn.disabled = true;

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name || email.split('@')[0]
                }
            }
        });

        if (error) {
            showAlert(error.message || 'Signup failed');
            btn.classList.remove('loading');
            btn.disabled = false;
            return;
        }

        if (data.user) {
            // Store user data
            localStorage.setItem('influora_user', JSON.stringify(data.user));

            showAlert('Account created! Redirecting...', 'success');

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        }
    } catch (error) {
        console.error('Signup error:', error);
        showAlert('An unexpected error occurred');
        btn.classList.remove('loading');
        btn.disabled = false;
    }
});
