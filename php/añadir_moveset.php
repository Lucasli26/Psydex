<?php
include("./conexion.php");
// include("./comprobar_login.php");
try {
    $db = new PDO($cadena_conexion, $usuario, $clave);
} catch (PDOException $e) {
    echo "Error con la base de datos: " . $e->getMessage();
    exit;
}



// Obtener el nombre del equipo desde la sesión
$teamName = isset($_SESSION['equipo']) ? $_SESSION['equipo'] : null;
if (!$teamName) {
    echo "Error: No se especificó el equipo.";
    exit;
}

// Obtener el ID del equipo usando el nombre del equipo y el ID del usuario
$query = $db->prepare("SELECT id FROM equipos WHERE nombre = :teamName AND usuario = :userId");
$query->bindParam(':teamName', $teamName, PDO::PARAM_STR);
$query->bindParam(':userId', $_SESSION['id'], PDO::PARAM_INT);
$query->execute();
$team = $query->fetch(PDO::FETCH_ASSOC);

if (!$team) {
    echo "Error: No se encontró el equipo.";
    exit;
}

$teamId = $team['id'];

// Valores predeterminados para el nuevo moveset
$defaultPokemon = "Ditto";
$defaultHabilidad = "No definido";
$defaultTeratipo = "Normal";
$defaultEvs = "0 HP / 0 Atk / 0 Def / 0 SpA / 0 SpD / 0 Spe";
$defaultIvs = "31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe";
$defaultMoves = "Move1 - Move2 - Move3 - Move4";
$defaultNaturaleza = "Adamant";
$defaultObjeto = "No definido";
$usuarioId = 1;

try {
    // Inicia una transacción
    $db->beginTransaction();

    // Insertar un nuevo moveset en la tabla moveset
    $insertMovesetQuery = "
        INSERT INTO moveset (pokemon, habilidades, teratipo, evs, ivs, moves, naturaleza, objeto, usuario)
        VALUES (:pokemon, :habilidades, :teratipo, :evs, :ivs, :moves, :naturaleza, :objeto, :usuario)
    ";
    $stmtMoveset = $db->prepare($insertMovesetQuery);
    $stmtMoveset->execute([
        ':pokemon' => $defaultPokemon,
        ':habilidades' => $defaultHabilidad,
        ':teratipo' => $defaultTeratipo,
        ':evs' => $defaultEvs,
        ':ivs' => $defaultIvs,
        ':moves' => $defaultMoves,
        ':naturaleza' => $defaultNaturaleza,
        ':objeto' => $defaultObjeto,
        ':usuario' => $usuarioId,
    ]);

    // Obtener el ID del moveset recién creado
    $movesetId = $db->lastInsertId();

    // Insertar la relación en la tabla equipo_set
    $insertEquipoSetQuery = "
        INSERT INTO equipo_set (equipo, moveset)
        VALUES (:equipo, :moveset)
    ";
    $stmtEquipoSet = $db->prepare($insertEquipoSetQuery);
    $stmtEquipoSet->execute([
        ':equipo' => $teamId,
        ':moveset' => $movesetId,
    ]);

    // Confirmar la transacción
    $db->commit();

    header("Location: ../teambuilder.php?teamName=". $teamName ."");

} catch (PDOException $e) {
    // Si ocurre un error, revertir la transacción
    $db->rollBack();
    echo "Error al añadir el moveset: " . $e->getMessage();
}
?>
