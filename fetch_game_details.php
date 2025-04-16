<?php
header('Content-Type: application/json');

// Conexión a la base de datos
$servername = "localhost"; // Cambia esto si es necesario
$username = "root"; // Usuario por defecto de XAMPP
$password = ""; // Sin contraseña
$dbname = "lugx_gaming"; // Nombre de la base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión y devolver error en formato JSON
if ($conn->connect_error) {
    die(json_encode(['error' => 'Conexión fallida: ' . $conn->connect_error]));
    // Verificar conexión y devolver error en formato JSON

    // Verificar conexión y devolver error en formato JSON

}

// Obtener el ID del juego
$gameId = isset($_GET['id']) ? $_GET['id'] : '';

    if ($gameId) {
        // Verificar que el ID del juego no esté vacío

        // Verificar que el ID del juego no esté vacío

    // Verificar que el ID del juego no esté vacío
    // Preparar la consulta
    $stmt = $conn->prepare("SELECT * FROM products WHERE gameId = ?");
    $stmt->bind_param("s", $gameId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Obtener los datos del juego
        $game = $result->fetch_assoc();
        echo json_encode($game);
    } else {
        echo json_encode(['error' => 'Juego no encontrado']);
    }

    $stmt->close();
} else {
    // Devolver error si no se proporciona un ID de juego
    echo json_encode(['error' => 'ID de juego no proporcionado']);
}

$conn->close();
?>
