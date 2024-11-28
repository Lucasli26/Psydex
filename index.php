<?php

include("./php/conexion.php");

try {
  $db = new PDO($cadena_conexion, $usuario, $clave);

  if (isset($_SESSION["id"])) {
    $sqlLog = "SELECT * FROM usuarios where id = ?";
    $usu = $db->prepare($sqlLog);
    $usu->execute([$_SESSION["id"]]);
    $usuario = $usu->fetch();
  } else {
    echo "No se a iniciado sesion";
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


<div class="d-flex-search-container mt-2">
  <div class="d-flex ">
    <input id="searchInput" type="text" class="form-control search-input" placeholder="Buscar Pokémon por nombre o ID">
    <button id="searchButton" class="btn btn-primary ms-2">Buscar</button>
    <button id="clearSearchButton" class="btn btn-secondary ms-2">Limpiar</button>
  </div>
  <div id="autocomplete-container"></div>
</div>



  <div class="container col-12">
    <div id="pokemon-container" class="row justify-content-center"></div>

    <div id="pagination" class="mt-4"></div>
  </div>

<!-- Archivo principal de JavaScript -->
<script src="./script.js"></script>
<!-- Archivo de búsqueda de JavaScript -->
<script src="./buscador.js"></script>

</body>

</html>