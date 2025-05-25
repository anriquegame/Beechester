let tourStarted = false;

function disableTourButton() {
    const btn = document.getElementById("tour-button");
    btn.style.cssText = `
        background: lightgray;
        color: gray;
        cursor: default;
    `;
    btn.classList.add("no-scale");
}

function scrollToTop() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
}

function createPetElement(src) {
    const pet = document.createElement("img");
    pet.src = src;
    Object.assign(pet.style, {
        position: "fixed",
        zIndex: "1001",
        width: `50px`,
        height: `50px`,
    });
    return pet;
}

function animatePath(pet, start, delta, amps, bias, duration) {
    const startTime = performance.now();
    const [split, amp1, amp2] = amps;

    function frame(now) {
        const t = Math.min((now - startTime) / duration, 1);
        let yOffset, vy;

        if (t <= split) {
            const t1 = t / split;
            yOffset = amp1 * Math.sin(Math.PI * t1) + bias * t1;
            vy = delta.y + (amp1 * Math.PI * Math.cos(Math.PI * t1) + bias) / split;
        }
        else {
            const t2 = (t - split) / (1 - split);
            yOffset = -amp2 * Math.sin(Math.PI * t2) + bias * (1 - t2);
            vy = delta.y - (amp2 * Math.PI * Math.cos(Math.PI * t2) + bias) / (1 - split);
        }

        const x = start.x + delta.x * t;
        const y = start.y + delta.y * t + yOffset;
        const vx = delta.x;
        const angle = (Math.atan2(vy, vx) * 180) / Math.PI;
        const extraRot = 720 * t;

        Object.assign(pet.style, {
            left: `${x}px`,
            top: `${y}px`,
            transform: `rotate(${angle}deg) rotate(${extraRot}deg)`,
        });

        if (t < 1) requestAnimationFrame(frame);
        else onAnimationEnd(pet);
    }

    requestAnimationFrame(frame);
}

function onAnimationEnd(pet, textsParam=texts, targetsParam=targets, linkPage="places") {
    const finalRect = pet.getBoundingClientRect();
    const container = document.createElement("div");
    Object.assign(container.style, {
        position: "fixed",
        left: `${finalRect.left}px`,
        top: `${finalRect.top}px`,
        width: `${finalRect.width}px`,
        height: `${finalRect.height}px`,
        pointerEvents: "none",
    });

    pet.style.top = pet.style.left = "0";
    const floater = document.createElement("div");
    floater.classList.add("floater");
    floater.appendChild(pet);
    container.appendChild(floater);

    const bubble = document.createElement("div");
    bubble.id = "bubble-div";
    bubble.innerHTML = `<h3 id="bubble-text">Hello, I will be your guide!</h3><button id="nextButton">Next</button>`;
    container.appendChild(bubble);
    document.getElementById("main").appendChild(container);

    setupBubbleNavigation(floater, bubble, textsParam, targetsParam, linkPage);
}

const texts = [
    // 0
    [
        "Hello! I'm your guide through Beechester website."
    ],
    // Section 1: manchester-city
    [
        "The heart of the city is full of life and history.",
        "Let's explore the Northern Quarter and feel the creative energy."
    ],
    // Section 2: videotopic
    [
        "Now, click on the video to experience the streets in motion.",
        "Enjoy the rhythm of the city as you watch."
    ],
    // Section 3: facts
    [
        "Time for some interesting Manchester facts!",
        "Did you know Manchester was once called 'Cottonopolis' in the 18th century?",
        "It also pioneered steam power in textile production."
    ]
];

const targets = ["introduction", "manchester-city", "videotopic", "facts"];

function setupBubbleNavigation(floater, bubble, textsParam, targetsParam, linkPage) {
    let section = 0;
    let dialogueIndex = 0;

    const nextBtn = bubble.querySelector("#nextButton");
    const textEl = bubble.querySelector("#bubble-text");

    textEl.textContent = textsParam[0][0];

    nextBtn.addEventListener("click", () => {
        dialogueIndex++;

        if (dialogueIndex < textsParam[section].length) {
            textEl.textContent = textsParam[section][dialogueIndex];
        } else {
            section++;
            dialogueIndex = 0;

            if (section < targetsParam.length) {
                document.getElementById(targetsParam[section])?.scrollIntoView({ behavior: "smooth" });
                textEl.textContent = textsParam[section][0];
            } else {
                textEl.textContent = `Let's continue to the ${linkPage} page!`;
                nextBtn.textContent = `Go to ${linkPage}`;

                nextBtn.replaceWith(nextBtn.cloneNode(true));
                const finalBtn = bubble.querySelector("#nextButton");
                finalBtn.addEventListener("click", () => endTour(floater, linkPage));
            }
        }
    });
}


function endTour(floater, linkPage) {
    // Scroll back to top smoothly
    const startY = window.scrollY;
    const duration0 = 600;
    const t0Start = performance.now();
    window.scrollTo({ top: 0, behavior: 'smooth' }); // animação nativa
    setTimeout(() => {
        const link = document.getElementById(linkPage);
        continueEnd(floater, link);
    }, 1200)
}

function continueEnd(floater, link) {
    document.getElementById("bubble-div")?.remove();
    const pet = floater.firstChild;
    if (!pet) return;
    const petRect = floater.getBoundingClientRect();
    Object.assign(pet.style, {
        position: "fixed",
        left: `${petRect.left}px`,
        top: `${petRect.top}px`,
        transform: "",
        transition: "",
    });
    document.getElementById("main").appendChild(pet);
    floater.remove();

    // Animate pet to places link
    const linkRect = link.getBoundingClientRect();
    const deltaX = linkRect.left + linkRect.width / 2 - (petRect.left + petRect.width / 2);
    const deltaY = linkRect.top + linkRect.height / 2 - (petRect.top + petRect.height / 2) - 25;
    const start1 = performance.now();
    const duration1 = 1000;

    (function animatePet(now1) {
        const t1 = Math.min((now1 - start1) / duration1, 1);
        pet.style.left = `${petRect.left + deltaX * t1}px`;
        pet.style.top = `${petRect.top + deltaY * t1}px`;
        pet.style.transform = `rotate(${(1 - t1) * 360}deg)`;
        if (t1 < 1) requestAnimationFrame(animatePet);
        else startOverlay(pet, link);
    })(performance.now());
}

function startOverlay(pet, link) {
    const main = document.getElementById("main");
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        pointerEvents: "none",
        zIndex: 1003,
        opacity: 0,
    });
    main.appendChild(overlay);

    const start2 = performance.now();
    const duration2 = 800;

    (function animateOverlay(now2) {
        const t2 = Math.min((now2 - start2) / duration2, 1);
        overlay.style.opacity = t2;
        if (t2 < 1) requestAnimationFrame(animateOverlay);
        else {
            const rect = pet.getBoundingClientRect();
            if (link.id == "places"){
                sessionStorage.setItem("beePlaces", JSON.stringify({ left: Math.round(rect.left * 100), top: Math.round(rect.top * 100) }))
                window.location.href = "places.html?guide=1";
            }
            if (link.id == "events"){
                sessionStorage.setItem("beeEvents", JSON.stringify({ left: Math.round(rect.left * 100), top: Math.round(rect.top * 100) }))
                window.location.href = "events.html?guide=2";
            }
            if (link.id == "info"){
                sessionStorage.setItem("beeInfo", JSON.stringify({ left: Math.round(rect.left * 100), top: Math.round(rect.top * 100) }))
                window.location.href = "info.html?guide=3";
            }
            if (link.id == "contact"){
                sessionStorage.setItem("beeContact", JSON.stringify({ left: Math.round(rect.left * 100), top: Math.round(rect.top * 100) }))
                window.location.href = "contact.html?guide=4";
            }
        }
    })(performance.now());
}

function startTour() {
    if (tourStarted) return;
    tourStarted = true;

    scrollToTop();
    disableTourButton();

    const logo = document.getElementById("anim-logo");
    logo.src = "images/lightgraylogobee.png";

    const { left: x0, top: y0, width: w, height: h } = logo.getBoundingClientRect();
    const pet = createPetElement("images/logobee.png");
    document.getElementById("main").appendChild(pet);

    const end = {
        x: window.innerWidth * 0.95 - w / 2,
        y: window.innerHeight * 0.5 - h / 2,
    };
    const delta = { x: end.x - x0, y: end.y - y0 };
    const amps = [0.25, window.innerHeight * 0.40, window.innerHeight * 0.15];
    const bias = window.innerHeight * 0.15;
    const duration = 3000;

    animatePath(pet, { x: x0, y: y0 }, delta, amps, bias, duration);
}

if (document.getElementById("tour-button")) {
    document.getElementById("tour-button").addEventListener("click", startTour);
}


document.querySelectorAll('#main img').forEach(img => {
    img.addEventListener('click', () => {
    const viewer = document.getElementById('image-viewer');
    const fullImage = document.getElementById('full-image');
    fullImage.src = img.src;
    viewer.style.display = 'flex';
    });
});

document.getElementById('close-viewer').addEventListener('click', () => {
    document.getElementById('image-viewer').style.display = 'none';
});

document.getElementById('image-viewer').addEventListener('click', (e) => {
    if (e.target.id === 'image-viewer') {
    document.getElementById('image-viewer').style.display = 'none';
    }
});