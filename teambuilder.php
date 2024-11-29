<?php
include("./php/conexion.php");

try {
    $db = new PDO($cadena_conexion, $usuario, $clave);
} catch (PDOException $e) {
    echo "Error con la base de datos: " . $e->getMessage();
}

// Capturamos el ID del equipo desde la URL
$teamName = isset($_GET['teamName']) ? htmlspecialchars($_GET['teamName']) : 'Equipo no especificado';

// Obtener el ID del equipo usando el nombre del equipo
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

// Obtener los IDs de los movesets del equipo
$query = $db->prepare("SELECT moveset FROM equipo_set WHERE equipo = :teamId");
$query->bindParam(':teamId', $teamId);
$query->execute();
$movesetIds = $query->fetchAll(PDO::FETCH_COLUMN);

$pokemonIds = []; // Array para almacenar los IDs de Pokémon

// Para cada moveset, obtenemos el pokemon asociado
foreach ($movesetIds as $movesetId) {
    // Obtener el Pokémon asociado al moveset
    $query = $db->prepare("SELECT pokemon FROM moveset WHERE id = :movesetId");
    $query->bindParam(':movesetId', $movesetId);
    $query->execute();
    $pokemonId = $query->fetch(PDO::FETCH_ASSOC)['pokemon'];

    if ($pokemonId) {
        $pokemonIds[] = $pokemonId; // Almacenamos el ID de Pokémon
    }
}

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teambuilder</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="icon" href="./img/Psydex.png" type="image/png">
    <link rel="stylesheet" href="./css/css.css">
</head>
<body class="bg-dark text-center d-flex flex-column align-items-center">
    <?php include("./php/cabezera.php"); ?>

    <h1 class="text-light mt-4">Teambuilding: <?php echo $teamName; ?></h1>

    <!-- Contenedor para los Pokémon del equipo -->
    <div id="pokemon-container" class="container mt-4 d-flex flex-wrap justify-content-center">
        <!-- Los Pokémon se cargarán aquí mediante JavaScript -->
    </div>

    <!-- Input oculto con los Pokémon del equipo -->
    <input type="hidden" id="pokemon-ids" value="<?php echo htmlspecialchars(json_encode($pokemonIds)); ?>">
    
    <!-- Cargar el archivo JS -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="./js/teambuilder.js"></script>
</body>
</html>
