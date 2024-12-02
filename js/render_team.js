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
            pokemons.forEach(async (pokemon) => {
                if (pokemon.pokemon_id) {
                    try {
                        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.pokemon_id.toLowerCase()}`);
                        const data = await response.json();

                        const img = document.createElement("img");
                        img.src = data.sprites.front_default; // URL del sprite frontal por defecto
                        img.alt = pokemon.pokemon_id;
                        img.classList.add("m-1", "pokemon-img");
                        pokemonContainer.appendChild(img);
                    } catch (error) {
                        console.error(`Error al obtener datos de ${pokemon.pokemon_id}:`, error);

                        // Mostrar un mensaje o imagen de error
                        const errorImg = document.createElement("p");
                        errorImg.classList.add("text-danger");
                        errorImg.textContent = "Error al cargar sprite";
                        pokemonContainer.appendChild(errorImg);
                    }
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
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
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
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-brush" viewBox="0 0 16 16">
                <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.1 6.1 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.1 8.1 0 0 1-3.078.132 4 4 0 0 1-.562-.135 1.4 1.4 0 0 1-.466-.247.7.7 0 0 1-.204-.288.62.62 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896q.19.012.348.048c.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04M4.705 11.912a1.2 1.2 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.4 3.4 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3 3 0 0 0 .126-.75zm1.44.026c.12-.04.277-.1.458-.183a5.1 5.1 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005zm3.582-3.043.002.001h-.002z"/>
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