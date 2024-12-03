<?php
include("./conexion.php");

try {
    $db = new PDO($cadena_conexion, $usuario, $clave);
} catch (PDOException $e) {
    echo "Error con la base de datos: " . $e->getMessage();
    exit;
}

$pokemon = isset($_GET['pokemon']) ? $_GET['pokemon'] : '';
$habilidades = isset($_GET['habilidades']) ? $_GET['habilidades'] : '';
$objeto = isset($_GET['objeto']) ? $_GET['objeto'] : '';
$teratipo = isset($_GET['teratipo']) ? $_GET['teratipo'] : '';
$naturaleza = isset($_GET['naturaleza']) ? $_GET['naturaleza'] : '';
$moves = isset($_GET['moves']) ? $_GET['moves'] : '';
$evs = isset($_GET['evs']) ? $_GET['evs'] : '';
$ivs = isset($_GET['ivs']) ? $_GET['ivs'] : '';
$pokemonId = isset($_GET['pokemonId']) ? $_GET['pokemonId'] : '';

echo "Datos recibidos mediante GET:";
echo "Pokemon: $pokemon, Habilidades: $habilidades, Objeto: $objeto, pokemonID: $pokemonId </br>";


if (isset($_SESSION['equipo'])) {
    $teamName = $_SESSION['equipo'];
    echo " El equipo seleccionado es: " . $teamName . "<br>";
} else {
    echo "No se ha especificado un equipo.<br>";
    exit;
}

// Obtener el id del equipo
$query = $db->prepare("SELECT id FROM equipos WHERE nombre = :teamName");
$query->bindParam(':teamName', $teamName);
$query->execute();
$team = $query->fetch(PDO::FETCH_ASSOC);

if ($team) {
    $teamId = $team['id'];
    echo "El ID del equipo es: " . $teamId . "<br>";
} else {
    echo "No se encontró el equipo.<br>";
    exit;
}

// Obtener el id del moveset asociado al equipo mediante la tabla intermedia equipo-set
$query = $db->prepare("SELECT es.moveset FROM equipo_set es WHERE es.equipo = :teamId");
$query->bindParam(':teamId', $teamId);
$query->execute();
$equipoSet = $query->fetch(PDO::FETCH_ASSOC);

if ($equipoSet) {
    $movesetId = $equipoSet['moveset'];
    echo "El ID del moveset relacionado con el equipo es: " . $movesetId . "<br>";
} else {
    echo "No se encontró el moveset relacionado con el equipo.<br>";
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
        moves = :moves,
        evs = :evs,
        ivs = :ivs
    WHERE pokemon = :pokemonId
");

$query->bindParam(':pokemon', $pokemon);
$query->bindParam(':habilidades', $habilidades);
$query->bindParam(':objeto', $objeto);
$query->bindParam(':teratipo', $teratipo);
$query->bindParam(':naturaleza', $naturaleza);
$query->bindParam(':moves', $moves);
$query->bindParam(':evs', $evs);
$query->bindParam(':ivs', $ivs);
$query->bindParam(':pokemonId', $pokemonId);

// $query->debugDumpParams(); // Debugging para ver los valores pasados

// Ejecutar la actualización
if ($query->execute()) {
    // echo "Actualización exitosa.";
    header("Location: ../teambuilder.php?teamName=". $teamName ."");
} else {
    echo "Error al actualizar los datos.";
}
?>
