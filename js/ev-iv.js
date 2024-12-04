// Archivo: js/ev-iv.js


/**
 * Parsear la cadena de EVs en un objeto.
 * @param {string} evString - Cadena en formato "252 HP / 252 Atk / 4 Def / 0 SpA / 0 SpD / 0 Spe".
 * @returns {Object} EVs por estadística.
 */
function parseEVString(evString) {
    const evs = { HP: 0, Atk: 0, Def: 0, SpA: 0, SpD: 0, Spe: 0, total: 0 };
    evString.split("/").forEach(ev => {
        const [value, stat] = ev.trim().split(" ");
        if (stat) {
            evs[stat] = parseInt(value, 10);
            evs.total += parseInt(value, 10);
        }
    });
    return evs;
}

/**
 * Crear sección de textboxes para los EVs.
 * @param {string} evString - Cadena con los EVs como "252 HP / 252 Atk / 4 Def".
 */
function createEVTextboxes(evString) {
    const evSection = document.createElement("div");
    evSection.classList.add("mt-3", "text-center", "ev-section");
    
    // Etiqueta principal
    const evLabel = document.createElement("h6");
    evLabel.textContent = "EVs:";
    evLabel.classList.add("mb-2", "text-dark");
    evSection.appendChild(evLabel);

    // Contenedor para los inputs en fila
    const rowContainer = document.createElement("div");
    rowContainer.classList.add("d-flex", "flex-wrap", "justify-content-center", "align-items-center");

    // Parsear los EVs iniciales
    const evs = parseEVString(evString);

    const totalEVContainer = document.createElement("p");
    totalEVContainer.classList.add("text-warning", "small", "mb-2");
    totalEVContainer.textContent = `Total Points: ${evs.total}/508`;
    evSection.appendChild(totalEVContainer);

    // Crear los inputs para cada estadística
    ["HP", "Atk", "Def", "SpA", "SpD", "Spe"].forEach(stat => {
        const statContainer = document.createElement("div");
        statContainer.classList.add("d-flex", "flex-column", "align-items-center", "mx-2");

        const label = document.createElement("label");
        label.textContent = stat;
        label.classList.add("mb-1", "text-dark", "small");

        const input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.max = 252;
        input.step = 1;
        input.value = evs[stat]; // Valor inicial
        input.classList.add("form-control", "text-center", "w-100");

        // Validar entrada y actualizar total
        input.oninput = () => {
            if (input.value < 0) input.value = 0;
            if (input.value > 252) input.value = 252;

            updateEVTotal(stat, input.value, totalEVContainer, rowContainer);
        };

        // Añadir atributo data-stat para referencia en updateEVTotal
        input.setAttribute("data-stat", stat);

        statContainer.appendChild(label);
        statContainer.appendChild(input);
        rowContainer.appendChild(statContainer);
    });

    evSection.appendChild(rowContainer);

    // Botón de reinicio
    const resetButton = document.createElement("button");
    resetButton.textContent = "Restart EVs";
    resetButton.classList.add("btn", "btn-danger", "mt-3");
    resetButton.onclick = () => {
        resetEVs(rowContainer, totalEVContainer);
    };
    evSection.appendChild(resetButton);

    return evSection;
}

/**
 * Reinicia todos los EVs a 0.
 * @param {HTMLElement} rowContainer - Contenedor principal de los inputs.
 * @param {HTMLElement} totalDisplay - Elemento donde se muestra el total.
 */
function resetEVs(rowContainer, totalDisplay) {
    const inputs = rowContainer.querySelectorAll("input[type='number']");
    inputs.forEach(input => {
        input.value = 0; // Reiniciar cada input a 0
        input.disabled = false; // Asegurarse de que estén habilitados
    });
    totalDisplay.textContent = `Total Points: 0/508`; // Actualizar el contador de puntos totales
}


/**
 * Actualizar los EVs y bloquear incremento al alcanzar el límite.
 * @param {string} stat - Nombre de la estadística (HP, Atk, etc.).
 * @param {number} value - Nuevo valor del input.
 * @param {HTMLElement} totalDisplay - Elemento donde se muestra el total.
 * @param {HTMLElement} rowContainer - Contenedor principal de los inputs.
 */
function updateEVTotal(stat, value, totalDisplay, rowContainer) {
    const maxEVs = 508;
    const inputs = rowContainer.querySelectorAll("input[type='number']");

    // Calcular total actual
    let total = 0;
    inputs.forEach(input => {
        total += parseInt(input.value, 10);
    });

    // Verificar límite
    if (total > maxEVs) {
        const excess = total - maxEVs;
        const currentInput = [...inputs].find(input => input.getAttribute("data-stat") === stat);
        currentInput.value = parseInt(currentInput.value, 10) - excess;
        total = maxEVs;
    }

    totalDisplay.textContent = `Total Points: ${total}/508`;

    // Deshabilitar inputs si el total alcanza el máximo
    inputs.forEach(input => {
        const currentTotal = [...inputs].reduce((sum, i) => sum + parseInt(i.value, 10), 0);
        input.disabled = currentTotal >= maxEVs && parseInt(input.value, 10) < parseInt(input.max, 10);
    });
}


/**
 * Crear sección de textboxes para los IVs.
 * @param {string} ivString - Cadena con los IVs como "25 HP / 14 Atk / 0 Def / 1 SpA / 16 SpD / 31 Spe".
 */
function createIVTextboxes(ivString) {
    const ivSection = document.createElement("div");
    ivSection.classList.add("mt-3", "text-center", "iv-section");

    // Etiqueta principal
    const ivLabel = document.createElement("h6");
    ivLabel.textContent = "IVs:";
    ivLabel.classList.add("mb-2", "text-dark");
    ivSection.appendChild(ivLabel);

    // Contenedor para los inputs en fila
    const rowContainer = document.createElement("div");
    rowContainer.classList.add("d-flex", "flex-wrap", "justify-content-center", "align-items-center");

    // Parsear los IVs iniciales
    const ivs = parseEVString(ivString); // Reutilizamos parseEVString para leer los IVs.

    // Crear los inputs para cada estadística
    ["HP", "Atk", "Def", "SpA", "SpD", "Spe"].forEach(stat => {
        const statContainer = document.createElement("div");
        statContainer.classList.add("d-flex", "flex-column", "align-items-center", "mx-2");

        const label = document.createElement("label");
        label.textContent = stat;
        label.classList.add("mb-1", "text-dark", "small");

        const input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.max = 31;
        input.step = 1;
        input.value = ivs[stat]; // Valor inicial
        input.classList.add("form-control", "text-center", "w-100");
        input.oninput = () => {
            if (input.value < 0) input.value = 0;
            if (input.value > 31) input.value = 31;
        };

        statContainer.appendChild(label);
        statContainer.appendChild(input);
        rowContainer.appendChild(statContainer);
    });

    ivSection.appendChild(rowContainer);

    return ivSection;
}

