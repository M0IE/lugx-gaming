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
    die("Error de conexión: " . $e->getMessage());
}

// Funciones para obtener datos
function getGames($conn) {
    $stmt = $conn->query("SELECT * FROM games");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getUsers($conn) {
    $stmt = $conn->query("SELECT * FROM users");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getOrders($conn) {
    $stmt = $conn->query("SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getStatistics($conn) {
    $stats = [
        'total_games' => $conn->query("SELECT COUNT(*) FROM games")->fetchColumn(),
        'total_users' => $conn->query("SELECT COUNT(*) FROM users")->fetchColumn(),
        'total_orders' => $conn->query("SELECT COUNT(*) FROM orders")->fetchColumn(),
        'total_sales' => $conn->query("SELECT SUM(total) FROM orders")->fetchColumn() ?: 0
    ];
    return $stats;
}

// Obtener datos para la página
$statistics = getStatistics($conn);
$games = getGames($conn);
$users = getUsers($conn);
$orders = getOrders($conn);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <!-- El resto del head permanece igual -->
</head>
<body>
    <!-- El resto del HTML permanece igual, pero ahora podemos usar los datos de PHP -->
    
    <!-- Ejemplo de cómo usar los datos en la tabla de juegos -->
    <tbody id="games-table-body">
        <?php foreach ($games as $game): ?>
            <tr>
                <td><img src="<?= htmlspecialchars($game['image_url']) ?>" alt="<?= htmlspecialchars($game['name']) ?>" width="50"></td>
                <td><?= htmlspecialchars($game['name']) ?></td>
                <td><?= htmlspecialchars($game['category']) ?></td>
                <td>$<?= number_format($game['price'], 2) ?></td>
                <td><?= $game['sales'] ?></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editGame(<?= $game['id'] ?>)">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteGame(<?= $game['id'] ?>)">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        <?php endforeach; ?>
    </tbody>

    <!-- Ejemplo de cómo usar las estadísticas -->
    <div id="total-games"><?= $statistics['total_games'] ?></div>
    <div id="total-users"><?= $statistics['total_users'] ?></div>
    <div id="total-orders"><?= $statistics['total_orders'] ?></div>
    <div id="total-sales">$<?= number_format($statistics['total_sales'], 2) ?></div>

    <!-- El resto del HTML permanece igual -->
</body>
</html>
