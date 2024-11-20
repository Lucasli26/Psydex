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
    const url = `https://pokeapi.co/api/v2/pokemon-species?limit=${itemsPerPage}&offset=${offset}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayPokemonSpecies(data.results);
        displayPagination(data.count);
    } catch (error) {
        console.error("Error al obtener las especies de Pokémon:", error);
    }
}

async function displayPokemonSpecies(speciesList) {
    // Limpiar el contenedor de Pokémon
    pokemonContainer.innerHTML = "";

    for (const species of speciesList) {
        try {
            // Obtén los datos de cada especie
            const speciesResponse = await fetch(species.url);
            const speciesData = await speciesResponse.json();

            // Recorre cada variación en la especie (como formas de Alola, Mega Evoluciones, etc.)
            for (const variety of speciesData.varieties) {
                const varietyResponse = await fetch(variety.pokemon.url);
                const pokemonData = await varietyResponse.json();
                
                // Muestra cada variación como un Pokémon individual
                displaySinglePokemon(pokemonData);
            }
        } catch (error) {
            console.error("Error al obtener los datos de la especie del Pokémon:", error);
        }
    }
}

// Función para mostrar un solo Pokémon (individual o variación)
function displaySinglePokemon(pokemonData) {
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
        const url = `https://pokeapi.co/api/v2/pokemon-species?limit=${itemsPerPage}&offset=${offset}`;
    
        try {
            const response = await fetch(url);
            const data = await response.json();
            displayPokemonSpecies(data.results);
            displayPagination(data.count);
        } catch (error) {
            console.error("Error al obtener las especies de Pokémon:", error);
        }
    }
    
    async function displayPokemonSpecies(speciesList) {
        // Limpiar el contenedor de Pokémon
        pokemonContainer.innerHTML = "";
    
        for (const species of speciesList) {
            try {
                // Obtén los datos de cada especie
                const speciesResponse = await fetch(species.url);
                const speciesData = await speciesResponse.json();
    
                // Recorre cada variación en la especie (como formas de Alola, Mega Evoluciones, etc.)
                for (const variety of speciesData.varieties) {
                    const varietyName = variety.pokemon.name.toLowerCase();
    
                    // Filtrar solo las formas que contienen "mega", "alola", "galar", "paldea" o "hisui"
                    if (varietyName.includes("mega") || varietyName.includes("alola") ||
                        varietyName.includes("galar") || varietyName.includes("paldea") || 
                        varietyName.includes("hisui") || variety.is_default) { // Incluye la forma normal (is_default)
                        
                        const varietyResponse = await fetch(variety.pokemon.url);
                        const pokemonData = await varietyResponse.json();
    
                        // Muestra cada variación filtrada como un Pokémon individual
                        displaySinglePokemon(pokemonData);
                    }
                }
            } catch (error) {
                console.error("Error al obtener los datos de la especie del Pokémon:", error);
            }
        }
    }
    
    // Función para mostrar un solo Pokémon (individual o variación)
    function displaySinglePokemon(pokemonData) {
        const pokemonElement = document.createElement("div");
        pokemonElement.className = "pokemon-item col-12 col-md-4 col-lg-3 bg-white rounded shadow-sm text-center m-3 d-flex align-items-center justify-content-center";
        pokemonElement.style.border = "1px solid #ccc";
        pokemonElement.style.position = "relative";
        pokemonElement.style.height = "200px"; // Altura fija opcional para centrar verticalmente
    
        // Mostrar número de Pokédex en la esquina superior izquierda
        const pokedexNumber = document.createElement("span");
        pokedexNumber.textContent = `#${pokemonData.id}`;
        pokedexNumber.className = "badge bg-dark text-white position-absolute";
        pokedexNumber.style.top = "10px";
        pokedexNumber.style.left = "10px";
        pokemonElement.appendChild(pokedexNumber);
    
        // Imagen del Pokémon
        const sprite = document.createElement("img");
        sprite.src = pokemonData.sprites.front_default;
        sprite.alt = pokemonData.name;
        sprite.className = "img-fluid mb-2";
        sprite.style.maxWidth = "100px";
    
        // Nombre del Pokémon
        const name = document.createElement("p");
        name.textContent = capitalizeFirstLetter(pokemonData.name);
        name.className = "text-capitalize font-weight-bold";
    
        // Añadir imagen y nombre al contenedor
        pokemonElement.appendChild(sprite);
        pokemonElement.appendChild(name);
    
        // Mostrar los tipos de Pokémon
        const typesContainer = displayTypes(pokemonData.types);
        pokemonElement.appendChild(typesContainer);
    
        // Mostrar las habilidades del Pokémon
        pokemonData.abilities.forEach((abilityInfo, index) => {
            const abilityText = document.createElement("p");
            abilityText.className = "mb-1 font-weight-bold";
            const abilityName = capitalizeFirstLetter(abilityInfo.ability.name);
    
            // Verificar si es una habilidad oculta
            if (abilityInfo.is_hidden) {
                abilityText.textContent = `Habilidad Oculta: ${abilityName}`;
            } else {
                abilityText.textContent = `Habilidad ${index + 1}: ${abilityName}`;
            }
            
            pokemonElement.appendChild(abilityText);
        });
    
        pokemonContainer.appendChild(pokemonElement);
    }
    
    // Función auxiliar para poner en mayúscula la primera letra de una cadena de texto
    function capitalizeFirstLetter(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
    
    // Nueva función para mostrar los tipos de un Pokémon
    function displayTypes(types) {
        const typesContainer = document.createElement("div");
        typesContainer.className = "d-flex justify-content-center mt-2";
    
        types.forEach(typeInfo => {
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
    
    // Llama a fetchPokemon una vez al cargar la página
    fetchPokemon(currentPage);
    
}

// Función auxiliar para poner en mayúscula la primera letra de una cadena de texto
function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// Nueva función para mostrar los tipos de un Pokémon
function displayTypes(types) {
    const typesContainer = document.createElement("div");
    typesContainer.className = "d-flex justify-content-center mt-2";

    types.forEach(typeInfo => {
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

// Llama a fetchPokemon una vez al cargar la página
fetchPokemon(currentPage);
