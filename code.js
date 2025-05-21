let tourStarted = false;

function startTour() {
    if (tourStarted) return;
    tourStarted = true;

    // At the beginning of startTour():
    document.documentElement.scrollTop = 0; // Chrome, Firefox, etc.
    document.body.scrollTop = 0; // Safari

    // disables the button
    const button = document.getElementById("tour-button");
    button.style.background = "lightgray"
    button.style.color = "gray"
    button.style.cursor = "default"
    button.classList.add('no-scale');

    // changes the logo color
    const logoBarra = document.getElementById("anim-logo");
    logoBarra.src = "images/lightgraylogobee.png";

    // creates the pet
    const pet = document.createElement("img");
    pet.src = "images/logobee.png";
    pet.style.position = "fixed";
    pet.style.zIndex = "1001";
    document.getElementById("main").appendChild(pet);

    // initial data
    const rect = logoBarra.getBoundingClientRect();
    const startX = rect.left;
    const startY = rect.top;
    const w = logoBarra.offsetWidth;
    const h = logoBarra.offsetHeight;
    pet.style.width  = w + "px";
    pet.style.height = h + "px";

    // destination (85vw, 50vh)
    const endX = window.innerWidth  * 0.95 - w/2;
    const endY = window.innerHeight * 0.50 - h/2;
    const dx = endX - startX;
    const dy = endY - startY;

    // relative parameters
    const duration = 3000; // 3s total
    const split = 0.25; // 30% / 70%
    const amp1 = window.innerHeight * 0.40;
    const amp2 = window.innerHeight * 0.15;
    const bias = window.innerHeight * 0.15;
    const startTime = performance.now();

    function frame(now) {
        const t = Math.min((now - startTime) / duration, 1);

        let yOffset, vy;
        if (t <= split) {
        // Phase 1: ramped bias and sine of amp1
        const t1 = t / split;
        yOffset = amp1 * Math.sin(Math.PI * t1) + bias * t1;
        vy = dy + (amp1 * Math.PI * Math.cos(Math.PI * t1) + bias) / split;
        } else {
        // Phase 2: inverted sine of amp2 + decaying bias
        const t2 = (t - split) / (1 - split);
        yOffset = -amp2 * Math.sin(Math.PI * t2) + bias * (1 - t2);
        vy = dy - (amp2 * Math.PI * Math.cos(Math.PI * t2) + bias) / (1 - split);
        }

        const x = startX + dx * t;
        const y = startY + dy * t + yOffset;

        const vx = dx;
        const angle = Math.atan2(vy, vx) * 180 / Math.PI;
        const extraRot = 720 * t;

        pet.style.left      = x + "px";
        pet.style.top       = y + "px";
        pet.style.transform = `rotate(${angle}deg) rotate(${extraRot}deg)`;

        if (t < 1) {
            requestAnimationFrame(frame);
        }
        else {
            // === ANIMATION FINISHED ===
            const finalRect = pet.getBoundingClientRect();

            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.left = finalRect.left + 'px';
            container.style.top = finalRect.top  + 'px';
            container.style.width = finalRect.width  + 'px';
            container.style.height = finalRect.height + 'px';
            container.style.pointerEvents = 'none';

            document.getElementById("main").removeChild(pet);
            // container.appendChild(pet);
            const floater = document.createElement('div');
            floater.appendChild(pet);
            container.appendChild(floater);
            floater.classList.add('floater');
            pet.style.top = "0";
            pet.style.left = "0";


            const bubble = document.createElement('div');
            bubble.id="bubble-div"
            bubble.innerHTML = `<h3 id="bubble-text">Hello I will be your guide!</h3> <button id="nextButton">Next</button>`;
            let pageBubble = 0;

            container.appendChild(bubble);
            document.getElementById("main").appendChild(container);

            // adds event to the button
            document.getElementById("nextButton").addEventListener("click", () => {
                ++pageBubble
                switch (pageBubble) {
                    case 1:
                        // Smooth scroll to ID "manchester-city"
                        document.getElementById("manchester-city")?.scrollIntoView({ behavior: "smooth" });
                        // Changes the bubble text
                        document.getElementById("bubble-text").innerHTML = "Lets see about Manchester City.";
                        break;
                    case 2:
                        // Smooth scroll to ID "transporte"
                        document.getElementById("videotopic")?.scrollIntoView({ behavior: "smooth" });
                        // Changes the bubble text
                        document.getElementById("bubble-text").innerHTML = "You can click on the video to watch a walking tour.";
                        break;
                    case 3:
                        // Smooth scroll to ID "transporte"
                        document.getElementById("transport")?.scrollIntoView({ behavior: "smooth" });
                        // Changes the bubble text
                        document.getElementById("bubble-text").innerHTML = "Now see the transport area.";
                        break;
                    default:
                        // 1) Scroll animado ao topo com rAF
                        (function() {
                            const startY   = window.scrollY;
                            const duration0 = 600;              // 600 ms para o scroll
                            const start0   = performance.now();

                            function animateScroll(now0) {
                                const t0 = Math.min((now0 - start0) / duration0, 1);
                                // interpola de startY até 0
                                window.scrollTo(0, startY * (1 - t0));

                                if (t0 < 1) {
                                    requestAnimationFrame(animateScroll);
                                } else {
                                    // quando terminar o scroll, chama a próxima
                                    afterScroll();
                                }
                            }
                            requestAnimationFrame(animateScroll);
                        })();

                        // 2) tudo que hoje estava dentro do setTimeout(…,600)
                        function afterScroll() {
                            const bubble = document.getElementById("bubble-div");
                            if (bubble) bubble.remove();

                            const divFather = document.querySelector(".floater");
                            let pet, petRect;
                            if (divFather) {
                                pet     = divFather.firstChild;
                                petRect = divFather.getBoundingClientRect();

                                pet.style.position = "fixed";
                                pet.style.left     = petRect.left + "px";
                                pet.style.top      = petRect.top  + "px";
                                pet.style.transform= "";
                                pet.style.transition="";
                                document.getElementById("main").appendChild(pet);
                                divFather.remove();
                            }

                            // calcula destino do link Places
                            const placesLink = document.querySelector('a[href="places.html"]');
                            const linkRect   = placesLink.getBoundingClientRect();
                            const deltaX = linkRect.left + linkRect.width/2  - (petRect.left + petRect.width/2);
                            const deltaY = linkRect.top  + linkRect.height/2 - (petRect.top  + petRect.height/2) - 25;

                            // 3) animação do pet
                            const start1    = performance.now();
                            const duration1 = 1000;
                            function animatePet(now1) {
                                const t1 = Math.min((now1 - start1) / duration1, 1);
                                pet.style.left      = petRect.left + deltaX * t1 + "px";
                                pet.style.top       = petRect.top  + deltaY * t1 + "px";
                                pet.style.transform = `rotate(${(1 - t1) * 360}deg)`; // ex: rotação decrescente

                                if (t1 < 1) {
                                    requestAnimationFrame(animatePet);
                                } else {
                                    // 4) quando pet acabar, chama overlay
                                    startOverlay();
                                }
                            }
                            requestAnimationFrame(animatePet);
                        }

                        // 4) fade‑in do overlay
                        function startOverlay() {
                            const main = document.getElementById("main");
                            const overlay = document.createElement("div");
                            Object.assign(overlay.style, {
                                position:       "absolute",
                                top:            0,
                                left:           0,
                                width:          "100%",
                                height:         "100%",
                                backgroundColor:"#fff",
                                opacity:        0,
                                pointerEvents:  "none",
                                zIndex:         2000
                            });
                            main.appendChild(overlay);

                            const start2    = performance.now();
                            const duration2 = 800;
                            function animateOverlay(now2) {
                                const t2 = Math.min((now2 - start2) / duration2, 1);
                                overlay.style.opacity = t2;
                                if (t2 < 1) {
                                    requestAnimationFrame(animateOverlay);
                                } else {
                                    window.location.href = "places.html?guia=1";
                                }
                            }
                            requestAnimationFrame(animateOverlay);
                        }

                        break;

                }
            });
        }
    }

    requestAnimationFrame(frame);
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

// Fecha ao clicar fora da imagem (opcional)
document.getElementById('image-viewer').addEventListener('click', (e) => {
    if (e.target.id === 'image-viewer') {
    document.getElementById('image-viewer').style.display = 'none';
    }
});