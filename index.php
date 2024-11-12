<?php
session_start();
//Conexion con la base de datos
$cadena_conexion = "mysql:dbname=psydex;host=127.0.0.1";
$usuario = "root";
$clave = "";

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
  <style>
        *{
            /* border: solid 1px black; */
            /* color: white; */
            text-align: center;
        }
        .vertical-line {
            border-left: 1px solid white; /* Línea vertical blanca */
            height: 100%;
        }
        #container{
            /* border: solid 5px blue; */
            border-radius: 15px;
        }
        .fotoLogo{
          height: auto;
          width: 75px;
        }
    </style>
</head>

<body class="bg-dark text-center  d-flex flex-column align-items-center">

  <div class="header col-12">
    <div class="col-4"></div>
    <img id="fotoLogo" class="m-3" src="./img/Psydex.png" alt="Psydex">
    <div class="col-4"></div>
  </div>

  <div class="container">
  
    <div id="pokemon-container" class="row justify-content-center"></div>

    <div id="pagination" class="mt-4"></div>
  </div>

  <!-- Enlace a tu script JavaScript -->
  <script src="script.js"></script>
</body>

</html>
