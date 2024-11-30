// Obtener el parámetro "name" de la URL
const urlParams = new URLSearchParams(window.location.search);
const pokemonName = urlParams.get("name");

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
            mostrarDetallesAside(pokemonData); // Mostrar en el aside
            mostrarTablaObjetos(pokemonData); // Mostrar la tabla de objetos sostenidos

            const speciesUrl = pokemonData.species.url; // Obtener la URL de la especie
            // Llamar a la función correcta para obtener la cadena evolutiva
            fetch(speciesUrl)
                .then((response) => response.json())
                .then((speciesData) => {
                    mostrarLineaEvolutiva(speciesData.evolution_chain.url);
                });
        })
        .catch((error) => {
            console.error(error);
            document.body.innerHTML = `<p>Error al cargar los datos del Pokémon. Verifique que el nombre sea válido.</p>`;
        });
} else {
    document.body.innerHTML = `<p>No se especificó un Pokémon en la URL.</p>`;
}

// Mostrar detalles en el aside
function mostrarDetallesAside(pokemon) {
    const asideContainer = document.getElementById("pokemon-aside");
    asideContainer.innerHTML = ""; // Limpiar contenido previo

    const spriteContainer = document.createElement("div");
    spriteContainer.style.position = "relative";
    spriteContainer.style.display = "inline-block";

    // Ícono (sprite)
    const sprite = document.createElement("img");
    sprite.src = pokemon.sprites.front_default;
    sprite.alt = pokemon.name;
    sprite.style.width = "150px"; // Ajustar tamaño si es necesario

    // Agregar sprite al contenedor
    spriteContainer.appendChild(sprite);

    // Contenedor de los tipos con imágenes
    const typesContainer = document.createElement("div");
    typesContainer.style.display = "flex";
    typesContainer.style.justifyContent = "center";
    typesContainer.style.gap = "10px";

    // Añadir las imágenes de los tipos
    pokemon.types.forEach((t) => {
        const typeImage = document.createElement("img");
        typeImage.src = `./img/${t.type.name}.png`; // Ruta de tu carpeta de tipos
        typeImage.alt = t.type.name;
        typeImage.title = capitalizarPrimeraLetra(t.type.name); // Tooltip con el nombre del tipo
        typeImage.style.width = "auto"; // Tamaño ajustado para las imágenes
        typeImage.style.height = "auto"; // Tamaño ajustado para las imágenes
        typesContainer.appendChild(typeImage);
    });

    // Habilidades
    const abilities = document.createElement("p");
    abilities.innerHTML = `Abilities: <br> ${pokemon.abilities.map((a) => 
        `${capitalizarPrimeraLetra(a.ability.name)}${a.is_hidden ? " (Hidden)" : ""}` // Reemplazado aquí
    ).join("<br>")}`;

    // Agregar elementos al aside
    asideContainer.appendChild(spriteContainer);
    asideContainer.appendChild(typesContainer);
    asideContainer.appendChild(abilities);
}

// Función para capitalizar la primera letra de un string
function capitalizarPrimeraLetra(cadena) {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}

// Función para mostrar la tabla de objetos sostenidos
function mostrarTablaObjetos(pokemon) {
    const tabla = document.getElementById("tabla-objetos").querySelector("tbody");
    tabla.innerHTML = ""; // Limpiar tabla existente

    const versionAGeneracion = {
        "red-blue": 1,
        "yellow": 1,
        "gold-silver": 2,
        "crystal": 2,
        "ruby-sapphire": 3,
        "emerald": 3,
        "firered-leafgreen": 3,
        "diamond-pearl": 4,
        "platinum": 4,
        "heartgold-soulsilver": 4,
        "black-white": 5,
        "black-2-white-2": 5,
        "x-y": 6,
        "omega-ruby-alpha-sapphire": 6,
        "sun-moon": 7,
        "ultra-sun-ultra-moon": 7,
        "sword-shield": 8,
    };

    // Iterar sobre los objetos sostenidos
    pokemon.held_items.forEach((item) => {
        const fila = document.createElement("tr");

        // Columna del nombre del objeto con sprite
        const celdaObjeto = document.createElement("td");
        const sprite = document.createElement("img");
        sprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.item.name}.png`;
        sprite.alt = item.item.name;
        sprite.style.width = "32px";
        sprite.style.height = "32px";
        celdaObjeto.appendChild(sprite);
        celdaObjeto.appendChild(document.createTextNode(` ${capitalizarPrimeraLetra(item.item.name)}`));
        fila.appendChild(celdaObjeto);

        // Inicializar un array con columnas vacías para cada generación
        const celdasGeneraciones = Array(8).fill(null).map(() => document.createElement("td"));

        // Procesar las versiones para encontrar las generaciones y porcentajes
        item.version_details.forEach((detalle) => {
            const version = detalle.version.name;
            const generacion = versionAGeneracion[version];

            if (generacion) {
                const celda = celdasGeneraciones[generacion - 1];
                celda.textContent = `${detalle.rarity}%`;
            }
        });

        // Agregar las celdas al resto de las columnas de la fila
        celdasGeneraciones.forEach((celda) => fila.appendChild(celda));

        // Agregar la fila completa a la tabla
        tabla.appendChild(fila);
    });
}
