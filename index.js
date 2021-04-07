// Scroll to top on reload
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

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

// Hide dropdown or mobile menu when clicking outside button or menu
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

// Statistic counter + scrolling observer

const statisticGroup = document.querySelector("#statistic-group .statistic");
const counters = document.querySelectorAll(".counter");
const speed = 100;

const statisticObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            fireCounters(counters);
            observer.unobserve(entry.target);
        }
    })
}, { root: null, rootMargin: '100px', threshold: 1.0 });

statisticObserver.observe(statisticGroup);

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

// Fetch and load from RSS feed

const newsGroup = document.querySelector("#news-group")
const loading = document.querySelector("#loading");
// NOTE: proxy was set up with nodeJS and deployed to heroku to bypass CORS restrictions
const proxyURL = "https://secure-cove-98237.herokuapp.com/";

// loadPlaceholders();

fetch(proxyURL)
  .then(response => response.json())
  .then(data => {loadLatestNews(data)})
  .catch(error => {
      console.log(error);
      loadPlaceholders();
  })

function loadLatestNews(data) {
    ;
    const numberOfNews = 3;
    console.log(data.items);
    if (data.items) {
        loading.innerHTML = "";
        for (let i = 0; i < numberOfNews; i++) {
            const title = data.items[i].title;
            const date = formatDate(new Date(data.items[i].pubDate));
            const link = data.items[i].link;

            const a = document.createElement("a");
            const span = document.createElement("span");
            const h3 = document.createElement("h3");

            a.href = link;
            a.target = "_blank";
            span.textContent = date;
            h3.textContent = title;

            a.append(span, h3);
            newsGroup.appendChild(a);
        }
    }
}

function loadPlaceholders() {
    news = [
        {
            date: "27.07.2016",
            title: "Liana Technologies and Encode Solutions merge to create unique mobile solutions"
        },
        {
            date: "28.01.2016",
            title: "From a local startup to a global player: Liana Technologies among the forerunners of digital marketing technology"
        },
        {
            date: "02.07.2015",
            title: "Liana Technologies Hong Kong launched a series of digital marketing events in June"
        },
    ]
    let HTMLstring = ""
    news.forEach(item => {
        HTMLstring += `
            <a  href="#">
                <span>${news[0].date}</span>
                <h3>${news[0].title}</h3>
            </a>
        `
    })
    newsGroup.innerHTML = HTMLstring;
    loading.innerHTML = "<span>Failed to load latest news &#128557 – loaded placeholder news instead.</span>";
}

// Sticky header hide and show
// Following: https://webdesign.tutsplus.com/tutorials/how-to-hide-reveal-a-sticky-header-on-scroll-with-javascript--cms-33756

const body = document.body;
const header = document.querySelector("#sticky-header");
const scrollUp = "scroll-up";
const scrollDown = "scroll-down";
let lastScroll = 0;

window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll <= 50) {
        body.classList.remove(scrollUp);
        return;
    }
    if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
        // down
        body.classList.remove(scrollUp);
        body.classList.add(scrollDown);
    } else if (currentScroll < lastScroll && body.classList.contains(scrollDown)) {
        // up
        body.classList.remove(scrollDown);
        body.classList.add(scrollUp);
    }
    lastScroll = currentScroll;
    menusActive() ? closeMenus() : null;
});

// Subscription notification 

const newsletterForm = document.querySelector("#newsletter-form");
const notification = document.querySelector("#notification");

newsletterForm.addEventListener("submit", e => {
    e.preventDefault();
    console.log(e);
    newsletterForm.reset();
    notification.innerHTML = "Thank you for subscribing to our newsletter &#10084;&#65039;";
    notification.style.opacity = "0.9";
    notification.style.transform = "none";
    setTimeout(() => {
        notification.style.opacity = "0";
        notification.style.transform = "translate3d(0, -101%, 0)";
    }, 3000);
})


// Helper functions

function padValue(value, target) {
    const targetLength = target.toString().length;
    return value.toString().padStart(targetLength, "0");
}

function formatDate(date) {
    const str = date.toISOString().split("T")[0];
    const arr = str.split("-").reverse();
    return arr.join(".");
}

function menusActive() {
    const menusActive = mainNavMenu.classList.contains("menu-open") ||
                        burgerBtn.classList.contains("burger-active") ||
                        !languageList.classList.contains("hidden");
    return menusActive;
}

function closeMenus() {
    mainNavMenu.classList.remove("menu-open");
    burgerBtn.classList.remove("burger-active");
    languageList.classList.add("hidden");
}