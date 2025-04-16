<?php
session_start();
header('Content-Type: application/json');

include 'config.php';

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    try {
        $stmt = $conn->prepare("SELECT username, email FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            echo json_encode(['success' => true, 'username' => $user['username'], 'email' => $user['email']]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Usuario no encontrado.']);
        }
    } catch (PDOException $e) {
        error_log('Database error: ' . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Error en el servidor. Por favor, inténtelo más tarde.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado.']);
}
?>
