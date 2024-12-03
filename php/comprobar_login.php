<?php

try {
    $db = new PDO($cadena_conexion, $usuario, $clave);
    $correoNombre = "";
    $con = "";

    if(isset($_SESSION["id"])){
        // Modificamos la consulta para buscar por email o nombre
        $sqlLog = "SELECT * FROM usuarios WHERE id = " . $_SESSION["id"] . " ";
        $usu = $db->prepare($sqlLog);
        $usu->execute();

        $User = $usu->fetch();
    }else{
        // Si no hay un usuario autenticado, redirigir al login
        header("Location: ./login.php");
        exit;
    }

} catch (PDOException $e) {
    echo "Error con la base de datos: " . $e->getMessage();
}

?>