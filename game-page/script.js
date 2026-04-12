document.addEventListener("DOMContentLoaded", () => {
    const iframe = document.querySelector("iframe");
    const overlay = document.querySelector(".fade-overlay");

    if (!iframe || !overlay)
        return;

    iframe.onload = () => {
        overlay.classList.add("active");

        iframe.classList.add("loaded");
    };
});