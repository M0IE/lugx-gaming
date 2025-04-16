<?php
// Configuración de la base de datos
$host = 'nuevo_host'; // Cambia esto al host del servidor remoto
$dbname = 'lugx_gaming'; // Asegúrate de que coincida con el nombre de la base de datos en el servidor
$user = 'nuevo_usuario'; // Usuario del servidor remoto
$password = 'nueva_contraseña'; // Contraseña del servidor remoto

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}

// Funciones de utilidad
function getMonthlyStats($conn) {
    $stmt = $conn->query("
        SELECT 
            DATE_FORMAT(created_at, '%Y-%m') as month,
            SUM(total) as total
        FROM orders 
        GROUP BY month 
        ORDER BY month DESC 
        LIMIT 12
    ");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getTopGames($conn) {
    $stmt = $conn->query("
        SELECT 
            g.name,
            COUNT(*) as total_sales
        FROM order_items oi
        JOIN games g ON oi.game_id = g.id
        GROUP BY g.id
        ORDER BY total_sales DESC
        LIMIT 5
    ");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getDashboardStats($conn) {
    return [
        'total_games' => $conn->query("SELECT COUNT(*) FROM games")->fetchColumn(),
        'total_users' => $conn->query("SELECT COUNT(*) FROM users")->fetchColumn(),
        'total_orders' => $conn->query("SELECT COUNT(*) FROM orders")->fetchColumn(),
        'total_sales' => $conn->query("SELECT COALESCE(SUM(total), 0) FROM orders")->fetchColumn()
    ];
}
?>