const BASE_URL = 'https://www.freetogame.com/api/games';
const GAME_DETAILS_URL = 'https://www.freetogame.com/api/game?id=';
const CORS_PROXY = "https://api.cors.lol/?url=";

function searchGames() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!query) return alert("Digite o nome do jogo!");

    const url = `${CORS_PROXY}${BASE_URL}`;

    fetch(url)
        .then(async (response) => {
            const text = await response.text();
            console.log("Resposta bruta da API:", text);
            try {
                const data = JSON.parse(text); 
                return data;
            } catch (err) {
                throw new Error("Resposta não é JSON válido. Verifique o proxy ou a URL.");
            }
        })
        .then(results => {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';

            const filtered = results.filter(game =>
                game.title.toLowerCase().includes(query)
            );

            if (filtered.length === 0) {
                resultsDiv.innerHTML = '<p>Nenhum jogo encontrado.</p>';
                return;
            }

            filtered.forEach((game, index) => {
                const gameHTML = `
                    <div class="game" onclick="getGameDetails(${game.id})" style="cursor: pointer; border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
                        <strong>${index + 1}. ${game.title}</strong><br>
                        Plataforma: ${game.platform}<br>
                        Lançamento: ${game.release_date || 'Desconhecido'}<br>
                        Gênero: ${game.genre}
                    </div>
                `;
                resultsDiv.innerHTML += gameHTML;
            });
        })
        .catch(error => {
            console.error("Erro na busca:", error);
            alert("Erro ao buscar jogos. Verifique o console para detalhes.");
        });
}

async function getGameDetails(id) {
    try {
        const url = `${CORS_PROXY}${GAME_DETAILS_URL}${id}`;
        const response = await fetch(url);
        const text = await response.text();
        console.log("Detalhes do jogo (bruto):", text); 

        let game;
        try {
            game = JSON.parse(text);
        } catch (e) {
            throw new Error("Detalhes do jogo não estão em JSON válido.");
        }

        const detailsHTML = `
            <div class="game-details" style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 8px;">
                <h3> ${game.title}</h3>
                <img src="${game.thumbnail}" alt="Capa do jogo" style="max-width: 200px;"><br><br>
                <p><strong>Plataforma:</strong> ${game.platform}</p>
                <p><strong>Lançamento:</strong> ${game.release_date}</p>
                <p><strong>Gênero:</strong> ${game.genre}</p>
                <p><strong>Descrição:</strong> ${game.short_description}</p>
                <p><strong>Sobre:</strong> ${game.description}</p>
                <p><strong>Link:</strong> <a href="${game.game_url}" target="_blank">Ir para o jogo</a></p>
            </div>
        `;

        document.getElementById('results').innerHTML += detailsHTML;
    } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
        alert("Erro ao carregar detalhes do jogo. Veja o console.");
    }
}
