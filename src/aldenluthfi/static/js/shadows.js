document.querySelector(".burger").addEventListener("mouseover", function () {
    document.querySelector(".sidebar").classList.remove("shadow-glow-article");
    document.querySelector(".sidebar").classList.remove("shadow-article");
    if (localStorage.getItem("theme").includes("dark")) {
        document.querySelector(".sidebar").classList.add("shadow-glow-article");
    } else {
        document.querySelector(".sidebar").classList.add("shadow-article");
    }
});

document.querySelectorAll(".photo").forEach(function (button) {
    button.classList.remove("hover:shadow-glow-xl");
    button.classList.remove("hover:shadow-xl");
    if (localStorage.getItem("theme").includes("dark")) {
        button.classList.add("hover:shadow-glow-xl");
    } else {
        button.classList.add("hover:shadow-xl");
    }
});

document.querySelectorAll(".button").forEach(function (button) {
        button.classList.remove("hover:shadow-glow-lg");
        button.classList.remove("hover:shadow-lg");
        if (localStorage.getItem("theme").includes("dark")) {
            button.classList.add("hover:shadow-glow-lg");
        } else {
            button.classList.add("hover:shadow-lg");
        }
    });

window.addEventListener("scroll", function () {
    if (window.scrollY > 0) {
        document.querySelector("header").classList.remove("drop-shadow-glow-md");
        document.querySelector("header").classList.remove("drop-shadow-md");
        if (localStorage.getItem("theme").includes("dark")) {
            document.querySelector("header").classList.add("drop-shadow-glow-md");
        } else {
            document.querySelector("header").classList.add("drop-shadow-md");
        }
    } else {
        document.querySelector("header").classList.remove("drop-shadow-glow-md");
        document.querySelector("header").classList.remove("drop-shadow-md");
    }
});

if (document.querySelector(".article") != null) {
    document.querySelector(".article").classList.remove("desktop:shadow-glow-article");
    document.querySelector(".article").classList.remove("desktop:shadow-article");
    if (localStorage.getItem("theme").includes("dark")) {
        document.querySelector(".article").classList.add("desktop:shadow-glow-article");
    } else {
        document.querySelector(".article").classList.add("desktop:shadow-article");
    }
}

document.addEventListener("htmx:afterRequest", function (e) {
    document.querySelector(".burger").addEventListener("mouseover", function () {
        document.querySelector(".sidebar").classList.remove("shadow-glow-article");
        document.querySelector(".sidebar").classList.remove("shadow-article");
        if (localStorage.getItem("theme").includes("dark")) {
            document.querySelector(".sidebar").classList.add("shadow-glow-article");
        } else {
            document.querySelector(".sidebar").classList.add("shadow-article");
        }
    });

    document.querySelectorAll(".button").forEach(function (button) {
        button.classList.remove("hover:shadow-glow-lg");
        button.classList.remove("hover:shadow-lg");
        if (localStorage.getItem("theme").includes("dark")) {
            button.classList.add("hover:shadow-glow-lg");
        } else {
            button.classList.add("hover:shadow-lg");
        }
    });

    document.querySelectorAll(".photo").forEach(function (button) {
        button.classList.remove("hover:shadow-glow-xl");
        button.classList.remove("hover:shadow-xl");
        if (localStorage.getItem("theme").includes("dark")) {
            button.classList.add("hover:shadow-glow-xl");
        } else {
            button.classList.add("hover:shadow-xl");
        }
    });

    if (document.querySelector(".article") != null) {
        document.querySelector(".article").classList.remove("desktop:shadow-glow-article");
        document.querySelector(".article").classList.remove("desktop:shadow-article");
        if (localStorage.getItem("theme").includes("dark")) {
            document.querySelector(".article").classList.add("desktop:shadow-glow-article");
        } else {
            document.querySelector(".article").classList.add("desktop:shadow-article");
        }
    }

    if (window.scrollY > 0) {
        document.querySelector("header").classList.remove("drop-shadow-glow-md");
        document.querySelector("header").classList.remove("drop-shadow-md");
        if (localStorage.getItem("theme").includes("dark")) {
            document.querySelector("header").classList.add("drop-shadow-glow-md");
        } else {
            document.querySelector("header").classList.add("drop-shadow-md");
        }
    } else {
        document.querySelector("header").classList.remove("drop-shadow-glow-md");
        document.querySelector("header").classList.remove("drop-shadow-md");
    }
})