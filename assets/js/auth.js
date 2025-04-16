document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
           
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
           
            fetch('./assets/php/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
                credentials: 'same-origin'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('username', data.username); // Almacenar el nombre de usuario
                    window.location.href = 'index.html';
                } else {
                    alert(data.message || 'Cuenta no encontrada');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error de conexión');
            });
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;

            // Validar que las contraseñas coincidan
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }

            // Validar el formato del correo electrónico
            if (!validateEmail(email)) {
                alert('Formato de correo electrónico inválido.');
                return;
            }

            fetch('./assets/php/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    confirm_password: confirmPassword
                }),
                credentials: 'same-origin'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Usuario registrado exitosamente.');
                    document.getElementById('register-form').reset();
                } else {
                    alert(data.message || 'Error al registrar el usuario.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error de conexión');
            });
        });
    }

    const username = localStorage.getItem('username');
    const loginLink = document.getElementById('login-link');
    if (username && loginLink) {
        loginLink.innerHTML = `<a href="account.html" class="nav-link" style="color: red;">${username}</a>`; // Reemplazar el texto y agregar el enlace
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}