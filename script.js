/**
 * APPLE EDITION - REALISTIC PHYSICS ANIMATIONS POWERED BY ANIME.JS
 * Features:
 * - Ultra-realistic 3D card tilt & spring rebound on photo hover
 * - Genuine optical parallax between card chassis, photo, and floating badges
 * - Specular reflection glare tracking cursor in real-time
 * - Staggered Apple Keynote entrance orchestration on load
 * - Tactile physical click compression and spring rebound
 * - Spring-driven iOS theme toggle switch
 */

(function () {
    'use strict';

    // Check if anime.js is loaded, provide fallback-safe wrapper
    const hasAnime = typeof anime !== 'undefined';

    /* ==========================================================================
       1. THEME CONTROLLER WITH ANIME.JS SPRING SWITCH
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeLabelApple = document.getElementById('theme-label-apple');
    const switchThumb = document.querySelector('.ios-switch-thumb');
    const systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function getActiveTheme() {
        const storedTheme = localStorage.getItem('apple-edition-theme');
        if (storedTheme === 'dark' || storedTheme === 'light') {
            return storedTheme;
        }
        return systemThemeMediaQuery.matches ? 'dark' : 'light';
    }

    function updateToggleUI(theme, animate = false) {
        const isDark = theme === 'dark';

        if (themeLabelApple) {
            themeLabelApple.textContent = isDark ? 'THEME [NIGHT]' : 'THEME [DAY]';
        }

        const mobileIcon = document.getElementById('mobile-theme-icon');
        if (mobileIcon) {
            mobileIcon.textContent = isDark ? '🌙' : '☀️';
        }

        if (themeToggleBtn) {
            themeToggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            themeToggleBtn.setAttribute('title', isDark ? 'Switch to Day Mode' : 'Switch to Night Mode');
        }

        // Physical spring movement of toggle thumb using Anime.js
        if (switchThumb && hasAnime && animate) {
            anime.remove(switchThumb);
            anime({
                targets: switchThumb,
                translateX: isDark ? [0, 18] : [18, 0],
                duration: 500,
                easing: 'spring(1, 90, 13, 0)'
            });
        }
    }

    function applyTheme(theme, save = false, animate = false) {
        document.documentElement.setAttribute('data-theme', theme);
        if (save) {
            localStorage.setItem('apple-edition-theme', theme);
        }
        updateToggleUI(theme, animate);
    }

    function initTheme() {
        const storedTheme = localStorage.getItem('apple-edition-theme');
        if (storedTheme) {
            applyTheme(storedTheme, false, false);
        } else {
            const initialTheme = systemThemeMediaQuery.matches ? 'dark' : 'light';
            updateToggleUI(initialTheme, false);
        }
    }

    function toggleThemeHandler() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 
                             (systemThemeMediaQuery.matches ? 'dark' : 'light');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme, true, true);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleThemeHandler);
    }

    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleThemeHandler);
    }

    if (systemThemeMediaQuery.addEventListener) {
        systemThemeMediaQuery.addEventListener('change', function (e) {
            const hasUserChoice = localStorage.getItem('apple-edition-theme');
            if (!hasUserChoice) {
                const newSystemTheme = e.matches ? 'dark' : 'light';
                document.documentElement.removeAttribute('data-theme');
                updateToggleUI(newSystemTheme, true);
            }
        });
    }

    /* ==========================================================================
       2. REALISTIC 3D PHOTO HOVER PHYSICS (ANIME.JS POWERED)
       ========================================================================== */
    function initRealisticPortraitHover() {
        const frame = document.getElementById('hero-portrait-frame');
        if (!frame) return;

        const img = frame.querySelector('.apple-portrait-img');
        const island = frame.querySelector('.apple-dynamic-island');
        const caption = frame.querySelector('.apple-screen-caption');
        const glare = frame.querySelector('.apple-specular-glare');
        const aura = frame.querySelector('.apple-frame-aura');

        let bounds = null;
        let isHovered = false;
        let animationFrameId = null;

        function updateBounds() {
            bounds = frame.getBoundingClientRect();
        }

        frame.addEventListener('mouseenter', function () {
            isHovered = true;
            updateBounds();

            if (hasAnime) {
                // Cancel any ongoing spring return animation
                anime.remove([frame, img, island, caption]);
            }

            // Animate aura glow fade in smoothly
            if (aura && hasAnime) {
                anime({
                    targets: aura,
                    opacity: 1,
                    scale: 1.05,
                    duration: 500,
                    easing: 'easeOutQuad'
                });
            }
        });

        frame.addEventListener('mousemove', function (e) {
            if (!bounds) updateBounds();

            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;

            // Normalized coordinates (-1 to 1)
            const xNorm = (mouseX / bounds.width - 0.5) * 2;
            const yNorm = (mouseY / bounds.height - 0.5) * 2;

            // Physical 3D Tilt angles (max 10 degrees)
            const rotateX = -yNorm * 10;
            const rotateY = xNorm * 10;

            // Optical parallax offsets (moving inner layers in opposing directions)
            const imgShiftX = -xNorm * 12;
            const imgShiftY = -yNorm * 12;

            if (animationFrameId) cancelAnimationFrame(animationFrameId);

            animationFrameId = requestAnimationFrame(function () {
                if (hasAnime) {
                    // Smooth, low-latency tracking using anime.js
                    anime({
                        targets: frame,
                        rotateX: rotateX,
                        rotateY: rotateY,
                        scale: 1.04,
                        duration: 160,
                        easing: 'easeOutQuad'
                    });

                    if (img) {
                        anime({
                            targets: img,
                            translateX: imgShiftX,
                            translateY: imgShiftY,
                            scale: 1.09,
                            duration: 180,
                            easing: 'easeOutQuad'
                        });
                    }

                    if (island) {
                        anime({
                            targets: island,
                            translateX: `calc(-50% + ${xNorm * 5}px)`,
                            translateY: yNorm * 4,
                            scale: 1.05,
                            duration: 160,
                            easing: 'easeOutQuad'
                        });
                    }

                    if (caption) {
                        anime({
                            targets: caption,
                            translateX: xNorm * 6,
                            translateY: -3 + yNorm * 3,
                            duration: 160,
                            easing: 'easeOutQuad'
                        });
                    }

                    // 3D Parallax offset for Satellite Glass Chips
                    const chips = frame.querySelectorAll('.apple-satellite-chip');
                    if (chips.length) {
                        chips.forEach(function (chip, idx) {
                            anime({
                                targets: chip,
                                translateX: xNorm * (7 + idx * 3),
                                duration: 160,
                                easing: 'easeOutQuad'
                            });
                        });
                    }
                } else {
                    // Fallback direct CSS transform
                    frame.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
                }

                // Specular Light Glare tracking cursor location
                if (glare) {
                    const glareX = ((mouseX / bounds.width) * 100).toFixed(1);
                    const glareY = ((mouseY / bounds.height) * 100).toFixed(1);
                    glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.09) 35%, transparent 70%)`;
                    glare.style.opacity = '1';
                }
            });
        });

        frame.addEventListener('mouseleave', function () {
            isHovered = false;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);

            if (hasAnime) {
                // Realistic physical spring snap-back (Apple Vision Pro physical feel)
                anime({
                    targets: frame,
                    rotateX: 0,
                    rotateY: 0,
                    scale: 1,
                    duration: 1250,
                    easing: 'spring(1, 65, 11, 0)' // Perfect elasticity & damping
                });

                if (img) {
                    anime({
                        targets: img,
                        translateX: 0,
                        translateY: 0,
                        scale: 1,
                        duration: 1100,
                        easing: 'spring(1, 75, 12, 0)'
                    });
                }

                if (island) {
                    anime({
                        targets: island,
                        translateX: '-50%',
                        translateY: 0,
                        scale: 1,
                        duration: 950,
                        easing: 'spring(1, 80, 13, 0)'
                    });
                }

                if (caption) {
                    anime({
                        targets: caption,
                        translateX: 0,
                        translateY: 0,
                        duration: 950,
                        easing: 'spring(1, 80, 13, 0)'
                    });
                }

                const chips = frame.querySelectorAll('.apple-satellite-chip');
                if (chips.length) {
                    anime({
                        targets: chips,
                        translateX: 0,
                        duration: 900,
                        easing: 'spring(1, 75, 12, 0)'
                    });
                }

                if (aura) {
                    anime({
                        targets: aura,
                        opacity: 0,
                        scale: 0.92,
                        duration: 600,
                        easing: 'easeOutQuad'
                    });
                }
            } else {
                frame.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            }

            if (glare) {
                glare.style.opacity = '0';
            }
        });

        // Tactile click haptic compression & spring rebound
        frame.addEventListener('mousedown', function () {
            if (hasAnime) {
                anime({
                    targets: frame,
                    scale: 1.01,
                    duration: 120,
                    easing: 'easeOutQuad'
                });
            }
        });

        frame.addEventListener('mouseup', function () {
            if (hasAnime) {
                anime({
                    targets: frame,
                    scale: isHovered ? 1.04 : 1,
                    duration: 600,
                    easing: 'spring(1, 90, 10, 0)'
                });
            }
        });

        window.addEventListener('resize', function () {
            if (isHovered) updateBounds();
        });
    }

    /* ==========================================================================
       3. AMBIENT LIVING LIGHTING & IDLE BREATHING (ANIME.JS)
       ========================================================================== */
    function initLivingAmbientEffects() {
        if (!hasAnime) return;

        // Subtle ambient radiance pulsing behind the hero
        const heroGlow = document.querySelector('.hero-ambient-glow');
        if (heroGlow) {
            anime({
                targets: heroGlow,
                scale: [0.94, 1.06],
                opacity: [0.75, 1],
                duration: 4800,
                direction: 'alternate',
                loop: true,
                easing: 'easeInOutSine'
            });
        }

        // Live camera indicator micro-pulse
        const cameraDot = document.querySelector('.island-camera-dot');
        if (cameraDot) {
            anime({
                targets: cameraDot,
                scale: [1, 1.3],
                boxShadow: [
                    '0 0 4px #34c759',
                    '0 0 16px #34c759'
                ],
                duration: 1800,
                direction: 'alternate',
                loop: true,
                easing: 'easeInOutQuad'
            });
        }
    }

    /* ==========================================================================
       4. KEYNOTE ENTRANCE REVEAL ORCHESTRATION (ANIME.JS TIMELINE)
       ========================================================================== */
    function initKeynoteEntrance() {
        if (!hasAnime) return;

        const timeline = anime.timeline({
            easing: 'easeOutExpo'
        });

        // 1. Floating Dock Header drops in gently
        timeline.add({
            targets: '#site-header .header-container',
            translateY: [-28, 0],
            opacity: [0, 1],
            duration: 900,
            delay: 100
        })
        // 2. Eyebrow badge
        .add({
            targets: '.hero-eyebrow-pill',
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 700
        }, '-=500')
        // 3. Apple Keynote Headline
        .add({
            targets: ['.hero-super-title', '.hero-title'],
            translateY: [32, 0],
            opacity: [0, 1],
            duration: 950,
            delay: anime.stagger(120)
        }, '-=450')
        // 4. Tagline
        .add({
            targets: '.hero-tagline',
            translateY: [24, 0],
            opacity: [0, 1],
            duration: 800
        }, '-=600')
        // 5. 3D Status HUD
        .add({
            targets: '#hero-3d-hud',
            translateY: [18, 0],
            opacity: [0, 1],
            duration: 750
        }, '-=500')
        // 6. Action buttons
        .add({
            targets: '.hero-actions .apple-btn',
            translateY: [16, 0],
            opacity: [0, 1],
            duration: 750,
            delay: anime.stagger(100)
        }, '-=550')
        // 7. Device Portrait Showcase Card spring reveal
        .add({
            targets: '#hero-portrait-frame',
            scale: [0.92, 1],
            rotateY: [-8, 0],
            opacity: [0, 1],
            duration: 1400,
            easing: 'spring(1, 60, 12, 0)'
        }, '-=900');
    }

    /* ==========================================================================
       5. ABOUT SECTION & CARDS HOVER PHYSICS
       ========================================================================== */
    function initCardHoverPhysics() {
        if (!hasAnime) return;

        // Philosophy / About portrait interactive elevation
        const aboutWrapper = document.querySelector('.about-avatar-wrapper');
        if (aboutWrapper) {
            aboutWrapper.addEventListener('mouseenter', function () {
                anime.remove(aboutWrapper);
                anime({
                    targets: aboutWrapper,
                    scale: 1.04,
                    translateY: -6,
                    duration: 600,
                    easing: 'spring(1, 80, 12, 0)'
                });
            });
            aboutWrapper.addEventListener('mouseleave', function () {
                anime.remove(aboutWrapper);
                anime({
                    targets: aboutWrapper,
                    scale: 1,
                    translateY: 0,
                    duration: 700,
                    easing: 'spring(1, 75, 11, 0)'
                });
            });
        }

        // Bento skills cards subtle spring hover
        const bentoCards = document.querySelectorAll('.skills-bento-card, .project-apple-card');
        bentoCards.forEach(function (card) {
            card.addEventListener('mouseenter', function () {
                anime.remove(card);
                anime({
                    targets: card,
                    translateY: -6,
                    duration: 500,
                    easing: 'spring(1, 85, 13, 0)'
                });
            });
            card.addEventListener('mouseleave', function () {
                anime.remove(card);
                anime({
                    targets: card,
                    translateY: 0,
                    duration: 600,
                    easing: 'spring(1, 75, 12, 0)'
                });
            });
        });
    }

    /* ==========================================================================
       6. 3D SATELLITE CHIPS CONTINUOUS FLOATING PHYSICS (ANIME.JS)
       ========================================================================== */
    function initSatelliteChipsAnimation() {
        if (!hasAnime) return;

        const chips = [
            { el: '.chip-top-left', y: [-6, 6], duration: 3200, delay: 0 },
            { el: '.chip-top-right', y: [5, -5], duration: 3600, delay: 300 },
            { el: '.chip-bottom-right', y: [-4, 7], duration: 4000, delay: 600 },
            { el: '.chip-bottom-left', y: [6, -6], duration: 3500, delay: 450 }
        ];

        chips.forEach(function (item) {
            const target = document.querySelector(item.el);
            if (target) {
                anime({
                    targets: target,
                    translateY: item.y,
                    duration: item.duration,
                    delay: item.delay,
                    direction: 'alternate',
                    loop: true,
                    easing: 'easeInOutSine'
                });
            }
        });
    }

    /* ==========================================================================
       7. THREE.JS ENRICHED 3D HOLOGRAPHIC & CELESTIAL ENGINE
       ========================================================================== */
    function initThreeHeroCanvas() {
        if (typeof THREE === 'undefined') return;

        const canvas = document.getElementById('hero-3d-canvas');
        if (!canvas) return;

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.z = 7.5;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        
        // Mobile-aware pixel ratio capping for buttery-smooth performance
        const isMobileInit = window.innerWidth <= 768;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobileInit ? 1.5 : 2));
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        // Master Group to hold all 3D geometries
        const masterGroup = new THREE.Group();
        scene.add(masterGroup);

        // Fluid responsive positioning for Desktop vs Tablet vs Mobile
        function update3DLayout() {
            const width = window.innerWidth;
            if (width <= 768) {
                // Mobile: centered behind headline & card, scaled down
                masterGroup.position.set(0, 0.35, -0.6);
                masterGroup.scale.set(0.72, 0.72, 0.72);
            } else if (width <= 1023) {
                // Tablet: centered, medium scale
                masterGroup.position.set(0, 0.2, -0.2);
                masterGroup.scale.set(0.88, 0.88, 0.88);
            } else {
                // Desktop: offset towards right visual column
                masterGroup.position.set(0.65, 0.2, 0);
                masterGroup.scale.set(1.0, 1.0, 1.0);
            }
        }
        update3DLayout();

        // ----------------------------------------------------------------------
        // 3D GEOMETRY 1: Central Holographic Apple Torus Knot
        // ----------------------------------------------------------------------
        const torusGeometry = new THREE.TorusKnotGeometry(1.5, 0.34, 128, 24, 2, 3);
        const torusMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x2997ff,
            emissive: 0x0a1c38,
            metalness: 0.2,
            roughness: 0.25,
            transmission: 0.75,
            ior: 1.5,
            thickness: 1.2,
            wireframe: true,
            transparent: true,
            opacity: 0.72
        });
        const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
        masterGroup.add(torusKnot);

        // ----------------------------------------------------------------------
        // 3D GEOMETRY 2: Dual Orbiting Gyro Gimbal Rings (Apple Vision Pro feel)
        // ----------------------------------------------------------------------
        // Outer Gyro Ring (Cyan)
        const gyro1Geometry = new THREE.TorusGeometry(2.35, 0.032, 16, 120);
        const gyro1Material = new THREE.MeshStandardMaterial({
            color: 0x2997ff,
            emissive: 0x0071e3,
            metalness: 0.8,
            roughness: 0.2,
            wireframe: false,
            transparent: true,
            opacity: 0.8
        });
        const gyroRing1 = new THREE.Mesh(gyro1Geometry, gyro1Material);
        gyroRing1.rotation.x = Math.PI / 3;
        masterGroup.add(gyroRing1);

        // Middle Gyro Ring (Electric Violet)
        const gyro2Geometry = new THREE.TorusGeometry(2.8, 0.028, 16, 120);
        const gyro2Material = new THREE.MeshStandardMaterial({
            color: 0xbf5af2,
            emissive: 0x5e17eb,
            metalness: 0.8,
            roughness: 0.2,
            wireframe: false,
            transparent: true,
            opacity: 0.7
        });
        const gyroRing2 = new THREE.Mesh(gyro2Geometry, gyro2Material);
        gyroRing2.rotation.y = Math.PI / 4;
        masterGroup.add(gyroRing2);

        // ----------------------------------------------------------------------
        // 3D GEOMETRY 3: Inner Core Crystal & Glowing Energy Nucleus
        // ----------------------------------------------------------------------
        const coreGemGeometry = new THREE.OctahedronGeometry(0.85, 0);
        const coreGemMaterial = new THREE.MeshStandardMaterial({
            color: 0xaf52de,
            roughness: 0.25,
            metalness: 0.65,
            flatShading: true,
            transparent: true,
            opacity: 0.65
        });
        const coreGem = new THREE.Mesh(coreGemGeometry, coreGemMaterial);
        masterGroup.add(coreGem);

        const nucleusGeometry = new THREE.SphereGeometry(0.28, 16, 16);
        const nucleusMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true
        });
        const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        masterGroup.add(nucleus);

        // ----------------------------------------------------------------------
        // 3D GEOMETRY 4: 4 Orbiting 3D Satellite Polyhedra / Crystals
        // ----------------------------------------------------------------------
        // Satellite Group 1: Octahedron
        const sat1Group = new THREE.Group();
        const sat1Mesh = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.3, 0),
            new THREE.MeshStandardMaterial({ color: 0x30d158, roughness: 0.3, metalness: 0.7, flatShading: true })
        );
        sat1Mesh.position.set(3.2, 0, 0);
        sat1Group.add(sat1Mesh);
        masterGroup.add(sat1Group);

        // Satellite Group 2: Icosahedron
        const sat2Group = new THREE.Group();
        const sat2Mesh = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.26, 0),
            new THREE.MeshStandardMaterial({ color: 0xff9f0a, roughness: 0.3, metalness: 0.7, flatShading: true })
        );
        sat2Mesh.position.set(0, 3.6, 0);
        sat2Group.rotation.z = Math.PI / 4;
        sat2Group.add(sat2Mesh);
        masterGroup.add(sat2Group);

        // Satellite Group 3: Dodecahedron
        const sat3Group = new THREE.Group();
        const sat3Mesh = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.24, 0),
            new THREE.MeshStandardMaterial({ color: 0x2997ff, roughness: 0.3, metalness: 0.6, flatShading: true })
        );
        sat3Mesh.position.set(0, 0, 3.8);
        sat3Group.rotation.x = -Math.PI / 6;
        sat3Group.add(sat3Mesh);
        masterGroup.add(sat3Group);

        // Satellite Group 4: Golden Micro Torus
        const sat4Group = new THREE.Group();
        const sat4Mesh = new THREE.Mesh(
            new THREE.TorusGeometry(0.24, 0.05, 12, 28),
            new THREE.MeshStandardMaterial({ color: 0xffd60a, metalness: 0.9, roughness: 0.15 })
        );
        sat4Mesh.position.set(-3.4, 0.8, 0);
        sat4Group.add(sat4Mesh);
        masterGroup.add(sat4Group);

        // ----------------------------------------------------------------------
        // 3D GEOMETRY 5: 140-Particle Floating Stardust Nebula
        // ----------------------------------------------------------------------
        const particleCount = 140;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 11;
            positions[i + 1] = (Math.random() - 0.5) * 9;
            positions[i + 2] = (Math.random() - 0.5) * 7;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x64d2ff,
            size: 0.07,
            transparent: true,
            opacity: 0.85
        });
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        masterGroup.add(particles);

        // ----------------------------------------------------------------------
        // LIGHTING: Dual Orbiting Point Lights & Ambient Fill
        // ----------------------------------------------------------------------
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
        scene.add(ambientLight);

        const pointLightCyan = new THREE.PointLight(0x2997ff, 2.6, 60);
        pointLightCyan.position.set(5, 4, 4);
        scene.add(pointLightCyan);

        const pointLightMagenta = new THREE.PointLight(0xbf5af2, 2.2, 60);
        pointLightMagenta.position.set(-5, -4, 4);
        scene.add(pointLightMagenta);

        // ----------------------------------------------------------------------
        // INTERACTIVE 3D CONTROLS (HUD BUTTONS)
        // ----------------------------------------------------------------------
        let spinSpeedMultiplier = 1.0;
        let isOrbitActive = true;
        let currentModeIndex = 0; // 0: Hologram Wireframe, 1: Solid Iridescent, 2: Cyber Quantum

        const btnSpin = document.getElementById('btn-3d-toggle-spin');
        const spinLabel = document.getElementById('spin-btn-label');
        if (btnSpin) {
            btnSpin.addEventListener('click', function () {
                if (isOrbitActive && spinSpeedMultiplier === 1.0) {
                    spinSpeedMultiplier = 2.4;
                    if (spinLabel) spinLabel.textContent = 'Orbit: Turbo';
                    btnSpin.classList.add('active');
                } else if (isOrbitActive && spinSpeedMultiplier > 1.0) {
                    isOrbitActive = false;
                    spinSpeedMultiplier = 0.0;
                    if (spinLabel) spinLabel.textContent = 'Orbit: Paused';
                    btnSpin.classList.remove('active');
                } else {
                    isOrbitActive = true;
                    spinSpeedMultiplier = 1.0;
                    if (spinLabel) spinLabel.textContent = 'Orbit: Active';
                    btnSpin.classList.add('active');
                }
            });
        }

        const btnMode = document.getElementById('btn-3d-toggle-mode');
        const modeLabel = document.getElementById('mode-btn-label');
        if (btnMode) {
            btnMode.addEventListener('click', function () {
                currentModeIndex = (currentModeIndex + 1) % 3;
                if (currentModeIndex === 0) {
                    // Mode 1: Hologram Wireframe
                    torusMaterial.wireframe = true;
                    torusMaterial.opacity = 0.72;
                    torusMaterial.color.setHex(0x2997ff);
                    coreGemMaterial.wireframe = false;
                    if (modeLabel) modeLabel.textContent = 'Mode: Hologram';
                } else if (currentModeIndex === 1) {
                    // Mode 2: Solid Iridescent
                    torusMaterial.wireframe = false;
                    torusMaterial.opacity = 0.88;
                    torusMaterial.color.setHex(0x5e5ce6);
                    coreGemMaterial.wireframe = false;
                    if (modeLabel) modeLabel.textContent = 'Mode: Crystal';
                } else {
                    // Mode 3: Cyber Quantum Wireframe
                    torusMaterial.wireframe = true;
                    torusMaterial.opacity = 0.95;
                    torusMaterial.color.setHex(0x30d158);
                    coreGemMaterial.wireframe = true;
                    if (modeLabel) modeLabel.textContent = 'Mode: Quantum';
                }
            });
        }

        // ----------------------------------------------------------------------
        // MOUSE & TOUCH TRACKING WITH INERTIAL DRAG PHYSICS
        // ----------------------------------------------------------------------
        let targetRotationX = 0;
        let targetRotationY = 0;
        let velocityX = 0;
        let velocityY = 0;
        let isDragging = false;
        let previousMouseX = 0;
        let previousMouseY = 0;

        // Window Mouse Movement Parallax
        window.addEventListener('mousemove', function (e) {
            if (!isDragging) {
                const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
                const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;
                targetRotationY = xNorm * 0.45;
                targetRotationX = yNorm * 0.35;
            }
        });

        // Interactive Drag on 3D Canvas
        canvas.addEventListener('mousedown', function (e) {
            isDragging = true;
            previousMouseX = e.clientX;
            previousMouseY = e.clientY;
        });

        window.addEventListener('mousemove', function (e) {
            if (isDragging) {
                const deltaX = e.clientX - previousMouseX;
                const deltaY = e.clientY - previousMouseY;

                velocityX = deltaX * 0.005;
                velocityY = deltaY * 0.005;

                masterGroup.rotation.y += velocityX;
                masterGroup.rotation.x += velocityY;

                previousMouseX = e.clientX;
                previousMouseY = e.clientY;
            }
        });

        window.addEventListener('mouseup', function () {
            isDragging = false;
        });

        // Mobile Touch Support with Smooth Inertia
        canvas.addEventListener('touchstart', function (e) {
            if (e.touches.length === 1) {
                isDragging = true;
                previousMouseX = e.touches[0].clientX;
                previousMouseY = e.touches[0].clientY;
            }
        }, { passive: true });

        window.addEventListener('touchmove', function (e) {
            if (isDragging && e.touches.length === 1) {
                const deltaX = e.touches[0].clientX - previousMouseX;
                const deltaY = e.touches[0].clientY - previousMouseY;

                velocityX = deltaX * 0.005;
                velocityY = deltaY * 0.005;

                masterGroup.rotation.y += velocityX;
                masterGroup.rotation.x += velocityY;

                previousMouseX = e.touches[0].clientX;
                previousMouseY = e.touches[0].clientY;
            }
        }, { passive: true });

        window.addEventListener('touchend', function () {
            isDragging = false;
        });

        // Resize Listener with Responsive Layout Update
        function onResize() {
            if (!canvas.clientWidth || !canvas.clientHeight) return;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            update3DLayout();
        }
        window.addEventListener('resize', onResize);

        // ----------------------------------------------------------------------
        // ANIMATION LOOP
        // ----------------------------------------------------------------------
        let clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const delta = clock.getDelta();
            const elapsedTime = clock.getElapsedTime();
            const spd = spinSpeedMultiplier;

            // Continuous rotation of central Torus Knot
            torusKnot.rotation.z += 0.15 * delta * spd;
            torusKnot.rotation.y += 0.22 * delta * spd;

            // Orbiting Gyro Gimbal Rings
            gyroRing1.rotation.x += 0.35 * delta * spd;
            gyroRing1.rotation.z += 0.25 * delta * spd;

            gyroRing2.rotation.y -= 0.3 * delta * spd;
            gyroRing2.rotation.x += 0.2 * delta * spd;

            // Internal Core Gem & Nucleus
            coreGem.rotation.y -= 0.45 * delta * spd;
            coreGem.rotation.x += 0.3 * delta * spd;
            nucleus.rotation.y += 0.6 * delta * spd;

            // 4 Orbiting Satellites on Independent Spherical Paths
            sat1Group.rotation.y += 0.55 * delta * spd;
            sat1Mesh.rotation.x += 1.2 * delta;
            sat1Mesh.rotation.y += 0.8 * delta;

            sat2Group.rotation.x += 0.45 * delta * spd;
            sat2Group.rotation.y += 0.3 * delta * spd;
            sat2Mesh.rotation.y += 1.0 * delta;

            sat3Group.rotation.z += 0.4 * delta * spd;
            sat3Group.rotation.x -= 0.35 * delta * spd;
            sat3Mesh.rotation.z += 0.9 * delta;

            sat4Group.rotation.y -= 0.5 * delta * spd;
            sat4Group.rotation.z += 0.3 * delta * spd;
            sat4Mesh.rotation.x += 1.4 * delta;

            // Floating Starfield Particles
            particles.rotation.y += 0.04 * delta;
            particles.rotation.x += 0.02 * delta;

            // Orbiting Colored Lights
            pointLightCyan.position.x = Math.cos(elapsedTime * 0.7 * spd) * 4.8;
            pointLightCyan.position.y = Math.sin(elapsedTime * 0.7 * spd) * 4.2;

            pointLightMagenta.position.x = -Math.cos(elapsedTime * 0.6 * spd) * 4.5;
            pointLightMagenta.position.z = Math.sin(elapsedTime * 0.6 * spd) * 4.5;

            // Drag inertia physics with smooth damping
            if (!isDragging) {
                masterGroup.rotation.y += (targetRotationY - masterGroup.rotation.y) * 0.05;
                masterGroup.rotation.x += (targetRotationX - masterGroup.rotation.x) * 0.05;

                masterGroup.rotation.y += velocityX;
                masterGroup.rotation.x += velocityY;
                velocityX *= 0.95;
                velocityY *= 0.95;
            }

            // Celestial floating vertical breathing motion
            const baseY = window.innerWidth <= 768 ? 0.35 : 0.2;
            masterGroup.position.y = baseY + Math.sin(elapsedTime * 1.6) * 0.08;

            renderer.render(scene, camera);
        }
        animate();
    }

    // Dynamic current year in footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* ==========================================================================
       8. RESPONSIVE MOBILE NAVIGATION DRAWER
       ========================================================================== */
    function initMobileDrawer() {
        const toggleBtn = document.getElementById('mobile-nav-toggle');
        const closeBtn = document.getElementById('mobile-nav-close');
        const navbar = document.getElementById('left-navbar');
        const backdrop = document.getElementById('nav-backdrop');
        const navLinks = document.querySelectorAll('.pixel-nav-link');

        if (!navbar) return;

        function openDrawer() {
            navbar.classList.add('open');
            if (backdrop) backdrop.classList.add('active');
            document.body.classList.add('nav-open');
            if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
        }

        function closeDrawer() {
            navbar.classList.remove('open');
            if (backdrop) backdrop.classList.remove('active');
            document.body.classList.remove('nav-open');
            if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
        }

        if (toggleBtn) {
            toggleBtn.addEventListener('click', function () {
                if (navbar.classList.contains('open')) {
                    closeDrawer();
                } else {
                    openDrawer();
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeDrawer);
        }

        if (backdrop) {
            backdrop.addEventListener('click', closeDrawer);
        }

        // Close drawer automatically on navigation link click on mobile
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 1023) {
                    closeDrawer();
                }
            });
        });

        // Close drawer on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navbar.classList.contains('open')) {
                closeDrawer();
            }
        });

        // Auto close when resizing to desktop
        window.addEventListener('resize', function () {
            if (window.innerWidth > 1023 && navbar.classList.contains('open')) {
                closeDrawer();
            }
        });
    }

    /* ==========================================================================
       9. RESPONSIVE SCROLL SPY (ACTIVE NAVBAR SECTION HIGHLIGHTING)
       ========================================================================== */
    function initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.pixel-nav-link');
        if (!sections.length || !navLinks.length) return;

        function onScroll() {
            const scrollPos = window.scrollY + 160;
            let currentSectionId = '';

            sections.forEach(function (section) {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                if (scrollPos >= top && scrollPos < top + height) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            if (!currentSectionId && window.scrollY < 200) {
                currentSectionId = 'hero';
            }

            if (currentSectionId) {
                navLinks.forEach(function (link) {
                    const targetId = link.getAttribute('data-section') || (link.getAttribute('href') || '').replace('#', '');
                    if (targetId === currentSectionId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ==========================================================================
       10. CHAT TERMINAL INTERACTION
       ========================================================================== */
    function initChatTerminal() {
        const form = document.getElementById('pixel-chat-form');
        const input = document.getElementById('chat-input-field');
        const msgContainer = document.getElementById('chat-messages');
        const chips = document.querySelectorAll('.prompt-chip');

        if (!form || !input || !msgContainer) return;

        const botReplies = {
            hello: "Greetings! System online. Thanks for dropping by. Feel free to inspect my projects or reach out directly for collaborations!",
            role: "I am actively open to Senior & Lead Software Engineering roles focusing on distributed cloud systems, high-concurrency microservices, and modern web architectures.",
            tech: "Core tech stack: TypeScript, React/Next.js, Node.js, Python/FastAPI, Go, Docker, AWS/GCP, and PostgreSQL. Focused on sub-50ms latency and high availability.",
            default: "Message received by UTSAV.SYS! Thank you for the ping. I will get back to you shortly."
        };

        function appendMessage(sender, text, isUser = false) {
            const bubble = document.createElement('div');
            bubble.className = isUser ? 'chat-bubble user-bubble' : 'chat-bubble bot-bubble';

            const senderSpan = document.createElement('span');
            senderSpan.className = 'bubble-sender';
            senderSpan.textContent = sender;

            const textP = document.createElement('p');
            textP.textContent = text;

            bubble.appendChild(senderSpan);
            bubble.appendChild(textP);
            msgContainer.appendChild(bubble);

            msgContainer.scrollTo({
                top: msgContainer.scrollHeight,
                behavior: 'smooth'
            });
        }

        function handleSend(userText) {
            const cleanText = userText.trim();
            if (!cleanText) return;

            appendMessage('► YOU:', cleanText, true);
            input.value = '';

            // Simulate bot processing delay
            setTimeout(function () {
                const lower = cleanText.toLowerCase();
                let reply = botReplies.default;
                if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
                    reply = botReplies.hello;
                } else if (lower.includes('role') || lower.includes('available') || lower.includes('job') || lower.includes('hire')) {
                    reply = botReplies.role;
                } else if (lower.includes('tech') || lower.includes('stack') || lower.includes('backend') || lower.includes('cloud')) {
                    reply = botReplies.tech;
                }
                appendMessage('► UTSAV_BOT:', reply, false);
            }, 500);
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            handleSend(input.value);
        });

        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                const msg = chip.getAttribute('data-msg') || chip.textContent;
                handleSend(msg);
            });
        });
    }

    /* ==========================================================================
       INITIALIZATION
       ========================================================================== */
    function init() {
        initTheme();
        initMobileDrawer();
        initScrollSpy();
        initChatTerminal();
        initRealisticPortraitHover();
        initLivingAmbientEffects();
        initKeynoteEntrance();
        initCardHoverPhysics();
        initSatelliteChipsAnimation();
        initThreeHeroCanvas();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
