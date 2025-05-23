window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const guide = urlParams.get('guide');
    const blank = document.getElementById('blank');
  
    if (!blank) return;
  
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  
    function fadeOut(element, duration) {
        return new Promise(resolve => {
            const start = performance.now();
            function step(now) {
            const t = Math.min((now - start) / duration, 1);
            element.style.opacity = 1 - t;
            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                resolve();
            }
            }
            requestAnimationFrame(step);
        });
    }
  
    function animatePetbee(pet, options = {}) {
        const { duration = 600, ease = 'ease-in-out', transform } = options;
        return new Promise(resolve => {
            pet.style.transition = `transform ${duration}ms ${ease}`;
            pet.style.transform = transform;
            pet.addEventListener('transitionend', () => resolve(), { once: true });
        });
    }
  
    if (guide === '1') {
        document.getElementById("anim-logo").src = "images/lightgraylogobee.png";
        document.getElementById("anim-logo").id = "grayBee";
        blank.style.opacity = 1;
    
        await wait(750);
        await fadeOut(blank, 1500);
        blank.remove();
    
        const pet = document.getElementById("petbee");
        const { left: x0, top: y0, width: w, height: h } = pet.getBoundingClientRect();
        const end = { x: window.innerWidth * 0.95 - w / 2, y: window.innerHeight * 0.5  - h / 2};
        const deltaX = end.x - x0;
        const deltaY = end.y - y0;
    
        await animatePetbee(pet, {
            duration: 600,
            transform: `translate(${deltaX}px, ${deltaY}px) rotate(380deg)`
        });

        const finalRotation = 'rotate(380deg)';

        pet.style.removeProperty('translate');

        Object.assign(pet.style, {
        transform: finalRotation
        });

        onAnimationEnd(pet, texts2, targets2, "events")
    } else {
      blank.remove();
    }
  });

const texts2 = [
// 0 – Introduction
[
    "Let's continue the tour, now for the Manchester's best Places of Interest.",
    "Scroll down to explore parks, neighbourhoods, landmarks and more."
],
// 1 – Heaton Park
[
    "First up: Heaton Park – one of Europe's largest municipal parks.",
    "Enjoy landscaped gardens, a historic hall, and even tram rides."
],
// 2 – Northern Quarter
[
    "Next, wander the Northern Quarter's creative streets.",
    "Spot colourful street art, indie shops and cosy cafés around every corner."
],
// 3 – Chinatown
[
    "Now let's head to Chinatown for authentic flavours.",
    "Sample delicious street food and soak up the festival lanterns."
],
// 4 – Albert Square
[
    "Over at Albert Square, admire Victorian architecture.",
    "Don't miss the Christmas tree lighting if you're here in winter!"
],
// 5 – The Lowry
[
    "Across the water at Salford Quays sits The Lowry.",
    "Explore contemporary art galleries and theatre performances."
],
// 6 – Stadiums
[
    "Calling all football fans – check out Old Trafford.",
    "Book a stadium tour to dive into Manchester's sporting history."
],
// 7 – Parks roundup
[
    "Manchester has more than just Heaton Park.",
    "There's a green space for every mood."
],
// 8 – Hotels
[
    "Ready to stay the night? Explore our hotel map.",
    "Find everything from boutique B&Bs to luxury riverside hotels."
],
// 9 – Interactive Map
[
    "Finally, here's your all-in-one interactive Manchester map.",
    "Click any marker to jump straight to that place's details above."
]
];

const targets2 = [
"places-intro",
"heaton-map",
"northern-map",
"chinatown-map",
"albert-map",
"lowry-map",
"stadiums-map",
"parks-map",
"hotel-map",
"city-map"
];
  