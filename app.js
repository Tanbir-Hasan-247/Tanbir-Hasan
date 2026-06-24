const cord = document.getElementById('pull-cord');
const beam = document.getElementById('glow-beam');
const shade = document.getElementById('lamp-shade');
const mouth = document.getElementById('lamp-mouth');
const content = document.getElementById('main-content');
const toast = document.getElementById('light-toast');
const hint = document.getElementById('lamp-hint');

let isOn = false;
content.classList.remove('dimmed');
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
        document.body.classList.add('light-mode');
        beam.style.opacity = "1";
        shade.setAttribute('fill', '#d4e09b');
        mouth.setAttribute('d', "M90 85 Q100 100 110 85");
        mouth.setAttribute('stroke', '#ff4d4d');
        content.classList.remove('dimmed');
        content.style.opacity = "1";
        content.style.filter = "blur(0) grayscale(0)";
        content.style.pointerEvents = "auto";
        content.style.transition = "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
        toast.classList.add('toast-visible');
        hint.style.display = "none";
        setTimeout(() => { toast.classList.remove('toast-visible'); }, 4000);
        fetchCF();
    } else {
        document.body.classList.remove('light-mode');
        beam.style.opacity = "0";
        shade.setAttribute('fill', '#181d14');
        mouth.setAttribute('d', "M90 95 Q100 85 110 95");
        mouth.setAttribute('stroke', '#000');
        content.classList.remove('dimmed');
        content.style.opacity = "";
        content.style.filter = "";
        content.style.pointerEvents = "";
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
    } catch (e) { console.error("CF API error:", e); }
}

// --- 1. Mobile Menu Logic ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeMenuBtn  = document.getElementById('close-menu-btn');
const mobileMenu    = document.getElementById('mobile-menu');
const mobileLinks   = document.querySelectorAll('.mobile-link');

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

// --- 2. Scroll Reveal Animation ---
const reveals = document.querySelectorAll('.reveal');
const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
reveals.forEach(r => revealOnScroll.observe(r));

// --- 3. Active Navbar Link ---
const sections = document.querySelectorAll('section');
const navLinks  = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 250) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
        link.classList.remove('text-yellow-500');
        if (link.getAttribute('href') === '#' + current) link.classList.add('text-yellow-500');
    });
}
window.addEventListener('scroll', updateActiveLink);
window.addEventListener('load', updateActiveLink);

// --- 4. Project Filter Logic ---
const filterBtns     = document.querySelectorAll('.filter-btn');
const allProjectItems = document.querySelectorAll('.project-item');
let currentFilter = 'all';

function applyFilter(filter) {
    currentFilter = filter;

    allProjectItems.forEach(item => {
        const matches = filter === 'all' || item.dataset.category === filter;
        if (matches) {
            item.style.display = 'flex';
            requestAnimationFrame(() => { item.style.opacity = '1'; item.style.transform = 'translateY(0)'; });
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(16px)';
            setTimeout(() => { item.style.display = 'none'; }, 300);
        }
    });

    // Reset view-more
    const viewBtn = document.getElementById('view-projects-btn');
    if (viewBtn) {
        viewBtn.innerText = 'View All Projects';
        viewBtn.style.display = '';
    }
    resetViewMore();
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.dataset.filter);
    });
});

// --- 5. View More Logic (respects active filter) ---
const VIEW_LIMIT = 4;

function getVisibleItems() {
    return [...allProjectItems].filter(item => {
        const matches = currentFilter === 'all' || item.dataset.category === currentFilter;
        return matches;
    });
}

function resetViewMore() {
    const visible = getVisibleItems();
    const viewBtn = document.getElementById('view-projects-btn');
    if (!viewBtn) return;

    visible.forEach((item, i) => {
        item.style.display = 'flex';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
        if (i >= VIEW_LIMIT) {
            item.style.display = 'none';
            item.style.opacity = '0';
        }
    });

    if (visible.length <= VIEW_LIMIT) {
        viewBtn.style.display = 'none';
    } else {
        viewBtn.style.display = '';
        viewBtn.innerText = 'View All Projects';
        isExpanded = false;
    }
}

let isExpanded = false;

document.addEventListener('DOMContentLoaded', () => {
    resetViewMore();

    const viewBtn = document.getElementById('view-projects-btn');
    if (!viewBtn) return;

    viewBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        const visible = getVisibleItems();

        if (isExpanded) {
            let delay = 0;
            visible.forEach((item, i) => {
                if (i >= VIEW_LIMIT) {
                    item.style.display = 'flex';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, delay);
                    delay += 120;
                }
            });
            viewBtn.innerText = 'View Less';
        } else {
            visible.forEach((item, i) => {
                if (i >= VIEW_LIMIT) {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(16px)';
                    setTimeout(() => { item.style.display = 'none'; }, 350);
                }
            });
            viewBtn.innerText = 'View All Projects';
            window.scrollTo({ top: document.getElementById('projects').offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// --- 6. Thesis View More ---
function setupThesisViewMore(itemClass, btnId, limit) {
    const items = document.querySelectorAll(itemClass);
    const btn   = document.getElementById(btnId);
    if (!btn || items.length <= limit) { if (btn) btn.style.display = 'none'; return; }

    items.forEach((item, i) => {
        if (i >= limit) { item.style.display = 'none'; item.style.opacity = '0'; }
    });

    let expanded = false;
    btn.addEventListener('click', () => {
        expanded = !expanded;
        if (expanded) {
            let d = 0;
            items.forEach((item, i) => {
                if (i >= limit) {
                    item.style.display = 'flex';
                    setTimeout(() => { item.style.opacity = '1'; }, d);
                    d += 250;
                }
            });
            btn.innerText = 'View Less';
        } else {
            items.forEach((item, i) => {
                if (i >= limit) { item.style.opacity = '0'; setTimeout(() => { item.style.display = 'none'; }, 400); }
            });
            btn.innerText = 'View All Research';
        }
    });
}
setupThesisViewMore('.thesis-item', 'view-thesis-btn', 1);