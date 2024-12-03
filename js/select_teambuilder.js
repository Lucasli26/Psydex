document.addEventListener("DOMContentLoaded", () => {
    const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
    let pokemonNameInput = null; 
    let abilityInput = null;
    let suggestionsContainer = null; 
    let abilityContainer = null;
    let movesContainer = null;
    let moveInputs = [];
    let pokemonMoves = []; // Array para almacenar los movimientos del Pokémon seleccionado

    // Inicializar elementos dinámicos
    function initializeDynamicElements() {
        pokemonNameInput = document.getElementById("pokemon-name-input");
        abilityInput = document.getElementById("pokemon-ability-input");
        suggestionsContainer = document.getElementById("suggestions-container");
        abilityContainer = document.getElementById("ability-container");
        movesContainer = document.getElementById("moves-container");
        // objectInput = document.getElementById("pokemon-object-input");
        // objectContainer = document.getElementById("item-suggestions-container");

        // Buscar todos los inputs de movimientos dinámicos
        moveInputs = Array.from(document.querySelectorAll(".move-input"));

        if (pokemonNameInput && suggestionsContainer) {
            pokemonNameInput.addEventListener("input", handleInputEvent);
        } else {
            console.warn("El input de búsqueda o el contenedor de sugerencias no se encontraron.");
        }

        if (abilityInput && abilityContainer) {
            abilityInput.addEventListener("focus", handleAbilityFocus);
        } else {
            console.warn("El input de habilidades o el contenedor de habilidades no se encontraron.");
        }

        if (moveInputs.length && movesContainer) {
            moveInputs.forEach(input => {
                input.addEventListener("input", handleMoveInputEvent); // Cambio aquí para detectar el 'input' de movimientos
                input.addEventListener("focus", handleMoveFocus);
            });
        } else {
            console.warn("Los inputs de movimientos o el contenedor de movimientos no se encontraron.");
        }
    }

    // Manejar el evento `input` en el campo de nombre del Pokémon
    function handleInputEvent() {
        const query = pokemonNameInput.value.trim().toLowerCase();
        if (query.length >= 2) {
            searchPokemon(query);
        } else {
            suggestionsContainer.innerHTML = "";
        }
    }

    // Manejar el evento `focus` en el campo de habilidades
    function handleAbilityFocus() {
        const pokemonName = pokemonNameInput.value.trim().toLowerCase();
        if (pokemonName) {
            fetchPokemonAbilities(pokemonName);
        } else {
            abilityContainer.innerHTML = "<li>Por favor, selecciona un Pokémon primero.</li>";
        }
    }

    // Manejar el evento `input` para los inputs de movimientos (autocompletar)
    function handleMoveInputEvent(event) {
        const query = event.target.value.trim().toLowerCase();
        if (query.length >= 2 && pokemonMoves.length > 0) {
            // Filtramos los movimientos que el Pokémon puede aprender
            const filteredMoves = pokemonMoves.filter(move => move.includes(query));
            displayMoveSuggestions(filteredMoves, event.target);
        } else {
            movesContainer.innerHTML = "";
        }
    }

    // Manejar el evento `focus` en los inputs de movimientos
    function handleMoveFocus(event) {
        const moveInput = event.target;
        const pokemonName = pokemonNameInput.value.trim().toLowerCase();
        if (pokemonName) {
            fetchPokemonMoves(pokemonName)
                .then(() => {
                    displayMoveSuggestions(pokemonMoves, moveInput);
                })
                .catch(error => {
                    console.error("Error al obtener los movimientos del Pokémon:", error);
                    movesContainer.innerHTML = "<li>Error al cargar movimientos</li>";
                });
        } else {
            movesContainer.innerHTML = "<li>Por favor, selecciona un Pokémon primero.</li>";
        }
    }

    // Buscar Pokémon en la API
    function searchPokemon(query) {
        fetch(`${POKEAPI_BASE_URL}?limit=2000`)
            .then(response => response.json())
            .then(data => {
                const matchingPokemons = data.results.filter(pokemon => pokemon.name.includes(query));
                displaySuggestions(matchingPokemons);
            })
            .catch(error => {
                console.error("Error al obtener los Pokémon:", error);
                suggestionsContainer.innerHTML = "<li>Error al cargar sugerencias</li>";
            });
    }

    // Mostrar sugerencias de Pokémon
    function displaySuggestions(pokemonList) {
        suggestionsContainer.innerHTML = "";
        if (pokemonList.length === 0) {
            suggestionsContainer.innerHTML = "<li>No se encontraron Pokémon</li>";
            return;
        }
        pokemonList.forEach(pokemon => {
            const suggestionItem = document.createElement("li");
            suggestionItem.textContent = pokemon.name;
            suggestionItem.classList.add("list-group-item", "suggestion-item", "text-dark", "mb-2");
            suggestionItem.addEventListener("click", function () {
                pokemonNameInput.value = pokemon.name;
                suggestionsContainer.innerHTML = "";
                fetchPokemonDetails(pokemon.name);
            });
            suggestionsContainer.appendChild(suggestionItem);
        });
    }

    // Obtener habilidades de un Pokémon
    function fetchPokemonAbilities(pokemonName) {
        fetch(`${POKEAPI_BASE_URL}${pokemonName}`)
            .then(response => response.json())
            .then(data => {
                const abilities = data.abilities.map(ability => ability.ability.name);
                displayAbilities(abilities);
            })
            .catch(error => {
                console.error("Error al obtener las habilidades:", error);
                abilityContainer.innerHTML = "<li>Error al cargar habilidades</li>";
            });
    }

    // Mostrar habilidades
    function displayAbilities(abilities) {
        abilityContainer.innerHTML = "";
        if (abilities.length === 0) {
            abilityContainer.innerHTML = "<li>No se encontraron habilidades</li>";
            return;
        }
        abilities.forEach(ability => {
            const abilityItem = document.createElement("li");
            abilityItem.textContent = ability;
            abilityItem.classList.add("list-group-item", "ability-item", "text-dark", "mb-2");
            abilityItem.addEventListener("click", function () {
                abilityInput.value = ability; 
                abilityContainer.innerHTML = ""; 
            });
            abilityContainer.appendChild(abilityItem);
        });
    }

    // Obtener los movimientos de un Pokémon específico
    function fetchPokemonMoves(pokemonName) {
        return fetch(`${POKEAPI_BASE_URL}${pokemonName}/`)
            .then(response => response.json())
            .then(data => {
                // Obtener solo los movimientos que el Pokémon puede aprender
                pokemonMoves = data.moves.map(move => move.move.name);
            })
            .catch(error => {
                console.error("Error al obtener los movimientos del Pokémon:", error);
            });
    }

    // Mostrar sugerencias de movimientos
    function displayMoveSuggestions(moves, moveInput) {
        movesContainer.innerHTML = ""; 
        movesContainer.style.maxHeight = "150px";
        movesContainer.style.overflowY = "scroll";

        moves.forEach(move => {
            const moveItem = document.createElement("li");
            moveItem.textContent = move;
            moveItem.classList.add("list-group-item", "move-item", "text-dark", "mb-2");

            moveItem.addEventListener("click", () => {
                moveInput.value = move;
                movesContainer.innerHTML = "";
            });

            movesContainer.appendChild(moveItem);
        });
    }

    // Obtener detalles del Pokémon seleccionado
    function fetchPokemonDetails(pokemonName) {
        fetch(`${POKEAPI_BASE_URL}${pokemonName.toLowerCase()}`)
            .then(response => response.json())
            .then(data => {
                console.log("Detalles del Pokémon:", data);
                fetchPokemonMoves(pokemonName); // Obtener movimientos del Pokémon seleccionado
            })
            .catch(error => {
                console.error("Error al obtener los detalles del Pokémon:", error);
            });
    }

    const observer = new MutationObserver(() => {
        initializeDynamicElements();

    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    initializeDynamicElements();


});


// Función para cargar y mostrar todos los objetos con autocompletado y visibilidad controlada
function loadFilteredItems() {
    const objectContainer = document.getElementById("item-suggestions-container");
    const objectInput = document.getElementById("pokemon-object-input");

    if (!objectContainer || !objectInput) {
        console.error("Contenedor de sugerencias o input de objetos no encontrado.");
        return;
    }

    // Categorías permitidas
    const allowedCategories = [
        "medicine",
        "other",
        "in-a-pinch",
        "picky-healing",
        "type-protection",
        "evolution",
        "held-items",
        "choice",
        "bad-held-items",
        "plates",
        "species-specific",
        "type-enhancement",
        "mega-stones",
        "jewels",
    ];

    let allItems = []; // Para almacenar todos los objetos cargados

    fetch("https://pokeapi.co/api/v2/item?limit=10000")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener los objetos: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const items = data.results;

            // Crear una lista de promesas para obtener detalles de cada objeto
            const promises = items.map(item =>
                fetch(item.url)
                    .then(response => response.json())
                    .then(details => {
                        const category = details.category.name;
                        if (allowedCategories.includes(category)) {
                            allItems.push(item.name); // Agregar nombre del objeto a la lista
                        }
                    })
                    .catch(error => console.error(`Error al obtener detalles de ${item.name}:`, error))
            );

            // Esperar a que todas las promesas se completen
            return Promise.all(promises).then(() => allItems);
        })
        .then(() => {
            // Mostrar inicialmente los primeros objetos
            displayItems(allItems);

            // Mostrar lista al hacer foco en el input
            objectInput.addEventListener("focus", () => {
                objectContainer.style.display = "block";
            });

            // Ocultar lista al hacer clic fuera del input y del contenedor
            document.addEventListener("click", (event) => {
                if (
                    !objectInput.contains(event.target) && 
                    !objectContainer.contains(event.target)
                ) {
                    objectContainer.style.display = "none";
                }
            });

            // Evento de autocompletar
            objectInput.addEventListener("input", () => {
                const query = objectInput.value.trim().toLowerCase();
                const filteredItems = allItems.filter(item => item.includes(query));
                displayItems(filteredItems);
            });

            console.log("Objetos cargados correctamente:", allItems.length);
        })
        .catch(error => {
            console.error("No se han podido mostrar los objetos filtrados:", error);
        });

    // Función para mostrar objetos en el contenedor
    function displayItems(items) {
        objectContainer.innerHTML = ""; // Limpiar contenedor antes de agregar elementos
        items.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = item; // Mostrar el nombre del objeto
            listItem.classList.add("list-group-item", "text-dark");
            listItem.addEventListener("click", (event) => {
                event.preventDefault(); // Evitar perder el foco del input
                objectInput.value = item; // Autocompletar input al seleccionar un elemento
                objectContainer.style.display = "none"; // Ocultar sugerencias al seleccionar
            });
            objectContainer.appendChild(listItem);
        });
    }
}

// Llamar a la función
document.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver(() => {
        const itemSuggestionsContainer = document.getElementById("item-suggestions-container");
        const itemInput = document.getElementById("pokemon-object-input");
        if (itemSuggestionsContainer && itemInput) {
            loadFilteredItems(); // Llama a la función solo cuando el contenedor exista
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
});

