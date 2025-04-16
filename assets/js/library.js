function loadGames() {
    fetch('fetch_games.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(data => {
            const trendingContainer = document.getElementById('trending-games');
            const mostPlayedContainer = document.getElementById('most-played-games-container');

            trendingContainer.innerHTML = ''; 
            mostPlayedContainer.innerHTML = ''; 

            if (data.error) {
                console.error(data.error);
                return;
            }

            const trendingGames = [];
            const mostPlayedGames = [];
            data.forEach(game => {
                // Limitar a 4 juegos en cada sección
                if (game.isTrending === 1 && trendingGames.length < 4) {
                    trendingGames.push(game);
                } else if (mostPlayedGames.length < 4) {
                    mostPlayedGames.push(game);
                }
            });

            // Insertar juegos en sus respectivos contenedores
            trendingGames.forEach(game => {
                const gameElement = document.createElement('div');
                gameElement.className = 'col-lg-3 col-md-6 align-self-center mb-30 trending-items col-md-6';
                gameElement.innerHTML = `
                    <div class="item" data-id="${game.gameId}">
                        <div class="thumb">
                            <a href="product-details.html?id=${game.gameId}">
                                <img src="${game.image}" alt="${game.name}">
                            </a>
                            <span class="price"><em>$${game.price}</em></span>
                        </div>
                        <div class="down-content">
                            <span class="category">${game.category}</span>
                            <h4 class="product-name">${game.name}</h4>
                            <a href="#" class="add-to-cart-btn"><i class="fa fa-shopping-bag"></i></a>
                        </div>
                    </div>
                `;
                trendingContainer.appendChild(gameElement);
            });

            mostPlayedGames.forEach(game => {
                const gameElement = document.createElement('div');
                gameElement.className = 'col-lg-3 col-md-6 align-self-center mb-30 trending-items col-md-6';
                gameElement.innerHTML = `
                    <div class="item" data-id="${game.gameId}">
                        <div class="thumb">
                            <a href="product-details.html?id=${game.gameId}">
                                <img src="${game.image}" alt="${game.name}">
                            </a>
                            <span class="price"><em>$${game.price}</em></span>
                        </div>
                        <div class="down-content">
                            <span class="category">${game.category}</span>
                            <h4 class="product-name">${game.name}</h4>
                            <a href="#" class="add-to-cart-btn"><i class="fa fa-shopping-bag"></i></a>
                        </div>
                    </div>
                `;
                mostPlayedContainer.appendChild(gameElement);
            });
        })
        .catch(error => console.error('Error al cargar los juegos:', error));
}

// Función para cargar la biblioteca de juegos
function loadLibrary() {
    fetch('assets/php/fetch_purchased_games.php')
        .then(response => response.json())
        .then(data => {
            const libraryContainer = document.getElementById('library-container');
            const emptyLibrary = document.getElementById('empty-library');

            if (data.error) {
                console.error(data.error);
                return;
            }

            if (data.length === 0) {
                emptyLibrary.style.display = 'block';
                libraryContainer.style.display = 'none';
            } else {
                emptyLibrary.style.display = 'none';
                libraryContainer.style.display = 'flex';

                data.forEach(game => {
                    const gameElement = document.createElement('div');
                    gameElement.className = 'col-lg-4 col-md-6';
                    gameElement.innerHTML = `
                        <div class="library-item">
                            <div class="game-image">
                                <img src="${game.image}" alt="${game.name}">
                            </div>
                            <div class="game-info">
                                <h4>${game.name}</h4>
                                <span class="category">${game.category}</span>
                                <span class="purchase-date">Comprado el: ${new Date(game.purchase_date).toLocaleDateString()}</span>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span>Tamaño: ${game.fileSize}</span>
                                    <a href="#" class="download-button" data-id="${game.gameId}">
                                        <i class="fa fa-download"></i> Descargar
                                    </a>
                                </div>
                            </div>
                        </div>
                    `;
                    libraryContainer.appendChild(gameElement);
                });

                document.querySelectorAll('.download-button').forEach(button => {
                    button.addEventListener('click', function(e) {
                        e.preventDefault();
                        const gameId = this.getAttribute('data-id');
                        downloadGame(gameId);
                    });
                });
            }
        })
        .catch(error => console.error('Error al cargar la biblioteca:', error));
}

// Función para simular la descarga de un juego
function downloadGame(gameId) {
    const game = products[gameId] || products['default'];
    
    // Crear un elemento de progreso para simular la descarga
    const downloadModal = document.createElement('div');
    downloadModal.style.position = 'fixed';
    downloadModal.style.top = '0';
    downloadModal.style.left = '0';
    downloadModal.style.width = '100%';
    downloadModal.style.height = '100%';
    downloadModal.style.backgroundColor = 'rgba(0,0,0,0.8)';
    downloadModal.style.zIndex = '9999';
    downloadModal.style.display = 'flex';
    downloadModal.style.flexDirection = 'column';
    downloadModal.style.justifyContent = 'center';
    downloadModal.style.alignItems = 'center';
    downloadModal.style.color = '#fff';
    
    downloadModal.innerHTML = `
        <h3>Descargando ${game.name}</h3>
        <p>Tamaño: ${game.fileSize}</p>
        <div style="width: 80%; max-width: 500px; background-color: #333; border-radius: 10px; height: 20px; margin: 20px 0;">
            <div id="progress-bar" style="width = '0%'; height: 100%; background-color: #ee626b; border-radius: 10px; transition: width 0.5s;"></div>
        </div>
        <p id="progress-text">0%</p>
        <button id="cancel-download" style="margin-top: 20px; padding: 10px 20px; background-color: #ee626b; color: #fff; border: none; border-radius: 25px; cursor: pointer;">Cancelar</button>
    `;
    
    document.body.appendChild(downloadModal);
    
    // Simular progreso de descarga
    let progress = 0;
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const cancelButton = document.getElementById('cancel-download');
    
    cancelButton.addEventListener('click', function() {
        clearInterval(downloadInterval);
        document.body.removeChild(downloadModal);
    });
    
    const downloadInterval = setInterval(() => {
        progress += Math.random() * 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(downloadInterval);
            
            // Cambiar el contenido del modal cuando la descarga se completa
            downloadModal.innerHTML = `
                <h3>¡Descarga Completada!</h3>
                <p>${game.name} se ha descargado correctamente.</p>
                <button id="close-modal" style="margin-top: 20px; padding: 10px 20px; background-color: #0071f8; color: #fff; border: none; border-radius: 25px; cursor: pointer;">Cerrar</button>
            `;
            
            document.getElementById('close-modal').addEventListener('click', function() {
                document.body.removeChild(downloadModal);
            });
        }
        
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
    }, 200);
}

// Cargar la biblioteca cuando se cargue la página
document.addEventListener('DOMContentLoaded', loadLibrary);
