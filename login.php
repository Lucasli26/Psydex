<?php

include("./php/conexion.php");
include("./php/comprobar_login.php");

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PsyDex</title>
    <!-- Estilos Bootstrap -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link rel="icon" href="./img/Psydex.png" type="image/png">
    <style>
        * {
            color: white;
            text-align: center;
        }
        .vertical-line {
            border-left: 1px solid white; /* Línea vertical blanca */
            height: 100%;
        }
        #container {
            border-radius: 20px;
        }
        .form-control{
            max-width: 300px;
        }
    </style>
</head>
<body class="bg-dark d-flex justify-content-center align-items-center flex-column vh-100">
    <!-- Logo -->
    <img class="mb-4 mx-auto img-fluid" src="./img/Psydex.png" alt="Psydex" >

    <!-- Contenido principal -->
    <main class="container mb-5">
        <div id="container" class="row bg-danger rounded p-4">
            <!-- Mensaje de error o redirección -->
            <div class="col-12">
                <?php
                    if (isset($users)) {
                        if ($users === false) {
                            echo "El Correo, Nombre o Contraseña están incorrectos";
                        } else {
                            session_start();
                            $_SESSION["usu"] = $users["nombre"];
                            $_SESSION["usuEmail"] = $users["email"];
                            $_SESSION["id"] = $users["id"];
                            header("Location: ./index.php");
                        }
                    }
                ?>
            </div>

            <!-- Sección de bienvenida -->
            <div class="col-12 col-md-4 text-center d-flex flex-column align-items-center justify-content-center mb-3 mb-md-0">
                <h2>Bienvenid@s</h2>
                <h5>A la mejor Pokedex jamás creada.</h5>
            </div>

            <!-- Formulario de inicio de sesión -->
            <div class="col-12 col-md-8">
                <form method="post" class="text-center">
                    <div class="form-group d-flex flex-column align-items-center justify-content-center">
                        <label for="exampleInputEmail1">Correo electrónico / Nombre</label>
                        <input type="text" name="correoNombre" class="form-control" id="exampleInputEmail1" placeholder="Ingrese su correo o nombre">
                    </div>
                    <div class="form-group d-flex flex-column align-items-center justify-content-center">
                        <label for="exampleInputPassword1">Contraseña</label>
                        <input type="password" name="con" class="form-control" id="exampleInputPassword1" placeholder="Contraseña">
                    </div>
                    <div class="d-flex flex-column flex-md-row justify-content-center align-items-center">
                        <button type="submit" class="btn btn-dark border-white me-0 me-md-2 mb-2 mb-md-0">Iniciar sesión</button>
                        <a href="./newUsuario.php" class="btn btn-dark border-white">Registrarse</a>
                    </div>
                </form>
            </div>
        </div>
    </main>

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Scripts Bootstrap -->
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
