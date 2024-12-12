document.addEventListener('DOMContentLoaded', () => {
    const reviewsContainer = document.querySelector('.reviews-grid');
    const filtroContainer = document.createElement('div');
    filtroContainer.className = 'mb-4';

    // Crear el label para el filtro
    const filtroLabel = document.createElement('label');
    filtroLabel.for = 'categoriaFiltro';
    filtroLabel.textContent = 'Filtrar por categoría:';
    filtroLabel.className = 'form-label';

    // Crear el select para categorías
    const categoriaFiltro = document.createElement('select');
    categoriaFiltro.id = 'categoriaFiltro';
    categoriaFiltro.className = 'form-select';
    categoriaFiltro.innerHTML = `<option value="all">Todas</option>`; // Opción por defecto

    // Añadir el label y el select al contenedor
    filtroContainer.appendChild(filtroLabel);
    filtroContainer.appendChild(categoriaFiltro);

    // Insertar el contenedor del filtro antes del contenedor de reseñas
    reviewsContainer.parentNode.insertBefore(filtroContainer, reviewsContainer);

    // Función para generar estrellas a partir del rating
    const generarEstrellas = (rating) => '⭐'.repeat(Math.round(rating));

    // Función para renderizar reseñas
    const renderResenas = (productos, filtroCategoria = 'all') => {
        reviewsContainer.innerHTML = ''; // Limpiar contenedor de reseñas

        // Filtrar productos por categoría si corresponde
        const productosFiltrados = filtroCategoria === 'all'
            ? productos
            : productos.filter(producto => producto.category === filtroCategoria);

        productosFiltrados.forEach(producto => {
            if (producto.reviews && producto.reviews.length > 0) {
                const reviewArticle = document.createElement('article');
                reviewArticle.className = 'review card';

                // Encabezado del producto: imagen y título como párrafo
                reviewArticle.innerHTML = `
                    <div class="card-body">
                        <img src="${producto.thumbnail}" alt="${producto.title}" class="img-fluid mb-3">
                        <p>${producto.title}</p>
                    </div>
                `;

                // Añadir las reseñas del producto
                producto.reviews.forEach(resena => {
                    const estrellas = generarEstrellas(resena.rating);
                    const comentarioHTML = `
                        <div class="card-footer">
                            <p>${estrellas}</p>
                            <p>${resena.comment}</p>
                        </div>
                    `;
                    reviewArticle.innerHTML += comentarioHTML;
                });

                reviewsContainer.appendChild(reviewArticle);
            }
        });
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
                // Excluir productos de la categoría "groceries"
                const productosValidos = productos.filter(producto => producto.category !== 'groceries');

                // Obtener categorías únicas
                const categorias = [...new Set(productosValidos.map(producto => producto.category))];

                // Agregar las categorías al selector de filtro
                categorias.forEach(categoria => {
                    const option = document.createElement('option');
                    option.value = categoria;
                    option.textContent = categoria;
                    categoriaFiltro.appendChild(option);
                });

                // Renderizar todas las reseñas al inicio
                renderResenas(productosValidos);

                // Escuchar cambios en el filtro y actualizar la lista de reseñas
                categoriaFiltro.addEventListener('change', (event) => {
                    renderResenas(productosValidos, event.target.value);
                });
            } else {
                console.error('El JSON no es un arreglo válido.');
            }
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
        });
});
