function addFormEventHandlers() {
    const forms = [
        { id: 'game-form', handler: saveGame },
        { id: 'user-form', handler: saveUser },
        { id: 'settings-form', handler: saveSettings }
    ];
 
    forms.forEach(form => {
        const formElement = document.getElementById(form.id);
        if (formElement) {
            formElement.addEventListener('submit', function(event) {
                event.preventDefault();
                form.handler();
            });
        }
    });
 
    // Manejador para actualizar estado de pedido
    const updateOrderStatusBtn = document.getElementById('update-order-status');
    if (updateOrderStatusBtn) {
        updateOrderStatusBtn.addEventListener('click', function() {
            const orderId = document.getElementById('current-order-id').value;
            const status = document.getElementById('order-status').value;
            updateOrderStatus(orderId, status);
        });
    }
 }
 
 // Función para inicializar los gráficos
 let salesChart = null; // Declaración única
 
 function initializeCharts() {
    if (!salesChart) { // Verificamos si ya está inicializado
        initializeSalesChart();
    }
    initializeTopGamesChart();
 }
 
 // Gráfico de ventas mensuales
 function initializeSalesChart() {
    fetch('./php/get_stats.php?type=monthly')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const ctx = document.getElementById('sales-chart').getContext('2d');
            salesChart = new Chart(ctx, { // Asignamos a la variable declarada
                type: 'line',
                data: {
                    labels: data.map(item => {
                        const [year, month] = item.month.split('-');
                        return `${month}/${year}`;
                    }),
                    datasets: [{
                        label: 'Ventas Mensuales',
                        data: data.map(item => parseFloat(item.total)),
                        borderColor: '#ee626b',
                        tension: 0.1,
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toFixed(2);
                                }
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return '$' + context.parsed.y.toFixed(2);
                                }
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error al cargar datos de ventas:', error);
            document.getElementById('sales-chart').innerHTML = 'Error al cargar el gráfico';
        });
 }
 
 // Gráfico de juegos más vendidos
 function initializeTopGamesChart() {
    fetch('./php/get_stats.php?type=top_games')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const ctx = document.getElementById('top-games-chart').getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: data.map(item => item.name),
                    datasets: [{
                        data: data.map(item => parseInt(item.total_sales)),
                        backgroundColor: [
                            '#ee626b',
                            '#0071f8',
                            '#28a745',
                            '#ffc107',
                            '#dc3545'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: ${context.parsed} unidades`;
                                }
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error al cargar datos de juegos:', error);
            document.getElementById('top-games-chart').innerHTML = 'Error al cargar el gráfico';
        });
 }
 
 // Cargar datos del dashboard
 function loadDashboardStats() {
    fetch('./php/get_stats.php?type=dashboard')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('total-games').textContent = data.total_games;
            document.getElementById('total-users').textContent = data.total_users;
            document.getElementById('total-orders').textContent = data.total_orders;
            document.getElementById('total-sales').textContent = '$' + parseFloat(data.total_sales).toFixed(2);
        })
        .catch(error => {
            console.error('Error al cargar estadísticas:', error);
        });
 }
 
 function loadGames() {
    fetch('./php/admin_actions.php?action=get_games')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(games => {
            const tableBody = document.getElementById('games-table-body');
            if (tableBody) {
                tableBody.innerHTML = games.map(game => `
                    <tr>
                        <td><img src="${game.image_url || 'assets/images/default-game.jpg'}" alt="${game.name}" width="50"></td>
                        <td>${game.name}</td>
                        <td>${game.category}</td>
                        <td>$${parseFloat(game.price).toFixed(2)}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="editGame(${game.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteGame(${game.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
        })
        .catch(error => console.error('Error:', error));
}

 
 // Cargar datos de usuarios
 function loadUsers() {
    fetch('.accets/php/admin_actions.php?action=get_users')
        .then(response => response.json())
        .then(users => {
            const tableBody = document.getElementById('users-table-body');
            if (tableBody) {
                tableBody.innerHTML = users.map(user => `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>${new Date(user.created_at).toLocaleDateString()}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="editUser(${user.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
        })
        .catch(error => console.error('Error:', error));
 }
 
 // Cargar datos de pedidos
 function loadOrders() {
    fetch('../assets/php/admin_actions.php?action=get_orders')
        .then(response => response.json())
        .then(orders => {
            const tableBody = document.getElementById('orders-table-body');
            if (tableBody) {
                tableBody.innerHTML = orders.map(order => `
                    <tr>
                        <td>#${order.id}</td>
                        <td>${order.user_name}</td>
                        <td>${new Date(order.created_at).toLocaleDateString()}</td>
                        <td>$${parseFloat(order.total).toFixed(2)}</td>
                        <td><span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></td>
                        <td>
                            <button class="btn btn-sm btn-info" onclick="viewOrder(${order.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
        })
        .catch(error => console.error('Error:', error));
 }
 
 // Inicialización cuando el documento está listo
 document.addEventListener('DOMContentLoaded', function() {
    addFormEventHandlers();
    initializeCharts();
    loadDashboardStats();
    setupEventListeners();
    
    // Cargar datos iniciales
    const activeTab = document.querySelector('.menu-item.active');
    if (activeTab) {
        loadTabContent(activeTab.getAttribute('data-tab'));
    }
 });
 
 // Configuración de eventos principales
 function setupEventListeners() {
    // Navegación del sidebar
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const tabId = this.getAttribute('data-tab');
            document.querySelectorAll('.content-tab').forEach(tab => tab.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            
            loadTabContent(tabId);
        });
    });
 
    // Sidebar toggle en móvil
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
 
    // User dropdown
    const userDropdownToggle = document.querySelector('.user-dropdown-toggle');
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdownToggle && userDropdown) {
        userDropdownToggle.addEventListener('click', () => {
            userDropdown.classList.toggle('active');
        });
 
        document.addEventListener('click', (e) => {
            if (!userDropdown.contains(e.target) && !userDropdownToggle.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }
 }
 
 // Cargar contenido según la pestaña
 function loadTabContent(tabId) {
    switch(tabId) {
        case 'dashboard-tab':
            loadDashboardStats();
            initializeCharts();
            break;
        case 'games-tab':
            loadGames();
            break;
        case 'users-tab':
            loadUsers();
            break;
        case 'orders-tab':
            loadOrders();
            break;
    }
 }
 
 // Función para guardar un juego
 function saveGame() {
    const formData = new FormData(document.getElementById('game-form'));
    fetch('../assets/php/php/admin_actions.php?action=save_game', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Juego guardado con éxito', 'success');
            loadGames();
            closeModal('gameModal');
        } else {
            showNotification('Error al guardar el juego: ' + data.error, 'danger');
        }
    })
    .catch(error => console.error('Error:', error));
 }
 
 // Función para guardar un usuario
 function saveUser() {
    const formData = new FormData(document.getElementById('user-form'));
    fetch('../assets/php/php/admin_actions.php?action=save_user', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Usuario guardado con éxito', 'success');
            loadUsers();
            closeModal('userModal');
        } else {
            showNotification('Error al guardar el usuario: ' + data.error, 'danger');
        }
    })
    .catch(error => console.error('Error:', error));
 }
 
 // Función para guardar la configuración
 function saveSettings() {
    const formData = new FormData(document.getElementById('settings-form'));
    fetch('../assets/php/admin_actions.php?action=save_settings', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Configuración guardada con éxito', 'success');
        } else {
            showNotification('Error al guardar la configuración: ' + data.error, 'danger');
        }
    })
    .catch(error => console.error('Error:', error));
 }
 
 // Función para editar un juego
 function editGame(gameId) {
    fetch('../assets/php/admin_actions.php?action=get_game&id=' + gameId)
        .then(response => response.json())
        .then(game => {
            document.getElementById('game-id').value = game.id;
            document.getElementById('game-name').value = game.name;
            document.getElementById('game-price').value = game.price;
            document.getElementById('game-original-price').value = game.original_price;
            document.getElementById('game-category').value = game.category;
            document.getElementById('game-description').value = game.description;
            document.getElementById('game-code').value = game.code;
            document.getElementById('game-file-size').value = game.file_size;
            if (game.image_url) {
                document.getElementById('game-image-preview').innerHTML = 
                    `<img src="${game.image_url}" alt="${game.name}" width="100">`;
            }
            const gameModal = new bootstrap.Modal(document.getElementById('gameModal'));
            gameModal.show();
        })
        .catch(error => console.error('Error:', error));
 }
 
 // Función para eliminar un juego
 function deleteGame(gameId) {
    if (confirm('¿Estás seguro de que deseas eliminar este juego?')) {
        fetch('./asests/php/admin_actions.php?action=delete_game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: gameId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Juego eliminado con éxito', 'success');
                loadGames();
            } else {
                showNotification('Error al eliminar el juego: ' + data.error, 'danger');
            }
        })
        .catch(error => console.error('Error:', error));
    }
 }
 
 // Función para editar un usuario
 function editUser(userId) {
    fetch('../assets/php/admin_actions.php?action=get_user&id=' + userId)
        .then(response => response.json())
        .then(user => {
            document.getElementById('user-id').value = user.id;
            document.getElementById('user-name').value = user.name;
            document.getElementById('user-email').value = user.email;
            document.getElementById('user-role').value = user.role;
            document.getElementById('password-field').style.display = 'none';
            const userModal = new bootstrap.Modal(document.getElementById('userModal'));
            userModal.show();
        })
        .catch(error => console.error('Error:', error));
 }
 
 // Función para eliminar un usuario
 function deleteUser(userId) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        fetch('../assets/php/admin_actions.php?action=delete_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: userId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Usuario eliminado con éxito', 'success');
                loadUsers();
            } else {
                showNotification('Error al eliminar el usuario: ' + data.error, 'danger');
            }
        })
        .catch(error => console.error('Error:', error));
    }
 }
 
 // Función para ver los detalles de un pedido
 function viewOrder(orderId) {
    fetch('../assets/php/admin_actions.php?action=get_order&id=' + orderId)
        .then(response => response.json())
        .then(order => {
            const orderDetails = document.getElementById('order-details');
            orderDetails.innerHTML = `
                <p><strong>ID del Pedido:</strong> #${order.id}</p>
                <p><strong>Usuario:</strong> ${order.user_name}</p>
                <p><strong>Fecha:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
                <p><strong>Total:</strong> $${parseFloat(order.total).toFixed(2)}</p>
                <p><strong>Estado:</strong> <span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></p>
                <h5>Items del Pedido</h5>
                <ul>
                    ${order.items.map(item => `<li>${item.quantity} x ${item.name} - $${parseFloat(item.price).toFixed(2)}</li>`).join('')}
                </ul>
            `;
            document.getElementById('order-status').value = order.status;
            document.getElementById('current-order-id').value = order.id;
            const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
            orderModal.show();
        })
        .catch(error => console.error('Error:', error));
 }
 
 // Función para actualizar el estado de un pedido
 function updateOrderStatus(orderId, status) {
    fetch('../assets/php/admin_actions.php?action=update_order_status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: orderId, status: status })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Estado del pedido actualizado con éxito', 'success');
            loadOrders();
            closeModal('orderModal');
        } else {
            showNotification('Error al actualizar el estado del pedido: ' + data.error, 'danger');
        }
    })
    .catch(error => console.error('Error:', error));
 }
 
 // Función auxiliar para obtener el color del estado
 function getStatusColor(status) {
    const colors = {
        'pending': 'warning',
        'processing': 'info',
        'completed': 'success',
        'cancelled': 'danger'
    };
    return colors[status] || 'secondary';
 }
 
 // Función para cerrar modales
 function closeModal(modalId) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    if (modal) modal.hide();
 }
 
 // Función para mostrar notificaciones
 // Función para mostrar notificaciones
 function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertDiv);
 
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
 }
 

// Función para cerrar modales
function closeModal(modalId) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    if (modal) modal.hide();
}

// Función para obtener el color del estado
function getStatusColor(status) {
    const colors = {
        'pending': 'warning',
        'processing': 'info',
        'completed': 'success',
        'cancelled': 'danger'
    };
    return colors[status] || 'secondary';
}

// Función para ver los detalles de un pedido
function viewOrder(orderId) {
    fetch('../assets/php/admin_actions.php?action=get_order&id=' + orderId)
        .then(response => response.json())
        .then(order => {
            const orderDetails = document.getElementById('order-details');
            orderDetails.innerHTML = `
                <p><strong>ID del Pedido:</strong> #${order.id}</p>
                <p><strong>Usuario:</strong> ${order.user_name}</p>
                <p><strong>Fecha:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
                <p><strong>Total:</strong> $${parseFloat(order.total).toFixed(2)}</p>
                <p><strong>Estado:</strong> <span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></p>
                <h5>Items del Pedido</h5>
                <ul>
                    ${order.items.map(item => `<li>${item.quantity} x ${item.name} - $${parseFloat(item.price).toFixed(2)}</li>`).join('')}
                </ul>
            `;
            document.getElementById('order-status').value = order.status;
            document.getElementById('current-order-id').value = order.id;
            const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
            orderModal.show();
        })
        .catch(error => console.error('Error:', error));
}

// Función para actualizar el estado de un pedido
function updateOrderStatus(orderId, status) {
    fetch('../assets/php/admin_actions.php?action=update_order_status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: orderId, status: status })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Estado del pedido actualizado con éxito', 'success');
            loadOrders();
            closeModal('orderModal');
        } else {
            showNotification('Error al actualizar el estado del pedido: ' + data.error, 'danger');
        }
    })
    .catch(error => console.error('Error:', error));
}


function loadRecentOrders() {
    fetch('../assets/php/admin_actions.php?action=get_recent_orders')
        .then(response => response.json())
        .then(orders => {
            const recentOrders = document.getElementById('recent-orders');
            if (recentOrders) {
                recentOrders.innerHTML = orders.map(order => `
                    <tr>
                        <td>#${order.id}</td>
                        <td>${order.user_name}</td>
                        <td>${new Date(order.created_at).toLocaleDateString()}</td>
                        <td>$${parseFloat(order.total).toFixed(2)}</td>
                        <td><span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></td>
                    </tr>
                `).join('');
            }
        })
        .catch(error => console.error('Error:', error));
}


function loadRecentActivity() {
    fetch('../assets/php/admin_actions.php?action=get_recent_activity')
        .then(response => response.json())
        .then(activities => {
            const activityList = document.getElementById('activity-list');
            if (activityList) {
                activityList.innerHTML = activities.map(activity => `
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="fas fa-${activity.icon}"></i>
                        </div>
                        <div class="activity-details">
                            <p>${activity.message}</p>
                            <span class="activity-time">${new Date(activity.timestamp).toLocaleString()}</span>
                        </div>
                    </div>
                `).join('');
            }
        })
        .catch(error => console.error('Error:', error));
}