window.addEventListener("scroll", function () {
    if (window.scrollY > 0) {
        document.querySelector("header").classList.add("drop-shadow-md");
    } else {
        document.querySelector("header").classList.remove("drop-shadow-md");
    }
});

document.addEventListener("htmx:afterRequest", function (e) {
    if (window.scrollY > 0) {
        document.querySelector("header").classList.add("drop-shadow-md");
    } else {
        document.querySelector("header").classList.remove("drop-shadow-md");
    }
})