// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Handle expand button clicks
const expandButtons = document.querySelectorAll('.expand-btn');

expandButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const card = this.closest('.feature-card');

        // Add a pulse effect
        this.style.transform = 'scale(0.9) rotate(90deg)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);

        // Add a highlight effect to the card
        card.style.transform = 'translateY(-8px)';
        card.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.4)';

        setTimeout(() => {
            card.style.transform = '';
            card.style.boxShadow = '';
        }, 300);

        // Simulate navigation (you can replace with actual navigation)
        console.log('Expanding feature:', card.querySelector('h2').textContent);
    });
});

// Parallax effect on scroll for feature images
let lastScrollY = window.scrollY;

function handleScroll() {
    const cards = document.querySelectorAll('.feature-card');
    const scrollY = window.scrollY;

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            const image = card.querySelector('.feature-image img');
            if (image) {
                const scrollSpeed = (scrollY - lastScrollY) * 0.3;
                const currentTransform = image.style.transform || 'translateY(0)';
                const currentY = parseFloat(currentTransform.match(/-?\d+\.?\d*/)?.[0] || 0);
                const newY = Math.max(-20, Math.min(20, currentY - scrollSpeed));
                image.style.transform = `translateY(${newY}px)`;
            }
        }
    });

    lastScrollY = scrollY;
}

// Throttle scroll events for better performance
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
});

// Add intersection observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
});

// Handle hover effects for desktop
if (window.innerWidth > 768) {
    const cards = document.querySelectorAll('.feature-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const image = this.querySelector('.feature-image img');
            if (image) {
                image.style.transform = 'scale(1.05)';
                image.style.transition = 'transform 0.6s ease';
            }
        });

        card.addEventListener('mouseleave', function() {
            const image = this.querySelector('.feature-image img');
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });
}

// Touch gestures for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (!e.changedTouches) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Detect swipe gestures
    if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 50) {
        if (deltaX > 0) {
            console.log('Swiped right');
        } else {
            console.log('Swiped left');
        }
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Performance optimization: Debounce resize events
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalculate layouts if needed
        console.log('Window resized');
    }, 250);
});

console.log('iPhone features page loaded successfully!');
