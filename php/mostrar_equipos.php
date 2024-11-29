<?php

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

?>