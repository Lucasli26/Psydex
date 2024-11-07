let itemsPerPage = 10;
let currentPage = 1;

const pokemonContainer = document.getElementById("pokemon-container");
const paginationContainer = document.getElementById("pagination");
const itemsPerPageSelect = document.getElementById("itemsPerPageSelect");

itemsPerPageSelect.addEventListener("change", (event) => {
    itemsPerPage = parseInt(event.target.value);
    currentPage = 1;
    fetchPokemon(currentPage);
});

async function fetchPokemon(page) {
    const offset = (page - 1) * itemsPerPage;
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage}&offset=${offset}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayPokemon(data.results);
        displayPagination(data.count);
    } catch (error) {
        console.error("Error al obtener los Pokémon:", error);
    }
}

async function displayPokemon(pokemonList) {
    pokemonContainer.innerHTML = ""; 

    for (const pokemon of pokemonList) {
        try {
            const response = await fetch(pokemon.url);
            const pokemonData = await response.json();

            const pokemonElement = document.createElement("div");
            pokemonElement.className = "pokemon-item";

            const sprite = document.createElement("img");
            sprite.src = pokemonData.sprites.front_default;
            sprite.alt = pokemon.name;
            sprite.style.width = "100px";
            
            const name = document.createElement("p");
            name.textContent = pokemon.name;

            pokemonElement.appendChild(sprite);
            pokemonElement.appendChild(name);
            pokemonContainer.appendChild(pokemonElement);
        } catch (error) {
            console.error("Error al obtener el sprite del Pokémon:", error);
        }
    }
}

function displayPagination(totalItems) {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startPage = Math.max(1, currentPage - 3);
    const endPage = Math.min(totalPages, currentPage + 3);

    if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "<<";
        prevButton.className = "pagination-button";
        prevButton.addEventListener("click", () => {
            currentPage--;
            fetchPokemon(currentPage);
        });
        paginationContainer.appendChild(prevButton);
    }

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = "pagination-button";
        if (i === currentPage) button.classList.add("active");
        button.addEventListener("click", () => {
            currentPage = i;
            fetchPokemon(currentPage);
        });
        paginationContainer.appendChild(button);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.textContent = ">>";
        nextButton.className = "pagination-button";
        nextButton.addEventListener("click", () => {
            currentPage++;
            fetchPokemon(currentPage);
        });
        paginationContainer.appendChild(nextButton);
    }
}

fetchPokemon(currentPage);
