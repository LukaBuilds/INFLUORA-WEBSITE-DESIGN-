// ===================================
// INTERACTIVE SOLUTION SECTION ANIMATIONS
// GSAP ScrollTrigger for reveal and card animations
// ===================================

console.log('Solution interactive script loaded');

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initSolutionAnimations();
});

function initSolutionAnimations() {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Animate section title
    const solutionTitle = document.querySelector('.solution-title');
    if (solutionTitle) {
        gsap.from(solutionTitle, {
            scrollTrigger: {
                trigger: solutionTitle,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        });
    }

    // Animate section subtitle
    const solutionSubtitle = document.querySelector('.solution-subtitle');
    if (solutionSubtitle) {
        gsap.from(solutionSubtitle, {
            scrollTrigger: {
                trigger: solutionSubtitle,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: 0.2,
            ease: 'power3.out'
        });
    }

    // Animate feature cards with stagger
    const featureCards = document.querySelectorAll('.feature-card-interactive');
    if (featureCards.length > 0) {
        featureCards.forEach((card, index) => {
            // Card reveal animation
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    onEnter: () => {
                        // Trigger checkmark animation when card enters viewport
                        setTimeout(() => {
                            card.classList.add('animated');
                        }, 300);
                    }
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: index * 0.15, // Stagger delay
                ease: 'power3.out'
            });
        });
    }

    // Parallax effect for background orbs
    const orbs = document.querySelectorAll('.gradient-orb');
    if (orbs.length > 0) {
        orbs.forEach((orb, index) => {
            gsap.to(orb, {
                scrollTrigger: {
                    trigger: '.solution-section',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                },
                y: index % 2 === 0 ? -100 : 100,
                ease: 'none'
            });
        });
    }

    // Add hover interaction for cards (on click for mobile)
    featureCards.forEach(card => {
        // For touch devices, toggle animation on tap
        card.addEventListener('touchstart', (e) => {
            e.preventDefault();
            card.classList.toggle('animated');
        });
    });
}
