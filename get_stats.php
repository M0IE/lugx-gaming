<?php


// Configuración de la base de datos
$host = 'localhost';
$dbname = 'lugx_gaming';
$user = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['error' => 'Error de conexión: ' . $e->getMessage()]);
    exit;
}

$type = $_GET['type'] ?? '';

switch($type) {
    case 'monthly':
        $stmt = $conn->query("
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                COALESCE(SUM(total), 0) as total
            FROM orders 
            GROUP BY month 
            ORDER BY month ASC
            LIMIT 12
        ");
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
        break;
        
    case 'top_games':
        $stmt = $conn->query("
            SELECT 
                g.name,
                COALESCE(SUM(oi.quantity), 0) as total_sales
            FROM games g
            LEFT JOIN order_items oi ON g.id = oi.game_id
            GROUP BY g.id, g.name
            ORDER BY total_sales DESC
            LIMIT 5
        ");
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
        break;
        
    case 'dashboard':
        $stats = [
            'total_games' => $conn->query("SELECT COUNT(*) FROM games")->fetchColumn(),
            'total_users' => $conn->query("SELECT COUNT(*) FROM users")->fetchColumn(),
            'total_orders' => $conn->query("SELECT COUNT(*) FROM orders")->fetchColumn(),
            'total_sales' => $conn->query("SELECT COALESCE(SUM(total), 0) FROM orders")->fetchColumn()
        ];
        echo json_encode($stats);
        break;
        
    default:
        echo json_encode(['error' => 'Tipo de estadística no válido']);
}
?>