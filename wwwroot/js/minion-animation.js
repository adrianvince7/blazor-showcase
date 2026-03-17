// Professional Minion Animation with Lottie and Walking Path
window.initMinionAnimation = function() {
    const container = document.getElementById('minion-container');
    const poolSection = document.getElementById('pool-section');
    const floatie = document.getElementById('floatie');
    
    if (!container) {
        console.error('Minion container not found');
        return;
    }

    let animation = null;
    let hasJumped = false;
    let currentPathPosition = 0;
    const pathPoints = calculateWalkingPath();
    
    // Load the Lottie animation
    function loadLottieAnimation() {
        fetch('/animations/minion-walking.json')
            .then(response => response.json())
            .then(animationData => {
                if (typeof lottie !== 'undefined') {
                    animation = lottie.loadAnimation({
                        container: container,
                        renderer: 'svg',
                        loop: true,
                        autoplay: true,
                        animationData: animationData
                    });
                } else {
                    console.warn('Lottie library not loaded, using fallback');
                    createFallbackAnimation();
                }
            })
            .catch(error => {
                console.error('Error loading animation:', error);
                createFallbackAnimation();
            });
    }

    // Calculate dynamic walking path through the site
    function calculateWalkingPath() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const points = [];
        
        // Create a natural curved path from top to bottom
        const numPoints = 100;
        const amplitude = 200; // How far left/right the path goes
        const frequency = 3; // Number of curves
        
        for (let i = 0; i <= numPoints; i++) {
            const progress = i / numPoints;
            const y = progress * (documentHeight - windowHeight);
            
            // Create a smooth sinusoidal path with varying amplitude
            const wobbleAmplitude = amplitude * Math.sin(progress * Math.PI); // Bigger curves in middle
            const x = (window.innerWidth / 2) + 
                     Math.sin(progress * frequency * Math.PI * 2) * wobbleAmplitude;
            
            // Add some organic variation
            const noise = (Math.random() - 0.5) * 20;
            
            points.push({
                x: Math.max(100, Math.min(window.innerWidth - 100, x + noise)),
                y: y,
                rotation: Math.atan2(1, Math.sin(progress * frequency * Math.PI * 2) * wobbleAmplitude * frequency * Math.PI * 2) * (180 / Math.PI)
            });
        }
        
        return points;
    }

    // Fallback animation if Lottie fails
    function createFallbackAnimation() {
        container.innerHTML = `
            <svg viewBox="0 0 200 300" width="120" height="180" class="minion-svg">
                <defs>
                    <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFE135;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#FFC300;stop-opacity:1" />
                    </linearGradient>
                    <filter id="shadow">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.3"/>
                    </filter>
                </defs>
                
                <!-- Body -->
                <rect x="60" y="80" width="80" height="140" rx="40" fill="url(#bodyGradient)" 
                      stroke="#2C3E50" stroke-width="3" filter="url(#shadow)"/>
                
                <!-- Goggle Strap -->
                <rect x="57.5" y="110" width="85" height="8" rx="4" fill="#2C3E50"/>
                
                <!-- Left Goggle -->
                <circle cx="85" cy="115" r="18" fill="#C0C0C0" stroke="#2C3E50" stroke-width="3"/>
                <circle cx="85" cy="115" r="11" fill="white"/>
                <circle cx="85" cy="115" r="6" fill="#2C3E50">
                    <animate attributeName="cx" values="85;88;82;85" dur="4s" repeatCount="indefinite"/>
                </circle>
                
                <!-- Right Goggle -->
                <circle cx="115" cy="115" r="18" fill="#C0C0C0" stroke="#2C3E50" stroke-width="3"/>
                <circle cx="115" cy="115" r="11" fill="white"/>
                <circle cx="115" cy="115" r="6" fill="#2C3E50">
                    <animate attributeName="cx" values="115;118;112;115" dur="4s" repeatCount="indefinite"/>
                </circle>
                
                <!-- Mouth -->
                <path d="M 85 160 Q 100 168 115 160" stroke="#2C3E50" stroke-width="3" 
                      fill="none" stroke-linecap="round">
                    <animate attributeName="d" 
                             values="M 85 160 Q 100 168 115 160;M 85 162 Q 100 170 115 162;M 85 160 Q 100 168 115 160" 
                             dur="2s" repeatCount="indefinite"/>
                </path>
                
                <!-- Overalls -->
                <rect x="65" y="170" width="70" height="50" rx="10" fill="#4A90E2" 
                      stroke="#2C3E50" stroke-width="3"/>
                <circle cx="100" cy="180" r="12" fill="#C0C0C0" stroke="#2C3E50" stroke-width="2"/>
                <text x="100" y="186" font-family="Arial" font-size="14" font-weight="bold" 
                      text-anchor="middle" fill="#2C3E50">G</text>
                
                <!-- Left Arm -->
                <g class="arm-left">
                    <rect x="50" y="140" width="15" height="50" rx="8" fill="url(#bodyGradient)" 
                          stroke="#2C3E50" stroke-width="2" transform-origin="57.5 140">
                        <animateTransform attributeName="transform" type="rotate"
                                        values="0 57.5 140;-30 57.5 140;20 57.5 140;0 57.5 140"
                                        dur="1s" repeatCount="indefinite"/>
                    </rect>
                    <circle cx="57.5" cy="190" r="9" fill="url(#bodyGradient)" 
                            stroke="#2C3E50" stroke-width="2"/>
                </g>
                
                <!-- Right Arm -->
                <g class="arm-right">
                    <rect x="135" y="140" width="15" height="50" rx="8" fill="url(#bodyGradient)" 
                          stroke="#2C3E50" stroke-width="2" transform-origin="142.5 140">
                        <animateTransform attributeName="transform" type="rotate"
                                        values="0 142.5 140;20 142.5 140;-30 142.5 140;0 142.5 140"
                                        dur="1s" repeatCount="indefinite"/>
                    </rect>
                    <circle cx="142.5" cy="190" r="9" fill="url(#bodyGradient)" 
                            stroke="#2C3E50" stroke-width="2"/>
                </g>
                
                <!-- Left Leg -->
                <g class="leg-left">
                    <rect x="75" y="220" width="20" height="35" rx="10" fill="#4A90E2" 
                          stroke="#2C3E50" stroke-width="2" transform-origin="85 220">
                        <animateTransform attributeName="transform" type="rotate"
                                        values="0 85 220;15 85 220;-15 85 220;0 85 220"
                                        dur="1s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="72" y="255" width="24" height="12" rx="6" fill="#2C3E50"/>
                </g>
                
                <!-- Right Leg -->
                <g class="leg-right">
                    <rect x="105" y="220" width="20" height="35" rx="10" fill="#4A90E2" 
                          stroke="#2C3E50" stroke-width="2" transform-origin="115 220">
                        <animateTransform attributeName="transform" type="rotate"
                                        values="0 115 220;-15 115 220;15 115 220;0 115 220"
                                        dur="1s" repeatCount="indefinite"/>
                    </rect>
                    <rect x="104" y="255" width="24" height="12" rx="6" fill="#2C3E50"/>
                </g>
            </svg>
        `;
    }

    // Update minion position along path based on scroll
    function handleScroll() {
        if (hasJumped) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollProgress = scrollTop / (documentHeight - windowHeight);
        
        // Find the closest point on the path
        const targetIndex = Math.floor(scrollProgress * (pathPoints.length - 1));
        const point = pathPoints[Math.min(targetIndex, pathPoints.length - 1)];
        
        if (point) {
            // Smooth transition to new position
            container.style.left = point.x + 'px';
            container.style.top = (point.y - scrollTop) + 'px';
            
            // Rotate minion based on path direction
            const nextPoint = pathPoints[Math.min(targetIndex + 1, pathPoints.length - 1)];
            if (nextPoint) {
                const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
                // Only tilt slightly, not full rotation
                const tilt = Math.max(-15, Math.min(15, angle / 4));
                container.style.transform = `rotate(${tilt}deg)`;
            }
            
            currentPathPosition = targetIndex;
        }

        // Check if reached pool
        if (poolSection) {
            const poolRect = poolSection.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            if (poolRect.top < windowHeight && poolRect.top > 0) {
                if (containerRect.bottom >= poolRect.top + (poolRect.height / 2) - 100) {
                    jumpIntoPool();
                }
            }
        }

        // Apply parallax to content sections
        applyParallax(scrollTop);
    }

    // Apply parallax effect to content
    function applyParallax(scrollTop) {
        const contentSections = document.querySelectorAll('[data-depth]');
        contentSections.forEach(section => {
            const depth = parseFloat(section.getAttribute('data-depth')) || 0.2;
            const movement = -(scrollTop * depth);
            section.style.transform = `translateZ(${movement}px)`;
        });
    }

    // Jump into pool animation
    function jumpIntoPool() {
        if (hasJumped || !floatie) return;
        hasJumped = true;

        const floatieRect = floatie.getBoundingClientRect();
        const poolRect = poolSection.getBoundingClientRect();
        
        // Calculate landing position
        const targetX = floatieRect.left + (floatieRect.width / 2) - 60;
        const targetY = poolRect.top + window.pageYOffset + (poolRect.height / 2) - 90;

        // Animate jump with CSS
        container.style.transition = 'all 2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        container.style.transform = 'rotate(720deg) scale(0.6)';
        container.style.left = targetX + 'px';
        container.style.top = (targetY - window.pageYOffset) + 'px';

        // Add splash effect
        setTimeout(() => {
            createSplashEffect(targetX + 60, targetY - window.pageYOffset + 90);
        }, 1500);

        // Fade out and add to floatie
        setTimeout(() => {
            container.style.opacity = '0';
            setTimeout(() => {
                container.style.display = 'none';
                addMinionToFloatie();
            }, 500);
        }, 2000);
    }

    // Create splash effect
    function createSplashEffect(x, y) {
        const splash = document.createElement('div');
        splash.className = 'splash-effect';
        splash.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 100px;
            height: 100px;
            pointer-events: none;
            z-index: 99;
        `;
        splash.innerHTML = `
            <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="5" fill="white" opacity="0.8">
                    <animate attributeName="r" from="5" to="50" dur="0.8s" />
                    <animate attributeName="opacity" from="0.8" to="0" dur="0.8s" />
                </circle>
                <circle cx="30" cy="40" r="3" fill="white" opacity="0.6">
                    <animate attributeName="r" from="3" to="20" dur="0.6s" />
                    <animate attributeName="opacity" from="0.6" to="0" dur="0.6s" />
                </circle>
                <circle cx="70" cy="45" r="3" fill="white" opacity="0.6">
                    <animate attributeName="r" from="3" to="20" dur="0.6s" />
                    <animate attributeName="opacity" from="0.6" to="0" dur="0.6s" />
                </circle>
            </svg>
        `;
        document.body.appendChild(splash);
        setTimeout(() => splash.remove(), 1000);
    }

    // Add minion icon to floatie
    function addMinionToFloatie() {
        if (!floatie) return;
        
        const minionIcon = document.createElement('div');
        minionIcon.className = 'minion-on-floatie';
        minionIcon.innerHTML = '😎';
        minionIcon.style.cssText = `
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 3rem;
            animation: bobOnFloatie 2s ease-in-out infinite;
            filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
        `;
        
        floatie.appendChild(minionIcon);
        
        // Add keyframe animation
        if (!document.getElementById('bobOnFloatie-style')) {
            const style = document.createElement('style');
            style.id = 'bobOnFloatie-style';
            style.textContent = `
                @keyframes bobOnFloatie {
                    0%, 100% { transform: translateX(-50%) translateY(0) rotate(-5deg); }
                    50% { transform: translateX(-50%) translateY(-10px) rotate(5deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Throttled scroll handler
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

    // Draw the walking path (for debugging/visualization)
    function drawPath() {
        const pathSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        pathSvg.setAttribute('class', 'walking-path');
        pathSvg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: ${document.documentElement.scrollHeight}px;
            pointer-events: none;
            z-index: 0;
            opacity: 0.15;
        `;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let pathData = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
        for (let i = 1; i < pathPoints.length; i++) {
            pathData += ` L ${pathPoints[i].x} ${pathPoints[i].y}`;
        }
        path.setAttribute('d', pathData);
        path.setAttribute('stroke', '#FFD700');
        path.setAttribute('stroke-width', '3');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-dasharray', '10,10');
        
        pathSvg.appendChild(path);
        document.querySelector('.minions-page').appendChild(pathSvg);
    }

    // Initialize
    loadLottieAnimation();
    drawPath();
    
    // Add event listeners
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', () => {
        pathPoints.length = 0;
        pathPoints.push(...calculateWalkingPath());
    }, { passive: true });

    // Initial position
    handleScroll();

    // Cleanup function
    return {
        destroy: function() {
            window.removeEventListener('scroll', requestTick);
            if (animation && animation.destroy) {
                animation.destroy();
            }
        }
    };
};
