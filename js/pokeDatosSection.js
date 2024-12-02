console.log("Nombre del Pokémon:", pokemonName); // Verifica que el nombre se obtenga correctamente

if (pokemonName) {
    // Llamar a la PokeAPI para obtener los datos del Pokémon
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al obtener los datos del Pokémon");
            }
            return response.json();
        })
        .then((pokemonData) => {
            console.log("Datos del Pokémon:", pokemonData); // Verifica la respuesta de la API
            mostrarEstadisticas(pokemonData.stats); // Mostrar estadísticas en el <section>
            obtenerEvolucion(pokemonData.species.url); // Obtener y mostrar la línea evolutiva
            mostrarMovimientos(pokemonData.moves); // Mostrar movimientos en el <div>

        })
        .catch((error) => {
            console.error("Error al obtener los datos:", error);
            document.body.innerHTML = `<p>Error al cargar los datos del Pokémon. Verifique que el nombre sea válido.</p>`;
        });
} else {
    document.body.innerHTML = `<p>No se especificó un Pokémon en la URL.</p>`;
}

// Función para mostrar estadísticas en el <section>
function mostrarEstadisticas(stats) {
    const sectionContainer = document.getElementById("pokemon-stats");

    // Verifica que las estadísticas estén disponibles
    console.log("Estadísticas del Pokémon:", stats);

    // Crear un contenedor para las estadísticas
    const statsContainer = document.createElement("div");
    statsContainer.className = "stats-container";

    stats.forEach((stat) => {
        const statName = capitalizarPrimeraLetra(stat.stat.name); // Nombre de la estadística
        const baseStat = stat.base_stat; // Valor base

        // Crear un contenedor para cada estadística con clases de Bootstrap
        const statRow = document.createElement("div");
        statRow.className = "d-flex align-items-center justify-content-center mb-3"; // Usar clases de Bootstrap para el layout

        // Crear una etiqueta para el nombre y el valor con clases de Bootstrap
        const statLabel = document.createElement("p");
        statLabel.textContent = `${statName}: ${baseStat}`;
        statLabel.className = "mb-0 mr-3"; // Alineación con márgenes
        statLabel.style.width = "280px";

        // Crear una barra de progreso utilizando las clases de Bootstrap
        const statBar = document.createElement("div");
        statBar.className = "progress w-25"; // Usar la clase `progress` de Bootstrap y ajustar el ancho
        statBar.style.height= "15px";
        statBar.style.border ="1px solid #dc3545";
        

        // Limitar a un máximo del 100% de la barra
        const progressWidth = Math.min(baseStat / 3, 100);

        // Barra dentro de la barra de progreso
        const statIndicator = document.createElement("div");
        statIndicator.className = "progress-bar bg-danger"; // Usar clase para el color
        statIndicator.style.width = `${progressWidth}%`; // Ajustar según el valor de base_stat (de 0 a 100)
        statIndicator.setAttribute("role", "progressbar");
        statIndicator.setAttribute("aria-valuenow", baseStat);
        statIndicator.setAttribute("aria-valuemin", "0");
        statIndicator.setAttribute("aria-valuemax", "300");

        // Añadir el indicador a la barra
        statBar.appendChild(statIndicator);

        // Agregar el nombre y la barra de progreso a la fila
        statRow.appendChild(statLabel);
        statRow.appendChild(statBar);

        // Agregar la fila al contenedor principal de estadísticas
        statsContainer.appendChild(statRow);
    });

    // Verifica que el contenedor de estadísticas se agrega al DOM
    console.log("Contenedor de estadísticas creado:", statsContainer);

    // Agregar el contenedor de estadísticas al section
    sectionContainer.appendChild(statsContainer);
}

// Función para obtener la línea evolutiva
function obtenerEvolucion(speciesUrl) {
    fetch(speciesUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al obtener los datos de la especie del Pokémon");
            }
            return response.json();
        })
        .then((speciesData) => {
            console.log("Datos de la especie del Pokémon:", speciesData);
            const evolutionChainUrl = speciesData.evolution_chain.url;
            return fetch(evolutionChainUrl);
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al obtener la cadena evolutiva del Pokémon");
            }
            return response.json();
        })
        .then((evolutionData) => {
            console.log("Datos de la cadena evolutiva:", evolutionData);
            mostrarEvoluciones(evolutionData.chain);
        })
        .catch((error) => {
            console.error("Error:", error);
            const evolutionContainer = document.getElementById("pokemon-evolucion");
            evolutionContainer.innerHTML += `<p>Error al cargar la línea evolutiva. Inténtelo más tarde.</p>`;
        });
}

// Función para mostrar la línea evolutiva con los métodos
function mostrarEvoluciones(evolutionChain) {
    const evolutionContainer = document.getElementById("pokemon-evolucion");
    evolutionContainer.innerHTML = `<h4>Evolution:</h4>`;

    const evolutionRow = document.createElement("div");
    evolutionRow.className = "row d-flex align-items-center"; // Fila horizontal

    // Recorrer la cadena evolutiva recursivamente
    function agregarEvoluciones(chain) {
        const evolutionCol = document.createElement("div");
        evolutionCol.className = "col text-center"; // Contenedor para cada Pokémon

        // Nombre del Pokémon
        const pokemonName = chain.species.name;

        // Imagen del Pokémon (usar API de sprites)
        const pokemonImage = document.createElement("img");
        pokemonImage.alt = pokemonName;
        pokemonImage.className = "img-fluid mb-2";
        pokemonImage.style.width = "170px";
        pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonIdFromUrl(chain.species.url)}.png`;

        // Nombre debajo de la imagen
        const pokemonLabel = document.createElement("p");
        pokemonLabel.className = "mb-0 fw-bold";
        pokemonLabel.textContent = capitalizarPrimeraLetra(pokemonName);

        // Añadir imagen y texto al contenedor
        evolutionCol.appendChild(pokemonImage);
        evolutionCol.appendChild(pokemonLabel);

        // Agregar el contenedor a la fila
        evolutionRow.appendChild(evolutionCol);

        // Si hay evoluciones, mostrar detalles del método entre ellas
        if (chain.evolves_to.length > 0) {
            chain.evolves_to.forEach((nextEvolution) => {
                mostrarMetodoDeEvolucion(chain, evolutionRow); // Agregar detalles del método
                agregarEvoluciones(nextEvolution); // Procesar la siguiente evolución
            });
        }
    }

// Mostrar el método de evolución
function mostrarMetodoDeEvolucion(chain, parentRow) {
        const methodDetails = chain.evolves_to[0].evolution_details[0]; // Obtener los detalles
        if (!methodDetails) return;
    
        const evolutionMethod = document.createElement("div");
        evolutionMethod.className = "col text-center"; // Contenedor para el método
        evolutionMethod.style.maxWidth = "150px";
    
        // Crear texto del método
        let methodText = "Evolves by ";
    
        if (methodDetails.trigger.name === "level-up") {
            methodText += `leveling up${methodDetails.min_level ? ` at level ${methodDetails.min_level}` : ""}`;
        } else if (methodDetails.trigger.name === "use-item") {
            methodText += `using ${capitalizarPrimeraLetra(methodDetails.item.name)}`;
    
            // Si el método incluye un objeto, añadir su imagen
            const itemImage = document.createElement("img");
            itemImage.alt = methodDetails.item.name;
            itemImage.className = "img-fluid mx-auto d-block my-2";
            itemImage.style.width = "55px";
            itemImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${methodDetails.item.name}.png`;
            evolutionMethod.appendChild(itemImage);
        } else if (methodDetails.trigger.name === "trade") {
            methodText += "trading";
        } else {
            methodText += methodDetails.trigger.name;
        }
    
        // Mostrar el texto del método
        const methodLabel = document.createElement("p");
        methodLabel.className = "mb-0 small"; // Texto pequeño y gris
        methodLabel.textContent = methodText;
    
        evolutionMethod.appendChild(methodLabel);
        parentRow.appendChild(evolutionMethod);
    }
    

    agregarEvoluciones(evolutionChain); // Empezar con la cadena base
    evolutionContainer.appendChild(evolutionRow); // Agregar la fila al contenedor principal
}

let currentSortColumn = null; // Guardamos la columna que estamos ordenando
let currentSortOrder = "asc"; // Orden ascendente por defecto

function mostrarMovimientos(moves) {
    const movesContainer = document.getElementById("pokemon-movimientos");

    // Limpiar el contenedor antes de agregar nuevos acordeones
    movesContainer.innerHTML = "";

    // Crear tablas vacías para cada método de aprendizaje
    const createTable = () => {
        const table = document.createElement("table");
        table.className = "table table-striped table-bordered table-hover mt-3";
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Level</th>
                    <th>Move</th>
                    <th class="d-none d-md-table-cell">Type</th>
                    <th class="d-none d-md-table-cell">Power</th>
                    <th class="d-none d-md-table-cell">Accuracy</th>
                    <th class="d-none d-md-table-cell">Category</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        return table;
    };

    // Crear tablas para cada método
    const levelUpTable = createTable();
    const eggTable = createTable();
    const tutorTable = createTable();
    const machineTable = createTable();

    const levelUpBody = levelUpTable.querySelector("tbody");
    const eggBody = eggTable.querySelector("tbody");
    const tutorBody = tutorTable.querySelector("tbody");
    const machineBody = machineTable.querySelector("tbody");

    const movesArray = [];

    // Procesar los movimientos
    const fetchPromises = moves.map((moveEntry) => {
        const moveName = capitalizarPrimeraLetra(moveEntry.move.name);

        // Buscar el método de aprendizaje y nivel
        const levelDetails = moveEntry.version_group_details.find(
            (detail) => detail.move_learn_method.name === "level-up"
        );
        const eggDetails = moveEntry.version_group_details.find(
            (detail) => detail.move_learn_method.name === "egg"
        );
        const tutorDetails = moveEntry.version_group_details.find(
            (detail) => detail.move_learn_method.name === "tutor"
        );
        const machineDetails = moveEntry.version_group_details.find(
            (detail) => detail.move_learn_method.name === "machine"
        );

        const levelLearned = levelDetails ? levelDetails.level_learned_at : "—";

        // Obtener datos adicionales del movimiento
        return fetch(moveEntry.move.url)
            .then((response) => response.json())
            .then((moveData) => {
                const moveType = capitalizarPrimeraLetra(moveData.type.name);
                const movePower = moveData.power || "—";
                const moveAccuracy = moveData.accuracy || "—";
                const moveCategory = capitalizarPrimeraLetra(moveData.damage_class.name);

                movesArray.push({
                    levelLearned: levelLearned === "—" ? Infinity : levelLearned,
                    moveName,
                    moveType,
                    movePower,
                    moveAccuracy,
                    moveCategory,
                    method: levelDetails
                        ? "level-up"
                        : eggDetails
                        ? "egg"
                        : tutorDetails
                        ? "tutor"
                        : "machine",
                });
            });
    });

    Promise.all(fetchPromises)
        .then(() => {
            // Ordenar movimientos por nivel
            movesArray.sort((a, b) => a.levelLearned - b.levelLearned);

            // Crear las filas para cada tabla
            movesArray.forEach((move) => {
                const row = `
                    <tr>
                        <td>${move.levelLearned === Infinity ? "—" : move.levelLearned}</td>
                        <td>${move.moveName}</td>
                        <td class="d-none d-md-table-cell">${move.moveType}</td>
                        <td class="d-none d-md-table-cell">${move.movePower}</td>
                        <td class="d-none d-md-table-cell">${move.moveAccuracy}</td>
                        <td class="d-none d-md-table-cell">${move.moveCategory}</td>
                    </tr>
                `;

                if (move.method === "level-up") levelUpBody.innerHTML += row;
                else if (move.method === "egg") eggBody.innerHTML += row;
                else if (move.method === "tutor") tutorBody.innerHTML += row;
                else if (move.method === "machine") machineBody.innerHTML += row;
            });

            // Crear acordeones
            const createAccordionItem = (id, label, content) => `
                <div class="card">
                    <div class="card-header" id="heading-${id}">
                        <h2 class="mb-0">
                            <button class="btn btn-link text-danger" type="button" data-toggle="collapse"
                                    data-target="#collapse-${id}" aria-expanded="true" aria-controls="collapse-${id}">
                                ${label}
                            </button>
                        </h2>
                    </div>
                    <div id="collapse-${id}" class="collapse" aria-labelledby="heading-${id}" data-parent="#pokemon-movimientos">
                        <div class="card-body">${content.outerHTML}</div>
                    </div>
                </div>
            `;

            movesContainer.innerHTML += createAccordionItem("level-up", "Level Up Moves", levelUpTable);
            movesContainer.innerHTML += createAccordionItem("machine", "TM Moves", machineTable);
            movesContainer.innerHTML += createAccordionItem("tutor", "Tutor Moves", tutorTable);
            movesContainer.innerHTML += createAccordionItem("egg", "Egg Moves", eggTable);
        })
        .catch((error) => {
            console.error("Error al procesar los movimientos:", error);
        });
}



// Función para renderizar la tabla con los movimientos ordenados
function renderizarTabla(movesArray, levelUpTableBody, eggTableBody, tutorTableBody, machineTableBody) {
    // Limpiar los cuerpos de las tablas
    levelUpTableBody.innerHTML = "";
    eggTableBody.innerHTML = "";
    tutorTableBody.innerHTML = "";
    machineTableBody.innerHTML = "";

    // Volver a insertar las filas ordenadas
    movesArray.forEach((move) => {
        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `
            <td>${move.levelLearned}</td>
            <td>${move.moveName}</td>
            <td class="d-none d-md-table-cell">${move.moveType}</td>
            <td class="d-none d-md-table-cell">${move.movePower}</td>
            <td class="d-none d-md-table-cell">${move.moveAccuracy}</td>
            <td class="d-none d-md-table-cell">${move.moveCategory}</td>
        `;

        // Añadir a las tablas correspondientes según el método de aprendizaje
        if (move.levelLearned !== "—") {
            levelUpTableBody.appendChild(tableRow);
        }
    });
}

// Función para extraer el ID del Pokémon de su URL
function getPokemonIdFromUrl(url) {
    const parts = url.split("/");
    return parts[parts.length - 2];
}

// Función para capitalizar la primera letra
function capitalizarPrimeraLetra(cadena) {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}
