// Referencias a elementos de la interfaz de búsqueda
const searchInput = document.getElementById("pokemon-search-input");
const searchButton = document.getElementById("pokemon-search-button");

// Función para buscar un Pokémon por nombre y mostrarlo
async function searchPokemon() {
    const query = searchInput.value.trim().toLowerCase(); // Obtiene el valor de búsqueda y lo convierte a minúsculas

    if (!query) {
        alert("Por favor, ingresa el nombre de un Pokémon para buscar.");
        return;
    }

    const url = `https://pokeapi.co/api/v2/pokemon/${query}`;

    try {
        const response = await fetch(url);

        // Verificar si el Pokémon existe
        if (!response.ok) {
            alert("No se encontró el Pokémon. Verifica el nombre e intenta nuevamente.");
            return;
        }

        const pokemonData = await response.json();

        // Limpiar el contenedor de Pokémon
        clearContainer(pokemonContainer); 

        // Crear el elemento para el Pokémon encontrado
        displaySinglePokemon(pokemonData);
    } catch (error) {
        console.error("Error al buscar el Pokémon:", error);
        alert("Ocurrió un error al buscar el Pokémon. Intenta nuevamente.");
    }
}

// Evento para el botón de búsqueda
searchButton.addEventListener("click", searchPokemon);

// Permitir que la búsqueda también se ejecute con "Enter" en el campo de búsqueda
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchPokemon();
    }
});
