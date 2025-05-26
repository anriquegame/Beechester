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

    if (guide) {
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
        if (guide == "1"){
            onAnimationEnd(pet, texts2, targets2, "events")
        }
        else if(guide == "2"){
            onAnimationEnd(pet, texts3, targets3, "info")
        }
        else if(guide == "3"){
            onAnimationEnd(pet, texts4, targets4, "contact")
        }
        else if(guide == "4"){
            onAnimationEnd(pet, texts5, targets5, "home")
        }
        else {
            console.warn('restart the tour', e);
        }
    }
    else {
        blank.remove();
    }
});

// dialogues
const texts2 = [
// 0 – Introduction
[
    "Let's continue the tour, now for the Manchester's best Places of Interest.",
    "Scroll down to explore parks, neighbourhoods, landmarks and more."
],
// 1 – Heaton Park
[
    "First up: Heaton Park - one of Europe's largest municipal parks.",
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
    "Calling all football fans - check out Old Trafford.",
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

const texts3 = [
    // 0 – Introduction 
    [
        "Hey, Ready to buzz through manchester's best events?",
        "Keep scrolling to uncover festivals, markets and more surprises!"
    ],
    // 1 – Manchester International Festival
    [
        "First stop: Manchester International Festival!",
        "From 10-20 July, dive into world premieres of theatre, music and art—made just for you."
    ],
    // 2 – Parklife Festival
    [
        "Next up: Parklife Festival at Heaton Park.",
        "On 14-15 June, dance under the open sky to top DJs, munch on street food and share the vibe."
    ],
    // 3 – Manchester Jazz Festival
    [
        "Feel the groove at Manchester Jazz Festival.",
        "16-25 May, intimate clubs, grand halls and plenty of improv to make you move."
    ],
    // 4 – Manchester Literature Festival
    [
        "Get inspired at Manchester Literature Festival!",
        "10-26 October, join readings, workshops and author chats—perfect for book lovers of all ages."
    ],
    // 5 – Manchester Christmas Markets
    [
        "Experience festive magic at the Manchester Christmas Markets.",
        "8 Nov-22 Dec, explore wooden chalets, sip mulled wine and hunt for unique gifts."
    ],
];

const targets3 = [
    "events-intro",
    "mif-event",
    "parklife-event",
    "jazzfest-event",
    "litfest-event",
    "christmas-event"
];


const texts4 = [
    // 0 – Introduction
    [
        "Hey there! Here is the Manchester's must-know info.",
        "Scroll down for key facilities, transport tips, and top hotel picks!"
    ],
    // 1 – Old Trafford
    [
        "First stop: Old Trafford—the Theatre of Dreams!",
        "Check out stadium tours, the museum and the legendary trophy room.",
        "Next is the Manchester Aquatics Centre!",
        "Dive into Olympic-standard pools and show off your best dive off the boards.",
        "Over at Albert Square stands the stunning Town Hall.",
        "Join a free weekend tour and marvel at its Gothic Revival splendor.",
        "Step inside Manchester Cathedral's medieval nave.",
        "Admire the stained glass and enjoy a moment of calm—open daily!"
    ],
    // 2 – Public Transport & Airport
    [
        "Getting around? Metrolink trams, buses, trains and coaches have you covered.",
        "Tip: hop on the direct airport tram—Piccadilly to terminals in just 20 minutes!"
    ],
    // 3 – Hotel Recommendations
    [
        "Time to rest your wings? Check these hotel gems:",
        "From the boutique luxury of Gotham to comfy value at Holiday Inn."
    ]
];

const targets4 = [
    "info-intro",
    "sporting-facilities",
    "transport-airport",
    "hotels" 
];


// petbee dialogues for the Contact page
const texts5 = [
    // 0 – Introduction / Contact Form
    [
        "You’ve reached the final stop: let’s get in touch!",
        "Fill out the form below with your name, email and message, I'll buzz right back to you."
    ],
    // 1 – Stay Connected
    [
        "Want more Manchester buzz? Follow us on social media!",
        "Click Facebook, Twitter or Instagram and don't forget you can always email us directly."
    ],
    // 2 – Key Organizations and end
    [
        "Need official info? Here are some key resources:",
        "Manchester City Council, GMP Police, TfGM and Visit Manchester are all just a click away.",
        "That's a wrap on our Beechester tour—thanks for buzzing with me!",
        "Safe travels, and come back soon for more city adventures."
    ]
];

const targets5 = [
    "contact-form",
    "stay-connected",
    "key-orgs"
];
