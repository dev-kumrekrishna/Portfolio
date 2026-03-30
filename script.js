// ====== 1. RANDOM PARTICLES (LIGHTWEIGHT) ======
tsParticles.load("tsparticles", {
    fpsLimit: 60,
    particles: {
        number: { value: 80, density: { enable: true, area: 800 } },
        color: { value: "#08fb8f" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: { min: 1, max: 3 }, random: true },
        links: {
            enable: true,
            distance: 150,
            color: "#08fb8f",
            opacity: 0.2,
            width: 1
        },
        move: { enable: true, speed: 1.5, direction: "none", outModes: { default: "bounce" } }
    },
    interactivity: {
        detectsOn: "canvas",
        events: { onHover: { enable: true, mode: "grab" }, resize: true },
        modes: { grab: { distance: 200, links: { opacity: 0.5 } } }
    },
    background: { color: "transparent" }
});

// ====== 2. SLIDE SOUND LOGIC ======
const swooshSoundURL = 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3';
const swooshAudio = new Audio(swooshSoundURL);
swooshAudio.volume = 0.3;

// INVISIBLE UNLOCKER: Pehle touch par audio jagayega
function unlockAudio() {
    swooshAudio.play().then(() => {
        swooshAudio.pause();
        swooshAudio.currentTime = 0;
    }).catch(e => {});
    
    // Ek baar unlock hone ke baad ye listeners hata do
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
}

document.addEventListener('click', unlockAudio);
document.addEventListener('touchstart', unlockAudio);

function playSwoosh() {
    swooshAudio.currentTime = 0;
    swooshAudio.play().catch(e => {
        console.log("Audio still blocked by browser");
    });
}

// ====== 3. TEXT REVEAL & NAVIGATION GLOW ======
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

document.querySelectorAll('.hero-title, .hero-subtitle, .content-box h2, .content-box p, .card h3, .styled-list li').forEach(el => wrapWords(el));

const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('nav a');
let isFirstLoad = true;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const currentId = entry.target.getAttribute('id');
        const words = entry.target.querySelectorAll('.type-word');
        const buttons = entry.target.querySelectorAll('.cta, .cta-outline');

        if (entry.isIntersecting) {
            // Slide hone par sound bajega
            if (!isFirstLoad) playSwoosh();
            isFirstLoad = false;

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) link.classList.add('active');
            });

            gsap.to(words, { opacity: 1, y: 0, duration: 0.1, stagger: 0.04 });
            gsap.fromTo(buttons, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.5 });
        } else {
            gsap.set(words, { opacity: 0, y: 10 });
            gsap.set(buttons, { opacity: 0 });
        }
    });
}, { root: document.querySelector('.horizontal-container'), threshold: 0.5 });

sections.forEach(section => {
    if (section.getAttribute('id')) observer.observe(section);
});

// Horizontal Wheel Scroll
const scrollContainer = document.querySelector('.horizontal-container');
if (scrollContainer) {
    scrollContainer.addEventListener('wheel', (evt) => {
        evt.preventDefault();
        scrollContainer.scrollLeft += evt.deltaY;
    });
}

function openModal(videoId) {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('modalIframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('modalIframe');
    iframe.src = ''; // Video stop karne ke liye
    modal.style.display = 'none';
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/Portfolio/service-worker.js", {
  scope: "/Portfolio/"
})
    .then(() => console.log("PWA Ready 🚀"))
    .catch(err => console.log("SW error:", err));
}
