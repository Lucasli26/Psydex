<?php
include("./conexion.php");
// include("./php/comprobar_login.php");
try {
    $db = new PDO($cadena_conexion, $usuario, $clave);
} catch (PDOException $e) {
    echo "Error con la base de datos: " . $e->getMessage();
    exit;
}

if (isset($_SESSION['equipo'])) {
    $teamName = $_SESSION['equipo'];
    echo " El equipo seleccionado es: " . $teamName . "<br>";
} else {
    echo "No se ha especificado un equipo.<br>";
    exit;
}

// Obtener el ID del Pokémon desde la URL (variable ejemplo)
$pokemonId = isset($_GET['IDPokemon']) ? $_GET['IDPokemon'] : '';

echo "El id del pokemon es:  $pokemonId";

if (!$pokemonId) {
    echo "No se especificó el ID del moveset a eliminar.";
    exit;
}

try {
    // Iniciar una transacción para mantener la consistencia en la base de datos
    $db->beginTransaction();

    // Eliminar la relación en la tabla equipo_set
    $queryEquipoSet = $db->prepare("DELETE FROM equipo_set WHERE moveset = :pokemonId");
    $queryEquipoSet->bindParam(':pokemonId', $pokemonId, PDO::PARAM_INT);
    $queryEquipoSet->execute();

    // Eliminar el registro del moveset
    $queryMoveset = $db->prepare("DELETE FROM moveset WHERE id = :pokemonId");
    $queryMoveset->bindParam(':pokemonId', $pokemonId, PDO::PARAM_INT);
    $queryMoveset->execute();

    // Confirmar la transacción
    $db->commit();

    // echo "El moveset con ID $pokemonId ha sido eliminado correctamente.";
    header("Location: ../teambuilder.php?teamName=". $teamName ."");
} catch (Exception $e) {
    // Revertir la transacción en caso de error
    $db->rollBack();
    echo "Error al eliminar el moveset: " . $e->getMessage();
}
?>
