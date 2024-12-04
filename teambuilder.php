<?php
include("./php/conexion.php");
include("./php/comprobar_login.php");

try {
    $db = new PDO($cadena_conexion, $usuario, $clave);
} catch (PDOException $e) {
    echo "Error con la base de datos: " . $e->getMessage();
}

// Capturamos el ID del equipo desde la URL
$teamName = isset($_GET['teamName']) ? htmlspecialchars($_GET['teamName']) : 'Equipo no especificado';
// Almacenas el nombre del equipo en la sesión
$_SESSION['equipo'] = $teamName;
// Obtener el ID del equipo usando el nombre del equipo y el ID del usuario
$query = $db->prepare("SELECT id FROM equipos WHERE nombre = :teamName AND usuario = :userId");
$query->bindParam(':teamName', $teamName, PDO::PARAM_STR);
$query->bindParam(':userId', $_SESSION['id'], PDO::PARAM_INT);
$query->execute();
$team = $query->fetch(PDO::FETCH_ASSOC);

if ($team) {
    $teamId = $team['id'];
} else {
    echo "No se encontró el equipo.";
    exit;
}

$query = "SELECT COUNT(*) as count FROM equipo_set WHERE equipo = ?";
$stmt = $pdo->prepare($query);
$stmt->execute([$teamId]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);
$result["count"];

$query = $db->prepare("
    SELECT 
        moveset.id,
        moveset.pokemon, 
        moveset.habilidades, 
        moveset.teratipo, 
        moveset.moves, 
        moveset.naturaleza, 
        moveset.objeto, 
        moveset.ivs,
        moveset.evs,
        equipo_set.capacidad
    FROM 
        equipo_set 
    JOIN 
        moveset ON equipo_set.moveset = moveset.id
    WHERE 
        equipo_set.equipo = :teamId
    ORDER BY 
        equipo_set.capacidad ASC
");
$query->bindParam(':teamId', $teamId);
$query->execute();
$movesets = $query->fetchAll(PDO::FETCH_ASSOC);

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
    <style>
        .pokemon-card{
            width: 250px;
        }
        /* Ajustar el tamaño de los inputs y espaciado */
        #details-container input,
        #details-container select {
            height: 40px; /* Reducir altura */
            margin-bottom: 8px; /* Separación entre elementos */
        }

        /* Alinear elementos */
        .item-sprite {
            vertical-align: middle;
            margin-left: 10px;
        }
        #item-suggestions-container {
            max-height: 150px; /* Altura máxima visible */
            overflow-y: auto; /* Habilitar scroll vertical */
            border: 1px solid #ccc; /* Añadir un borde para resaltar el contenedor */
            border-radius: 5px;
            background-color: #fff;
            z-index: 0; /* Asegurar que esté en el flujo normal */
            width: 100%; /* Asegurar que el ancho coincide con el input */
            display: none; /* Ocultar por defecto */
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Sombra sutil */
            top: 300px; /* Espacio entre el input y el contenedor */
            position: relative; /* Mantener el contenedor en el flujo del documento */
        }
    </style>
</head>
<body class="bg-dark text-center d-flex flex-column align-items-center">
    <?php include("./php/cabezera.php"); ?>

    <h1 class="text-light mt-4">Teambuilding: <?php echo $teamName; ?></h1>

    <!-- Contenedor para los Pokémon del equipo -->
    <div id="pokemon-container" class="container col-12 mt-4 d-flex flex-wrap justify-content-center">
    </div>

    <!-- Input oculto con los datos del equipo -->
    <input type="hidden" id="movesets-data" value="<?php echo htmlspecialchars(json_encode($movesets)); ?>">
    <input type="hidden" id="team-count" value="<?php echo $result['count']; ?>">


    <!-- Cargar el archivo JS -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="./js/ev-iv.js"></script>
    <script src="./js/teambuilder.js"></script>
    <script src="./js/select_teambuilder.js"></script>

</body>
</html>
