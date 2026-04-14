document.addEventListener("DOMContentLoaded", () => {

    const path = window.location.pathname;

    const match = path.match(/season-(\d+)/);

    if (!match) {
        document.body.innerHTML = "<h1>Ошибка: не удалось определить сезон</h1>";
        console.error("Year not found in path:", path);
        return;
    }

    const year = match[1];

    const jsonPath = `../../data/GamesData/games-${year}.json`;

    const list = document.getElementById("games-list");
    const title = document.getElementById("title");

    if (!list) {
        console.error("Не найден #games-list");
        return;
    }

    if (title) {
        title.textContent = `СЕЗОН ${year}`;
    }

    fetch(jsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка загрузки JSON: ${response.status}`);
            }
            return response.json();
        })
        .then(games => {
            renderGames(games);
        })
        .catch(error => {
            console.error(error);
            list.innerHTML = "<p>Не удалось загрузить игры</p>";
        });

    function renderGames(games) {

        if (!Array.isArray(games) || games.length === 0) {
            list.innerHTML = "<p>Нет игр для этого сезона</p>";
            return;
        }

        const html = games.map(game => {
            return `
                <div class="game-field">
                    <img src="${game.imageSrc}" alt="${game.altText}" width="200" height="200">

                    <div class="info">
                        <span>Игра: ${game.gameName}</span>
                        <span>Автор: ${game.author}</span>
                    </div>

                    <a href="../../game-page/index.html?game=${encodeURIComponent(game.link)}">
                        START
                    </a>
                </div>
            `;
        }).join("");

        list.innerHTML = html;
    }

});
