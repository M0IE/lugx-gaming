<?php
header('Content-Type: application/json');

// Conexión a la base de datos
$servername = "localhost"; // Cambia esto si es necesario
$username = "root"; // Usuario por defecto de XAMPP
$password = ""; // Sin contraseña
$dbname = "lugx_gaming"; // Nombre de la base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(['error' => 'Conexión fallida: ' . $conn->connect_error]));
}

// Probar con un ID de juego específico
$gameId = 'CC-REM'; // Cambia esto por el ID que deseas probar

// Realizar la consulta
$result = $conn->query("SELECT * FROM products WHERE gameId = '$gameId'");

if ($result) {
    // Obtener los datos del juego
    $game = $result->fetch_assoc();
    echo json_encode($game);
} else {
    echo json_encode(['error' => 'Error en la consulta: ' . $conn->error]);
}

$conn->close();
?>
