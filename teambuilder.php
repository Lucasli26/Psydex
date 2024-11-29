<?php

include("./php/conexion.php");

try {
  $db = new PDO($cadena_conexion, $usuario, $clave);

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






</body>

</html>