<?php

include("./php/conexion.php");

try {
  $db = new PDO($cadena_conexion, $usuario, $clave);
  if (isset($_SESSION["id"])) {
    $sqlLog = "SELECT * FROM usuarios where id = ?";
    $usu = $db->prepare($sqlLog);
    $usu->execute([$_SESSION["id"]]);
    $usuario = $usu->fetch();
  }
} catch (PDOException $e) {
  echo "Error con la base de datos: " . $e->getMessage();
}


?>

<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pokedex con Paginación</title>
  <!-- Enlace a Bootstrap -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <link rel="icon" href="./img/Psydex.png" type="image/png">
  <link rel="stylesheet" href="./css/css.css">
  <style>

  </style>
</head>

<body class="bg-dark text-center  d-flex flex-column align-items-center">


<?php
include("./php/cabezera.php");
?>

<div class="filters-container d-flex justify-content-center align-items-center mt-3">
    <div class="form-group mx-2">
        <label for="filterOrder" class="text-white">Order:</label>
        <select id="filterOrder" class="form-control">
            <option value="number">Nº Dex</option>
            <option value="name">Alphabetically</option>
        </select>
    </div>
    <div class="form-group mx-2">
        <label for="filterType" class="text-white">Type:</label>
        <select id="filterType" class="form-control">
            <option value="all">All</option>
        </select>
    </div>
    <button id="applyFilters" class="btn btn-warning mx-2">Apply</button>
</div>

<div class="d-flex-search-container mt-2">
  <div class="d-flex justify-content-center align-items-center">
    <input id="searchInput" type="text" class="form-control search-input" placeholder="Search for name or ID">
    <button id="searchButton" class="btn btn-primary m-2 ms-2">Search</button>
    <button id="clearSearchButton" class="btn btn-secondary ms-2">Clear</button>
  </div>
  <div id="autocomplete-container"></div>
</div>



  <div class="container col-12">
    <div id="pokemon-container" class="row justify-content-center"></div>

    <div id="pagination" class="mt-4"></div>
  </div>

<!-- Archivo principal de JavaScript -->
<script src="./js/script.js"></script>
<!-- archivos de filtro -->
<script src="./js/filtros.js"></script>
<!-- Archivo de búsqueda de JavaScript -->
<script src="./js/buscador.js"></script>

</body>

</html>