const pokemonContainer = document.getElementById("pokemon-container");
const paginationContainer = document.getElementById("pagination");
const itemsPerPageSelect = document.getElementById("itemsPerPageSelect");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

// Función para buscar un Pokémon por nombre
async function searchPokemon() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    // Si el campo de búsqueda está vacío, simplemente muestra la lista de Pokémon paginada
    if (searchTerm === "") {
        currentPage = 1;
        fetchPokemon(currentPage);
        return;
    }

    try {
        // Llamada a la API para obtener los datos del Pokémon por nombre
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
        
        if (!response.ok) {
            alert("Pokémon no encontrado");
            pokemonContainer.innerHTML = ""; // Limpiar el contenedor
            paginationContainer.innerHTML = ""; // Ocultar la paginación
            return;
        }

        const pokemonData = await response.json();
        
        // Limpiar el contenedor y mostrar solo el Pokémon buscado
        pokemonContainer.innerHTML = "";
        displaySinglePokemon(pokemonData); // Muestra el Pokémon encontrado
        paginationContainer.innerHTML = ""; // Oculta la paginación al mostrar solo un resultado
    } catch (error) {
        console.error("Error al buscar el Pokémon:", error);
    }
}

// Función para mostrar un solo Pokémon
function displaySinglePokemon(pokemonData) {
    const pokemonElement = document.createElement("div");
    pokemonElement.className = "pokemon-item col-12 col-md-4 col-lg-3 bg-white rounded shadow-sm text-center m-3 d-flex flex-column align-items-center justify-content-center";
    pokemonElement.style.border = "1px solid #ccc";
    pokemonElement.style.position = "relative";
    pokemonElement.style.height = "300px";

    // Imagen y nombre del Pokémon
    const sprite = document.createElement("img");
    sprite.src = pokemonData.sprites.front_default;
    sprite.alt = pokemonData.name;
    sprite.className = "img-fluid mb-2";
    sprite.style.maxWidth = "100px";

    const name = document.createElement("p");
    name.textContent = pokemonData.name;
    name.className = "text-capitalize font-weight-bold";

    // Añadir imagen y nombre al contenedor
    pokemonElement.appendChild(sprite);
    pokemonElement.appendChild(name);

    // Mostrar los tipos de Pokémon
    const typesContainer = displayTypes(pokemonData.types);
    pokemonElement.appendChild(typesContainer);

    // Mostrar las habilidades de Pokémon
    pokemonData.abilities.forEach((abilityInfo, index) => {
        const abilityText = document.createElement("p");
        abilityText.className = "mb-1 font-weight-bold";

        // Verificar si es una habilidad oculta
        if (abilityInfo.is_hidden) {
            abilityText.textContent = `Habilidad Oculta: ${capitalizeFirstLetter(abilityInfo.ability.name)}`;
        } else {
            abilityText.textContent = `Habilidad ${index + 1}: ${capitalizeFirstLetter(abilityInfo.ability.name)}`;
        }
        
        pokemonElement.appendChild(abilityText);
    });

    pokemonContainer.appendChild(pokemonElement);
}

// Función auxiliar para poner en mayúscula la primera letra de un texto
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Agregar evento al botón de búsqueda
searchButton.addEventListener("click", searchPokemon);

// Función de búsqueda cuando presionan Enter en el campo de búsqueda
searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchPokemon();
    }
});
