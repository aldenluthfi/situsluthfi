function contacts() {
    const button = document.querySelector(".contact-button");

    button.addEventListener("click", (e) => {
        navigator.clipboard.writeText(document.querySelector(".email").innerHTML).then(() => {
            const originalText = document.querySelector(".original-text-contact");
            const popUpText = document.querySelector(".pop-up-text-contact");

            originalText.classList.add("hidden");
            popUpText.classList.remove("hidden");

            setTimeout(() => {
                originalText.classList.remove("hidden");
                popUpText.classList.add("hidden");
            }, 1000)
        })
    })
}

contacts()

document.addEventListener("htmx:afterRequest", function (e) { contacts() })