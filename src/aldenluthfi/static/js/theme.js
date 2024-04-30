const dark = document.querySelector(".moon")
const light = document.querySelector(".sun")
const modeToggle = document.querySelector(".mode-toggle")
const hue = document.querySelector(".hue-selector")

var iosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream && "matchMedia" in window
var modeToggleClicked = 0

let theme = localStorage.getItem("theme")

if (theme != null) {
    document.documentElement.classList.add(theme);
    if (theme.includes("-dark")) {
        dark.classList.add("hidden")
        light.classList.remove("hidden")
        document.querySelector(".neutral-icon").classList.add("fill-neutral-600")
        document.querySelector(".neutral-icon").classList.remove("fill-neutral-500")
    } else {
        dark.classList.remove("hidden")
        light.classList.add("hidden")
        document.querySelector(".neutral-icon").classList.remove("fill-neutral-600")
        document.querySelector(".neutral-icon").classList.add("fill-neutral-500")
    }
} else {
    document.documentElement.classList.add("neutral")
    localStorage.setItem("theme", "neutral")
    dark.classList.remove("hidden")
    light.classList.add("hidden")
}

document.documentElement.addEventListener(
    "click",
    function (e) {
        if (document.activeElement != document.querySelector(".mode-toggle") && document.activeElement != document.querySelector(".hue-selector")) {
            document.activeElement.blur()
            modeToggleClicked = 0
        }
    }
)

document.documentElement.addEventListener(
    "mouseover",
    function (e) {
        if (document.documentElement.clientWidth >= 1024) {
            document.activeElement.blur()
        }
    }
)

function themeSetter() {
    const dark = document.querySelector(".moon")
    const light = document.querySelector(".sun")
    const modeToggle = document.querySelector(".mode-toggle")

    let theme = localStorage.getItem("theme")

    if (theme != null) {
        document.documentElement.classList.add(theme);
        if (theme.includes("-dark")) {
            dark.classList.add("hidden")
            light.classList.remove("hidden")
            document.querySelector(".neutral-icon").classList.add("fill-neutral-600")
            document.querySelector(".neutral-icon").classList.remove("fill-neutral-500")
        } else {
            dark.classList.remove("hidden")
            light.classList.add("hidden")
            document.querySelector(".neutral-icon").classList.remove("fill-neutral-600")
            document.querySelector(".neutral-icon").classList.add("fill-neutral-500")
        }
    } else {
        document.documentElement.classList.add("neutral")
        localStorage.setItem("theme", "neutral")
        dark.classList.remove("hidden")
        light.classList.add("hidden")
    }

    modeToggle.addEventListener(
        "mousedown",
        function (e) {
            if (document.documentElement.clientWidth >= 1024 || modeToggleClicked == 1) {
                current = document.documentElement.classList[document.documentElement.classList.length - 1]
                if (current.includes("-dark")) {
                    hueClass = current.replace("-dark", "")
                    dark.classList.remove("hidden")
                    light.classList.add("hidden")
                    document.querySelector(".neutral-icon").classList.remove("fill-neutral-600")
                    document.querySelector(".neutral-icon").classList.add("fill-neutral-500")
                } else {
                    hueClass = current + "-dark"
                    dark.classList.add("hidden")
                    light.classList.remove("hidden")
                    document.querySelector(".neutral-icon").classList.add("fill-neutral-600")
                    document.querySelector(".neutral-icon").classList.remove("fill-neutral-500")
                }
                document.documentElement.classList.remove(current)
                document.documentElement.classList.add(hueClass)
                localStorage.setItem("theme", hueClass)

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

            } else if (!iosDevice) {
                modeToggleClicked = 1
            }
        }
    )

    modeToggle.addEventListener(
        "mouseleave",
        function (e) {
            if (document.documentElement.clientWidth < 1024 && iosDevice) {
                modeToggleClicked = 0
            }
        }
    )

    modeToggle.addEventListener(
        "mouseover",
        function (e) {
            if (document.documentElement.clientWidth < 1024 && iosDevice) {
                modeToggleClicked = 1
            }
        }
    )

    const hues = ["neutral", "rose", "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"]

    hues.forEach(hue => {
        let hueButton = document.querySelector(`.hue-${hue}`)
        hueButton.addEventListener(
            "mousedown",
            function (e) {
                hueClass = `${hue}`
                current = document.documentElement.classList[document.documentElement.classList.length - 1]
                if (current.includes("-dark")) {
                    hueClass = `${hue}-dark`
                    if (!current.includes("neutral")) {
                        document.querySelector(".neutral-icon").classList.add("fill-neutral-600")
                        document.querySelector(".neutral-icon").classList.remove("fill-neutral-500")
                    }
                } else {
                    if (!current.includes("neutral")) {
                        document.querySelector(".neutral-icon").classList.remove("fill-neutral-600")
                        document.querySelector(".neutral-icon").classList.add("fill-neutral-500")
                    }
                }
                document.documentElement.classList.remove(current)
                document.documentElement.classList.add(hueClass)
                localStorage.setItem("theme", hueClass);
                modeToggleClicked = 1
            }
        )
    })
}

themeSetter()

document.addEventListener("htmx:afterRequest", function (e) { themeSetter() })

document.documentElement.addEventListener('dragstart', event => {
    event.preventDefault();
});

document.documentElement.addEventListener('drop', event => {
    event.preventDefault();
});