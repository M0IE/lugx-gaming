// Variables globales
let cart = [];

// Función para verificar si el usuario está autenticado
function isLoggedIn() {
    return true; // Permitir acceso sin verificar sesión
}

// Cargar el carrito desde localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Guardar el carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Actualizar el contador del carrito
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// Agregar un producto al carrito
function addToCart(gameId, name, price, image, quantity = 1) {
    const existingItemIndex = cart.findIndex(item => item.gameId === gameId);
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({ gameId, name, price, image, quantity });
    }
    
    saveCart();
    alert(`${name} ha sido añadido al carrito.`);
}

// Actualizar la cantidad de un producto en el carrito
function updateCartItemQuantity(index, quantity) {
    if (index >= 0 && index < cart.length) {
        cart[index].quantity = quantity;
        saveCart();
        updateCartUI();
    }
}

// Eliminar un producto del carrito
function removeCartItem(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        saveCart();
        updateCartUI();
    }
}

// Calcular el subtotal del carrito
function calculateSubtotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Actualizar la interfaz del carrito
function updateCartUI() {
    const cartTableBody = document.getElementById('cart-table-body');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartItems = document.getElementById('cart-items');
    
    if (!cartTableBody) return;
    
    if (cart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (cartItems) cartItems.style.display = 'none';
        return;
    }
    
    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    if (cartItems) cartItems.style.display = 'block';
    
    cartTableBody.innerHTML = '';
    
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        const total = item.price * item.quantity;
        
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px;">
                    <span>${item.name}</span>
                </div>
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                </div>
            </td>
            <td>$${total.toFixed(2)}</td>
            <td>
                <button class="remove-btn" data-index="${index}">
                    <i class="fa fa-trash"></i>
                </button>
            </td>
        `;
        
        cartTableBody.appendChild(row);
    });
    
    const subtotal = calculateSubtotal();
    const shipping = 5.00;
    const total = subtotal + shipping;
    
    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
    
    document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            if (cart[index].quantity > 1) {
                updateCartItemQuantity(index, cart[index].quantity - 1);
            }
        });
    });
    
    document.querySelectorAll('.quantity-btn.increase').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            updateCartItemQuantity(index, cart[index].quantity + 1);
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const quantity = parseInt(this.value);
            if (quantity > 0) {
                updateCartItemQuantity(index, quantity);
            } else {
                this.value = 1;
                updateCartItemQuantity(index, 1);
            }
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeCartItem(index);
        });
    });
}

function showCheckoutModal() {
    setTimeout(() => {
        $('#checkout-modal').modal('show'); // Mostrar el modal
    }, 100); // Retraso de 100 ms para asegurar que todo esté cargado
}

function togglePaymentFields() {
    const paymentMethod = document.getElementById('payment-method').value;
    document.getElementById('credit-card-group').style.display = paymentMethod === 'credit-card' ? 'block' : 'none';
    document.getElementById('paypal-group').style.display = paymentMethod === 'paypal' ? 'block' : 'none';
    document.getElementById('coupon-group').style.display = paymentMethod === 'coupon' ? 'block' : 'none';
}

function submitCheckout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de realizar la compra.');
        return;
    }

    const paymentMethod = document.getElementById('payment-method').value;
    let paymentData = {};

    if (paymentMethod === 'credit-card') {
        paymentData = {
            cardNumber: document.getElementById('card-number').value,
            cardName: document.getElementById('card-name').value,
            expirationDate: document.getElementById('expiration-date').value,
            cvv: document.getElementById('cvv').value
        };
    } else if (paymentMethod === 'paypal') {
        paymentData = {
            paypalEmail: document.getElementById('paypal-email').value,
            paypalPassword: document.getElementById('paypal-password').value
        };
    } else if (paymentMethod === 'coupon') {
        paymentData = {
            couponCode: document.getElementById('coupon').value
        };
    }

    // Calcular el precio total de todos los items en el carrito
    const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Obtener los gameId de todos los items en el carrito
    const gameIds = cart.map(item => item.gameId).join(',');

    // Crear datos para la factura
    const invoiceData = {
        user_id: 1, // Cambiar esto por el ID del usuario autenticado
        game_id: gameIds, // Usar los gameId en lugar de los IDs numéricos
        purchase_date: new Date().toISOString().split('T')[0],
        total_amount: parseFloat(totalAmount.toFixed(2)),
        payment_method: paymentMethod,
        payment_data: paymentData
    };

    console.log("Datos de la factura:", invoiceData);
    
    // Enviar datos a create_invoice.php
    $.ajax({
        type: "POST",
        url: "assets/php/create_invoice.php",
        data: invoiceData,
        success: function(response) {
            console.log("Invoice created successfully:", response);
            cart = [];
            saveCart();
            updateCartUI();
            alert("Compra confirmada. Revisa la consola para más detalles.");
        },
        error: function(error) {
            console.error("Error creating invoice:", error);
            alert("Error al crear la factura: " + error.responseText);
        }
    });
}

// Inicializar el carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartCount();
    updateCartUI();
    
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showCheckoutModal(); // Mostrar el modal en lugar de procesar la compra
        });
    }
    
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const item = this.closest('.item');
            const id = item.getAttribute('data-id');
            const name = item.querySelector('.product-name').textContent;
            const priceText = item.querySelector('.price').textContent;
            const price = parseFloat(priceText.replace('$', ''));
            const image = item.querySelector('.thumb img').src;
            
            addToCart(id, name, price, image);
        });
    });
    
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const productId = new URLSearchParams(window.location.search).get('id') || 'default';
            const productName = document.getElementById('product-name').textContent;
            const priceText = document.getElementById('product-price').textContent;
            const price = parseFloat(priceText.match(/\$(\d+(\.\d+)?)/)[1]);
            const image = document.getElementById('product-image').src;
            const quantity = parseInt(document.getElementById('product-qty').value);
            
            addToCart(productId, productName, price, image, quantity);
        });
    }
});
