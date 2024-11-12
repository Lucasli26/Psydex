let itemsPerPage = 9;
let currentPage = 1;

const pokemonContainer = document.getElementById("pokemon-container");
const paginationContainer = document.getElementById("pagination");
const itemsPerPageSelect = document.getElementById("itemsPerPageSelect");

// Función para limpiar el contenedor de Pokémon de forma más estricta
function clearContainer(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
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

async function displayPokemon(pokemonList) {
    // Limpiar el contenedor de Pokémon
    pokemonContainer.innerHTML = "";

    for (const pokemon of pokemonList) {
        try {
            const response = await fetch(pokemon.url);
            const pokemonData = await response.json();

            // Crear el contenedor principal de la carta
            const pokemonElement = document.createElement("div");
            pokemonElement.className = "pokemon-item col-12 col-md-4 col-lg-3 bg-white rounded shadow-sm text-center m-3 d-flex align-items-center justify-content-center";
            pokemonElement.style.border = "1px solid #ccc";
            pokemonElement.style.position = "relative";
            pokemonElement.style.height = "200px"; // Altura fija opcional para centrar verticalmente
            // pokemonElement.style.width = "250px";

            // Mostrar número de Pokédex en la esquina superior izquierda
            const pokedexNumber = document.createElement("span");
            pokedexNumber.textContent = `#${pokemonData.id}`;
            pokedexNumber.className = "badge bg-dark text-white position-absolute";
            pokedexNumber.style.top = "10px";
            pokedexNumber.style.left = "10px";
            pokemonElement.appendChild(pokedexNumber);

            // Crear contenedor para la parte izquierda (imagen y nombre)
            const leftColumn = document.createElement("div");
            leftColumn.className = "col-6 text-center";

            // Imagen del Pokémon
            const sprite = document.createElement("img");
            sprite.src = pokemonData.sprites.front_default;
            sprite.alt = pokemon.name;
            sprite.className = "img-fluid mb-2";
            sprite.style.maxWidth = "100px";

            // Nombre del Pokémon
            const name = document.createElement("p");
            name.textContent = pokemon.name;
            name.className = "text-capitalize font-weight-bold";

            leftColumn.appendChild(sprite);
            leftColumn.appendChild(name);

            // Crear contenedor para la parte derecha (tipos y habilidades)
            const rightColumn = document.createElement("div");
            rightColumn.className = "col-6 text-start mr-3";
            
            // Título de habilidades
            const abilitiesTitle = document.createElement("p");
            abilitiesTitle.textContent = "Abilities:";
            abilitiesTitle.className = "mb-1 font-weight-bold";
            rightColumn.appendChild(abilitiesTitle);

            // Listar habilidades con primera letra en mayúscula
            pokemonData.abilities.forEach((abilityInfo, index) => {
                const abilityText = document.createElement("p");
                abilityText.className = "mb-1 font-weight-bold";

                // Transformar el nombre de la habilidad para que la primera letra esté en mayúscula
                const abilityName = capitalizeFirstLetter(abilityInfo.ability.name);

                // Verificar si es una habilidad oculta
                if (abilityInfo.is_hidden) {
                    abilityText.textContent = `${abilityName}`;
                } else {
                    abilityText.textContent = `${abilityName}`;
                }

                rightColumn.appendChild(abilityText);
            });
            
            // Añadir tipos usando la función displayTypes
            const typesContainer = displayTypes(pokemonData.types); // Obtiene el contenedor de tipos
            rightColumn.appendChild(typesContainer);

            // Añadir ambas columnas a la carta del Pokémon
            pokemonElement.appendChild(leftColumn);
            pokemonElement.appendChild(rightColumn);
            pokemonContainer.appendChild(pokemonElement);

        } catch (error) {
            console.error("Error al obtener el sprite del Pokémon:", error);
        }
    }
}

// Función para capitalizar la primera letra de una cadena de texto
function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// Nueva función para mostrar los tipos de un Pokémon
function displayTypes(types) {
    // Crear un contenedor para las imágenes de tipo
    const typesContainer = document.createElement("div");
    typesContainer.className = "d-flex justify-content-center mt-2";

    // Recorrer cada tipo y añadir la imagen correspondiente
    types.forEach(typeInfo => {
        const typeName = typeInfo.type.name; // Obtener el nombre del tipo
        const typeImage = document.createElement("img");
        typeImage.src = `./img/${typeName}.png`; // Ruta de la imagen del tipo
        typeImage.alt = typeName;
        typeImage.className = "type-icon mb-1"; // Estilo Bootstrap para margen
        typeImage.style.maxWidth = "75px"; // Tamaño de la imagen del tipo

        // Añadir la imagen del tipo al contenedor
        typesContainer.appendChild(typeImage);
    });

    return typesContainer; // Devolver el contenedor de tipos
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

// Llama a fetchPokemon una vez
fetchPokemon(currentPage);