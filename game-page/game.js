document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const game = params.get("game");

    const iframe = document.getElementById("game-frame");
    const overlay = document.querySelector(".fade-overlay");

    if (!game) {
        document.body.innerHTML = "<h1>Игра не найдена</h1>";
        return;
    }

    iframe.src = game;

    iframe.onload = () => {
        overlay.classList.add("active");
        iframe.classList.add("loaded");
    };

});