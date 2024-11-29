<?php
include("./php/conexion.php");
include("./php/comprobar_login.php");

try {
    $pdo = new PDO($cadena_conexion, $usuario, $clave);

    $usuario_id = $User["id"]; // ID del usuario logueado

    // Consulta para obtener los equipos y Pokémon
    $sql = "SELECT e.nombre AS equipo_name, m.pokemon AS pokemon_id
            FROM equipos e
            LEFT JOIN equipo_set es ON e.id = es.equipo
            LEFT JOIN moveset m ON es.moveset = m.id
            WHERE e.usuario = :usuario_id";
    $query = $pdo->prepare($sql);
    $query->bindParam(":usuario_id", $usuario_id, PDO::PARAM_INT);
    $query->execute();
    $resultados = $query->fetchAll(PDO::FETCH_ASSOC);

    // Si no hay resultados, asignamos un array vacío
    if (!$resultados) {
        $resultados = [];
    }

    // Verificar si el formulario fue enviado
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['teamName'])) {
        try {
            // Obtener el nombre del equipo desde el formulario
            $teamName = htmlspecialchars($_POST['teamName']);

            // Obtener la fecha actual
            $fechaCreacion = date('Y-m-d H:i:s');

            // Insertar el nuevo equipo en la base de datos
            $sqlInsert = "INSERT INTO equipos (nombre, fecha, usuario) VALUES (:nombre, :fecha, :usuario_id)";
            $queryInsert = $pdo->prepare($sqlInsert);
            $queryInsert->bindParam(":nombre", $teamName, PDO::PARAM_STR);
            $queryInsert->bindParam(":fecha", $fechaCreacion, PDO::PARAM_STR);
            $queryInsert->bindParam(":usuario_id", $usuario_id, PDO::PARAM_INT);
            $queryInsert->execute();

            // Redirigir después de la creación para evitar el reenvío del formulario
            header("Location: user.php?success=true");
            exit;  // Detenemos la ejecución del script después de la redirección
        } catch (PDOException $e) {
            // Error al insertar
            $mensajeError = '<p class="text-danger mt-4">Error al crear el equipo: ' . $e->getMessage() . '</p>';
        }
    }

    // Si hay un parámetro de éxito en la URL, mostrar el mensaje de éxito
    if (isset($_GET['success']) && $_GET['success'] == 'true') {
        $mensajeExito = '<p class="text-success mt-4">¡Equipo creado con éxito!</p>';
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

        /* Estilo para el formulario de creación de equipo */
        form {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 30px;
        }

        input#teamName {
            margin-right: 10px;
        }

        /* Estilo para los mensajes de éxito o error */
        p.text-success {
            font-weight: bold;
            color: #28a745;
        }

        p.text-danger {
            font-weight: bold;
            color: #dc3545;
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

        <!-- Mostrar el mensaje de éxito o error -->
        <?php 
        if (isset($mensajeExito)) {
            echo $mensajeExito;
        } elseif (isset($mensajeError)) {
            echo $mensajeError;
        }
        ?>

        <!-- Formulario para crear un nuevo equipo -->
        <section class="mt-4">
            <h3 class="text-light">Crear un nuevo equipo</h3>
            <form action="user.php" method="POST" class="form-inline">
                <div class="form-group mx-sm-3 mb-2">
                    <input type="text" class="form-control" id="teamName" name="teamName" placeholder="Nombre del equipo" required>
                </div>
                <button type="submit" class="btn btn-warning mb-2">Crear Equipo</button>
            </form>
        </section>

        <!-- Contenedor para los equipos -->
        <section>
            <div id="team-previews" class="d-flex flex-wrap justify-content-center mt-4">
                <?php 
                if (empty($resultados)) {
                    echo '<p class="text-warning mt-4">No tienes equipos registrados.</p>';
                } else {
                    foreach ($resultados as $equipo) {
                        echo '<div class="team-preview">';
                        echo '<div class="team-name">' . htmlspecialchars($equipo['equipo_name']) . '</div>';
                        
                        // Mostrar Pokémon si existen, si no, sólo el nombre del equipo
                        if ($equipo['pokemon_id'] !== null) {
                            echo '<div class="pokemon-container">';
                            echo '<img src="pokemon_images/' . htmlspecialchars($equipo['pokemon_id']) . '.png" class="pokemon-img" alt="Pokémon">';
                            echo '</div>';
                        } else {
                            echo '<div class="pokemon-container">No hay Pokémon en este equipo</div>';
                        }

                        echo '</div>';
                    }
                }
                ?>
            </div>
        </section>

        <!-- Input oculto con los datos de los equipos -->
        <input type="hidden" id="teams-data" value="<?php echo htmlspecialchars(json_encode($resultados)); ?>">

    </div>

    <script>
        const userPokemon = "<?php echo htmlspecialchars($User['pokefoto'] ?? ''); ?>";
    </script>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="./js/profile.js"></script>
</body>
</html>
