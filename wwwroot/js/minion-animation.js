// Minion Animation JavaScript
window.initMinionAnimation = function() {
    const minion = document.getElementById('minion');
    const poolSection = document.getElementById('pool-section');
    const floatie = document.getElementById('floatie');
    
    if (!minion) return;

    let hasJumped = false;
    let lastScrollTop = 0;
    const baseSpeed = 2; // pixels per scroll unit
    let minionY = 100; // Initial position
    let minionX = 50;

    // Handle scroll events
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDelta = scrollTop - lastScrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Only move minion down (never up)
        if (scrollDelta > 0 && !hasJumped) {
            minionY += scrollDelta * baseSpeed;
            
            // Add some horizontal wobble
            const wobble = Math.sin(scrollTop / 100) * 30;
            minionX = 50 + wobble;
            
            // Keep minion within bounds
            minionX = Math.max(20, Math.min(window.innerWidth - 100, minionX));
            
            minion.style.top = minionY + 'px';
            minion.style.left = minionX + 'px';
        }

        // Check if we reached the pool section
        if (poolSection && !hasJumped) {
            const poolRect = poolSection.getBoundingClientRect();
            const minionRect = minion.getBoundingClientRect();
            
            // If minion is near the pool
            if (poolRect.top < windowHeight && poolRect.top > 0) {
                const distanceToPool = poolRect.top + (poolRect.height / 2);
                
                // If minion is close enough to the pool
                if (minionRect.bottom >= distanceToPool - 100) {
                    jumpIntoPool();
                }
            }
        }

        // Apply 3D parallax effect to content sections
        const contentSections = document.querySelectorAll('[data-depth]');
        contentSections.forEach(section => {
            const depth = parseFloat(section.getAttribute('data-depth')) || 0.2;
            const movement = -(scrollTop * depth);
            section.style.transform = `translateZ(${movement}px)`;
        });

        lastScrollTop = scrollTop;
    }

    // Jump into pool animation
    function jumpIntoPool() {
        if (hasJumped) return;
        hasJumped = true;

        const poolRect = poolSection.getBoundingClientRect();
        const floatieRect = floatie.getBoundingClientRect();
        
        // Calculate target position (center of floatie)
        const targetX = floatieRect.left + (floatieRect.width / 2) - 40;
        const targetY = poolRect.top + window.pageYOffset + (poolRect.height / 2) - 60;

        // Add jump animation class
        minion.style.transition = 'all 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        minion.style.transform = 'rotate(360deg) scale(0.5)';
        minion.style.top = targetY + 'px';
        minion.style.left = targetX + 'px';

        // After jump, fade out and settle on floatie
        setTimeout(() => {
            minion.style.opacity = '0';
            
            // Show minion on floatie (you could add a small minion icon here)
            setTimeout(() => {
                minion.style.display = 'none';
                addMinionToFloatie();
            }, 500);
        }, 1500);
    }

    // Add minion representation to floatie
    function addMinionToFloatie() {
        if (!floatie) return;
        
        const minionIcon = document.createElement('div');
        minionIcon.className = 'minion-on-floatie';
        minionIcon.innerHTML = '😎';
        minionIcon.style.cssText = `
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 2rem;
            animation: bobOnFloatie 2s ease-in-out infinite;
        `;
        
        floatie.appendChild(minionIcon);
        
        // Add animation keyframes if not already added
        if (!document.getElementById('bobOnFloatie-style')) {
            const style = document.createElement('style');
            style.id = 'bobOnFloatie-style';
            style.textContent = `
                @keyframes bobOnFloatie {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50% { transform: translateX(-50%) translateY(-5px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Throttle scroll events for performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Add scroll listener
    window.addEventListener('scroll', requestTick, { passive: true });

    // Initial position
    handleScroll();

    // Cleanup function
    return function() {
        window.removeEventListener('scroll', requestTick);
    };
};
