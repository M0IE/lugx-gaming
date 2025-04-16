<?php
// Conexión a la base de datos
$servername = "localhost"; // Cambia esto si es necesario
$username = "root"; // Usuario por defecto de XAMPP
$password = ""; // Sin contraseña
$dbname = "lugx_gaming"; // Nombre de la base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$sql = "SELECT *, 0 AS isTrending FROM products"; // Agregar columna isTrending por defecto

$result = $conn->query($sql);

$games = array();

if ($result === false) {
    echo json_encode(['error' => 'Error en la consulta: ' . $conn->error]);
    exit;
}

if ($result->num_rows > 0) {
    // Almacenar los datos en un array
    while($row = $result->fetch_assoc()) {
        $games[] = $row;
    }

}

if (empty($games)) {
    echo json_encode(['error' => 'No games found']);
} else {
    // Devolver los datos en formato JSON
    header('Content-Type: application/json');
    echo json_encode($games);
}

$conn->close();
?>
