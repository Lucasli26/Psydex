const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/pokemon/";

document.addEventListener("DOMContentLoaded", () => {
    // Obtener los Pokémon IDs desde el campo oculto
    const pokemonIds = JSON.parse(document.getElementById("pokemon-ids").value);
    const pokemonContainer = document.getElementById("pokemon-container");

    // Función para cargar el sprite y tipo de un Pokémon
    function loadPokemonData(pokemonId) {
        const url = `${POKEAPI_BASE_URL}${pokemonId}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se pudo cargar el Pokémon");
                }
                return response.json();
            })
            .then(data => {
                // Obtener el sprite del Pokémon
                const spriteUrl = data.sprites.front_default;

                // Crear un contenedor para cada Pokémon
                const pokemonDiv = document.createElement("div");
                pokemonDiv.classList.add("pokemon-card", "m-2", "p-3", "border", "rounded", "bg-light", "d-flex", "flex-column", "align-items-center", "w-25");

                // Agregar la imagen del Pokémon
                const img = document.createElement("img");
                img.src = spriteUrl;
                img.alt = data.name;
                img.classList.add("pokemon-img");
                pokemonDiv.appendChild(img);

                // Agregar el nombre del Pokémon
                const nameDiv = document.createElement("div");
                nameDiv.classList.add("text-dark", "mt-2");
                nameDiv.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
                pokemonDiv.appendChild(nameDiv);

                // Agregar el Pokémon al contenedor
                pokemonContainer.appendChild(pokemonDiv);
            })
            .catch(error => {
                console.error("Error al cargar el Pokémon:", error);
                // Mostrar un placeholder si ocurre un error
                const pokemonDiv = document.createElement("div");
                pokemonDiv.classList.add("pokemon-card", "m-2", "p-3", "border", "rounded", "bg-light", "w-25");
                pokemonDiv.textContent = "Error al cargar este Pokémon";
                pokemonContainer.appendChild(pokemonDiv);
            });
    }

    // Cargar todos los Pokémon del equipo
    pokemonIds.forEach(pokemonId => {
        loadPokemonData(pokemonId);
    });
});
