function squiggles() {

    var squiggles = document.querySelectorAll(".squiggle");

    for (const squiggle of squiggles) {
        squiggle.addEventListener("mouseover", function (e) {
            console.log("mouseover");
            cursor = document.querySelector(".cursor");

            document.querySelector(".cursor").classList.remove("border-accent");
            document.querySelector(".cursor").classList.add("border-background");

            if (cursor.classList.contains("bg-accent")) {
                document.querySelector(".cursor").classList.remove("bg-accent");
                document.querySelector(".cursor").classList.add("bg-background");
            }
        });
        squiggle.addEventListener("mouseleave", function (e) {
            cursor = document.querySelector(".cursor");

            document.querySelector(".cursor").classList.add("border-accent");
            document.querySelector(".cursor").classList.remove("border-background");

            if (cursor.classList.contains("bg-accent")) {
                document.querySelector(".cursor").classList.add("bg-accent");
                document.querySelector(".cursor").classList.remove("bg-background");
            }
        });
        if (squiggle.clientWidth <= 768) {
            squiggle.setAttribute("viewBox", "0 0 1800 975");
        }

        else if (squiggle.clientWidth <= 1024) {
            squiggle.setAttribute("viewBox", "0 0 3000 975");
        }

        else {
            squiggle.setAttribute("viewBox", "0 0 4200 975");
        }
    }
}
window.addEventListener("resize", function (e) {
    var squiggles = document.querySelectorAll(".squiggle");

    for (const squiggle of squiggles) {
        if (squiggle.clientWidth <= 768) {
            squiggle.setAttribute("viewBox", "0 0 1800 975");
        }

        else if (squiggle.clientWidth <= 1024) {
            squiggle.setAttribute("viewBox", "0 0 3000 975");
        }

        else {
            squiggle.setAttribute("viewBox", "0 0 4200 975");
        }
    }
});

squiggles()
document.addEventListener("htmx:afterRequest", function (e) { squiggles() })