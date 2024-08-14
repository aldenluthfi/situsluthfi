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