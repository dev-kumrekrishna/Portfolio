// ====== 1. LIGHTWEIGHT RANDOM PARTICLES (PERFORMANCE OPTIMIZED) ======
tsParticles.load("tsparticles", {
    fpsLimit: 60,
    particles: {
        number: { 
            value: 80, // Kam count = Better performance
            density: { enable: true, area: 800 } 
        },
        color: { value: "#08fb8f" },
        shape: { type: "circle" },
        opacity: {
            value: 0.5,
            random: true
        },
        size: {
            value: { min: 1, max: 3 },
            random: true
        },
        links: {
            enable: true,
            distance: 150,
            color: "#08fb8f",
            opacity: 0.3,
            width: 1
        },
        move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            random: false,
            straight: false,
            outModes: { default: "bounce" }
        }
    },
    interactivity: {
        detectsOn: "canvas",
        events: {
            onHover: { enable: true, mode: "grab" }, // Mouse/Touch par lines judengi
            onClick: { enable: true, mode: "push" },
            resize: true
        },
        modes: {
            grab: { distance: 200, links: { opacity: 0.6 } },
            push: { quantity: 4 }
        }
    },
    background: { color: "transparent" },
    detectRetina: true
});


// ====== 2. AUDIO SETUP (SELECTED SWOOSH) ======
const swooshSoundURL = 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3';
const swooshAudio = new Audio(swooshSoundURL);
swooshAudio.volume = 0.3;

function playSwoosh() {
    swooshAudio.currentTime = 0;
    swooshAudio.play().catch(e => { /* Autoplay restriction handle */ });
}


// ====== 3. TYPEWRITER EFFECT (WORD WRAPPER) ======
function wrapWords(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
        if (node.nodeValue.trim() !== '') textNodes.push(node);
    }
    textNodes.forEach(textNode => {
        const words = textNode.nodeValue.split(/(\s+)/);
        const fragment = document.createDocumentFragment();
        words.forEach(word => {
            if (word.trim() !== '') {
                const span = document.createElement('span');
                span.className = 'type-word';
                span.textContent = word;
                fragment.appendChild(span);
            } else {
                fragment.appendChild(document.createTextNode(word));
            }
        });
        textNode.parentNode.replaceChild(fragment, textNode);
    });
}

// Applying typewriter logic to all major text elements
document.querySelectorAll('.hero-title, .hero-subtitle, .content-box h2, .content-box p, .card h3, .styled-list li').forEach(el => wrapWords(el));


// ====== 4. INTERSECTION OBSERVER (GLOW, SOUND & REVEAL) ======
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('nav a');
let isFirstLoad = true;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const currentId = entry.target.getAttribute('id');
        const words = entry.target.querySelectorAll('.type-word');
        const buttons = entry.target.querySelectorAll('.cta, .cta-outline');

        if (entry.isIntersecting) {
            // Play sound only after the first load interaction
            if (!isFirstLoad) playSwoosh();
            isFirstLoad = false;

            // Nav Glow
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) link.classList.add('active');
            });

            // Reveal Words (Staggered Animation)
            gsap.to(words, { opacity: 1, y: 0, duration: 0.1, stagger: 0.04 });
            
            // Fade-in Buttons
            gsap.fromTo(buttons, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.5 });
        } else {
            // Reset state when section is out of view
            gsap.set(words, { opacity: 0, y: 10 });
            gsap.set(buttons, { opacity: 0 });
        }
    });
}, { root: document.querySelector('.horizontal-container'), threshold: 0.5 });

sections.forEach(section => {
    if (section.getAttribute('id')) observer.observe(section);
});


// ====== 5. HORIZONTAL WHEEL SCROLL SUPPORT ======
const scrollContainer = document.querySelector('.horizontal-container');
if (scrollContainer) {
    scrollContainer.addEventListener('wheel', (evt) => {
        evt.preventDefault();
        scrollContainer.scrollLeft += evt.deltaY;
    });
}
