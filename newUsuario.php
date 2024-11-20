<?php

include("./php/conexion.php");

try {
    $db = new PDO($cadena_conexion, $usuario, $clave);

    // Variables para almacenar los valores del formulario
    $nombre = "";
    $correo = "";
    $con = "";

    // Hacemos un método POST para que recibamos los valores del formulario y transformarlos a valores
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $nombre = $_POST["nombre"];
        $correo = $_POST["correo"];
        $con = $_POST["con"];

        // Insertar el nuevo usuario en la base de datos
        $sqlInsert = "INSERT INTO usuarios (email, nombre, clave) VALUES (:correo, :nombre, :con)";
        $stmt = $db->prepare($sqlInsert);
        $stmt->bindParam(':correo', $correo);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':con', $con);
        $stmt->execute();

        // Redirigir al inicio de sesión después del registro
        header("Location: ./login.php");
        exit();
    }

} catch(PDOException $e) {
    echo "Error con la base de datos: " . $e->getMessage();
}

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Psydex - Registro</title>
    <!-- Estilos Bootstrap -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link rel="icon" href="./img/Psydex.png" type="image/png">
    <style>
        *{
            /* border: solid 1px black; */
            color: white;
            text-align: center;
        }
        .vertical-line {
            border-left: 1px solid white; /* Línea vertical blanca */
            height: 100%;
        }
        #container{
            border-radius: 15px;
        }
    </style>
</head>
<body class="bg-dark container-fluid d-flex justify-content-center align-items-center flex-column vh-100">
    <img class="mb-4 mx-auto" src="./img/Psydex.png" alt="Psydex">
    <main class="col-7">
        <div id="container" class="row bg-danger d-flex justify-content-around align-items-center p-3">
            <div class="col-12">
                <?php
                if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($stmt)) {
                    if ($stmt->rowCount() > 0) {
                        echo "<div class='alert alert-success'>Registro exitoso. Redirigiendo al inicio de sesión...</div>";
                    } else {
                        echo "<div class='alert alert-danger'>Error en el registro. Por favor, inténtelo de nuevo.</div>";
                    }
                }
                ?>
            </div>
            <div class="col-5">
              <h2 class="text-center">Registrate</h2>
              <h5>Regístrate para crear tus equipos y ver los de los demás.</h5>
            </div>
            <div class="col-5">
                <div class="ml-3 col-10">
                    <form method="post">
                        <div class="form-group">
                            <label for="nombre">Nombre de Usuario</label>
                            <input type="text" name="nombre" class="form-control" id="nombre" placeholder="Ingrese su nombre">
                        </div>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Correo Electrónico</label>
                            <input type="email" name="correo" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Ingrese su correo">
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Contraseña</label>
                            <input type="password" name="con" class="form-control" id="exampleInputPassword1" placeholder="Contraseña">
                        </div>
                        <button type="submit" class="btn btn-dark border-white">Registrase</button>
                        <a href="./login.php" class="btn btn-dark border-white">Iniciar Sesión</a>
                    </form>
                </div>
            </div>
        </div>
    </main>
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Scripts Bootstrap -->
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
