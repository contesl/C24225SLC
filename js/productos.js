document.addEventListener('DOMContentLoaded', () => {
    const productosContainer = document.getElementById('productos');
    const filtroContainer = document.createElement('div'); // Contenedor para el filtro

    // Crear el label para el campo de selección
    const filtroLabel = document.createElement('label');
    filtroLabel.for = 'categoriaFiltro';
    filtroLabel.className = 'form-label';
    filtroLabel.textContent = 'Seleccione la categoría o Todas:';

    // Crear el campo de selección
    const categoriaFiltro = document.createElement('select');
    categoriaFiltro.id = 'categoriaFiltro';
    categoriaFiltro.className = 'form-select mb-4';
    categoriaFiltro.innerHTML = `<option value="all">Todas</option>`; // Opción por defecto

    // Añadir el label y el campo de selección al contenedor
    filtroContainer.appendChild(filtroLabel);
    filtroContainer.appendChild(categoriaFiltro);

    // Insertar el filtro en la página, justo antes del contenedor de productos
    productosContainer.parentNode.insertBefore(filtroContainer, productosContainer);

    // Crear el modal de Bootstrap para la descripción ampliada (inicialmente oculto)
    const modalHTML = `
        <div class="modal fade" id="descripcionModal" tabindex="-1" aria-labelledby="descripcionModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="descripcionModalLabel">Descripción Ampliada</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <p id="descripcionAmpliada"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    // Añadir el modal al body del documento
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Inicializar el carrito desde localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            //---visualizacion carrito
            const actualizarCarrito = () => {
            const carritoTabla = document.getElementById('carritoTabla');
            carritoTabla.innerHTML = '';

            carrito.forEach(producto => {
                const subtotal = producto.price * producto.quantity;
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${producto.title}</td>
                    <td><input type="number" min="1" value="${producto.quantity}" class="form-control cantidadCarrito" data-id="${producto.id}"></td>
                    <td>$${producto.price.toFixed(2)}</td>
                    <td>$${subtotal.toFixed(2)}</td>
                    <td><button class="btn btn-danger btn-sm eliminarCarrito" data-id="${producto.id}">Eliminar</button></td>
                `;
                carritoTabla.appendChild(fila);
            });

            // Eventos para cambiar cantidad o eliminar producto
            document.querySelectorAll('.cantidadCarrito').forEach(input => {
                input.addEventListener('change', event => {
                    const id = event.target.dataset.id;
                    const nuevaCantidad = parseInt(event.target.value, 10);
                    actualizarCantidadCarrito(id, nuevaCantidad);
                });
            });

            document.querySelectorAll('.eliminarCarrito').forEach(btn => {
                btn.addEventListener('click', event => {
                    const id = event.target.dataset.id;
                    eliminarDelCarrito(id);
                });
            });
        };

        const actualizarCantidadCarrito = (id, cantidad) => {
            const producto = carrito.find(item => item.id == id);
            if (producto) {
                producto.quantity = cantidad;
                guardarCarrito();
                actualizarCarrito();
            }
        };

        const eliminarDelCarrito = id => {
            carrito = carrito.filter(producto => producto.id != id);
            guardarCarrito();
            actualizarCarrito();
        };

        // Vaciar el carrito
        document.getElementById('vaciarCarrito').addEventListener('click', () => {
            carrito = [];
            guardarCarrito();
            actualizarCarrito();
        });

        // Inicializar el carrito al cargar la página
        actualizarCarrito();

    //

    const guardarCarrito = () => {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    };

    // Cargar el JSON desde el archivo local
    fetch('https://dummyjson.com/products') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el JSON');
            }
            return response.json();
        })
        .then(data => {
            const productos = data.products;

            if (Array.isArray(productos)) {
                // Filtrar productos para excluir la categoría "groceries"
                const productosFiltrados = productos.filter(producto => producto.category !== 'groceries');

                // Obtener categorías únicas (excluyendo "groceries")
                const categorias = [...new Set(productosFiltrados.map(producto => producto.category))];

                // Agregar categorías al campo de selección
                categorias.forEach(categoria => {
                    const option = document.createElement('option');
                    option.value = categoria;
                    option.textContent = categoria;
                    categoriaFiltro.appendChild(option);
                });

                // Función para renderizar productos
                const renderProductos = (filtroCategoria = 'all') => {
                    productosContainer.innerHTML = ''; // Limpiar el contenedor

                    const productosParaMostrar = filtroCategoria === 'all'
                        ? productosFiltrados
                        : productosFiltrados.filter(producto => producto.category === filtroCategoria);

                    productosParaMostrar.forEach(producto => {
                        const colDiv = document.createElement('div');
                        colDiv.className = 'col-sm-12 col-md-6 col-lg-4 mb-4';

                        colDiv.innerHTML = `
                            <div class="card h-100">
                                <img src="${producto.thumbnail}" class="card-img-top" alt="${producto.title}" style="cursor: pointer;">
                                <div class="card-body">
                                    <p>${producto.title}</p>
                                    <p class="card-text"><strong>Precio:</strong> $${producto.price.toFixed(2)}</p>
                                    <div class="d-flex align-items-center">
                                        <label for="cantidadProducto${producto.id}" class="me-2">Cantidad:</label>
                                        <input type="number" id="cantidadProducto${producto.id}" class="form-control me-2" style="width: 120px;" min="1" value="1">
                                        <button class="btn btn-sm btn-primary flex-shrink-0" data-id="${producto.id}" style="width: 100px;">Comprar</button>
                                    </div>
                                </div>
                            </div>
                        `;
                        // Evento para mostrar la descripción ampliada en el modal
                        colDiv.querySelector('img').addEventListener('click', () => {
                            document.getElementById('descripcionAmpliada').textContent = producto.description;
                            const modal = new bootstrap.Modal(document.getElementById('descripcionModal'));
                            modal.show();
                        });

                        // Evento para añadir al carrito
                        colDiv.querySelector('button').addEventListener('click', (event) => {
                            const cantidad = parseInt(document.getElementById(`cantidadProducto${producto.id}`).value, 10);
                            if (cantidad > 0) {
                                const productoEnCarrito = carrito.find(item => item.id === producto.id);
                                if (productoEnCarrito) {
                                    //productoEnCarrito.quantity += cantidad;
                                    productoEnCarrito.quantity = cantidad;
                                } else {
                                    carrito.push({ id: producto.id, title: producto.title, price: producto.price, quantity: cantidad });
                                }
                                guardarCarrito();
                                actualizarCarrito(); // Actualiza el carrito inmediatamente
                                alert(`Añadido al carrito: ${producto.title} (x${cantidad})`);
                            } else {
                                alert('Por favor, ingresa una cantidad válida.');
                            }
                        });

                        productosContainer.appendChild(colDiv);
                    });
                };

                // Renderizar todos los productos al inicio
                renderProductos();

                // Escuchar cambios en el filtro y actualizar la lista de productos
                categoriaFiltro.addEventListener('change', (event) => {
                    renderProductos(event.target.value);
                });
            } else {
                console.error('El JSON no es un arreglo válido.');
            }
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
        });
});
