// Check Authentication
async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (!session) {
        window.location.href = '/login';
        return;
    }

    // Load user profile
    loadUserProfile(session.user);
}

// Load User Profile
function loadUserProfile(user) {
    // Read saved profile data from localStorage
    const savedProfile = JSON.parse(localStorage.getItem('influora_user') || '{}');

    // Read profile picture from the CORRECT localStorage key
    const savedProfilePic = localStorage.getItem(`influora_profile_pic_${user.email}`);

    // Merge localStorage data with Supabase user data (localStorage takes priority)
    const displayName = savedProfile.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
    const avatarData = savedProfilePic || null;

    // Top nav user info
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');

    // Dropdown user info
    const dropdownName = document.getElementById('dropdown-name');
    const dropdownEmail = document.getElementById('dropdown-email');
    const dropdownAvatar = document.getElementById('dropdown-avatar');

    if (userName) userName.textContent = displayName;
    if (dropdownName) dropdownName.textContent = displayName;
    if (dropdownEmail) dropdownEmail.textContent = user.email;

    // Generate initials for avatar
    const initials = displayName
        ? displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : user.email[0].toUpperCase();

    // If there's an avatar image, show it instead of initials
    if (avatarData) {
        if (userAvatar) {
            userAvatar.style.backgroundImage = `url(${avatarData})`;
            userAvatar.style.backgroundSize = 'cover';
            userAvatar.style.backgroundPosition = 'center';
            userAvatar.textContent = '';
        }
        if (dropdownAvatar) {
            dropdownAvatar.style.backgroundImage = `url(${avatarData})`;
            dropdownAvatar.style.backgroundSize = 'cover';
            dropdownAvatar.style.backgroundPosition = 'center';
            dropdownAvatar.textContent = '';
        }
    } else {
        if (userAvatar) userAvatar.textContent = initials;
        if (dropdownAvatar) dropdownAvatar.textContent = initials;
    }
}

// Listen for profile picture updates (for real-time updates across pages)
window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('influora_profile_pic_')) {
        // Profile picture changed in another tab/window
        const { data: { session } } = supabaseClient.auth.getSession();
        session.then(({ data: { session } }) => {
            if (session) {
                loadUserProfile(session.user);
            }
        });
    }
});

// Listen for custom profile picture update event (same-window updates)
window.addEventListener('profile-pic-updated', async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        loadUserProfile(session.user);
    }
});

// Initialize
checkAuth();

// User Menu Dropdown Toggle
const userMenuBtn = document.getElementById('user-menu-btn');
const userDropdown = document.getElementById('user-dropdown');

if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside (but not on links)
    document.addEventListener('click', (e) => {
        // Check if click is on a link inside dropdown
        const clickedLink = e.target.closest('a');
        if (clickedLink && userDropdown.contains(clickedLink)) {
            // Let the link navigate, don't close dropdown here
            return;
        }

        if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('active');
        }
    });
}

// Logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await supabaseClient.auth.signOut();
        localStorage.removeItem('influora_user');
        window.location.href = '/login';
    });
}

// Preferences button
const preferencesBtn = document.getElementById('preferences-btn');
if (preferencesBtn) {
    preferencesBtn.addEventListener('click', () => {
        showNotification('⚙️ Preferences feature coming soon!', 'info');
        userDropdown.classList.remove('active');
    });
}

// Integrations button
const integrationsBtn = document.getElementById('integrations-btn');
if (integrationsBtn) {
    integrationsBtn.addEventListener('click', () => {
        showNotification('🔗 Integrations feature coming soon!', 'info');
        userDropdown.classList.remove('active');
    });
}

// Profile Settings link - completely hands-off, just close dropdown
const profileSettingsLink = document.querySelector('.profile-settings-link-simple');
if (profileSettingsLink) {
    console.log('Profile settings link found, adding minimal handler');
    profileSettingsLink.addEventListener('click', (e) => {
        console.log('=== DASHBOARD: Profile settings link clicked ===');
        console.log('Link href:', profileSettingsLink.href);
        console.log('Current location:', window.location.href);
        // Just close dropdown, let the browser handle navigation
        if (userDropdown) {
            userDropdown.classList.remove('active');
        }
    });
}

// Tab Navigation
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;

        // Remove active from all tabs
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Add active to clicked tab
        btn.classList.add('active');
        const targetContent = document.getElementById(`tab-${tabName}`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    });
});

// Sync Button
const syncBtn = document.getElementById('sync-btn');
if (syncBtn) {
    syncBtn.addEventListener('click', () => {
        const icon = syncBtn.querySelector('svg');
        icon.style.animation = 'rotate 1s linear infinite';
        syncBtn.disabled = true;

        setTimeout(() => {
            icon.style.animation = '';
            syncBtn.disabled = false;
            showNotification('✓ Data synced successfully', 'success');
        }, 2000);
    });
}

// Notifications Button
const notificationsBtn = document.getElementById('notifications-btn');
if (notificationsBtn) {
    notificationsBtn.addEventListener('click', () => {
        showNotification('🔔 Notifications feature coming soon!', 'info');
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 30px;
        padding: 16px 20px;
        background: ${type === 'success' ? 'rgba(34, 197, 94, 0.15)' : type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(124, 58, 237, 0.15)'};
        border: 1px solid ${type === 'success' ? 'rgba(34, 197, 94, 0.3)' : type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(124, 58, 237, 0.3)'};
        border-radius: 12px;
        color: white;
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 320px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.6);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    @keyframes rotate {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Disabled - no accounts connected yet
// Numbers will be animated once user connects social media accounts

// Performance Chart - Disabled until accounts connected
const ctx = document.getElementById('performance-chart');
if (false && ctx && typeof Chart !== 'undefined') {
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan 1', 'Jan 5', 'Jan 10', 'Jan 15', 'Jan 20', 'Jan 25', 'Jan 30'],
            datasets: [{
                label: 'Views',
                data: [45000, 52000, 48000, 61000, 73000, 68000, 85000],
                borderColor: '#7C3AED',
                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: '#7C3AED',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }, {
                label: 'Engagement',
                data: [3200, 3800, 3500, 4500, 5200, 4900, 6100],
                borderColor: '#06B6D4',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: '#06B6D4',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: '#A1A1AA',
                        font: {
                            family: 'Inter',
                            size: 13,
                            weight: 500
                        },
                        padding: 16,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 36, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#A1A1AA',
                    borderColor: '#27272A',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    boxPadding: 6,
                    usePointStyle: true,
                    font: {
                        family: 'Inter'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#27272A',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#71717A',
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        callback: function(value) {
                            return value >= 1000 ? (value / 1000) + 'K' : value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#71717A',
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Time Filter Buttons
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        showNotification(`Showing data for ${btn.textContent}`, 'info');
    });
});

// Insight Action Buttons
const insightActions = document.querySelectorAll('.insight-action');
insightActions.forEach(btn => {
    btn.addEventListener('click', () => {
        const originalText = btn.textContent;
        btn.textContent = '✓ Scheduled';
        btn.style.background = 'linear-gradient(135deg, #16A34A, #15803D)';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);

        showNotification('Post scheduled successfully!', 'success');
    });
});

// Action Buttons
const actionButtons = document.querySelectorAll('.action-button');
actionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const text = btn.textContent.trim();
        showNotification(`${text} - Coming soon!`, 'info');
    });
});

// Search Bar
const searchInput = document.getElementById('search-input');
if (searchInput) {
    // CMD/CTRL + K shortcut
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (query.length > 2) {
            console.log('Searching for:', query);
            // Add search functionality here
        }
    });
}

// Progress bar animations on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.metric-bar-fill').forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.timeline').forEach(timeline => {
    observer.observe(timeline);
});

// Console branding
console.log('%c✨ Influora Dashboard - Modern Design', 'color: #7C3AED; font-size: 16px; font-weight: bold;');
console.log('%cPurple/Cyan Theme - Clean & Professional', 'color: #06B6D4; font-weight: bold;');
