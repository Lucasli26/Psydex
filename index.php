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

    .fotoLogo {
      height: auto;
      width: 75px;
    }
  </style>
</head>

<body class="bg-dark text-center  d-flex flex-column align-items-center">

  <div class="header col-12">
    <div class="col-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-door-open-fill text-danger" viewBox="0 0 16 16">
        <path d="M1.5 15a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2.5A1.5 1.5 0 0 0 11.5 1H11V.5a.5.5 0 0 0-.57-.495l-7 1A.5.5 0 0 0 3 1.5V15zM11 2h.5a.5.5 0 0 1 .5.5V15h-1zm-2.5 8c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1"/>
      </svg>
    </div>
    <img id="fotoLogo" class="m-3" src="./img/Psydex.png" alt="Psydex">
    <div class="col-4"></div>
  </div>

  <!-- Buscador de Pokémon -->
  <div class="search-container my-3 col-4 text-center">
      <input type="text" id="pokemon-search-input" placeholder="Buscar Pokémon por nombre" class="form-control w-50 mx-auto">
      <button id="pokemon-search-button" class="btn btn-primary mt-2">Buscar</button>
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