// URL base de la PokeAPI
const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/pokemon/";

// Mapa de colores según el tipo de Pokémon
const typeColors = {
    fire: "rgba(255, 85, 0, 0.7)",
    water: "rgba(0, 100, 255, 0.7)",
    grass: "rgba(0, 200, 80, 0.7)",
    electric: "rgba(255, 223, 0, 0.7)",
    psychic: "rgba(255, 75, 150, 0.7)",
    ice: "rgba(100, 200, 255, 0.7)",
    dragon: "rgba(130, 0, 255, 0.7)",
    dark: "rgba(90, 90, 120, 0.7)",
    fairy: "rgba(255, 150, 200, 0.7)",
    fighting: "rgba(200, 50, 50, 0.7)",
    poison: "rgba(150, 0, 200, 0.7)",
    ground: "rgba(185, 115, 50, 0.7)",
    flying: "rgba(140, 180, 255, 0.7)",
    bug: "rgba(90, 180, 50, 0.7)",
    rock: "rgba(120, 80, 40, 0.7)",
    ghost: "rgba(100, 60, 150, 0.7)",
    steel: "rgba(140, 140, 150, 0.7)",
    normal: "rgba(200, 200, 180, 0.7)"
};

function loadPokemonSpriteAndType(pokemonName) {
    const url = `${POKEAPI_BASE_URL}${pokemonName.toLowerCase()}`;

    // Llamada a la API
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

            // Obtener los tipos del Pokémon (primer y segundo tipo si existen)
            const primaryType = data.types[0].type.name;
            const secondaryType = data.types[1] ? data.types[1].type.name : null;

            // Actualizar el contenedor con la imagen del Pokémon
            const profilePicContainer = document.getElementById("profile-pic-container");
            profilePicContainer.innerHTML = `<img src="${spriteUrl}" alt="${pokemonName}">`;

            // Si el Pokémon tiene un segundo tipo, usamos un fondo de 2 colores alternados
            if (secondaryType) {
                const primaryColor = typeColors[primaryType] || "rgba(255, 255, 255, 0.5)";
                const secondaryColor = typeColors[secondaryType] || "rgba(255, 255, 255, 0.5)";

                // Crear un fondo alternado para los dos tipos (agua, volador, agua, volador)
                profilePicContainer.style.background = `
                    repeating-linear-gradient(
                        45deg,
                        ${primaryColor} 0%,
                        ${primaryColor} 25%,
                        ${secondaryColor} 25%,
                        ${secondaryColor} 50%,
                        ${primaryColor} 50%,
                        ${primaryColor} 75%,
                        ${secondaryColor} 75%,
                        ${secondaryColor} 100%
                    )`;
            } else {
                // Si solo tiene un tipo, solo utilizamos un color de fondo
                const typeColor = typeColors[primaryType] || "rgba(255, 255, 255, 0.5)";
                profilePicContainer.style.background = `
                    repeating-linear-gradient(
                        45deg,
                        ${typeColor} 0%,
                        ${typeColor} 25%,
                        transparent 25%,
                        transparent 50%
                    )`;
            }
        })
        .catch(error => {
            console.error("Error al cargar el sprite o tipo del Pokémon:", error);
            // Mostrar un placeholder si ocurre un error
            const profilePicContainer = document.getElementById("profile-pic-container");
            profilePicContainer.innerHTML = `<p>Error al cargar la imagen</p>`;
        });
}



// Renderizar equipos
function renderTeams(teamsData) {
    const teamContainer = document.getElementById("team-previews");
    if (!teamsData || !Array.isArray(teamsData)) return;

    const groupedTeams = teamsData.reduce((groups, item) => {
        const teamId = item.equipo_name; // Agrupar por nombre de equipo
        if (!groups[teamId]) groups[teamId] = [];
        groups[teamId].push(item);
        return groups;
    }, {});

    for (const [teamName, pokemons] of Object.entries(groupedTeams)) {
        const teamDiv = document.createElement("div");
        teamDiv.classList.add("team-preview", "m-2", "p-3", "border", "rounded", "bg-light", "d-flex", "flex-column", "align-items-center");

        // Crear el nombre del equipo
        const teamNameDiv = document.createElement("div");
        teamNameDiv.classList.add("team-name", "mb-3");
        teamNameDiv.textContent = teamName;
        teamDiv.appendChild(teamNameDiv);

        // Contenedor para los Pokémon
        const pokemonContainer = document.createElement("div");
        pokemonContainer.classList.add("pokemon-container", "d-flex", "flex-wrap", "justify-content-center");

        // Mostrar los Pokémon del equipo
        pokemons.forEach(pokemon => {
            const img = document.createElement("img");
            img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemon_id}.png`;
            img.alt = pokemon.pokemon_id;
            img.classList.add("m-1", "pokemon-img");
            pokemonContainer.appendChild(img);
        });

        teamDiv.appendChild(pokemonContainer);

        // Agregar todo el equipo al contenedor principal
        teamContainer.appendChild(teamDiv);
    }
}


// Ejecutar al cargar
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("teams-data");
    const teamsData = JSON.parse(input.value);

    renderTeams(teamsData);

    if (userPokemon) {
        loadPokemonSpriteAndType(userPokemon);
    }
});
