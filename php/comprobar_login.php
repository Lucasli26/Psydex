<?php

try {
    $db = new PDO($cadena_conexion, $usuario, $clave);
    $correoNombre = "";
    $con = "";

    // Hacemos un método POST para que recibamos los valores del formulario y los transformemos a valores
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $correoNombre = $_POST["correoNombre"];
        $con = $_POST["con"];
        
        // Modificamos la consulta para buscar por email o nombre
        $sqlLog = "SELECT * FROM usuarios WHERE (email = :correoNombre OR nombre = :correoNombre) AND clave = :con";
        $usu = $db->prepare($sqlLog);
        $usu->bindParam(':correoNombre', $correoNombre);
        $usu->bindParam(':con', $con);
        $usu->execute();

        $users = $usu->fetch();
    } else {
        $users = null;
    }

    if(isset($_SESSION["id"])){
        // Modificamos la consulta para buscar por email o nombre
        $sqlLog = "SELECT * FROM usuarios WHERE id = " . $_SESSION["id"] . " ";
        $usu = $db->prepare($sqlLog);
        $usu->execute();

        $User = $usu->fetch();
    }

} catch (PDOException $e) {
    echo "Error con la base de datos: " . $e->getMessage();
}

?>