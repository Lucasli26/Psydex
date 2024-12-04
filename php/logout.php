<?php
session_start(); // Iniciar la sesión si no está iniciada
session_destroy(); // Destruir la sesión
session_unset(); // Eliminar todas las variables de sesión

// Eliminar la cookie de sesión en el navegador
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Redirigir al usuario al login
header("Location: ../login.php");
exit;
?>
