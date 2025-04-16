<?php

include '../config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // $user_id = $_SESSION['user_id']; // Obtener el ID del usuario de la sesión

    $game_id = $_POST['game_id']; // ID del juego comprado
    $price = $_POST['price']; // Precio del juego

    // Insertar la compra en la tabla invoices
    $stmt = $conn->prepare("INSERT INTO invoices (user_id, game_id, price) VALUES (?, ?, ?)");
    if ($stmt->execute([$user_id, $game_id, $price])) {
        echo json_encode(['success' => true, 'message' => 'Compra registrada exitosamente.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al registrar la compra: ' . implode(", ", $stmt->errorInfo())]);
    }
}
?>
