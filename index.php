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
    * {
      /* border: solid 1px black; */
      /* color: white; */
      text-align: center;
    }

    .vertical-line {
      border-left: 1px solid white;
      /* Línea vertical blanca */
      height: 100%;
    }

    #container {
      /* border: solid 5px blue; */
      border-radius: 15px;
    }

    #fotoLogo { 
      min-width: 75px;
    }
    a{
      font-size: 25px;
    }
    #pokemon-search-input{
      font-size: 11px;
    }
  </style>
</head>

<body class="bg-dark text-center  d-flex flex-column align-items-center">

<div class="header bg-danger p-3 col-12 d-flex flex-column flex-sm-row justify-content-center align-items-center">
    <div class="col-12 col-sm-4 d-flex justify-content-center">
        <a class="text-dark" href="./php/logout.php">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-door-open-fill text-warning" viewBox="0 0 16 16">
                <path d="M1.5 15a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2.5A1.5 1.5 0 0 0 11.5 1H11V.5a.5.5 0 0 0-.57-.495l-7 1A.5.5 0 0 0 3 1.5V15zM11 2h.5a.5.5 0 0 1 .5.5V15h-1zm-2.5 8c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1"/>
            </svg>
            <p>Log Out</p>
        </a>
    </div>
    <div class="col-12 col-sm-4 d-flex justify-content-center">
        <img id="fotoLogo" src="./img/Psydex.png" alt="Psydex" class="img-fluid">
    </div>
    <div class="col-12 col-sm-4"></div>
</div>


<div class="d-flex-search-container">
  <div class="d-flex">
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