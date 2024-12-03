// Variables para los filtros
const filterOrder = document.getElementById("filterOrder");
const filterType = document.getElementById("filterType");
const applyFiltersButton = document.getElementById("applyFilters");

// Lista completa de Pokémon y tipos
let filteredPokemonList = []; // Cambié el nombre de allPokemon
let availableTypes = []; // Cambié el nombre de allTypes

// Función para inicializar la lista de Pokémon y los tipos
async function initializeFilters() {
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0`;
    const typesUrl = `https://pokeapi.co/api/v2/type`;

    try {
        const [pokemonResponse, typesResponse] = await Promise.all([
            fetch(pokemonUrl),
            fetch(typesUrl),
        ]);

        const pokemonData = await pokemonResponse.json();
        const typesData = await typesResponse.json();

        filteredPokemonList = pokemonData.results; // Guardar la lista completa
        availableTypes = typesData.results; // Guardar los tipos

        populateTypeFilter(availableTypes);
    } catch (error) {
        console.error("Error al inicializar los filtros:", error);
    }
}


// Función para llenar el filtro de tipos en el HTML
function populateTypeFilter(types) {
    types.forEach((type) => {
        const option = document.createElement("option");
        option.value = type.name;
        option.textContent = capitalizeFirstLetter(type.name);
        filterType.appendChild(option);
    });
}

async function applyFilters() {
    const order = filterOrder.value;
    const selectedType = filterType.value;

    let filteredPokemon = [...allPokemon]; // Usar la lista completa de Pokémon

    // Filtrar por tipo (si no es "all")
    if (selectedType !== "all") {
        filteredPokemon = await filterByType(filteredPokemon, selectedType);
    }

    // Ordenar por número o nombre
    if (order === "number") {
        filteredPokemon.sort((a, b) => {
            const idA = extractIdFromUrl(a.url);
            const idB = extractIdFromUrl(b.url);
            return idA - idB;
        });
    } else if (order === "name") {
        filteredPokemon.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Actualizar la paginación para los Pokémon filtrados
    displayPagination(filteredPokemon.length);
    displayPokemonPage(filteredPokemon, currentPage);
}

// Función para mostrar los Pokémon en la página actual
function displayPokemonPage(filteredPokemon, page) {
    // Calcula el inicio y fin de los Pokémon a mostrar
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(page * itemsPerPage, filteredPokemon.length);

    // Muestra solo los Pokémon de la página actual
    const currentPokemonPage = filteredPokemon.slice(startIndex, endIndex);
    displayPokemon(currentPokemonPage);
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
            applyFilters(); // Refrescar los filtros
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
            applyFilters(); // Refrescar los filtros
        });
        paginationContainer.appendChild(button);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.textContent = ">>";
        nextButton.className = "pagination-button btn btn-dark mx-1";
        nextButton.addEventListener("click", () => {
            currentPage++;
            applyFilters(); // Refrescar los filtros
        });
        paginationContainer.appendChild(nextButton);
    }
}



// Función para filtrar por tipo
async function filterByType(pokemonList, selectedType) {
    // Cargar datos detallados solo una vez para todos los Pokémon de la lista
    const detailedPokemonList = await Promise.all(
        pokemonList.map(async (pokemon) => {
            try {
                const response = await fetch(pokemon.url);
                return await response.json();
            } catch (error) {
                console.error(`Error al cargar detalles de ${pokemon.name}:`, error);
                return null; // Si falla, devolver null para filtrar después
            }
        })
    );

    // Filtrar solo aquellos Pokémon que tengan el tipo seleccionado
    const filtered = detailedPokemonList.filter((pokemonData) => {
        if (!pokemonData) return false; // Ignorar entradas nulas
        return pokemonData.types.some((t) => t.type.name === selectedType);
    });

    return filtered.map((pokemonData) => ({
        name: pokemonData.name,
        url: `https://pokeapi.co/api/v2/pokemon/${pokemonData.id}/`, // Reconstruir la URL básica
    }));
}


// Función para extraer el ID del Pokémon desde su URL
function extractIdFromUrl(url) {
    const segments = url.split("/");
    return parseInt(segments[segments.length - 2], 10);
}

// Función para capitalizar la primera letra de un texto
function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// Vincular la función al botón "Aplicar filtros"
applyFiltersButton.addEventListener("click", applyFilters);

// Inicializar los filtros al cargar el script
initializeFilters();
