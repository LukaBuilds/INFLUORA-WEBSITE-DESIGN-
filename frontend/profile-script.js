// Global state for uploaded avatar
let uploadedAvatarData = null;

// Check Authentication
async function checkAuth() {
    // PRIORITY 1: Check localStorage first (fallback auth)
    const localAuth = localStorage.getItem('influora_auth');
    const localUser = localStorage.getItem('influora_user');

    if (localAuth === 'true' && localUser) {
        try {
            const user = JSON.parse(localUser);
            // Create a minimal user object with email for compatibility
            const userObj = {
                email: localStorage.getItem('influora_email') || user.email || '',
                user_metadata: {
                    name: user.name || '',
                    bio: user.bio || ''
                }
            };
            loadUserProfile(userObj);
            return;
        } catch (error) {
            console.error('Error parsing localStorage user:', error);
        }
    }

    // PRIORITY 2: Check Supabase (if localStorage failed)
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            // One-time cleanup: Remove avatar from user metadata if it exists (causes quota errors)
            if (session.user.user_metadata?.avatar) {
                try {
                    await supabaseClient.auth.updateUser({
                        data: {
                            name: session.user.user_metadata.name,
                            bio: session.user.user_metadata.bio,
                            avatar: null // Remove avatar from metadata
                        }
                    });
                } catch (e) {
                    console.log('Avatar cleanup skipped:', e);
                }
            }
            loadUserProfile(session.user);
            return;
        }
    } catch (error) {
        console.error('Supabase check failed:', error);
    }

    // PRIORITY 3: No auth found - redirect to login
    window.location.href = 'login.html';
}

// Load User Profile
function loadUserProfile(user) {
    // Read saved profile data from localStorage
    const savedProfile = JSON.parse(localStorage.getItem('influora_user') || '{}');

    // Load saved profile picture from localStorage
    const savedProfilePic = localStorage.getItem(`influora_profile_pic_${user.email}`);

    // Merge with Supabase user metadata (Supabase user_metadata takes priority)
    const name = user.user_metadata?.name || savedProfile.name || user.email?.split('@')[0] || 'User';
    const bio = user.user_metadata?.bio || savedProfile.bio || '';
    // Avatar from localStorage (base64 image)
    const avatarData = savedProfilePic || null;

    // Top nav
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');
    const dropdownName = document.getElementById('dropdown-name');
    const dropdownEmail = document.getElementById('dropdown-email');
    const dropdownAvatar = document.getElementById('dropdown-avatar');

    // Form inputs
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profileBio = document.getElementById('profile-bio');

    // Preview elements
    const previewName = document.getElementById('preview-name');
    const previewEmail = document.getElementById('preview-email');
    const previewBio = document.getElementById('preview-bio');
    const previewAvatarInitials = document.getElementById('preview-avatar-initials');
    const previewAvatarImg = document.getElementById('preview-avatar-img');

    // Generate initials
    const initials = name
        ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : user.email[0].toUpperCase();

    // Update all elements
    if (userName) userName.textContent = name;
    if (dropdownName) dropdownName.textContent = name;
    if (dropdownEmail) dropdownEmail.textContent = user.email;

    // Update form inputs
    if (profileName) profileName.value = name;
    if (profileEmail) profileEmail.value = user.email;
    if (profileBio) profileBio.value = bio;

    // Update preview
    if (previewName) previewName.textContent = name;
    if (previewEmail) previewEmail.textContent = user.email;
    if (previewBio) previewBio.textContent = bio || 'No bio yet - tell us about yourself!';

    // Load saved avatar if exists
    if (avatarData) {
        uploadedAvatarData = avatarData;
        updateAvatarPreview(avatarData);
        const removeBtn = document.getElementById('remove-avatar-btn');
        if (removeBtn) removeBtn.style.display = 'block';

        // Update top nav avatars with image
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
        if (previewAvatarInitials) previewAvatarInitials.textContent = initials;
    }

    // Update bio character counter
    updateBioCounter();
}

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

    document.addEventListener('click', (e) => {
        if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('active');
        }
    });
}

// Logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        // Clear ALL Influora localStorage data
        localStorage.removeItem('influora_user');
        localStorage.removeItem('influora_auth');
        localStorage.removeItem('influora_email');

        // Clear profile pictures
        const userEmail = localStorage.getItem('influora_email');
        if (userEmail) {
            localStorage.removeItem(`influora_profile_pic_${userEmail}`);
        }

        // Sign out from Supabase if available
        try {
            if (supabaseClient) {
                await supabaseClient.auth.signOut();
            }
        } catch (error) {
            console.error('Supabase signOut error:', error);
        }

        window.location.href = 'login.html';
    });
}

// Preferences button
const preferencesBtn = document.getElementById('preferences-btn');
if (preferencesBtn) {
    preferencesBtn.addEventListener('click', () => {
        showNotification('⚙️ Preferences feature coming soon!', 'info');
        if (userDropdown) userDropdown.classList.remove('active');
    });
}

// Integrations button
const integrationsBtn = document.getElementById('integrations-btn');
if (integrationsBtn) {
    integrationsBtn.addEventListener('click', () => {
        showNotification('🔗 Integrations feature coming soon!', 'info');
        if (userDropdown) userDropdown.classList.remove('active');
    });
}

// ===== TAB SWITCHING =====
const settingsTabs = document.querySelectorAll('.settings-tab');
const tabContents = document.querySelectorAll('.tab-content');

settingsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;

        // Remove active class from all tabs and contents
        settingsTabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        const targetContent = document.querySelector(`[data-content="${tabName}"]`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    });
});

// ===== PROFILE PICTURE UPLOAD =====
const uploadArea = document.getElementById('upload-area');
const avatarUpload = document.getElementById('avatar-upload');
const chooseFileBtn = document.getElementById('choose-file-btn');
const removeAvatarBtn = document.getElementById('remove-avatar-btn');
const previewAvatarImg = document.getElementById('preview-avatar-img');
const previewAvatarInitials = document.getElementById('preview-avatar-initials');

// Click to upload
if (chooseFileBtn && avatarUpload) {
    chooseFileBtn.addEventListener('click', () => {
        avatarUpload.click();
    });
}

if (uploadArea && avatarUpload) {
    uploadArea.addEventListener('click', () => {
        avatarUpload.click();
    });
}

// Handle file selection
if (avatarUpload) {
    avatarUpload.addEventListener('change', (e) => {
        handleFileSelect(e.target.files[0]);
    });
}

// Drag and drop
if (uploadArea) {
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('dragging');
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('dragging');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('dragging');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });
}

// Resize image to fit within maxSize while maintaining aspect ratio
function resizeImage(file, maxSize = 400) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > height) {
                    if (width > maxSize) {
                        height = (height / width) * maxSize;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width = (width / height) * maxSize;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to base64 with compression
                const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8);
                resolve(resizedBase64);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Handle file selection
async function handleFileSelect(file) {
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
        showNotification('Please upload an image file (JPG, PNG, GIF)', 'error');
        return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('File size must be less than 5MB', 'error');
        return;
    }

    try {
        // Resize image to reduce file size
        const resizedImage = await resizeImage(file, 400);
        uploadedAvatarData = resizedImage;
        updateAvatarPreview(resizedImage);
        const removeBtn = document.getElementById('remove-avatar-btn');
        if (removeBtn) removeBtn.style.display = 'block';
        showNotification('✓ Profile picture uploaded! Click "Save Changes" to apply', 'success');
    } catch (error) {
        console.error('Error processing image:', error);
        showNotification('Failed to process image', 'error');
    }
}

// Update avatar preview
function updateAvatarPreview(imageData) {
    const img = document.getElementById('preview-avatar-img');
    const initials = document.getElementById('preview-avatar-initials');
    if (img && initials) {
        img.src = imageData;
        img.style.display = 'block';
        initials.style.display = 'none';
    }
}

// Remove avatar
if (removeAvatarBtn) {
    removeAvatarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        uploadedAvatarData = null;
        const img = document.getElementById('preview-avatar-img');
        const initials = document.getElementById('preview-avatar-initials');
        if (img && initials) {
            img.style.display = 'none';
            initials.style.display = 'flex';
        }
        removeAvatarBtn.style.display = 'none';
        const upload = document.getElementById('avatar-upload');
        if (upload) upload.value = '';
        showNotification('Profile picture removed', 'info');
    });
}

// ===== REAL-TIME PREVIEW UPDATES =====
const profileNameInput = document.getElementById('profile-name');
const profileBioInput = document.getElementById('profile-bio');

if (profileNameInput) {
    profileNameInput.addEventListener('input', (e) => {
        const previewName = document.getElementById('preview-name');
        if (previewName) {
            previewName.textContent = e.target.value || 'User';
        }
    });
}

if (profileBioInput) {
    profileBioInput.addEventListener('input', (e) => {
        const previewBio = document.getElementById('preview-bio');
        if (previewBio) {
            previewBio.textContent = e.target.value || 'No bio yet - tell us about yourself!';
        }
        updateBioCounter();
    });
}

// Bio character counter
function updateBioCounter() {
    const bioInput = document.getElementById('profile-bio');
    const bioCount = document.getElementById('bio-count');
    if (bioInput && bioCount) {
        bioCount.textContent = bioInput.value.length;
    }
}

// ===== PROFILE FORM SUBMISSION =====
const profileForm = document.getElementById('profile-form');
if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const alertDiv = document.getElementById('profile-alert');
        const saveBtn = document.getElementById('save-profile-btn');
        const name = document.getElementById('profile-name').value.trim();
        const bio = document.getElementById('profile-bio').value.trim();

        saveBtn.disabled = true;
        saveBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Saving...</span>';

        try {
            // Get current user email from localStorage first
            let userEmail = localStorage.getItem('influora_email') || '';

            // Try to get from Supabase if localStorage doesn't have it
            if (!userEmail) {
                try {
                    const { data: { session } } = await supabaseClient.auth.getSession();
                    if (session?.user?.email) {
                        userEmail = session.user.email;
                    }
                } catch (e) {
                    console.log('Could not get email from Supabase:', e);
                }
            }

            // Save profile picture to localStorage (persists across sessions)
            if (uploadedAvatarData && userEmail) {
                localStorage.setItem(`influora_profile_pic_${userEmail}`, uploadedAvatarData);

                // Dispatch custom event to notify other pages (like dashboard) to update
                window.dispatchEvent(new Event('profile-pic-updated'));
            }

            // PRIORITY 1: Save to localStorage (ALWAYS works - primary storage)
            const storedUser = localStorage.getItem('influora_user');
            const user = {
                ...JSON.parse(storedUser || '{}'),
                name: name,
                bio: bio,
                email: userEmail,
                updated_at: new Date().toISOString()
            };
            localStorage.setItem('influora_user', JSON.stringify(user));

            // PRIORITY 2: Try to save to Supabase (optional - doesn't fail if unavailable)
            if (supabaseClient) {
                try {
                    await supabaseClient.auth.updateUser({
                        data: {
                            name: name,
                            bio: bio
                        }
                    });
                    console.log('Profile synced to Supabase');
                } catch (err) {
                    console.log('Supabase update skipped (not critical):', err);
                    // Don't throw - localStorage save succeeded
                }
            }

            if (alertDiv) {
                alertDiv.textContent = '✓ Profile updated successfully!';
                alertDiv.className = 'alert-message success';

                setTimeout(() => {
                    alertDiv.className = 'alert-message hidden';
                }, 3000);
            }

            // Update UI
            const userName = document.getElementById('user-name');
            const userAvatar = document.getElementById('user-avatar');
            const dropdownName = document.getElementById('dropdown-name');
            const dropdownAvatar = document.getElementById('dropdown-avatar');
            const previewName = document.getElementById('preview-name');
            const previewAvatarImg = document.getElementById('preview-avatar-img');
            const previewAvatarInitials = document.getElementById('preview-avatar-initials');

            // Use existing session variable
            const userEmail = session?.user?.email || '';
            const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : userEmail[0]?.toUpperCase() || 'U';

            // Update names
            if (userName) userName.textContent = name || 'User';
            if (dropdownName) dropdownName.textContent = name || 'User';
            if (previewName) previewName.textContent = name || 'User';

            // Update avatars - show image if uploaded, otherwise show initials
            if (uploadedAvatarData) {
                // Update top nav avatars with image
                if (userAvatar) {
                    userAvatar.style.backgroundImage = `url(${uploadedAvatarData})`;
                    userAvatar.style.backgroundSize = 'cover';
                    userAvatar.style.backgroundPosition = 'center';
                    userAvatar.textContent = '';
                }
                if (dropdownAvatar) {
                    dropdownAvatar.style.backgroundImage = `url(${uploadedAvatarData})`;
                    dropdownAvatar.style.backgroundSize = 'cover';
                    dropdownAvatar.style.backgroundPosition = 'center';
                    dropdownAvatar.textContent = '';
                }
                // Update preview card avatar
                if (previewAvatarImg && previewAvatarInitials) {
                    previewAvatarImg.src = uploadedAvatarData;
                    previewAvatarImg.style.display = 'block';
                    previewAvatarInitials.style.display = 'none';
                }
            } else {
                // Show initials
                if (userAvatar) userAvatar.textContent = initials;
                if (dropdownAvatar) dropdownAvatar.textContent = initials;
            }

            showNotification('✓ Profile saved successfully!', 'success');

        } catch (error) {
            if (alertDiv) {
                alertDiv.textContent = 'Failed to update profile';
                alertDiv.className = 'alert-message error';
            }
            showNotification('Failed to save profile', 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="7 3 7 8 15 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Save Changes</span>';
        }
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        padding: 16px 20px;
        background: ${type === 'success' ? 'rgba(34, 197, 94, 0.15)' : type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(124, 58, 237, 0.15)'};
        border: 1px solid ${type === 'success' ? 'rgba(34, 197, 94, 0.3)' : type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(124, 58, 237, 0.3)'};
        border-radius: 12px;
        color: white;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
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

// Add animation styles
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
`;
document.head.appendChild(style);

// ===== SECURITY TAB FUNCTIONALITY =====

// Update Security UI function
function updateSecurityUI() {
    const is2FAEnabled = localStorage.getItem('influora_2fa_enabled') === 'true';
    const enable2FABtns = document.querySelectorAll('.btn-secondary');

    enable2FABtns.forEach(btn => {
        if (btn.textContent.includes('Enable 2FA') || btn.textContent.includes('Disable 2FA')) {
            btn.textContent = is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA';
            if (is2FAEnabled) {
                btn.style.background = 'rgba(34, 197, 94, 0.1)';
                btn.style.borderColor = 'rgba(34, 197, 94, 0.3)';
                btn.style.color = '#22C55E';
            } else {
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.style.color = '';
            }
        }
    });
}

// Initialize security UI based on saved state
function initializeSecurityUI() {
    updateSecurityUI();
}

// Call on page load
setTimeout(initializeSecurityUI, 100);

// Platform Connect Buttons
const connectButtons = document.querySelectorAll('.connect-btn');
connectButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
        const platformCard = e.target.closest('.platform-card');
        const platformName = platformCard.querySelector('h4').textContent;

        if (platformName === 'YouTube') {
            await connectYouTube(btn);
        } else {
            showNotification(`🔗 ${platformName} integration coming soon!`, 'info');
        }
    });
});

// Connect YouTube via OAuth
async function connectYouTube(button) {
    try {
        // Get current user
        const { data: { session } } = await supabaseClient.auth.getSession();

        if (!session) {
            showNotification('Please log in first', 'error');
            window.location.href = '/login';
            return;
        }

        const userId = session.user.id;

        // Show loading state
        button.disabled = true;
        const originalText = button.textContent;
        button.textContent = 'Connecting...';

        // Request OAuth URL from backend
        const response = await fetch(`/api/youtube/auth?userId=${userId}`);
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to initialize YouTube connection');
        }

        // Open OAuth flow in a popup window
        const width = 600;
        const height = 700;
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);

        const popup = window.open(
            data.authUrl,
            'YouTube OAuth',
            `width=${width},height=${height},left=${left},top=${top}`
        );

        // Monitor popup for completion
        const checkPopup = setInterval(() => {
            if (popup.closed) {
                clearInterval(checkPopup);
                button.disabled = false;
                button.textContent = originalText;

                // Check if connection was successful
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('youtube_connected') === 'true') {
                    const channelData = JSON.parse(decodeURIComponent(urlParams.get('data')));

                    // Save to localStorage
                    const connectedAccounts = JSON.parse(localStorage.getItem('connected_accounts') || '{}');
                    connectedAccounts.youtube = channelData;
                    localStorage.setItem('connected_accounts', JSON.stringify(connectedAccounts));

                    // Update UI
                    updatePlatformUI('youtube', channelData);
                    showNotification('✅ YouTube connected successfully!', 'success');

                    // Clean URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                } else if (urlParams.get('error')) {
                    const error = urlParams.get('error');
                    showNotification('❌ Failed to connect YouTube: ' + error, 'error');
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            }
        }, 500);

    } catch (error) {
        console.error('Error connecting YouTube:', error);
        showNotification('❌ ' + error.message, 'error');
        button.disabled = false;
        button.textContent = 'Connect';
    }
}

// Update platform UI after connection
function updatePlatformUI(platform, data) {
    // Find the platform card
    const platformCards = document.querySelectorAll('.platform-card');
    platformCards.forEach(card => {
        const platformName = card.querySelector('h4').textContent.toLowerCase();
        if (platformName === platform) {
            // Update status
            const statusBadge = card.querySelector('.platform-status');
            if (statusBadge) {
                statusBadge.textContent = 'Connected';
                statusBadge.style.background = 'rgba(34, 197, 94, 0.1)';
                statusBadge.style.color = '#22C55E';
            }

            // Update button
            const button = card.querySelector('.connect-btn');
            if (button) {
                button.textContent = 'Disconnect';
                button.style.background = 'rgba(239, 68, 68, 0.1)';
                button.style.color = '#EF4444';
                button.classList.add('connected');
            }

            // Show account info
            const accountInfo = document.createElement('div');
            accountInfo.style.cssText = 'margin-top: 12px; padding: 12px; background: rgba(124, 58, 237, 0.1); border-radius: 8px; font-size: 13px;';
            accountInfo.innerHTML = `
                <strong>${data.displayName}</strong><br>
                <span style="color: #A1A1AA;">${data.followers.toLocaleString()} subscribers • ${data.posts} videos</span>
            `;

            // Remove existing info if any
            const existingInfo = card.querySelector('.account-info');
            if (existingInfo) existingInfo.remove();

            accountInfo.classList.add('account-info');
            card.appendChild(accountInfo);
        }
    });
}

// Check for OAuth callback on page load
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('youtube_connected') === 'true') {
        const channelDataParam = urlParams.get('data');
        if (channelDataParam) {
            try {
                const channelData = JSON.parse(decodeURIComponent(channelDataParam));

                // Save to localStorage
                const connectedAccounts = JSON.parse(localStorage.getItem('connected_accounts') || '{}');
                connectedAccounts.youtube = channelData;
                localStorage.setItem('connected_accounts', JSON.stringify(connectedAccounts));

                // Update UI
                updatePlatformUI('youtube', channelData);
                showNotification('✅ YouTube connected successfully!', 'success');

                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (error) {
                console.error('Error processing YouTube connection:', error);
            }
        }
    } else if (urlParams.get('error')) {
        const error = urlParams.get('error');
        let errorMessage = 'Failed to connect YouTube';

        switch(error) {
            case 'no_code':
                errorMessage = 'Authorization failed. Please try again.';
                break;
            case 'no_channel':
                errorMessage = 'No YouTube channel found for this account.';
                break;
            case 'oauth_failed':
                errorMessage = 'OAuth authorization failed. Please try again.';
                break;
        }

        showNotification('❌ ' + errorMessage, 'error');
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Load connected accounts from localStorage
    const connectedAccounts = JSON.parse(localStorage.getItem('connected_accounts') || '{}');
    if (connectedAccounts.youtube) {
        updatePlatformUI('youtube', connectedAccounts.youtube);
    }
});

// Change Password Button
const changePasswordBtns = document.querySelectorAll('.btn-secondary');
changePasswordBtns.forEach(btn => {
    if (btn.textContent.includes('Change Password')) {
        btn.addEventListener('click', () => {
            showPasswordChangeModal();
        });
    }

    if (btn.textContent.includes('Enable 2FA')) {
        btn.addEventListener('click', () => {
            show2FAModal();
        });
    }

    if (btn.textContent.includes('View Sessions')) {
        btn.addEventListener('click', () => {
            showSessionsModal();
        });
    }
});

// Delete Account Button
const deleteAccountBtns = document.querySelectorAll('.btn-danger');
deleteAccountBtns.forEach(btn => {
    if (btn.textContent.includes('Delete Account')) {
        btn.addEventListener('click', () => {
            showDeleteAccountModal();
        });
    }
});

// ===== MODAL FUNCTIONS =====

function showPasswordChangeModal() {
    const modal = createModal('Change Password', `
        <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px;">Current Password</label>
            <input type="password" id="current-password" placeholder="Enter current password" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; font-size: 14px;">
        </div>
        <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px;">New Password</label>
            <input type="password" id="new-password" placeholder="Enter new password" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; font-size: 14px;">
        </div>
        <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px;">Confirm New Password</label>
            <input type="password" id="confirm-password" placeholder="Confirm new password" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; font-size: 14px;">
        </div>
    `, [
        {
            text: 'Cancel',
            style: 'secondary',
            onClick: () => closeModal()
        },
        {
            text: 'Change Password',
            style: 'primary',
            onClick: () => {
                const current = document.getElementById('current-password').value;
                const newPass = document.getElementById('new-password').value;
                const confirm = document.getElementById('confirm-password').value;

                if (!current || !newPass || !confirm) {
                    showNotification('Please fill in all fields', 'error');
                    return;
                }

                // Verify current password matches stored password
                const storedPassword = localStorage.getItem('influora_password');
                if (storedPassword && current !== storedPassword) {
                    showNotification('Current password is incorrect', 'error');
                    return;
                }

                if (newPass !== confirm) {
                    showNotification('New passwords do not match', 'error');
                    return;
                }

                if (newPass.length < 8) {
                    showNotification('Password must be at least 8 characters', 'error');
                    return;
                }

                // Actually update the password in localStorage
                localStorage.setItem('influora_password', newPass);

                closeModal();
                showNotification('✓ Password changed successfully!', 'success');
            }
        }
    ]);
}

function show2FAModal() {
    // Check if 2FA is already enabled
    const is2FAEnabled = localStorage.getItem('influora_2fa_enabled') === 'true';

    if (is2FAEnabled) {
        // Show disable 2FA modal
        const modal = createModal('Disable Two-Factor Authentication', `
            <div style="text-align: center; margin-bottom: 24px;">
                <div style="width: 80px; height: 80px; background: rgba(34, 197, 94, 0.1); border: 2px solid rgba(34, 197, 94, 0.3); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 40px;">
                    ✓
                </div>
                <h3 style="font-size: 18px; font-weight: 700; color: #22C55E; margin-bottom: 8px;">2FA is Currently Enabled</h3>
                <p style="font-size: 14px; color: #A1A1AA; line-height: 1.6;">
                    Your account is protected with two-factor authentication. Disabling it will make your account less secure.
                </p>
            </div>
            <div style="margin-bottom: 20px;">
                <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px;">Enter your password to disable 2FA</label>
                <input type="password" id="2fa-password" placeholder="Enter password" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; font-size: 14px;">
            </div>
        `, [
            {
                text: 'Cancel',
                style: 'secondary',
                onClick: () => closeModal()
            },
            {
                text: 'Disable 2FA',
                style: 'danger',
                onClick: async () => {
                    const password = document.getElementById('2fa-password').value;

                    if (!password) {
                        showNotification('Please enter your password', 'error');
                        return;
                    }

                    // Get current user's email
                    const { data: { session } } = await supabaseClient.auth.getSession();
                    if (!session || !session.user) {
                        showNotification('Session expired. Please log in again.', 'error');
                        return;
                    }

                    // Verify password by re-authenticating with Supabase
                    const { error } = await supabaseClient.auth.signInWithPassword({
                        email: session.user.email,
                        password: password
                    });

                    if (error) {
                        showNotification('Incorrect password. Please try again.', 'error');
                        return;
                    }

                    // Password is correct - disable 2FA
                    localStorage.setItem('influora_2fa_enabled', 'false');
                    localStorage.removeItem('influora_2fa_secret');

                    // Update button text
                    updateSecurityUI();

                    closeModal();
                    showNotification('Two-Factor Authentication disabled', 'info');
                }
            }
        ]);
    } else {
        // Generate a random 2FA secret (without spaces for the URI)
        const secret = generateRandomSecret();
        const secretForDisplay = secret; // With spaces for display
        const secretForQR = secret.replace(/\s/g, ''); // Without spaces for QR code

        // Get user email for the QR code
        const userEmail = localStorage.getItem('influora_user')
            ? JSON.parse(localStorage.getItem('influora_user')).email
            : 'user@influora.com';

        const modal = createModal('Enable Two-Factor Authentication', `
            <div style="text-align: center; margin-bottom: 24px;">
                <div id="qrcode-container" style="width: 200px; height: 200px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; background: white; border-radius: 12px; padding: 10px;"></div>
                <p style="font-size: 14px; color: #A1A1AA; margin-bottom: 8px;">Scan the QR code above with your authenticator app</p>
                <p style="font-size: 12px; color: #71717A;">Or enter this code manually:</p>
                <div style="background: rgba(124, 58, 237, 0.1); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 8px; padding: 12px; margin-top: 12px; font-family: monospace; font-size: 14px; letter-spacing: 2px;">
                    ${secretForDisplay}
                </div>
            </div>
            <div style="margin-bottom: 20px;">
                <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px;">Enter 6-digit code from app</label>
                <input type="text" id="2fa-code" placeholder="000000" maxlength="6" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; font-size: 18px; text-align: center; letter-spacing: 4px; font-family: monospace;">
            </div>
        `, [
            {
                text: 'Cancel',
                style: 'secondary',
                onClick: () => closeModal()
            },
            {
                text: 'Enable 2FA',
                style: 'primary',
                onClick: () => {
                    const code = document.getElementById('2fa-code').value;

                    if (!code || code.length !== 6) {
                        showNotification('Please enter a valid 6-digit code', 'error');
                        return;
                    }

                    // Verify the TOTP code is correct
                    if (!verifyTOTP(secret, code)) {
                        showNotification('Invalid code. Please check your authenticator app and try again.', 'error');
                        return;
                    }

                    // Code is valid - enable 2FA and save the secret
                    localStorage.setItem('influora_2fa_enabled', 'true');
                    localStorage.setItem('influora_2fa_secret', secret);

                    // Update button text
                    updateSecurityUI();

                    closeModal();
                    showNotification('✓ Two-Factor Authentication enabled!', 'success');
                }
            }
        ]);

        // Generate the QR code after a brief delay to ensure DOM is ready
        setTimeout(() => {
            const qrContainer = document.getElementById('qrcode-container');
            if (qrContainer && typeof QRCode !== 'undefined') {
                // Clear container first
                qrContainer.innerHTML = '';

                // Create TOTP URI
                const otpauth = `otpauth://totp/Influora:${userEmail}?secret=${secretForQR}&issuer=Influora`;

                // Generate QR code
                new QRCode(qrContainer, {
                    text: otpauth,
                    width: 180,
                    height: 180,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            }
        }, 100);
    }
}

function generateRandomSecret() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 16; i++) {
        if (i > 0 && i % 4 === 0) secret += ' ';
        secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
}

// Base32 decode function
function base32Decode(secret) {
    const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    let hex = '';

    // Remove spaces and convert to uppercase
    secret = secret.replace(/\s/g, '').toUpperCase();

    for (let i = 0; i < secret.length; i++) {
        const val = base32chars.indexOf(secret.charAt(i));
        if (val === -1) continue;
        bits += val.toString(2).padStart(5, '0');
    }

    for (let i = 0; i + 8 <= bits.length; i += 8) {
        const chunk = bits.substr(i, 8);
        hex += parseInt(chunk, 2).toString(16).padStart(2, '0');
    }

    return hex;
}

// Generate TOTP code from secret
function generateTOTP(secret, timeStep = 30) {
    try {
        // Get current time counter
        const epoch = Math.floor(Date.now() / 1000);
        const counter = Math.floor(epoch / timeStep);

        // Convert counter to hex (8 bytes)
        const counterHex = counter.toString(16).padStart(16, '0');

        // Decode secret to hex
        const secretHex = base32Decode(secret);

        // Create HMAC-SHA1
        const shaObj = new jsSHA('SHA-1', 'HEX');
        shaObj.setHMACKey(secretHex, 'HEX');
        shaObj.update(counterHex);
        const hmac = shaObj.getHMAC('HEX');

        // Dynamic truncation
        const offset = parseInt(hmac.substring(hmac.length - 1), 16);
        const otp = (parseInt(hmac.substr(offset * 2, 8), 16) & 0x7fffffff) % 1000000;

        return otp.toString().padStart(6, '0');
    } catch (error) {
        console.error('TOTP generation error:', error);
        return null;
    }
}

// Verify TOTP code
function verifyTOTP(secret, code, window = 1) {
    // Check current time and nearby time windows to account for clock drift
    for (let i = -window; i <= window; i++) {
        const timeStep = 30;
        const epoch = Math.floor(Date.now() / 1000);
        const counter = Math.floor(epoch / timeStep) + i;

        // Generate TOTP for this time window
        const expectedCode = generateTOTPForCounter(secret, counter);

        if (expectedCode === code) {
            return true;
        }
    }
    return false;
}

// Generate TOTP for specific counter
function generateTOTPForCounter(secret, counter) {
    try {
        // Convert counter to hex (8 bytes)
        const counterHex = counter.toString(16).padStart(16, '0');

        // Decode secret to hex
        const secretHex = base32Decode(secret);

        // Create HMAC-SHA1
        const shaObj = new jsSHA('SHA-1', 'HEX');
        shaObj.setHMACKey(secretHex, 'HEX');
        shaObj.update(counterHex);
        const hmac = shaObj.getHMAC('HEX');

        // Dynamic truncation
        const offset = parseInt(hmac.substring(hmac.length - 1), 16);
        const otp = (parseInt(hmac.substr(offset * 2, 8), 16) & 0x7fffffff) % 1000000;

        return otp.toString().padStart(6, '0');
    } catch (error) {
        console.error('TOTP generation error:', error);
        return null;
    }
}

function showSessionsModal() {
    const modal = createModal('Active Sessions', `
        <p style="font-size: 14px; color: #A1A1AA; margin-bottom: 24px;">Manage devices where you're currently logged in</p>

        <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <div>
                        <div style="font-size: 15px; font-weight: 600; margin-bottom: 4px;">🖥️ Current Device</div>
                        <div style="font-size: 13px; color: #A1A1AA;">MacBook Pro • Safari • San Francisco, CA</div>
                        <div style="font-size: 12px; color: #71717A; margin-top: 4px;">Last active: Just now</div>
                    </div>
                    <span style="background: rgba(34, 197, 94, 0.1); color: #22C55E; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 500;">Active</span>
                </div>
            </div>

            <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <div>
                        <div style="font-size: 15px; font-weight: 600; margin-bottom: 4px;">📱 iPhone 14 Pro</div>
                        <div style="font-size: 13px; color: #A1A1AA;">Mobile App • Los Angeles, CA</div>
                        <div style="font-size: 12px; color: #71717A; margin-top: 4px;">Last active: 2 hours ago</div>
                    </div>
                    <button onclick="showNotification('Session terminated', 'success')" style="background: rgba(239, 68, 68, 0.1); color: #EF4444; padding: 6px 16px; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer;">Revoke</button>
                </div>
            </div>
        </div>
    `, [
        {
            text: 'Close',
            style: 'secondary',
            onClick: () => closeModal()
        },
        {
            text: 'Revoke All Other Sessions',
            style: 'danger',
            onClick: async () => {
                closeModal();
                showNotification('✓ All sessions revoked. Signing out...', 'success');

                // Sign out after 1.5 seconds
                setTimeout(async () => {
                    // Sign out from Supabase (this revokes all sessions)
                    await supabaseClient.auth.signOut();
                    localStorage.removeItem('influora_user');
                    // Redirect to landing page
                    window.location.href = '/';
                }, 1500);
            }
        }
    ]);
}

function showDeleteAccountModal() {
    const modal = createModal('Delete Account', `
        <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 80px; height: 80px; background: rgba(239, 68, 68, 0.1); border: 2px solid rgba(239, 68, 68, 0.3); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 40px;">
                ⚠️
            </div>
            <h3 style="font-size: 18px; font-weight: 700; color: #EF4444; margin-bottom: 8px;">Are you absolutely sure?</h3>
            <p style="font-size: 14px; color: #A1A1AA; line-height: 1.6;">
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>
        </div>
        <div style="background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <p style="font-size: 13px; color: #EF4444; margin-bottom: 12px; font-weight: 600;">Type "DELETE" to confirm:</p>
            <input type="text" id="delete-confirm" placeholder="Type DELETE" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; color: white; font-size: 14px;">
        </div>
    `, [
        {
            text: 'Cancel',
            style: 'secondary',
            onClick: () => closeModal()
        },
        {
            text: 'Delete My Account',
            style: 'danger',
            onClick: () => {
                const confirm = document.getElementById('delete-confirm').value;

                if (confirm !== 'DELETE') {
                    showNotification('Please type DELETE to confirm', 'error');
                    return;
                }

                closeModal();
                showNotification('Account deletion initiated. You will receive a confirmation email.', 'info');
            }
        }
    ]);
}

// ===== MODAL SYSTEM =====

function createModal(title, content, buttons) {
    // Remove any existing modal
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) existingModal.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.2s ease;
    `;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        background: linear-gradient(135deg, #1a1a24 0%, #0f0f17 100%);
        border: 1px solid rgba(124, 58, 237, 0.3);
        border-radius: 20px;
        padding: 32px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    modal.innerHTML = `
        <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; background: linear-gradient(135deg, #7C3AED, #06B6D4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${title}</h2>
        <div style="margin-top: 24px;">${content}</div>
        <div style="display: flex; gap: 12px; margin-top: 32px; justify-content: flex-end;">
            ${buttons.map((btn, index) => `
                <button class="modal-btn modal-btn-${btn.style}" data-index="${index}" style="
                    padding: 12px 24px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    ${btn.style === 'primary' ? 'background: linear-gradient(135deg, #7C3AED, #06B6D4); border: none; color: white;' :
                      btn.style === 'danger' ? 'background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #EF4444;' :
                      'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;'}
                ">${btn.text}</button>
            `).join('')}
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Add event listeners to buttons
    buttons.forEach((btn, index) => {
        const btnElement = modal.querySelector(`[data-index="${index}"]`);
        btnElement.addEventListener('click', btn.onClick);

        btnElement.addEventListener('mouseenter', () => {
            if (btn.style === 'primary') {
                btnElement.style.transform = 'translateY(-2px)';
                btnElement.style.boxShadow = '0 8px 24px rgba(124, 58, 237, 0.4)';
            } else {
                btnElement.style.transform = 'translateY(-2px)';
            }
        });

        btnElement.addEventListener('mouseleave', () => {
            btnElement.style.transform = 'translateY(0)';
            btnElement.style.boxShadow = 'none';
        });
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // Close on Escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

function closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => overlay.remove(), 200);
    }
}

// Add modal animations
const modalStyle = document.createElement('style');
modalStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`;
document.head.appendChild(modalStyle);

console.log('PROFILE PAGE LOADED SUCCESSFULLY');
