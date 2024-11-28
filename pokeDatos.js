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
    abilities.innerHTML = `Habilidades: <br> ${pokemon.abilities.map((a) => 
        `${capitalizarPrimeraLetra(a.ability.name)}${a.is_hidden ? " (Oculta)" : ""}` // Reemplazado aquí
    ).join("<br>")}`;

    // Agregar elementos al aside
    asideContainer.appendChild(spriteContainer);
    asideContainer.appendChild(typesContainer);
    asideContainer.appendChild(abilities);

    const evolutionContainer = document.createElement("div");
    evolutionContainer.id = "evolution-chain";
    
    evolutionContainer.style.marginTop = "20px";
    asideContainer.appendChild(evolutionContainer);
}

// Función principal para mostrar la línea evolutiva
function mostrarLineaEvolutiva(cadenaUrl) {
    // Llamar a la API para obtener la cadena evolutiva
    fetch(cadenaUrl)
        .then((response) => response.json())
        .then((data) => {
            const contenedorEvolucion = document.getElementById("evolution-chain");
            contenedorEvolucion.innerHTML = ""; // Limpiar contenido previo

            // Crear título para la línea evolutiva
            const tituloEvolucion = document.createElement("h3");
            tituloEvolucion.textContent = "Línea Evolutiva:";
            contenedorEvolucion.appendChild(tituloEvolucion);

            // Verificamos si la cadena evolutiva existe antes de proceder
            if (data) {
                procesarEvoluciones(data.chain, contenedorEvolucion);
            } else {
                console.error("La cadena evolutiva no está disponible");
            }
        })
        .catch((error) => {
            console.error("Error al cargar la cadena evolutiva", error);
        });
}

// Función recursiva para recorrer todas las evoluciones
function procesarEvoluciones(cadena, contenedorEvolucion) {
    if (!cadena) return; // Verificamos que la cadena exista

    const itemEvolucion = document.createElement("div");
    itemEvolucion.style.textAlign = "center";

    // Crear el sprite del Pokémon
    fetch(`https://pokeapi.co/api/v2/pokemon/${cadena.species.name}`)
        .then((response) => response.json())
        .then((data) => {
            const sprite = document.createElement("img");
            sprite.src = data.sprites.front_default;
            sprite.alt = cadena.species.name;
            sprite.style.width = "100px";

            // Crear el texto de la evolución con las condiciones
            let textoEvolucion = capitalizarPrimeraLetra(cadena.species.name);

            // Verificar si existen condiciones de evolución
            if (cadena.evolution_details.length > 0) {
                cadena.evolution_details.forEach(condicion => {
                    let textoCondicion = "";

                    // Verificar si hay una condición de piedra (item)
                    if (condicion.item) {
                        textoCondicion = `=(${capitalizarPrimeraLetra(condicion.item.name)})`; // Mostrar nombre de la piedra
                    }

                    textoEvolucion = `${textoEvolucion} ${textoCondicion} > ${capitalizarPrimeraLetra(cadena.species.name)}`;

                    // Crear el texto de la etiqueta
                    const etiqueta = document.createElement("p");
                    etiqueta.textContent = textoEvolucion;

                    // Agregar sprite e información
                    itemEvolucion.appendChild(sprite);
                    itemEvolucion.appendChild(etiqueta);
                    contenedorEvolucion.appendChild(itemEvolucion);
                });
            } else {
                // Si no hay condiciones, solo mostramos la evolución básica
                textoEvolucion = `${capitalizarPrimeraLetra(cadena.species.name)} (Sin condiciones)`;

                // Crear el texto de la etiqueta
                const etiqueta = document.createElement("p");
                etiqueta.textContent = textoEvolucion;

                // Agregar sprite e información
                itemEvolucion.appendChild(sprite);
                itemEvolucion.appendChild(etiqueta);
                contenedorEvolucion.appendChild(itemEvolucion);
            }
        });

    // Si hay más evoluciones de esta etapa, las agregamos
    if (cadena.evolves_to && cadena.evolves_to.length > 0) {
        cadena.evolves_to.forEach(evolucion => {
            procesarEvoluciones(evolucion, contenedorEvolucion); // Recursión para seguir con las evoluciones
        });
    }
}

// Función para capitalizar la primera letra de un string
function capitalizarPrimeraLetra(cadena) {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}
