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
        const { duration = 1200, ease = 'ease-in-out', transform } = options;
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
        await fadeOut(blank, 2000);
        blank.remove();
    
        const pet = document.getElementById("petbee");
        const { left: x0, top: y0, width: w, height: h } = pet.getBoundingClientRect();
        const end = { x: window.innerWidth * 0.95 - w / 2, y: window.innerHeight * 0.5  - h / 2};
        const deltaX = end.x - x0;
        const deltaY = end.y - y0;
    
        await animatePetbee(pet, {
            duration: 1200,
            transform: `translate(${deltaX}px, ${deltaY}px) rotate(380deg)`
        });

        const finalRect = pet.getBoundingClientRect();
        const finalRotation = 'rotate(380deg)';

        Object.assign(pet.style, {
        transform: finalRotation
        });

        pet.style.removeProperty('transition');

        onAnimationEnd(pet)

        Object.assign(pet.style, {
            left:     `0px`,
            top:      `0px`,
        });
    } else {
      blank.remove();
    }
  });
  