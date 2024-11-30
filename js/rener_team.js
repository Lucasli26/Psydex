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

        // Botón SVG para cada equipo
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-secondary", "mt-3");
        deleteButton.title = "Eliminar equipo";

        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
            </svg>
        `;
        deleteButton.innerHTML = svg;
        // Aquí podrías agregar un evento al botón para eliminar el equipo o alguna otra acción
        deleteButton.addEventListener("click", function() {
            alert("Botón de eliminar clickeado para el equipo: " + teamName);
        });

        teamDiv.appendChild(deleteButton);
        teamContainer.appendChild(teamDiv);
    }
}