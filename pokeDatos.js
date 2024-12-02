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
            mostrarFormasAlternas(pokemonData); // Mostrar formas alternas
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

    // Agregar sprite, tipos y habilidades
    asideContainer.appendChild(spriteContainer);
    asideContainer.appendChild(typesContainer);
    asideContainer.appendChild(abilities);

    // Mostrar objetos por generación
    mostrarObjetosPorGeneracion(pokemon, asideContainer);
}

// Función para mostrar objetos por generación
function mostrarObjetosPorGeneracion(pokemon, asideContainer) {
    const generaciones = {
        "red": 1,
        "blue": 1,
        "yellow": 1,
        "firered": 1,
        "leafgreen": 1,
        "gold": 2,
        "silver": 2,
        "heartgold": 2,
        "soulsilver": 2,
        "ruby": 3,
        "sapphire": 3,
        "emerald": 3,
        "omega-ruby": 3,
        "alpha-sapphire": 3,
        "diamond": 4,
        "pearl": 4,
        "platinum": 4,
        "black": 5,
        "white": 5,
        "black-2": 5,
        "white-2": 5,
        "x": 6,
        "y": 6,
        "sun": 7,
        "moon": 7,
        "ultra-sun": 7,
        "ultra-moon": 7,
        "sword": 8,
        "shield": 8,
        "scarlet": 7,
        "violet": 7,
    };

    const objetosContainer = document.createElement("div");
    objetosContainer.classList.add("mt-4");

    const objetosPorGeneracion = {};

    pokemon.held_items.forEach((item) => {
        item.version_details.forEach((versionDetail) => {
            const generacion = generaciones[versionDetail.version.name];
            if (generacion) {
                if (!objetosPorGeneracion[generacion]) {
                    objetosPorGeneracion[generacion] = {};
                }

                if (objetosPorGeneracion[generacion][item.item.name]) {
                    if (objetosPorGeneracion[generacion][item.item.name].porcentaje < versionDetail.rarity) {
                        objetosPorGeneracion[generacion][item.item.name].porcentaje = versionDetail.rarity;
                    }
                } else {
                    objetosPorGeneracion[generacion][item.item.name] = {
                        nombre: item.item.name,
                        porcentaje: versionDetail.rarity,
                    };
                }
            }
        });
    });

    for (const [generacion, objetos] of Object.entries(objetosPorGeneracion)) {
        const generacionTitulo = document.createElement("p");
        generacionTitulo.textContent = `Generación ${generacion}`;
        generacionTitulo.style.fontWeight = "bold";
        generacionTitulo.style.fontSize = "20px";
        generacionTitulo.classList.add("mt-3");

        const listaObjetos = document.createElement("ul");
        listaObjetos.classList.add("list-unstyled");

        for (const objetoKey in objetos) {
            const objeto = objetos[objetoKey];
            const itemLista = document.createElement("li");
            itemLista.style.fontSize = "14px";

            const sprite = document.createElement("img");
            sprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${objeto.nombre}.png`;
            sprite.alt = objeto.nombre;
            sprite.style.width = "32px";
            sprite.style.height = "32px";

            const texto = document.createTextNode(` ${capitalizarPrimeraLetra(objeto.nombre)}: ${Math.min(100, objeto.porcentaje)}%`);

            itemLista.appendChild(sprite);
            itemLista.appendChild(texto);

            listaObjetos.appendChild(itemLista);
        }

        objetosContainer.appendChild(generacionTitulo);
        objetosContainer.appendChild(listaObjetos);
    }

    asideContainer.appendChild(objetosContainer);
}

// Función para mostrar las formas alternas del Pokémon
function mostrarFormasAlternas(pokemon) {
    const pokeFormas = `https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}/varieties`;

    fetch(pokeFormas)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de las variedades');
            }
            return response.json();
        })
        .then(data => {
            // Filtrar las variedades para eliminar la que coincide con el nombre del Pokémon actual
            const formasAlternas = data.results.filter(forma => forma.name !== pokemon.name); // Eliminar la forma principal

            if (formasAlternas.length > 0) {
                const formasContainer = document.getElementById("pokemon-form");
                formasContainer.innerHTML = "";

                const tituloFormas = document.createElement("h4");
                tituloFormas.textContent = "Formas Alternas:";
                formasContainer.appendChild(tituloFormas);

                formasAlternas.forEach(forma => {
                    const formaNombre = document.createElement("p");

                    const enlace = document.createElement("a");
                    enlace.href = `?name=${forma.name}`;
                    enlace.textContent = capitalizarPrimeraLetra(forma.name);
                    enlace.style.cursor = "pointer";
                    formaNombre.appendChild(enlace);

                    formasContainer.appendChild(formaNombre);
                });
            } else {
                const noFormas = document.createElement("p");
                noFormas.textContent = "Este Pokémon no tiene formas alternas.";
                document.getElementById("pokemon-form").appendChild(noFormas);
            }
        })
        .catch(error => {
            console.error('Error al cargar las formas alternas:', error);
        });
}

function capitalizarPrimeraLetra(cadena) {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}
