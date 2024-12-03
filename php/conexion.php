<?php
session_start();

// Datos de conexión a la base de datos
$cadena_conexion = "mysql:dbname=psydex;host=127.0.0.1";
$usuario = "root";
$clave = "";

$db = new PDO($cadena_conexion, $usuario, $clave);
$correoNombre = "";
$con = "";

try {
    // Crear la instancia PDO
    $pdo = new PDO($cadena_conexion, $usuario, $clave);
    // Configurar el modo de error para excepciones
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error al conectar con la base de datos: " . $e->getMessage());
}
?>
