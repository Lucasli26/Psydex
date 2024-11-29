<?php
include("./php/conexion.php");
include("./php/comprobar_login.php");

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['teamName'])) {
    // Obtener el nombre del equipo a eliminar
    $teamName = $_POST['teamName'];
    try {
        // Iniciar la conexión a la base de datos
        $pdo = new PDO($cadena_conexion, $usuario, $clave);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Comenzamos una transacción
        $pdo->beginTransaction();

        // 1. Eliminar los moveset asociados con el equipo a través de la tabla equipo_set
        $queryDeleteMovesets = "
            DELETE m FROM moveset m
            JOIN equipo_set es ON m.id = es.moveset
            JOIN equipos e ON es.equipo = e.id
            WHERE e.nombre = :teamName";
        $stmtDeleteMovesets = $pdo->prepare($queryDeleteMovesets);
        $stmtDeleteMovesets->bindParam(':teamName', $teamName, PDO::PARAM_STR);
        $stmtDeleteMovesets->execute();

        // 2. Eliminar las relaciones en la tabla equipo_set
        $queryDeleteEquipoSet = "DELETE FROM equipo_set WHERE equipo = (SELECT id FROM equipos WHERE nombre = :teamName)";
        $stmtDeleteEquipoSet = $pdo->prepare($queryDeleteEquipoSet);
        $stmtDeleteEquipoSet->bindParam(':teamName', $teamName, PDO::PARAM_STR);
        $stmtDeleteEquipoSet->execute();

        // 3. Eliminar el equipo de la tabla equipos
        $queryDeleteEquipo = "DELETE FROM equipos WHERE nombre = :teamName";
        $stmtDeleteEquipo = $pdo->prepare($queryDeleteEquipo);
        $stmtDeleteEquipo->bindParam(':teamName', $teamName, PDO::PARAM_STR);
        $stmtDeleteEquipo->execute();

        // Confirmar la transacción
        $pdo->commit();

        // Responder con éxito
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        // Si hay un error, hacer rollback y responder con error
        $pdo->rollBack();
        error_log("Error al eliminar el equipo: " . $e->getMessage());
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}
?>
