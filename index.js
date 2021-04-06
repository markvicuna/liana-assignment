// Select language dropdown
const languageBtn = document.querySelector("#language-btn");
const languageList = document.querySelector("#language-list");

languageBtn.addEventListener("click", e => {
    e.preventDefault();
    languageList.classList.toggle("hidden");
})

// Mobile menu trigger

const burgerBtn = document.querySelector("#burger-btn");
const mainNavMenu = document.querySelector("#main-nav-menu");

burgerBtn.addEventListener("click", e => {
    console.log("click");
    mainNavMenu.classList.toggle("menu-open");
    burgerBtn.classList.toggle("burger-active");
})

// Hide dropdown when clicking outside button or menu
document.addEventListener("mouseup", e => {
    if (!languageList.classList.contains("hidden")
        && !languageBtn.contains(e.target)
        && !languageList.contains(e.target)
        && languageBtn !== e.target
        && languageList !== e.target) {
            languageList.classList.add("hidden");
    }

    if (mainNavMenu.classList.contains("menu-open")
        && !mainNavMenu.contains(e.target)
        && !burgerBtn.contains(e.target)
        && mainNavMenu !== e.target
        && burgerBtn !== e.target) {
            mainNavMenu.classList.remove("menu-open");
            burgerBtn.classList.remove("burger-active");
    }
})

// Sticky header hide and show
const scrollUp = "scroll-up";
const scrollDown = "scroll-down";
let lastScroll = 0;


// Statistic counter + scrolling observer

const statisticGroup = document.querySelector("#statistic-group .statistic");
const counters = document.querySelectorAll(".counter");
const speed = 100;

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            fireCounters(counters);
            observer.unobserve(entry.target);
        }
    })
}, { root: null, rootMargin: '100px', threshold: 1.0 });

observer.observe(statisticGroup);

function fireCounters(counters) {
    counters.forEach(counter => {
        const update = () => {
            const target = +counter.getAttribute("data-target");
            const count = +counter.textContent;
            const inc = target / speed;
            if (count < target) {
                const value = Math.ceil(count + inc);
                counter.textContent = padValue(value, target);
                setTimeout(update, 1);
            } else {
                counter.textContent = target;
            }
        }
        update();
    })
}

// Helper functions

function padValue(value, target) {
    const targetLength = target.toString().length;
    return value.toString().padStart(targetLength, "0");
}