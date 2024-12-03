const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
const ITEM_API_BASE_URL = "https://pokeapi.co/api/v2/item/";

document.addEventListener("DOMContentLoaded", () => {
    const movesets = JSON.parse(document.getElementById("movesets-data").value); // Cargamos los datos del PHP
    const pokemonContainer = document.getElementById("pokemon-container");
    const detailsContainerId = "details-container";

    function showPokemonDetails(moveset) {
        const detailsContainer = document.getElementById(detailsContainerId) || createDetailsContainer();
        detailsContainer.innerHTML = ""; // Limpiar contenido anterior

        const row = document.createElement("div");
        row.classList.add("row", "text-light", "align-items-start", "text-dark");

        // Columna Izquierda: Nombre, Habilidad, Objeto
        const leftCol = document.createElement("div");
        leftCol.classList.add("col-md-4", "mb-3");

        // Usamos el nuevo parámetro `isNameInput` para asignar el ID y las clases al input de nombre
        const nameInput = createTextbox("Nombre del Pokémon:", moveset.pokemon, true);
        const ejemplo = moveset.pokemon;
        // Crear el contenedor de sugerencias
        const suggestionsContainer = document.createElement("ul");
        suggestionsContainer.id = "suggestions-container"; // id para el contenedor de sugerencias
        suggestionsContainer.classList.add("list-group", "text-danger"); // clases para el contenedor de sugerencias

        // Crear el input de habilidad
        const abilityInput = createTextbox("Habilidad:", moveset.habilidades, false, false, true);

        // Crear el contenedor de sugerencias
        const abilityContainer = document.createElement("ul");
        abilityContainer.id = "ability-container"; // id para el contenedor de sugerencias
        abilityContainer.classList.add("list-group", "text-danger"); // clases para el contenedor de sugerencias

        const itemContainer = document.createElement("div");
        itemContainer.classList.add("form-group", "d-flex", "flex-column", "align-items-center", "justify-content-center");
                
                const itemLabel = document.createElement("label");
                itemLabel.textContent = "Objeto:";
                itemLabel.classList.add("mr-2");
                
                // Crear el input de texto para el objeto
                const itemInput = document.createElement("input");
                itemInput.type = "text";
                itemInput.value = moveset.objeto; // El valor por defecto será el objeto del moveset
                itemInput.classList.add("form-control", "mr-2");
                itemInput.id = "pokemon-object-input";
                itemInput.placeholder = "Buscar o escribir objeto..."; // Placeholder para sugerencias
                const itemSprite = document.createElement("img");
                itemSprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${moveset.objeto.toLowerCase()}.png`;
                itemSprite.alt = moveset.objeto;
                itemSprite.classList.add("item-sprite");
                itemSprite.width = 40;
                itemSprite.height = 40;
                
                // Contenedor para las sugerencias
                const itemSuggestionsContainer = document.createElement("ul");
                itemSuggestionsContainer.id = "item-suggestions-container"; // ID para el contenedor de sugerencias
                itemSuggestionsContainer.classList.add("list-group", "text-dark", "position-absolute", "w-100", "bg-white");
                
                // Conexión de los elementos del contenedor
                itemContainer.appendChild(itemLabel);
                itemContainer.appendChild(itemSprite);
                itemContainer.appendChild(itemInput);
                itemContainer.appendChild(itemSuggestionsContainer);
                
                
                

        leftCol.appendChild(nameInput);
        leftCol.appendChild(suggestionsContainer);
        leftCol.appendChild(abilityInput);
        leftCol.appendChild(abilityContainer);
        // Insertar el contenedor en la columna izquierda
        leftCol.appendChild(itemContainer);
        const ivSection = createIVTextboxes(moveset.ivs || "0 HP / 0 Atk / 0 Def / 0 SpA / 0 SpD / 0 Spe");
        leftCol.appendChild(ivSection);


        // Columna Central: Movimientos
        const centerCol = document.createElement("div");
        centerCol.classList.add("col-md-4", "mb-3");
        const moves = moveset.moves.split(" - ").map(move => move.trim());
        moves.forEach((move, index) => {
            const moveInput = createTextbox(`Movimiento ${index + 1}:`, move, false, true);
            centerCol.appendChild(moveInput);
        });

        // Crear el contenedor de sugerencias
        const movesContainer = document.createElement("ul");
        movesContainer.id = "moves-container"; // id para el contenedor de sugerencias
        movesContainer.classList.add("list-group", "text-danger", "border", "border-5"); // clases para el contenedor de sugerencias
        centerCol.appendChild(movesContainer);

        // Columna Derecha: Teratipo, Naturaleza y EVs
        const rightCol = document.createElement("div");
        rightCol.classList.add("col-md-4", "mb-3");

        const teratypeSelect = createDropdown(
            "Teratipo:",
            ["Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"],
            moveset.teratipo
        );

        const natureSelect = createDropdown(
            "Naturaleza:",
            ["Adamant", "Bold", "Brave", "Calm", "Careful", "Gentle", "Hardy", "Hasty", "Impish", "Jolly", "Lax", "Lonely", "Mild", "Modest", "Naive", "Naughty", "Quiet", "Quirky", "Rash", "Relaxed", "Sassy", "Serious", "Timid"],
            moveset.naturaleza
        );

        rightCol.appendChild(teratypeSelect);
        rightCol.appendChild(natureSelect);

        // Aquí se carga la sección de EVs desde un archivo separado
        const evSection = createEVTextboxes(moveset.evs || "0 HP / 0 Atk / 0 Def / 0 SpA / 0 SpD / 0 Spe");

        rightCol.appendChild(evSection);

        // Agregar columnas a la fila principal
        row.appendChild(leftCol);
        row.appendChild(centerCol);
        row.appendChild(rightCol);

        // Crear y agregar el botón con el icono
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("col-md-12");

        const button = document.createElement("button");
        button.classList.add("btn", "btn-primary", "mb-2");

        // Crear el SVG para el icono
        const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        icon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        icon.setAttribute("width", "25");
        icon.setAttribute("height", "25");
        icon.setAttribute("fill", "currentColor");
        icon.setAttribute("class", "bi bi-patch-check-fill");
        icon.setAttribute("viewBox", "0 0 16 16");

        // Crear el path del icono
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.5a.5.5 0 0 1 1 0V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0m-.354 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V11h-1v3.293l-2.146-2.147a.5.5 0 0 0-.708.708z");

        // Añadir el path al SVG
        icon.appendChild(path);

        // Agregar el SVG al botón
        button.appendChild(icon);

        button.onclick = async () => {
            try {
                // Recolectar datos
                const pokemonName = detailsContainer.querySelector('.form-group input[type="text"]').value.trim().toLowerCase() || "No definido";
                const ability = detailsContainer.querySelectorAll('.form-group input[type="text"]')[1]?.value || "No definido";
                const item = detailsContainer.querySelectorAll('.form-group input[type="text"]')[2]?.value || "No definido";
                const teratype = detailsContainer.querySelector('select.form-control')?.value || "No definido";
                const nature = detailsContainer.querySelectorAll('select.form-control')[1]?.value || "No definido";
                const moves = Array.from(detailsContainer.querySelectorAll('.col-md-4 input[type="text"]'))
                    .slice(3, 7)
                    .map(input => input.value || "No definido");
                const ivs = Array.from(detailsContainer.querySelectorAll('.iv-section input[type="number"]'))
                    .map(input => `${input.value} ${input.previousElementSibling.textContent}`)
                    .join(" / ") || "No definido";
                const evs = Array.from(detailsContainer.querySelectorAll('.ev-section input[type="number"]'))
                    .map(input => `${input.value} ${input.previousElementSibling.textContent}`)
                    .join(" / ") || "No definido";
        
                // Validar el nombre del Pokémon con la PokéAPI
                const pokeApiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
                const response = await fetch(pokeApiUrl);
        
                if (!response.ok) {
                    // Si el Pokémon no existe, mostrar un error
                    alert(`El Pokémon "${pokemonName}" no existe. Por favor, ingrese un nombre válido.`);
                    return; // Detener la ejecución
                }
        
                // Formatear los datos del moveset
                const movesetData = `${pokemonName} @ ${item}\n` +
                    `Ability: ${ability}\n` +
                    `Tera Type: ${teratype}\n` +
                    `EVs: ${evs}\n` +
                    `${nature} Nature\n` +
                    `IVs: ${ivs}\n` +
                    moves.map(move => `- ${move}`).join("\n");
        
                // Copiar al portapapeles
                await navigator.clipboard.writeText(movesetData);
        
                // Construir la URL de redirección
                const queryParams = new URLSearchParams({
                    pokemon: pokemonName,
                    habilidades: ability,
                    objeto: item,
                    teratipo: teratype,
                    naturaleza: nature,
                    moves: moves.join(" - "),
                    evs: evs,
                    ivs: ivs,
                    pokemonId: ejemplo,
                });
        
                const url = `./php/update_moves.php?${queryParams.toString()}`;
                window.location.href = url;
            } catch (error) {
                console.error("Error al recolectar o enviar los datos:", error);
                alert("Error al recolectar o enviar los datos. Revisa la consola para más detalles.");
            }
        };
        
        
        
        
        
        
        
        // Función para mostrar el mensaje "Paste!" debajo del botón
        function showPasteMessage(button) {
            // Crear un elemento <span> para el mensaje
            const message = document.createElement("span");
            message.textContent = "Copy!";
            message.style.color = "green";
            message.style.marginTop = "10px";
            message.style.display = "block";
            message.style.fontWeight = "bold";
        
            // Insertar el mensaje justo debajo del botón
            button.insertAdjacentElement("afterend", message);
        
            // Eliminar el mensaje después de 3 segundos
            setTimeout(() => {
                message.remove();
            }, 500);
        }
    
        // Añadir el botón al contenedor
        buttonContainer.appendChild(button);
        // Agregar el contenedor del botón al contenedor de detalles
        detailsContainer.appendChild(buttonContainer);
        // Agregar la fila con los detalles al contenedor de detalles
        detailsContainer.appendChild(row);

    }

/**
 * Crear un textbox con etiqueta
 * @param {string} labelText - El texto para la etiqueta.
 * @param {string} value - El valor por defecto para el campo.
 * @param {boolean} [isNameInput=false] - Si es verdadero, aplica características especiales para el input de nombre.
 * @param {boolean} [isMoveInput=false] - Si es verdadero, aplica características especiales para los inputs de movimiento.
 * @param {boolean} [isAbilityInput=false] - Si es verdadero, aplica características especiales para el input de habilidades.
 * @returns {HTMLElement} - El textbox creado.
 */
function createTextbox(labelText, value, isNameInput = false, isMoveInput = false, isAbilityInput = false) {
    const div = document.createElement("div");
    div.classList.add("form-group");

    const label = document.createElement("label");
    label.textContent = labelText;
    div.appendChild(label);

    const input = document.createElement("input");
    input.type = "text";
    input.value = value;
    input.classList.add("form-control");

    if (isNameInput) {
        input.id = "pokemon-name-input";
        input.classList.add("search-input");
        input.placeholder = "Buscar Pokémon...";
    } else if (isMoveInput) {
        input.classList.add("move-input");
        input.setAttribute("data-move-index", labelText.match(/\d+/)?.[0]); // Asociar índice basado en etiqueta
    } else if (isAbilityInput) {
        input.id = "pokemon-ability-input";
        input.classList.add("ability-input");
        input.placeholder = "Seleccionar habilidad...";
    }

    div.appendChild(input);
    return div;
}




    /**
     * Crear un dropdown con etiqueta
     * @param {string} labelText - El texto para la etiqueta.
     * @param {Array} options - Las opciones para el dropdown.
     * @param {string} defaultValue - El valor por defecto que estará seleccionado.
     * @returns {HTMLElement} - El dropdown creado.
     */
    function createDropdown(labelText, options, defaultValue) {
        const div = document.createElement("div");
        div.classList.add("form-group");

        const label = document.createElement("label");
        label.textContent = labelText;
        div.appendChild(label);

        const select = document.createElement("select");
        select.classList.add("form-control");

        options.forEach(option => {
            const opt = document.createElement("option");
            opt.value = option;
            opt.textContent = option;
            if (option.toLowerCase() === defaultValue.toLowerCase()) opt.selected = true;
            select.appendChild(opt);
        });

        div.appendChild(select);
        return div;
    }

    /**
     * Crear el contenedor de detalles del Pokémon
     * @returns {HTMLElement} - El contenedor de detalles creado.
     */
    function createDetailsContainer() {
        const detailsContainer = document.createElement("div");
        detailsContainer.id = detailsContainerId;
        detailsContainer.classList.add("container", "mt-4", "p-3", "bg-light", "rounded");
        document.body.appendChild(detailsContainer);
        return detailsContainer;
    }

    /**
     * Cargar datos del Pokémon usando la API de PokeAPI.
     * @param {Object} moveset - El moveset del Pokémon.
     */
    function loadPokemonData(moveset) {
        const url = `${POKEAPI_BASE_URL}${moveset.pokemon.toLowerCase()}`;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error("No se pudo cargar el Pokémon");
                return response.json();
            })
            .then(data => {
                const spriteUrl = data.sprites.front_default;

                const pokemonDiv = document.createElement("div");
                pokemonDiv.classList.add("pokemon-card", "m-2", "p-3", "border", "rounded", "bg-light", "d-flex", "flex-column", "align-items-center");
                pokemonDiv.onclick = () => showPokemonDetails(moveset);

                const img = document.createElement("img");
                img.src = spriteUrl;
                img.alt = data.name;
                img.classList.add("pokemon-img");
                pokemonDiv.appendChild(img);

                const nameDiv = document.createElement("div");
                nameDiv.classList.add("text-dark", "mt-2");
                nameDiv.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
                pokemonDiv.appendChild(nameDiv);

                pokemonContainer.appendChild(pokemonDiv);
            })
            .catch(error => {
                console.error("Error al cargar el Pokémon:", error);
            });
    }

    // Cargar los Pokémon de acuerdo a los movesets
    movesets.forEach(moveset => {
        loadPokemonData(moveset);
    });
});
