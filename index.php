<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pokedex con Paginación</title>
  <style>
    body {
      background-color: #87CEEB;
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #333;
    }

    #pokemon-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 20px;
    }

    .pokemon-item {
      background-color: #fff;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      text-align: center;
      font-weight: bold;
      text-transform: capitalize;
    }

    #pagination {
      margin-top: 20px;
    }

    .pagination-button {
      margin: 0 5px;
      padding: 8px 12px;
      background-color: #333;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1em;
    }

    .pagination-button.active {
      background-color: #ffcb05;
      color: #333;
      font-weight: bold;
    }

    #itemsPerPageSelect {
      margin-top: 15px;
      font-size: 1em;
      padding: 5px;
    }
  </style>
</head>
<body>
  <h1>Pokedex</h1>

  <label for="itemsPerPageSelect">Pokémon por página:</label>
  <select id="itemsPerPageSelect">
    <option value="10">10</option>
    <option value="20">20</option>
    <option value="50">50</option>
  </select>

  <div id="pokemon-container"></div>

  <div id="pagination"></div>

  <script src="script.js"></script>
</body>
</html>
