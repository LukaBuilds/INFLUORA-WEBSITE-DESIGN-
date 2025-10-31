// ===================================
// HOMEPAGE AUTH DETECTION
// Checks if user is signed in and updates UI
// ===================================

console.log('Auth homepage script loaded');

// Check authentication on page load
async function checkHomepageAuth() {
    try {
        // Get current session
        const { data: { session } } = await supabaseClient.auth.getSession();

        if (session && session.user) {
            // User is signed in
            showSignedInUI(session.user);
        } else {
            // User is NOT signed in
            showSignedOutUI();
        }
    } catch (error) {
        console.error('Error checking auth:', error);
        showSignedOutUI();
    }
}

// Show UI for signed-in users
function showSignedInUI(user) {
    console.log('User is signed in:', user.email);

    // Read saved profile data
    const savedProfile = JSON.parse(localStorage.getItem('influora_user') || '{}');
    const savedProfilePic = localStorage.getItem(`influora_profile_pic_${user.email}`);

    // Get display name
    const displayName = savedProfile.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
    const avatarData = savedProfilePic || null;

    // Generate initials
    const initials = displayName
        ? displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : user.email[0].toUpperCase();

    // Hide guest elements
    const guestButtons = document.getElementById('auth-buttons-guest');
    const heroTitleGuest = document.getElementById('hero-title-guest');
    const heroCtaGuest = document.getElementById('hero-cta-guest');

    if (guestButtons) guestButtons.style.display = 'none';
    if (heroTitleGuest) heroTitleGuest.style.display = 'none';
    if (heroCtaGuest) heroCtaGuest.style.display = 'none';

    // Show signed-in elements
    const userMenu = document.getElementById('user-menu-homepage');
    const welcomeMessage = document.getElementById('welcome-message');
    const heroCtaUser = document.getElementById('hero-cta-user');

    if (userMenu) userMenu.style.display = 'flex';
    if (welcomeMessage) welcomeMessage.style.display = 'block';
    if (heroCtaUser) heroCtaUser.style.display = 'inline-flex';

    // Update welcome name
    const welcomeName = document.getElementById('welcome-name');
    if (welcomeName) welcomeName.textContent = displayName;

    // Update user info in navigation
    const dropdownName = document.getElementById('dropdown-name-homepage');
    const dropdownEmail = document.getElementById('dropdown-email-homepage');

    if (dropdownName) dropdownName.textContent = displayName;
    if (dropdownEmail) dropdownEmail.textContent = user.email;

    // Update avatars
    const userAvatar = document.getElementById('user-avatar-homepage');
    const dropdownAvatar = document.getElementById('dropdown-avatar-homepage');

    if (avatarData) {
        // Show profile picture
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
        // Show initials
        if (userAvatar) userAvatar.textContent = initials;
        if (dropdownAvatar) dropdownAvatar.textContent = initials;
    }

    // Setup dropdown toggle
    const userAvatarBtn = document.getElementById('user-avatar-btn');
    const userDropdown = document.getElementById('user-dropdown-homepage');

    if (userAvatarBtn && userDropdown) {
        userAvatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userAvatarBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }

    // Setup logout button
    const logoutBtn = document.getElementById('logout-btn-homepage');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabaseClient.auth.signOut();
            localStorage.removeItem('influora_user');
            // Optionally clear profile picture
            // localStorage.removeItem(`influora_profile_pic_${user.email}`);
            window.location.reload();
        });
    }
}

// Show UI for signed-out users (guests)
function showSignedOutUI() {
    console.log('User is NOT signed in (guest)');

    // Show guest elements
    const guestButtons = document.getElementById('auth-buttons-guest');
    const heroTitleGuest = document.getElementById('hero-title-guest');
    const heroCtaGuest = document.getElementById('hero-cta-guest');

    if (guestButtons) guestButtons.style.display = 'flex';
    if (heroTitleGuest) heroTitleGuest.style.display = 'block';
    if (heroCtaGuest) heroCtaGuest.style.display = 'inline-flex';

    // Hide signed-in elements
    const userMenu = document.getElementById('user-menu-homepage');
    const welcomeMessage = document.getElementById('welcome-message');
    const heroCtaUser = document.getElementById('hero-cta-user');

    if (userMenu) userMenu.style.display = 'none';
    if (welcomeMessage) welcomeMessage.style.display = 'none';
    if (heroCtaUser) heroCtaUser.style.display = 'none';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkHomepageAuth();
});
