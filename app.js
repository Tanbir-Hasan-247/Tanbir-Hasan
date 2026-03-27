const cord = document.getElementById('pull-cord');
const beam = document.getElementById('glow-beam');
const shade = document.getElementById('lamp-shade');
const mouth = document.getElementById('lamp-mouth');
const content = document.getElementById('main-content');
const toast = document.getElementById('light-toast');
const hint = document.getElementById('lamp-hint'); // New Hint Element

let isOn = false;

cord.addEventListener('mousedown', () => {
    cord.classList.remove('lamp-swing');
    cord.style.transform = 'translateY(35px)';
});

window.addEventListener('mouseup', () => {
    if (cord.style.transform === 'translateY(35px)') {
        cord.style.transform = 'translateY(0px)';
        setTimeout(() => cord.classList.add('lamp-swing'), 100);
        toggleApp();
    }
});

function toggleApp() {
    isOn = !isOn;
    if (isOn) {
        // 👉 Turn ON Light Mode
        document.body.classList.add('light-mode');

        beam.style.opacity = "1";
        shade.setAttribute('fill', '#d4e09b');
        mouth.setAttribute('d', "M90 85 Q100 100 110 85");
        mouth.setAttribute('stroke', '#ff4d4d');

        // 👉 CSS inside JS
        content.style.opacity = "1";
        content.style.filter = "blur(0) grayscale(0)";
        content.style.pointerEvents = "auto";
        content.style.transition = "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)";

        toast.classList.add('toast-visible');
        hint.style.display = "none";

        setTimeout(() => { toast.classList.remove('toast-visible'); }, 4000);

        fetchCF();

    } else {
        // 👉 Turn OFF Light Mode
        document.body.classList.remove('light-mode');

        beam.style.opacity = "0";
        shade.setAttribute('fill', '#181d14');
        mouth.setAttribute('d', "M90 95 Q100 85 110 95");
        mouth.setAttribute('stroke', '#000');

        // 👉 CSS inside JS
        content.style.opacity = "1";
        content.style.filter = "blur(0) grayscale(0)";
        content.style.pointerEvents = "auto";
        content.style.transition = "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)";

        toast.classList.remove('toast-visible');
        hint.style.display = "block";
    }
}

async function fetchCF() {
    try {
        const resUser = await fetch('https://codeforces.com/api/user.info?handles=Tanbir_hasan');
        const dataUser = await resUser.json();
        const resStatus = await fetch('https://codeforces.com/api/user.status?handle=Tanbir_hasan');
        const dataStatus = await resStatus.json();
        if (dataUser.status === "OK") {
            document.getElementById('cf-rating').innerText = dataUser.result[0].rating || 'Unrated';
            document.getElementById('cf-max').innerText = dataUser.result[0].maxRating || '--';
        }
        if (dataStatus.status === "OK") {
            const solved = new Set(dataStatus.result.filter(s => s.verdict === "OK").map(s => s.problem.name));
            document.getElementById('cf-solved').innerText = solved.size;
        }
    } catch (e) { console.error("API error"); }
}

// --- 1. Mobile Menu Logic ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (mobileMenuBtn && closeMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
    });

    closeMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('opacity-0', 'pointer-events-none');
        });
    });
}

// --- 2. Scroll Reveal Animation Logic ---
const reveals = document.querySelectorAll('.reveal');
const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

reveals.forEach(reveal => {
    revealOnScroll.observe(reveal);
});

// --- 3. Active Navbar Link Highlighting ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 250) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-yellow-500');
        
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-yellow-500');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);
window.addEventListener('load', updateActiveLink);

// --- 4. View All Toggle Logic (Projects & Thesis) ---
function setupViewMore(itemClass, btnId, limit) {
    const items = document.querySelectorAll(itemClass);
    const btn = document.getElementById(btnId);

    if (!btn || items.length === 0) return;

    // Check if total items are less than or equal to the limit
    if (items.length <= limit) {
        btn.style.display = 'none'; // Hide button if not needed
        return;
    }

    // Initially hide items beyond the limit
    items.forEach((item, index) => {
        if (index >= limit) {
            item.style.display = 'none';
            item.style.opacity = '0';
        }
    });

    let isExpanded = false;

    btn.addEventListener('click', () => {
        isExpanded = !isExpanded;

        if (isExpanded) {
            let delay = 0;
            items.forEach((item, index) => {
                if (index >= limit) {
                    item.style.display = 'flex'; // Show in DOM
                    // Staggered animation (একের পর এক আসবে)
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, delay);
                    delay += 300; // 300ms পর পর আসবে
                }
            });
            btn.innerText = 'View Less';
        } else {
            items.forEach((item, index) => {
                if (index >= limit) {
                    item.style.opacity = '0'; // Fade out
                    setTimeout(() => {
                        item.style.display = 'none'; // Remove from DOM after fade
                    }, 500); 
                }
            });
            btn.innerText = btnId === 'view-projects-btn' ? 'View All Projects' : 'View All Research';
        }
    });
}

// প্রজেক্টের জন্য ইনিশিয়াল লিমিট ২
setupViewMore('.project-item', 'view-projects-btn', 2);

// থিসিসের জন্য ইনিশিয়াল লিমিট ১
setupViewMore('.thesis-item', 'view-thesis-btn', 1);