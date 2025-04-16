<?php
session_start();
header('Content-Type: application/json');

include 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_SESSION['user_id'])) {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!isset($data['username'])) {
        echo json_encode(['success' => false, 'message' => 'Faltan campos requeridos']);
        exit;
    }

    $user_id = $_SESSION['user_id'];
    $username = $data['username'];
    $password = isset($data['password']) ? $data['password'] : null;

    try {
        if ($password) {
            $stmt = $conn->prepare("UPDATE users SET username = ?, password = ? WHERE id = ?");
            $stmt->execute([$username, $password, $user_id]);
        } else {
            $stmt = $conn->prepare("UPDATE users SET username = ? WHERE id = ?");
            $stmt->execute([$username, $user_id]);
        }

        echo json_encode(['success' => true, 'message' => 'Cuenta actualizada exitosamente.']);
    } catch (PDOException $e) {
        error_log('Database error: ' . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Error en el servidor. Por favor, inténtelo más tarde.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido o usuario no autenticado.']);
}
?>
