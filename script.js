let itemsPerPage = 9;
let currentPage = 1;
let allPokemon = []; // Lista de todos los Pokémon para autocompletado

const pokemonContainer = document.getElementById("pokemon-container");
const paginationContainer = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const clearSearchButton = document.getElementById("clearSearchButton");
const autocompleteContainer = document.getElementById("autocomplete-container"); // Contenedor para las sugerencias

// Función para limpiar el contenedor de Pokémon
function clearContainer(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

// Obtener todos los Pokémon para autocompletado
async function fetchAllPokemon() {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0`; // Obtiene todos los Pokémon
    try {
        const response = await fetch(url);
        const data = await response.json();
        allPokemon = data.results; // Guardar la lista completa
    } catch (error) {
        console.error("Error al obtener la lista completa de Pokémon:", error);
    }
}

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

async function fetchPokemonByNameOrId(searchTerm) {
    const url = `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Pokémon no encontrado");
        }
        const pokemonData = await response.json();
        displayPokemon([pokemonData]);
        paginationContainer.innerHTML = "";
    } catch (error) {
        console.error("Error al buscar Pokémon:", error);
        pokemonContainer.innerHTML = `<p class="text-center text-danger">No se encontró el Pokémon "${searchTerm}". Por favor, intente con otro nombre o ID.</p>`;
        paginationContainer.innerHTML = "";
    }
}

async function displayPokemon(pokemonList) {
    clearContainer(pokemonContainer);

    for (const pokemon of pokemonList) {
        try {
            const response = pokemon.url ? await fetch(pokemon.url) : { json: () => pokemon };
            const pokemonData = await response.json();

            const pokemonElement = document.createElement("div");
            pokemonElement.className = "pokemon-item col-12 col-md-4 col-lg-3 bg-white rounded shadow-sm text-center m-3 d-flex align-items-center justify-content-center";
            pokemonElement.style.border = "1px solid #ccc";
            pokemonElement.style.position = "relative";
            pokemonElement.style.height = "250px";

            const pokedexNumber = document.createElement("span");
            pokedexNumber.textContent = `#${pokemonData.id}`;
            pokedexNumber.className = "badge bg-dark text-white position-absolute";
            pokedexNumber.style.top = "10px";
            pokedexNumber.style.left = "10px";
            pokemonElement.appendChild(pokedexNumber);

            const leftColumn = document.createElement("div");
            leftColumn.className = "col-6 text-center";

            const sprite = document.createElement("img");
            sprite.src = pokemonData.sprites.front_default;
            sprite.alt = pokemonData.name;
            sprite.className = "img-fluid mb-2";
            sprite.style.maxWidth = "100px";

            const name = document.createElement("p");
            name.textContent = pokemonData.name;
            name.className = "text-capitalize font-weight-bold";

            leftColumn.appendChild(sprite);
            leftColumn.appendChild(name);

            const rightColumn = document.createElement("div");
            rightColumn.className = "col-6 text-start mr-3";

            const abilitiesTitle = document.createElement("p");
            abilitiesTitle.textContent = "Abilities:";
            abilitiesTitle.className = "mb-1 font-weight-bold";
            rightColumn.appendChild(abilitiesTitle);

            pokemonData.abilities.forEach((abilityInfo) => {
                const abilityText = document.createElement("p");
                abilityText.className = "mb-1 font-weight-bold";
                const abilityName = capitalizeFirstLetter(abilityInfo.ability.name);
                abilityText.textContent = `${abilityName}`;
                rightColumn.appendChild(abilityText);
            });

            const typesContainer = displayTypes(pokemonData.types);
            rightColumn.appendChild(typesContainer);

            pokemonElement.appendChild(leftColumn);
            pokemonElement.appendChild(rightColumn);
            pokemonContainer.appendChild(pokemonElement);

        } catch (error) {
            console.error("Error al obtener el sprite del Pokémon:", error);
        }
    }
}

function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function displayTypes(types) {
    const typesContainer = document.createElement("div");
    typesContainer.className = "d-flex justify-content-center mt-2";

    types.forEach((typeInfo) => {
        const typeName = typeInfo.type.name;
        const typeImage = document.createElement("img");
        typeImage.src = `./img/${typeName}.png`;
        typeImage.alt = typeName;
        typeImage.className = "type-icon mb-1";
        typeImage.style.maxWidth = "75px";
        typesContainer.appendChild(typeImage);
    });

    return typesContainer;
}

function displayPagination(totalItems) {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startPage = Math.max(1, currentPage - 3);
    const endPage = Math.min(totalPages, currentPage + 3);

    if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "<<";
        prevButton.className = "pagination-button btn btn-dark mx-1";
        prevButton.addEventListener("click", () => {
            currentPage--;
            fetchPokemon(currentPage);
        });
        paginationContainer.appendChild(prevButton);
    }

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = "pagination-button btn btn-dark mx-1 mb-4";
        if (i === currentPage) button.classList.add("active", "btn-warning");
        button.addEventListener("click", () => {
            currentPage = i;
            fetchPokemon(currentPage);
        });
        paginationContainer.appendChild(button);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.textContent = ">>";
        nextButton.className = "pagination-button btn btn-dark mx-1";
        nextButton.addEventListener("click", () => {
            currentPage++;
            fetchPokemon(currentPage);
        });
        paginationContainer.appendChild(nextButton);
    }
}

// Autocompletado
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    clearContainer(autocompleteContainer);

    if (searchTerm.length === 0) {
        return;
    }

    const suggestions = allPokemon.filter(pokemon => pokemon.name.startsWith(searchTerm));
    suggestions.slice(0, 5).forEach((pokemon) => {
        const suggestionItem = document.createElement("div");
        suggestionItem.textContent = pokemon.name;
        suggestionItem.className = "autocomplete-item p-2 bg-light border";
        suggestionItem.addEventListener("click", () => {
            searchInput.value = pokemon.name;
            fetchPokemonByNameOrId(pokemon.name);
            clearContainer(autocompleteContainer);
        });
        autocompleteContainer.appendChild(suggestionItem);
    });
});

searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        fetchPokemonByNameOrId(searchTerm);
        clearContainer(autocompleteContainer);
    }
});

clearSearchButton.addEventListener("click", () => {
    searchInput.value = "";
    currentPage = 1;
    fetchPokemon(currentPage);
    clearContainer(autocompleteContainer);
});

// Inicializa la lista completa de Pokémon y la paginación
fetchAllPokemon();
fetchPokemon(currentPage);
