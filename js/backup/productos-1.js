document.addEventListener('DOMContentLoaded', () => {
    const productosContainer = document.getElementById('productos');

    // Cargar el JSON desde un archivo o API
    fetch('/Data/products2.json') // Cambia 'ruta/al/archivo.json' por la URL o ruta real
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el JSON');
            }
            return response.json();
        })
        .then(productos => {
            // Verifica que el JSON sea un arreglo
            if (Array.isArray(productos)) {
                productos.forEach(producto => {
                    const colDiv = document.createElement('div');
                    colDiv.className = 'col-sm-12 col-md-6 col-lg-4 mb-4';

                    colDiv.innerHTML = `
                        <div class="card h-100">
                            <img src="${producto.image}" class="card-img-top" alt="${producto.title}">
                            <div class="card-body">
                                <h5 class="card-title">${producto.title}</h5>
                                <p class="card-text">${producto.description}</p>
                                <p class="card-text"><strong>Precio:</strong> $${producto.price.toFixed(2)}</p>
                                <label for="cantidadProducto${producto.id}">Cantidad a Comprar:</label>
                                <input type="number" id="cantidadProducto${producto.id}" class="form-control" min="0" value="0">
                            </div>
                        </div>
                    `;

                    productosContainer.appendChild(colDiv);
                });
            } else {
                console.error('El JSON no es un arreglo válido.');
            }
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
        });
});

