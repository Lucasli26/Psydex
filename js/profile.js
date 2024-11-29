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



function renderTeams(teamsData) {
    const teamContainer = document.getElementById("team-previews");
    if (!teamsData || !Array.isArray(teamsData)) return;

    // Limpiar contenedor de equipos
    teamContainer.innerHTML = '';

    const groupedTeams = teamsData.reduce((groups, item) => {
        const teamId = item.equipo_name;
        if (!groups[teamId]) groups[teamId] = [];
        groups[teamId].push(item);
        return groups;
    }, {});

    for (const [teamName, pokemons] of Object.entries(groupedTeams)) {
        const teamDiv = document.createElement("div");
        teamDiv.classList.add("team-preview", "m-2", "p-3", "border", "rounded", "bg-light", "d-flex", "flex-column", "align-items-center", "w-25", "col-5");

        const teamNameDiv = document.createElement("div");
        teamNameDiv.classList.add("team-name", "mb-3", "text-center");
        teamNameDiv.textContent = teamName;
        teamDiv.appendChild(teamNameDiv);

        const pokemonContainer = document.createElement("div");
        pokemonContainer.classList.add("pokemon-container", "d-flex", "flex-wrap", "justify-content-center");

        if (pokemons.length > 0) {
            pokemons.forEach(pokemon => {
                if (pokemon.pokemon_id) {
                    const img = document.createElement("img");
                    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemon_id}.png`;
                    img.alt = pokemon.pokemon_id;
                    img.classList.add("m-1", "pokemon-img");
                    pokemonContainer.appendChild(img);
                }
            });
        } else {
            const noPokemonMessage = document.createElement("p");
            noPokemonMessage.classList.add("text-warning");
            noPokemonMessage.textContent = "No hay Pokémon en este equipo";
            pokemonContainer.appendChild(noPokemonMessage);
        }

        teamDiv.appendChild(pokemonContainer);

        // Botón SVG para eliminar el equipo
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-secondary", "mt-3");
        deleteButton.title = "Eliminar equipo";

        const deleteSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
            </svg>
        `;
        deleteButton.innerHTML = deleteSvg;

        // Evento para eliminar el equipo
        deleteButton.addEventListener("click", function() {
            const confirmation = confirm("¿Estás seguro de que deseas eliminar este equipo?");
            if (confirmation) {
                // Enviar solicitud para eliminar el equipo
                fetch('delete_team.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `teamName=${teamName}`,
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("Equipo eliminado correctamente");
                        location.reload(); // Recargar la página para reflejar los cambios
                    } else {
                        alert("Hubo un error al eliminar el equipo");
                    }
                })
                .catch(error => {
                    console.error("Error al eliminar el equipo:", error);
                    alert("Hubo un error al eliminar el equipo");
                });
            }
        });


        // Botón para añadir un Pokémon al equipo
        const addPokemonButton = document.createElement("button");
        addPokemonButton.classList.add("btn", "btn-primary", "mt-3");
        addPokemonButton.title = "Añadir Pokémon";

        const addPokemonSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-plus-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m6.5-11a.5.5 0 0 0-1 0V6H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V7H10a.5.5 0 0 0 0-1H8.5z"/>
            </svg>
        `;
        addPokemonButton.innerHTML = addPokemonSvg;

        // Evento para añadir un Pokémon al equipo
        addPokemonButton.addEventListener("click", function() {
            // Redirigir al teambuilder.php pasando el nombre del equipo como parámetro
            const teamId = teamName;  // Usamos el nombre del equipo que ya tenemos almacenado
            window.location.href = `teambuilder.php?teamName=${encodeURIComponent(teamId)}`;
        });

        teamDiv.appendChild(addPokemonButton);
        teamDiv.appendChild(deleteButton);
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
