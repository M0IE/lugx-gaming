<?php

include '../config.php';

// Lógica para manejar la compra
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $game_id = $_POST['game_id']; // ID del juego comprado
    $price = $_POST['price']; // Precio del juego

    // Enviar la solicitud a purchase.php
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://localhost/templatemo_589_lugx_gaming/assets/php/purchase.php");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(['game_id' => $game_id, 'price' => $price]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);

    $result = json_decode($response, true);
    if ($result['success']) {
        echo json_encode(['success' => true, 'message' => 'Compra realizada con éxito.']);
    } else {
        echo json_encode(['success' => false, 'message' => $result['message']]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
}
