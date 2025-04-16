<?php
// admin_actions.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
session_start();

// Configuración de la base de datos
$host = 'localhost';
$dbname = 'lugx_gaming';
$user = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode(['error' => 'Error de conexión: ' . $e->getMessage()]));
}

// Obtener la acción solicitada
$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch($action) {
    case 'get_games':
        getGames();
        break;

    case 'save_game':
        saveGame();
        break;

    case 'delete_game':
        deleteGame();
        break;

    case 'get_users':
        getUsers();
        break;

    case 'save_user':
        saveUser();
        break;

    case 'delete_user':
        deleteUser();
        break;

    case 'get_orders':
        getOrders();
        break;

    case 'get_order':
        getOrder();
        break;

    case 'update_order_status':
        updateOrderStatus();
        break;

    case 'get_statistics':
        getStatistics();
        break;

    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}

function getStatistics() {
    global $conn;
    try {
        $stats = [
            'total_games' => $conn->query("SELECT COUNT(*) FROM games")->fetchColumn(),
            'total_users' => $conn->query("SELECT COUNT(*) FROM users")->fetchColumn(),
            'total_orders' => $conn->query("SELECT COUNT(*) FROM orders")->fetchColumn(),
            'total_sales' => $conn->query("SELECT SUM(total) FROM orders")->fetchColumn() ?: 0,
            'chart_data' => [
                'monthly_sales' => $conn->query("SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total) as sales FROM orders GROUP BY month ORDER BY month")->fetchAll(PDO::FETCH_ASSOC),
                'top_games' => $conn->query("SELECT g.name, SUM(oi.quantity) as sales FROM order_items oi JOIN games g ON oi.game_id = g.id GROUP BY g.id ORDER BY sales DESC LIMIT 5")->fetchAll(PDO::FETCH_ASSOC)
            ]
        ];
        echo json_encode($stats);
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getGames() {
    global $conn;
    try {
        $stmt = $conn->query("SELECT * FROM games");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getUsers() {
    global $conn;
    try {
        $stmt = $conn->query("SELECT * FROM users");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getOrders() {
    global $conn;
    try {
        $stmt = $conn->query("SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function saveGame() {
    global $conn;
    try {
        if (!empty($_POST['id'])) {
            $stmt = $conn->prepare("UPDATE games SET name=?, price=?, original_price=?, category=?, description=?, code=?, file_size=? WHERE id=?");
            $stmt->execute([
                $_POST['name'],
                $_POST['price'],
                $_POST['original_price'],
                $_POST['category'],
                $_POST['description'],
                $_POST['code'],
                $_POST['file_size'],
                $_POST['id']
            ]);
        } else {
            $stmt = $conn->prepare("INSERT INTO games (name, price, original_price, category, description, code, file_size) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $_POST['name'],
                $_POST['price'],
                $_POST['original_price'],
                $_POST['category'],
                $_POST['description'],
                $_POST['code'],
                $_POST['file_size']
            ]);
        }
        echo json_encode(['success' => true]);
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function saveUser() {
    global $conn;
    try {
        if (!empty($_POST['id'])) {
            $stmt = $conn->prepare("UPDATE users SET name=?, email=?, role=? WHERE id=?");
            $stmt->execute([
                $_POST['name'],
                $_POST['email'],
                $_POST['role'],
                $_POST['id']
            ]);
        } else {
            $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $_POST['name'],
                $_POST['email'],
                password_hash($_POST['password'], PASSWORD_DEFAULT),
                $_POST['role']
            ]);
        }
        echo json_encode(['success' => true]);
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function deleteGame() {
    global $conn;
    try {
        $stmt = $conn->prepare("DELETE FROM games WHERE id=?");
        $stmt->execute([$_POST['id']]);
        echo json_encode(['success' => true]);
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function deleteUser() {
    global $conn;
    try {
        $stmt = $conn->prepare("DELETE FROM users WHERE id=?");
        $stmt->execute([$_POST['id']]);
        echo json_encode(['success' => true]);
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getOrder() {
    global $conn;
    try {
        $stmt = $conn->prepare("SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id=?");
        $stmt->execute([$_GET['id']]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);

        $stmt = $conn->prepare("SELECT * FROM order_items WHERE order_id=?");
        $stmt->execute([$_GET['id']]);
        $order['items'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($order);
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function updateOrderStatus() {
    global $conn;
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $conn->prepare("UPDATE orders SET status=? WHERE id=?");
        $stmt->execute([$data['status'], $data['id']]);
        echo json_encode(['success' => true]);
    } catch(PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>
