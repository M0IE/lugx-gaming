<?php
session_start();
include '../../config.php';

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("SELECT p.* FROM invoices i JOIN products p ON FIND_IN_SET(p.gameId, i.game_id) WHERE i.user_id = ?");
    $stmt->execute([$user_id]);
    $games = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($games);
} else {
    echo json_encode(['error' => 'Usuario no autenticado']);
}
?>
