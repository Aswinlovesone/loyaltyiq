/* =========================================================
   LOADER
========================================================= */

window.addEventListener("load", () => {

    const loader = document.querySelector(".loader");

    if (loader) {

        setTimeout(() => {

            loader.classList.add("hide");

        }, 1000);

    }

});

/* =========================================================
   SMOOTH SCROLL
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", e => {

        const targetId =
            link.getAttribute("href");

        if (targetId === "#") return;

        const target =
            document.querySelector(targetId);

        if (target) {

            e.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});

/* =========================================================
   HERO ANIMATION
========================================================= */

const fadeItems =
    document.querySelectorAll(".animate-fade-up");

fadeItems.forEach((item, index) => {

    item.style.animationDelay =
        `${index * 0.15}s`;

});

/* =========================================================
   FLOATING CTA EFFECT
========================================================= */

const floatingBtn =
    document.querySelector(".floating-cta");

if (floatingBtn) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {

            floatingBtn.classList.add("show");

        } else {

            floatingBtn.classList.remove("show");

        }

    });

}

/* =========================================================
   NAVBAR SCROLL EFFECT
========================================================= */

const nav =
    document.querySelector(".hero-nav");

window.addEventListener("scroll", () => {

    if (window.scrollY > 40) {

        nav.classList.add("nav-scrolled");

    } else {

        nav.classList.remove("nav-scrolled");

    }

});

/* =========================================================
   COUNTER ANIMATION
========================================================= */

const counters =
    document.querySelectorAll(".hstat-num");

const animateCounter = (counter) => {

    const text =
        counter.innerText;

    const number =
        parseInt(text.replace(/[^0-9]/g, ""));

    let current = 0;

    const increment =
        number / 60;

    const update = () => {

        current += increment;

        if (current >= number) {

            counter.innerText = text;

            return;
        }

        counter.innerText =
            Math.floor(current) +
            text.replace(/[0-9]/g, "");

        requestAnimationFrame(update);

    };

    update();

};

const observer =
    new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                animateCounter(
                    entry.target);

                observer.unobserve(
                    entry.target);

            }

        });

    });

counters.forEach(counter => {

    observer.observe(counter);

});