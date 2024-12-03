<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Encabezado para devolver JSON
header('Content-Type: application/json');

// Importar la conexión
require_once 'conexion.php';

// Verificar que la sesión contiene el ID del usuario
if (!isset($_SESSION['id'])) {
    echo json_encode(['success' => false, 'error' => 'Usuario no autenticado.']);
    exit;
}

// Leer datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Verificar si los datos existen
if (isset($data['nombre']) && isset($data['isFavorite'])) {
    $nombre = $data['nombre'];
    $isFavorite = $data['isFavorite'];
    $usuarioId = $_SESSION['id'];

    try {
        // Preparar la consulta
        if ($isFavorite) {
            $sql = "UPDATE usuarios SET pokefoto = :nombre WHERE id = :usuarioId";
        } else {
            $sql = "UPDATE usuarios SET pokefoto = NULL WHERE id = :usuarioId";
        }

        $stmt = $pdo->prepare($sql);

        // Bind de parámetros
        if ($isFavorite) {
            $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
        }
        $stmt->bindParam(':usuarioId', $usuarioId, PDO::PARAM_INT);

        // Ejecutar la consulta
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'No se pudo actualizar la base de datos.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Error en la consulta: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Datos incompletos en la solicitud.']);
}
?>
