document.addEventListener('DOMContentLoaded', function() {
    const accountForm = document.getElementById('account-form');
    const logoutBtn = document.getElementById('logout-btn');

    // Cargar los datos del usuario
    fetch('./assets/php/get_account_details.php', {
        method: 'GET',
        credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('account-username').value = data.username;
            document.getElementById('account-email').value = data.email;
        } else {
            alert(data.message || 'Error al cargar los detalles de la cuenta.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error de conexión');
    });

    // Actualizar los datos del usuario
    accountForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('account-username').value;
        const password = document.getElementById('account-password').value;
        const confirmPassword = document.getElementById('account-confirm-password').value;

        if (password && password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        fetch('./assets/php/update_account.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Cuenta actualizada exitosamente.');
                localStorage.setItem('username', username); // Actualizar el nombre de usuario en localStorage
                window.location.href = 'account.html';
            } else {
                alert(data.message || 'Error al actualizar la cuenta.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error de conexión');
        });
    });

    // Cerrar sesión
    logoutBtn.addEventListener('click', function() {
        fetch('./assets/php/logout.php', {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(() => {
            localStorage.removeItem('username');
            window.location.href = 'login.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error de conexión');
        });
    });
});
