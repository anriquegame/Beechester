window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const guide = urlParams.get('guide');
    const blank = document.getElementById('blank');

    if (!blank) return;

    if (guide === '1') {
        document.getElementById("anim-logo").src = "images/lightgraylogobee.png"
        document.getElementById("anim-logo").id = "grayBee"
        // configure opacity
        blank.style.opacity = 1;

        setTimeout(() => {
            const duration = 2000; // duration of the fade-out in ms
            const start = performance.now();

            function fadeOutStep(now) {
                const t = Math.min((now - start) / duration, 1);
                blank.style.opacity = 1 - t;
                if (t < 1) {
                    requestAnimationFrame(fadeOutStep);
                } else {
                    blank.remove();
                }
            }

            requestAnimationFrame(fadeOutStep);
        }, 750);

    } else {
        blank.remove();
    }
});

