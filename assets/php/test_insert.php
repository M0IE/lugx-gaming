<?php
include '../../config.php';


// Datos de prueba
$username = 'testuser';
$email = 'testuser@example.com';
$password = 'password123';
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Intentar insertar un nuevo usuario
$stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
if ($stmt->execute([$username, $email, $hashed_password])) {
    echo json_encode(['success' => true, 'message' => 'Usuario insertado exitosamente.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al insertar el usuario: ' . implode(", ", $stmt->errorInfo())]);
}
?>
