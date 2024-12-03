<?php
require_once 'conexion.php';

header('Content-Type: application/json');

try {
    $usuarioId = $_SESSION['id']; // Asegúrate de que esto esté configurado

    // Consulta para obtener el Pokémon favorito
    $sql = "SELECT pokefoto FROM usuarios WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $usuarioId, PDO::PARAM_INT);
    $stmt->execute();

    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($resultado) {
        echo json_encode(['success' => true, 'pokefoto' => $resultado['pokefoto']]);
    } else {
        echo json_encode(['success' => false, 'error' => 'No se encontró el favorito']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit;
}
?>
