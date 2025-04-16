console.log("Script cargado"); // Confirmar que el script se está ejecutando
document.addEventListener('DOMContentLoaded', function() {

    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (gameId) {
        console.log(`Cargando detalles para el juego con ID: ${gameId}`);

        fetch(`fetch_game_details.php?id=${gameId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la red');
                }
                return response.json();
            })
            .then(data => {
                console.log("Datos recibidos:", data); // Verificar los datos recibidos
                if (data.error) {
                    console.error(data.error);
                    return;
                }

                // Rellenar los elementos en la plantilla con los datos del juego
                document.getElementById('product-name').innerText = data.name || "Nombre no disponible";
                document.getElementById('product-image').src = data.image || "assets/images/default-image.jpg";
                document.getElementById('product-price').innerHTML = `<em>$${data.price || "Precio no disponible"}</em> $${data.original_price || "Precio original no disponible"}`;
                document.getElementById('product-description').innerText = data.description || "Descripción no disponible";
                document.getElementById('product-id').innerText = data.gameId || "ID no disponible";
            })
            .catch(error => console.error('Error al cargar los detalles del juego:', error));
    } else {
        console.error('No se proporcionó un ID de juego.');
    }
});
