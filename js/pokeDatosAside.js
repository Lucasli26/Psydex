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
            mostrarFormasAlternas(pokemonName); // Mostrar formas alternas
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

    // Nombre del Pokémon
    const nombre = document.createElement("p");
    nombre.textContent = capitalizarPrimeraLetra(pokemon.name); // Capitalizar el nombre
    nombre.style.textAlign = "center"; // Alinear el texto al centro
    nombre.style.fontWeight = "bold"; // Hacer el texto más destacado
    nombre.style.marginTop = "10px"; // Agregar espacio entre el sprite y el nombre

    // Ícono (sprite)
    const sprite = document.createElement("img");
    sprite.src = pokemon.sprites.front_default;
    sprite.alt = pokemon.name;
    sprite.style.width = "150px"; // Ajustar tamaño si es necesario

    // Agregar sprite al contenedor
    spriteContainer.appendChild(nombre);
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
    const habilidades = document.createElement("p");
    habilidades.innerHTML = `Abilities: <br> ${pokemon.abilities
        .map((a) =>
            `${capitalizarPrimeraLetra(a.ability.name)}${a.is_hidden ? " (Hidden)" : ""}`
        )
        .join("<br>")}`;
        habilidades.style.fontSize = "13px";
        habilidades.style.fontWeight = "bold";

    // Agregar sprite, tipos y habilidades
    asideContainer.appendChild(spriteContainer);
    asideContainer.appendChild(typesContainer);
    asideContainer.appendChild(habilidades);

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
        "scarlet": 9,
        "violet": 9,
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
                    if (
                        objetosPorGeneracion[generacion][item.item.name].porcentaje <
                        versionDetail.rarity
                    ) {
                        objetosPorGeneracion[generacion][item.item.name].porcentaje =
                            versionDetail.rarity;
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
        generacionTitulo.textContent = `Generation ${generacion}`;
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

            const texto = document.createTextNode(
                ` ${capitalizarPrimeraLetra(objeto.nombre)}: ${Math.min(
                    100,
                    objeto.porcentaje
                )}%`
            );

            itemLista.appendChild(sprite);
            itemLista.appendChild(texto);

            listaObjetos.appendChild(itemLista);
        }

        objetosContainer.appendChild(generacionTitulo);
        objetosContainer.appendChild(listaObjetos);
    }

    asideContainer.appendChild(objetosContainer);
}

function mostrarFormasAlternas(pokemonName) {
    const contenedorFormas = document.getElementById("pokemon-forms");
    const contenedorPrincipal = document.getElementById("pokemon-main-container");

    // Asegúrate de limpiar el contenido previo
    contenedorFormas.innerHTML = "";

    // Obtener el nombre base del Pokémon (sin sufijos como -galar, -mega, etc.)
    const basePokemonName = pokemonName.split("-")[0];

    // URL de las especies del Pokémon
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${basePokemonName}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al obtener los datos de las especies del Pokémon");
            }
            return response.json();
        })
        .then((speciesData) => {
            const varieties = speciesData.varieties;

            if (varieties.length > 1) {
                // Agregar título de formas alternas
                const tituloFormas = document.createElement("p");
                tituloFormas.textContent = "Other forms:";
                tituloFormas.style.fontWeight = "bold";
                contenedorFormas.appendChild(tituloFormas);

                varieties.forEach((variety) => {

                    fetch(variety.pokemon.url)
                        .then((response) => response.json())
                        .then((varietyData) => {
                            // Crear un contenedor para cada forma
                            const formaDiv = document.createElement("div");
                            formaDiv.classList = "bg-danger", "d-flex", "flex-column", "align-items-center";
                            formaDiv.style.marginBottom = "10px";
                            formaDiv.style.paddingBottom = "7px";
                            formaDiv.style.borderRadius = "10px";
                            formaDiv.style.cursor = "pointer";

                            // Imagen de la forma
                            const formaImg = document.createElement("img");
                            formaImg.src = varietyData.sprites.front_default || "";
                            formaImg.alt = varietyData.name;
                            formaImg.style.width = "100px";
                            formaImg.style.marginRight = "10px";

                            // Nombre de la forma
                            const formaNombre = document.createElement("p");
                            formaNombre.style.fontSize = "13px";
                            formaNombre.className = "text-white";
                            formaNombre.textContent = capitalizarPrimeraLetra(varietyData.name);

                            // Agregar imagen y nombre al contenedor de la forma
                            formaDiv.appendChild(formaImg);
                            formaDiv.appendChild(formaNombre);

                            // Evento de clic para redirigir a la página de detalles
                            formaDiv.addEventListener("click", () => {
                                // Redirigir a la página con el nombre del Pokémon
                                window.location.href = `pokemonDatos.php?name=${varietyData.name}`;
                            });

                            // Agregar el contenedor de la forma al contenedor principal
                            contenedorFormas.appendChild(formaDiv);
                        })
                        .catch((error) => {
                            console.error("Error al cargar los datos de una variedad:", error);
                        });
                });
            } else {
                // Si no hay variedades, escondemos el div de formas y ajustamos el contenedor principal
                contenedorFormas.style.display = "none";

                // Cambiamos el otro contenedor al ancho completo (col-12)
                if (contenedorPrincipal) {
                    contenedorPrincipal.classList.remove("col-md-8");
                    contenedorPrincipal.classList.add("col-md-12");
                }
            }
        })
        .catch((error) => {
            console.error("Error al cargar las especies del Pokémon:", error);

            // Si hay un error, también escondemos el div de formas por seguridad
            contenedorFormas.style.display = "none";

            if (contenedorPrincipal) {
                contenedorPrincipal.classList.remove("col-md-8");
                contenedorPrincipal.classList.add("col-md-12");
            }
        });
}


// Función para capitalizar la primera letra
function capitalizarPrimeraLetra(cadena) {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}
