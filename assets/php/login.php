<?php
session_start();
header('Content-Type: application/json');

// Include the config file with the correct path
include 'config.php'; // Adjust this path as needed

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // Check if JSON was valid
    if ($data === null) {
        echo json_encode([
            'success' => false, 
            'message' => 'JSON inválido'
        ]);
        exit;
    }
    
    // Check if the required fields are present
    if (!isset($data['email']) || !isset($data['password'])) {
        echo json_encode([
            'success' => false, 
            'message' => 'Faltan campos requeridos'
        ]); 
        exit;
    }
    
    $email = $data['email'];
    $password = $data['password'];
    
    try {
        // Authentication logic
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            if ($password === $user['password']) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                echo json_encode([
                    'success' => true, 
                    'username' => $user['username'],
                    'email' => $user['email']
                ]);
            } else {
                echo json_encode([
                    'success' => false, 
                    'message' => 'Credenciales inválidas.'
                ]); 
            }
        } else {
            echo json_encode([
                'success' => false, 
                'message' => 'Usuario no encontrado.'
            ]);
        }
    } catch (PDOException $e) {
        // Log the error but don't expose details to the user
        error_log('Database error: ' . $e->getMessage());
        echo json_encode([
            'success' => false, 
            'message' => 'Error en el servidor. Por favor, inténtelo más tarde.'
        ]);
    }
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Método no permitido.'
    ]);
}
?>