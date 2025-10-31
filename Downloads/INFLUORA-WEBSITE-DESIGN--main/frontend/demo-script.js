// ===================================
//   INFLUORA DEMO PAGE INTERACTIVE
// ===================================

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Demo State
const demoState = {
    platform: null,
    niche: null,
    contentType: null,
    connectedAccount: null,
    accountUsername: null
};

// AI Insights Data
const insightsData = {
    tiktok: {
        fitness: {
            tutorial: {
                score: 87,
                engagement: '5.8%',
                viral: 'High',
                trend: 'Strong',
                bestTime: 'Monday, 5:30 PM',
                timeReason: 'Post-work fitness enthusiasm peaks - highest gym/workout content engagement window (Jan 2025 data)',
                boost: '+42%',
                recommendations: [
                    'Focus on 15-second quick demos - TikTok favors <20s content (2025 algorithm)',
                    'Use trending sounds from TikTok Creative Center (updated weekly)',
                    'Hook: transformation/before-after in first frame (0.5 second rule)',
                    'Add captions - 78% of fitness content is watched muted'
                ],
                trending: ['#FitnessMotivation', '#WorkoutRoutine', '#HealthyLifestyle'],
                strategy: 'Current TikTok algorithm (Jan 2025) prioritizes <strong>completion rate over everything</strong>. Fitness tutorials with full watch-through get 4.5x distribution. Start with results/transformation to hook immediately. "Quick workout" format (10-15s) performs 62% better than longer tutorials.'
            }
        },
        tech: {
            review: {
                score: 82,
                engagement: '4.9%',
                viral: 'High',
                trend: 'Strong',
                bestTime: 'Wednesday, 8:00 PM',
                timeReason: 'Mid-week tech shopping research peak - users browse before weekend purchases (2025 consumer data)',
                boost: '+38%',
                recommendations: [
                    'Show product in action first 2 seconds - no intros',
                    'Use split-screen comparison (vs competitor or cheaper alternative)',
                    'Price reveal hook: "This costs X but..." format works best',
                    'Address main pain point in text overlay immediately'
                ],
                trending: ['#TechReview', '#GadgetLife', '#TechTok'],
                strategy: 'Jan 2025 data: Tech reviews with <strong>instant value proposition</strong> get 3.8x saves (key ranking signal). Lead with price or standout feature. Format: "I bought X so you don\'t have to" performs extremely well. TikTok users decide to scroll or watch in 0.8 seconds - your hook is everything.'
            },
            entertainment: {
                score: 88,
                engagement: '6.7%',
                viral: 'Very High',
                trend: 'Very Strong',
                bestTime: 'Friday, 9:00 PM',
                timeReason: 'Weekend tech content consumption peaks - users browse TikTok for entertainment after work week ends',
                boost: '+43%',
                recommendations: [
                    'Start with a shocking tech fact or fail in first 0.5 seconds',
                    'Use trending sounds: check TikTok Creative Center for January 2025 trends',
                    'Keep it 15-20 seconds - TikTok\'s algorithm prioritizes complete watch-through',
                    'Add captions/text overlay for accessibility (85% watch without sound)'
                ],
                trending: ['#TechTok', '#TechMemes', '#TechFails'],
                strategy: 'Based on real-time data: Entertaining tech content on TikTok thrives on <strong>unexpected humor and relatability</strong>. The algorithm (Jan 2025 update) heavily weighs completion rate and shares. Content that makes viewers laugh in the first 3 seconds sees 3.2x higher engagement. Combine tech knowledge with comedy timing - think "tech fails but make it funny" format.'
            }
        },
        lifestyle: {
            vlog: {
                score: 91,
                engagement: '6.2%',
                viral: 'Very High',
                trend: 'Very Strong',
                bestTime: 'Sunday, 2:00 PM',
                timeReason: 'Weekend relaxation browsing peak time',
                boost: '+45%',
                recommendations: [
                    'Use "day in my life" format structure',
                    'Include aesthetic B-roll footage',
                    'Add trending music (check TikTok Creative Center)',
                    'Show relatable "that girl" morning routines'
                ],
                trending: ['#ThatGirl', '#DayInMyLife', '#LifestyleVlog'],
                strategy: 'Lifestyle vlogs thrive on <strong>aspirational yet relatable</strong> content. The algorithm pushes content that keeps users watching. Create satisfying visual loops and aesthetic transitions.'
            }
        }
    },
    instagram: {
        fitness: {
            tutorial: {
                score: 84,
                engagement: '7.3%',
                viral: 'High',
                trend: 'Strong',
                bestTime: 'Tuesday, 6:00 PM',
                timeReason: 'Evening workout motivation window',
                boost: '+35%',
                recommendations: [
                    'Post Reels in 9:16 format for maximum reach',
                    'Use carousel posts for detailed form breakdowns',
                    'Include exercise variations for all fitness levels',
                    'Engage with comments within first hour'
                ],
                trending: ['#FitnessTransformation', '#WorkoutMotivation', '#FitLife'],
                strategy: 'Instagram\'s algorithm prioritizes <strong>save and share rates</strong>. Create educational content people want to reference later. Carousel posts with detailed instructions perform exceptionally well.'
            }
        },
        food: {
            tutorial: {
                score: 89,
                engagement: '8.1%',
                viral: 'Very High',
                trend: 'Very Strong',
                bestTime: 'Thursday, 7:30 PM',
                timeReason: 'Peak dinner inspiration browsing time',
                boost: '+48%',
                recommendations: [
                    'Show final dish in first frame',
                    'Use overhead shots for recipe steps',
                    'Include ingredient list in caption',
                    'Add "Save this!" call-to-action'
                ],
                trending: ['#FoodTok', '#EasyRecipes', '#Foodie'],
                strategy: 'Food content dominates Instagram with <strong>visual appeal and saveability</strong>. Users save recipes to try later - optimize for this behavior. Beautiful plating and clear instructions = high engagement.'
            }
        },
        travel: {
            vlog: {
                score: 93,
                engagement: '9.2%',
                viral: 'Very High',
                trend: 'Exceptional',
                bestTime: 'Friday, 12:00 PM',
                timeReason: 'Lunchtime daydreaming and weekend planning',
                boost: '+52%',
                recommendations: [
                    'Lead with most breathtaking location shot',
                    'Use location tags aggressively',
                    'Share hidden gems and secret spots',
                    'Include budget breakdown in caption'
                ],
                trending: ['#TravelGram', '#Wanderlust', '#TravelReels'],
                strategy: 'Travel content performs best when it inspires <strong>wanderlust and provides value</strong>. The algorithm favors content that generates saves and shares. Make viewers want to visit AND save your tips.'
            }
        }
    },
    youtube: {
        tech: {
            review: {
                score: 86,
                engagement: '12.4%',
                viral: 'Medium',
                trend: 'Strong',
                bestTime: 'Saturday, 10:00 AM',
                timeReason: 'Weekend product research window',
                boost: '+31%',
                recommendations: [
                    'Create timestamps for easy navigation',
                    'Include pros/cons section',
                    'Show real-world usage scenarios',
                    'End with clear recommendation'
                ],
                trending: ['Tech Reviews', 'Unboxing', 'Is it worth it?'],
                strategy: 'YouTube\'s algorithm values <strong>watch time and session time</strong>. Structure reviews to keep viewers watching. Use pattern interrupts every 90 seconds. Strong CTR requires compelling thumbnails with clear value props.'
            }
        },
        business: {
            tutorial: {
                score: 81,
                engagement: '11.2%',
                viral: 'Medium',
                trend: 'Strong',
                bestTime: 'Monday, 9:00 AM',
                timeReason: 'Start-of-week productivity motivation',
                boost: '+29%',
                recommendations: [
                    'Front-load value - deliver promise in first 60 seconds',
                    'Use B-roll to maintain visual interest',
                    'Include downloadable resources',
                    'Create series for increased subscriber retention'
                ],
                trending: ['Business Tips', 'Entrepreneur Life', 'Side Hustle'],
                strategy: 'Educational content succeeds on YouTube through <strong>depth and authority</strong>. The algorithm rewards videos that keep viewers on platform. Create content that answers complete questions, not surface-level tips.'
            }
        },
        lifestyle: {
            vlog: {
                score: 88,
                engagement: '13.8%',
                viral: 'High',
                trend: 'Very Strong',
                bestTime: 'Sunday, 6:00 PM',
                timeReason: 'Sunday evening relaxation viewing',
                boost: '+41%',
                recommendations: [
                    'Create narrative arc (beginning, middle, end)',
                    'Include B-roll and multiple camera angles',
                    'Add personal commentary and authenticity',
                    'Use chapters for different vlog segments'
                ],
                trending: ['Weekly Vlog', 'Life Update', 'Vlog Aesthetic'],
                strategy: 'Lifestyle vlogs on YouTube benefit from <strong>personal connection and consistency</strong>. Viewers subscribe for you, not just content. Algorithm favors creators who upload consistently and maintain audience retention.'
            }
        }
    }
};

// Default insights for combinations not in database
const defaultInsights = {
    score: 75,
    engagement: '5.2%',
    viral: 'Medium',
    trend: 'Moderate',
    bestTime: 'Tuesday, 6:00 PM',
    timeReason: 'General peak engagement window for your audience',
    boost: '+28%',
    recommendations: [
        'Post consistently at the same times',
        'Engage with your audience in comments',
        'Use relevant hashtags and keywords',
        'Analyze top-performing content and iterate'
    ],
    trending: ['#ContentCreator', '#CreatorEconomy', '#SocialMedia'],
    strategy: 'Focus on <strong>consistency and audience engagement</strong>. The algorithm rewards creators who post regularly and build community. Monitor your analytics to find patterns in what resonates with your specific audience.'
};

// Mock Account Analysis Issues (randomly selected)
const accountIssues = [
    {
        title: 'Inconsistent Posting Schedule',
        description: 'You post irregularly (gaps of 3-7 days). The algorithm favors consistent creators. Aim for same time/day each week.'
    },
    {
        title: 'Low Hook Effectiveness',
        description: 'Your first 3 seconds don\'t grab attention. 68% of viewers scroll past. Add shocking facts or questions upfront.'
    },
    {
        title: 'Poor Hashtag Strategy',
        description: 'Using oversaturated hashtags (#fyp, #viral). These get buried. Use niche tags with 10K-500K posts instead.'
    },
    {
        title: 'Weak Call-to-Action',
        description: 'Only 12% of your posts have clear CTAs. Ask questions, prompt saves/shares to boost engagement signals.'
    },
    {
        title: 'Suboptimal Posting Times',
        description: 'You post during low-engagement windows. Your audience is most active 6-9 PM, but you post at 2 PM.'
    },
    {
        title: 'Lack of Captions/Text Overlay',
        description: '85% watch without sound but you don\'t use captions. Missing massive audience segment and accessibility.'
    },
    {
        title: 'Low Watch-Through Rate',
        description: 'Average completion: 34%. Videos over 20s lose 60% of viewers. Cut content to 15-18s for better retention.'
    },
    {
        title: 'No Trending Audio Usage',
        description: 'Using generic/old sounds. Trending audio gets 40% more distribution. Check TikTok Creative Center weekly.'
    }
];

function getRandomIssues(count = 4) {
    const shuffled = [...accountIssues].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

document.addEventListener('DOMContentLoaded', () => {

    // Get elements
    const optionCards = document.querySelectorAll('.option-card');
    const generateBtn = document.getElementById('generateBtn');
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const connectBtn = document.getElementById('connectBtn');
    const accountInput = document.getElementById('accountInput');
    const connectedBadge = document.getElementById('connectedBadge');
    const connectedUsername = document.getElementById('connectedUsername');
    const step1 = document.querySelector('.step-1');
    const step2 = document.querySelector('.step-2');
    const step3 = document.querySelector('.step-3');

    // Handle option card selection
    optionCards.forEach(card => {
        card.addEventListener('click', function() {
            const block = this.closest('.selection-block');
            const blockCards = block.querySelectorAll('.option-card');

            // Remove selected from siblings
            blockCards.forEach(c => c.classList.remove('selected'));

            // Add selected to this card
            this.classList.add('selected');

            // Update state
            const value = this.dataset.value;
            const blockLabel = block.querySelector('.block-label').textContent.toLowerCase();

            if (blockLabel.includes('platform')) {
                demoState.platform = value;
            } else if (blockLabel.includes('niche')) {
                demoState.niche = value;
            } else if (blockLabel.includes('content') || blockLabel.includes('type')) {
                demoState.contentType = value;
            }

            // Check if all selections are made
            if (demoState.platform && demoState.niche && demoState.contentType) {
                generateBtn.disabled = false;
                gsap.to(generateBtn, {
                    scale: 1.05,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                });
            }

            // Animate card selection
            gsap.to(this, {
                scale: 0.95,
                duration: 0.15,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });
        });
    });

    // Handle generate button click
    generateBtn.addEventListener('click', () => {
        // Transition to step 2 (processing)
        step1.classList.remove('active');

        setTimeout(() => {
            step2.classList.add('active');
            startProcessing();
        }, 300);
    });

    // Processing animation
    function startProcessing() {
        console.log('=== START PROCESSING ===');
        console.log('Demo State:', demoState);

        const stageItems = document.querySelectorAll('.stage-item');

        stageItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('active');
            }, index * 600);
        });

        // After all processing steps, show results
        setTimeout(() => {
            console.log('Transitioning from step-2 to step-3...');
            step2.classList.remove('active');
            setTimeout(() => {
                console.log('Activating step-3 and calling displayResults...');
                step3.classList.add('active');

                // Force step-3 to stay visible
                step3.style.display = 'block';
                step3.style.opacity = '1';

                // Scroll to results
                step3.scrollIntoView({ behavior: 'smooth', block: 'start' });

                displayResults();
            }, 300);
        }, 3000);
    }

    // Display results
    function displayResults() {
        try {
            console.log('=== DISPLAY RESULTS CALLED ===');
            const insights = getInsights();
            console.log('Insights:', insights);

        // Update result header
        const resultNiche = document.getElementById('resultNiche');
        const resultPlatform = document.getElementById('resultPlatform');

        console.log('resultNiche element:', resultNiche);
        console.log('resultPlatform element:', resultPlatform);

        if (resultNiche) resultNiche.textContent = demoState.niche;
        if (resultPlatform) resultPlatform.textContent = demoState.platform.charAt(0).toUpperCase() + demoState.platform.slice(1);

        console.log('Calling animateScore with:', insights.score);
        // Animate score
        animateScore(insights.score);

        // Update engagement metrics
        setTimeout(() => {
            console.log('Updating engagement metrics...');
            const engagementRate = document.getElementById('engagementRate');
            const viralPotential = document.getElementById('viralPotential');
            const trendAlignment = document.getElementById('trendAlignment');

            if (engagementRate) engagementRate.textContent = insights.engagement;
            if (viralPotential) viralPotential.textContent = insights.viral;
            if (trendAlignment) trendAlignment.textContent = insights.trend;
        }, 500);

        // Update time recommendation
        document.getElementById('bestTime').textContent = insights.bestTime;
        document.getElementById('timeReason').textContent = insights.timeReason;
        document.getElementById('boostValue').textContent = insights.boost;

        // Populate recommendations
        const recList = document.getElementById('recommendationsList');
        recList.innerHTML = '';
        insights.recommendations.forEach((rec, index) => {
            const li = document.createElement('li');
            li.textContent = rec;
            li.style.opacity = '0';
            recList.appendChild(li);

            gsap.to(li, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: 0.8 + (index * 0.1),
                ease: 'power2.out'
            });
        });

        // Populate trending topics
        const trendingContainer = document.getElementById('trendingTopics');
        trendingContainer.innerHTML = '';
        insights.trending.forEach((tag, index) => {
            const tagEl = document.createElement('div');
            tagEl.className = 'trend-tag';
            tagEl.innerHTML = `🔥 ${tag}`;
            tagEl.style.opacity = '0';
            trendingContainer.appendChild(tagEl);

            gsap.to(tagEl, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                delay: 1 + (index * 0.1),
                ease: 'back.out(2)'
            });
        });

        // Update strategy
        document.getElementById('strategyContent').innerHTML = insights.strategy;

        // Ensure all result cards are visible first
        gsap.utils.toArray('.result-card').forEach((card) => {
            card.style.display = 'block';
            card.style.visibility = 'visible';
            card.style.opacity = '1';
        });

        // Animate result cards
        gsap.utils.toArray('.result-card').forEach((card, index) => {
            gsap.from(card, {
                y: 40,
                opacity: 0,
                duration: 0.6,
                delay: 0.5 + (index * 0.1),
                ease: 'power3.out',
                clearProps: 'all' // Clear props after animation
            });
        });

        console.log('=== DISPLAY RESULTS COMPLETED SUCCESSFULLY ===');
        } catch (error) {
            console.error('=== ERROR IN DISPLAY RESULTS ===');
            console.error(error);
            console.error('Error stack:', error.stack);
        }
    }

    // Get insights based on selections
    function getInsights() {
        const platform = demoState.platform;
        const niche = demoState.niche;
        const contentType = demoState.contentType;

        console.log('=== GET INSIGHTS ===');
        console.log('Looking for:', platform, '/', niche, '/', contentType);
        console.log('insightsData[platform]:', insightsData[platform]);
        if (insightsData[platform]) {
            console.log('insightsData[platform][niche]:', insightsData[platform][niche]);
            if (insightsData[platform][niche]) {
                console.log('insightsData[platform][niche][contentType]:', insightsData[platform][niche][contentType]);
            }
        }

        // Try to get specific insights
        if (insightsData[platform] &&
            insightsData[platform][niche] &&
            insightsData[platform][niche][contentType]) {
            console.log('Found specific insights!');
            return insightsData[platform][niche][contentType];
        }

        // Return default insights
        console.log('Using default insights');
        return defaultInsights;
    }

    // Animate score circle
    function animateScore(targetScore) {
        const scoreNumber = document.getElementById('scoreNumber');
        const scoreRing = document.getElementById('scoreRing');
        const circumference = 326.73;
        const offset = circumference - (targetScore / 100) * circumference;

        // Animate number
        gsap.to(scoreNumber, {
            textContent: targetScore,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate: function() {
                scoreNumber.textContent = Math.round(this.targets()[0].textContent);
            }
        });

        // Animate ring
        gsap.to(scoreRing, {
            strokeDashoffset: offset,
            duration: 2,
            ease: 'power2.out',
            delay: 0.3
        });
    }

    // Try again button
    tryAgainBtn.addEventListener('click', () => {
        // Reset state
        demoState.platform = null;
        demoState.niche = null;
        demoState.contentType = null;

        // Remove all selections
        optionCards.forEach(card => card.classList.remove('selected'));

        // Disable generate button
        generateBtn.disabled = true;

        // Reset processing items
        document.querySelectorAll('.stage-item').forEach(item => {
            item.classList.remove('active');
        });

        // Go back to step 1
        step3.classList.remove('active');
        setTimeout(() => {
            step1.classList.add('active');
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
    });

    // Magnetic effect for CTA buttons
    const ctaButtons = document.querySelectorAll('.demo-cta');
    ctaButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            if (button.disabled) return;

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
    });

    // Scroll animations
    gsap.utils.toArray('.option-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 0.5,
            delay: index * 0.03,
            ease: 'power2.out'
        });
    });

    console.log('✨ Demo page interactive features loaded');
});
