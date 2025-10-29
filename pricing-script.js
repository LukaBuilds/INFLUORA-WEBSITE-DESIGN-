// ===================================
//   PRICING PAGE ENHANCED INTERACTIVITY
// ===================================

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    // Enhanced pricing card animations with 3D tilt
    const pricingCards = document.querySelectorAll('.pricing-card');

    pricingCards.forEach((card, index) => {
        // Scroll-triggered entrance animation
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 80,
            opacity: 0,
            scale: 0.9,
            duration: 1,
            delay: index * 0.15,
            ease: 'power3.out'
        });

        // 3D tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });

    // Animated number counter for price amounts
    const priceAmounts = document.querySelectorAll('.price-amount');
    priceAmounts.forEach(amount => {
        const targetValue = parseInt(amount.textContent);

        gsap.from(amount, {
            scrollTrigger: {
                trigger: amount,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            textContent: 0,
            duration: 1.5,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate: function() {
                amount.textContent = Math.round(this.targets()[0].textContent);
            }
        });
    });

    // Animated counter for AI generation credits
    const creditsAmounts = document.querySelectorAll('.credits-amount');
    creditsAmounts.forEach(credit => {
        const targetValue = parseFloat(credit.textContent.replace(/,/g, ''));

        gsap.from(credit, {
            scrollTrigger: {
                trigger: credit,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            textContent: 0,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 10 },
            onUpdate: function() {
                const value = Math.round(this.targets()[0].textContent);
                credit.textContent = value.toLocaleString();
            }
        });
    });

    // CTA Button magnetic effect
    const ctaButtons = document.querySelectorAll('.plan-cta, .cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(button, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.5)'
            });
        });

        // Click animation
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // Ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transform: scale(0);
                top: 50%;
                left: 50%;
                pointer-events: none;
            `;

            this.appendChild(ripple);

            gsap.to(ripple, {
                scale: 2.5,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out',
                onComplete: () => ripple.remove()
            });

            // Button click animation
            gsap.to(this, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });

            console.log('Plan selected:', this.closest('.pricing-card')?.querySelector('.plan-tag')?.textContent);
        });
    });

    // Pulse animation for popular badge
    const popularRibbon = document.querySelector('.popular-ribbon');
    if (popularRibbon) {
        gsap.to(popularRibbon, {
            scale: 1.03,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }

    // Glow animation for best value badge
    const valueBadge = document.querySelector('.value-badge');
    if (valueBadge) {
        gsap.to(valueBadge, {
            boxShadow: '0 0 20px rgba(255, 107, 53, 0.5)',
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }

    // Comparison table animations
    gsap.utils.toArray('.table-row').forEach((row, index) => {
        gsap.from(row, {
            scrollTrigger: {
                trigger: row,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            x: -50,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.05,
            ease: 'power3.out'
        });
    });

    // FAQ items stagger animation
    gsap.utils.toArray('.faq-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'back.out(1.2)'
        });

        // Hover tilt effect for FAQ items
        item.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        item.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Animate check icons on scroll
    gsap.utils.toArray('.check-icon').forEach((icon, index) => {
        gsap.from(icon, {
            scrollTrigger: {
                trigger: icon,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            scale: 0,
            rotation: -180,
            opacity: 0,
            duration: 0.5,
            delay: index * 0.03,
            ease: 'back.out(2)'
        });
    });

    // Trust section animation
    const trustText = document.querySelector('.trust-text');
    if (trustText) {
        gsap.from(trustText, {
            scrollTrigger: {
                trigger: trustText,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    }

    // Section titles animation
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            scale: 0.95,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Section subtitles animation
    gsap.utils.toArray('.section-subtitle').forEach(subtitle => {
        gsap.from(subtitle, {
            scrollTrigger: {
                trigger: subtitle,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 1,
            delay: 0.2,
            ease: 'power3.out'
        });
    });

    // Parallax effect on pricing cards
    pricingCards.forEach(card => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -30,
            ease: 'none'
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: target, offsetY: 80 },
                    ease: 'power3.inOut'
                });
            }
        });
    });

    // Pricing badge animation
    const pricingBadge = document.querySelector('.pricing-badge');
    if (pricingBadge) {
        gsap.from(pricingBadge, {
            scale: 0,
            rotation: -10,
            opacity: 0,
            duration: 0.8,
            delay: 0.2,
            ease: 'back.out(2)'
        });
    }

    // Card glow follow mouse
    pricingCards.forEach(card => {
        const glow = card.querySelector('.card-glow');
        if (glow) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;

                glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(99, 102, 241, 0.2), transparent 60%)`;
            });
        }
    });

    console.log('✨ Pricing page interactive features loaded');
});
