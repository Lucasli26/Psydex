<?php
include("./php/conexion.php");

try {
    $db = new PDO($cadena_conexion, $usuario, $clave);
} catch (PDOException $e) {
    echo "Error con la base de datos: " . $e->getMessage();
    exit;
}

// Obtener los datos del formulario (usando POST)
$pokemon = isset($_POST['pokemon']) ? strtolower($_POST['pokemon']) : '';
$habilidades = isset($_POST['habilidades']) ? strtolower($_POST['habilidades']) : '';
$objeto = isset($_POST['objeto']) ? strtolower($_POST['objeto']) : '';
$teratipo = isset($_POST['teratipo']) ? strtolower($_POST['teratipo']) : '';
$naturaleza = isset($_POST['naturaleza']) ? strtolower($_POST['naturaleza']) : '';
$moves = isset($_POST['moves']) ? strtolower($_POST['moves']) : '';

// Asegúrate de tener el ID del equipo para actualizar el moveset
$teamName = isset($_GET['teamName']) ? htmlspecialchars($_GET['teamName']) : 'Equipo no especificado';
$query = $db->prepare("SELECT id FROM equipos WHERE nombre = :teamName");
$query->bindParam(':teamName', $teamName);
$query->execute();
$team = $query->fetch(PDO::FETCH_ASSOC);

if ($team) {
    $teamId = $team['id'];
} else {
    echo "No se encontró el equipo.";
    exit;
}

// Actualizar el moveset en la base de datos
$query = $db->prepare("
    UPDATE moveset 
    SET pokemon = :pokemon,
        habilidades = :habilidades,
        objeto = :objeto,
        teratipo = :teratipo,
        naturaleza = :naturaleza,
        moves = :moves
    WHERE equipo_id = :teamId
");

$query->bindParam(':pokemon', $pokemon);
$query->bindParam(':habilidades', $habilidades);
$query->bindParam(':objeto', $objeto);
$query->bindParam(':teratipo', $teratipo);
$query->bindParam(':naturaleza', $naturaleza);
$query->bindParam(':moves', $moves);
$query->bindParam(':teamId', $teamId);

if ($query->execute()) {
    echo "Actualización exitosa.";
} else {
    echo "Error al actualizar los datos.";
}
?>
