// ===================================
//   PRICING PAGE INTERACTIVE FEATURES
// ===================================

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Scroll animations for pricing cards
document.addEventListener('DOMContentLoaded', () => {

    // Animate pricing cards on scroll
    gsap.utils.toArray('.pricing-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'power3.out'
        });
    });

    // Animate add-on cards
    gsap.utils.toArray('.addon-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.7,
            delay: index * 0.1,
            ease: 'power2.out'
        });
    });

    // Animate FAQ items
    gsap.utils.toArray('.faq-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.7,
            delay: index * 0.08,
            ease: 'power2.out'
        });
    });

    // Animate comparison table rows
    gsap.utils.toArray('.table-row').forEach((row, index) => {
        gsap.from(row, {
            scrollTrigger: {
                trigger: row,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            x: -30,
            opacity: 0,
            duration: 0.6,
            delay: index * 0.05,
            ease: 'power2.out'
        });
    });

    // Add smooth hover effect to pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', function() {
            const isFeatured = this.classList.contains('featured');
            gsap.to(this, {
                scale: isFeatured ? 1.05 : 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Magnetic effect for CTA buttons
    const ctaButtons = document.querySelectorAll('.plan-cta, .cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(button, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });

    // Animate price amounts on scroll into view
    const priceAmounts = document.querySelectorAll('.price-amount');
    priceAmounts.forEach(amount => {
        gsap.from(amount, {
            scrollTrigger: {
                trigger: amount,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            scale: 0.5,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(2)'
        });
    });

    // Add subtle pulse animation to popular badge
    const popularBadge = document.querySelector('.popular-badge');
    if (popularBadge) {
        gsap.to(popularBadge, {
            scale: 1.05,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }

    // Animate section titles
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    // Add click handlers for CTA buttons (you can customize these)
    document.querySelectorAll('.plan-cta, .cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // Add click animation
            gsap.to(this, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });

            // You can add your own logic here (e.g., redirect to signup, open modal, etc.)
            console.log('CTA clicked:', this.textContent.trim());
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
});
