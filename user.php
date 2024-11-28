<?php
include("./php/conexion.php");
include("./php/comprobar_login.php");

try {
    $pdo = new PDO($cadena_conexion, $usuario, $clave);

    $usuario_id = $User["id"]; // ID del usuario logueado

    // Consulta para obtener los equipos y Pokémon
    $sql = "SELECT e.nombre AS equipo_name, m.pokemon AS pokemon_id
            FROM equipo_set es
            JOIN equipos e ON es.equipo = e.id
            JOIN moveset m ON es.moveset = m.id
            WHERE e.usuario = :usuario_id";

    $query = $pdo->prepare($sql);
    $query->bindParam(":usuario_id", $usuario_id, PDO::PARAM_INT);
    $query->execute();

    $resultados = $query->fetchAll(PDO::FETCH_ASSOC);

    // Si no hay resultados, asignamos un array vacío
    if (!$resultados) {
        $resultados = [];
    }
} catch (PDOException $e) {
    // Registrar errores en un archivo log (opcional)
    error_log("Error al obtener datos de equipos: ");
    $resultados = [];
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PsyDex</title>
    <!-- Enlace a Bootstrap -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="icon" href="./img/Psydex.png" type="image/png">
    <link rel="stylesheet" href="./css/css.css">
    <style>
        body {
            color: white;
        }

        #profile-pic-container {
            width: 175px;
            height: 175px;
            border-radius: 50%;
            overflow: hidden;
            border: 3px solid #fff;
            margin: auto;
            position: relative;
            background-color: rgba(0, 0, 0, 0.7);
            margin-top: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #profile-pic-container img {
            width: 80%;
            height: 80%;
            object-fit: cover;
            z-index: 1;
        }

        .team-preview {
            display: flex;
            flex-direction: column; /* Organiza el contenido en columna */
            align-items: center;
            margin-bottom: 15px;
            padding: 20px;
            border-radius: 10px;
            background-color: #f8f9fa;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .team-name {
            background-color: #343a40; /* Fondo oscuro */
            color: white;
            padding: 10px;
            border-radius: 5px;
            width: 100%;
            text-align: center;
            margin-bottom: 15px;
            font-size: 1.2rem;
        }

        .pokemon-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        }

        .pokemon-img {
            width: 90px;
            height: 90px;
            margin: 5px;
        }

    </style>
</head>
<body class="bg-dark text-center d-flex flex-column align-items-center">
    <?php include("./php/cabezera.php"); ?>

    <div class="container col-12 m-4">
        <h2>Welcome <?php echo htmlspecialchars($User["nombre"]); ?></h2>

        <!-- Contenedor para la foto del perfil -->
        <section>
            <div id="profile-pic-container"></div>
        </section>

        <!-- Contenedor para los equipos -->
        <section>
            <div id="team-previews" class="d-flex flex-wrap justify-content-center mt-4"></div>
        </section>

        <!-- Input oculto con los datos de los equipos -->
        <input type="hidden" id="teams-data" value="<?php echo htmlspecialchars(json_encode($resultados)); ?>">

        <!-- Mensaje si no hay equipos -->
        <?php if (empty($resultados)): ?>
            <p class="text-warning mt-4">No tienes equipos registrados.</p>
        <?php endif; ?>
    </div>

    <!-- Pasar el nombre del Pokémon a JavaScript -->
    <script>
        const userPokemon = "<?php echo htmlspecialchars($User['pokefoto'] ?? ''); ?>";
    </script>

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Scripts Bootstrap -->
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <!-- Archivo de JavaScript personalizado -->
    <script src="./js/profile.js"></script>
</body>
</html>
