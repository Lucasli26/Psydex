<?php

//Conexion con la base de datos
$cadena_conexion = "mysql:dbname=psydex;host=127.0.0.1";
$usuario = "root";
$clave ="";

try{
    $db = new PDO($cadena_conexion, $usuario, $clave);
    $correo = "";
    $con = "";

    //hacemos un metodo post para que recibamos los valores del formulario y transformarlos a valores
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $correo = $_POST["correo"];
        $con = $_POST["con"];
        
        //buscamos en la base de datos los valores que queremos atraves de los valores obtenidos por el formulario
        $sqlLog = "SELECT * FROM usuarios where email = :correo AND clave = :con";
        $usu = $db->prepare($sqlLog);
        $usu->bindParam(':correo', $correo);
        $usu->bindParam(':con', $con);
        $usu->execute();

        $users = $usu->fetch();

    }else{
        $users = null;
    }
    

}
catch(PDOException $e){
    echo "Error con la base de datos: " . $e->getMessage();
}

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PsyDex</title>
    <!-- Estilos Bootstrap -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link rel="icon" href="img/Psydex.png" type="image/png">
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
            /* border: solid 5px blue; */
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
                    if(isset($users)) {
                        if($users === false) {
                            echo "El Correo o Contraseña están incorrectos";
                        } else {
                            session_start(); 
                            $_SESSION["usu"] = $users["nombre"];
                            $_SESSION["usuEmail"] = $users["email"];
                            $_SESSION["id"] = $users["id"];
                            header("Location: index.php");
                        }
                    }
                ?>
            </div>

            <div class="col-4">
              <h2 class="text-center">Bienvenid@s</h2>
              <h5>A la mejor Pokedex jamás creada.</h5>
            </div>
             <div class="col-6">
                 <div class="ml-3 col-12 d-flex justify-content-center align-items-center">
                     <form method="post">
                         <div class="form-group">
                             <label for="exampleInputEmail1">Correo electrónico</label>
                             <input type="email" name="correo" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Ingrese su correo">
                         </div>
                         <div class="form-group">
                             <label for="exampleInputPassword1">Contraseña</label>
                             <input type="password" name="con" class="form-control" id="exampleInputPassword1" placeholder="Contraseña">
                         </div>
                         <div class="d-flex align-items-center">
                            <button type="submit" class="btn btn-dark border-white me-2">Iniciar sesión</button>
                            <a href="newUsuario.php" class="btn btn-dark border-white">Registrarse</a>
                        </div>
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
