<?php
session_start();
include '../../config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $game_ids = $_POST['game_id'];
    $purchase_date = $_POST['purchase_date'];
    $total_amount = $_POST['total_amount'];
    $payment_method = $_POST['payment_method'];
    $payment_data = json_encode($_POST['payment_data']);

    $stmt = $conn->prepare("INSERT INTO invoices (user_id, game_id, purchase_date, total_amount, payment_method, payment_data) VALUES (?, ?, ?, ?, ?, ?)");
    if ($stmt->execute([$user_id, $game_ids, $purchase_date, $total_amount, $payment_method, $payment_data])) {
        echo "Factura creada con éxito";
    } else {
        echo "Error al crear la factura: " . implode(", ", $stmt->errorInfo());
    }
} else {
    echo "Error: Faltan datos requeridos para crear la factura o el usuario no está autenticado";
}

$conn = null;
?>