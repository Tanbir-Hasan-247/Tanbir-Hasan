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