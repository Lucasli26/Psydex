<?php
include("./php/conexion.php");
include("./php/comprobar_login.php");

try {
    $pdo = new PDO($cadena_conexion, $usuario, $clave);

    include("./php/mostrar_equipos.php");

   
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

