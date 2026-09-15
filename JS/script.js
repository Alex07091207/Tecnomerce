document.addEventListener('DOMContentLoaded', () => {
    inicializarEventos();
    cargarProductosFetch();
});

// Función central para organizar los eventos interactivos
function inicializarEventos() {
    // 1. Evento MOUSEOVER: Cambiar estilo de botones de compra
    const botonesCompra = document.querySelectorAll('.card .btn-primary');
    botonesCompra.forEach(boton => {
        boton.addEventListener('mouseover', () => {
            boton.textContent = '¡Llevar ahora!';
            boton.classList.add('bg-success');
        });
        boton.addEventListener('mouseout', () => {
            boton.textContent = 'Comprar';
            boton.classList.remove('bg-success');
        });
    });

    // 2. Manipulación del DOM y Evento CLICK: Modo Oscuro
    const nav = document.querySelector('.navbar-nav');
    if (nav) {
        const liModo = document.createElement('li'); // Manipulación del DOM
        liModo.className = 'nav-item ms-lg-3';
        liModo.innerHTML = '<button id="btn-modo" class="btn btn-dark btn-sm mt-1">Modo Oscuro</button>';
        nav.appendChild(liModo);

        document.getElementById('btn-modo').addEventListener('click', function() {
            document.body.classList.toggle('bg-dark');
            document.body.classList.toggle('text-white');
            this.textContent = document.body.classList.contains('bg-dark') ? 'Modo Claro' : 'Modo Oscuro';
        });
    }

    // 3. Evento SUBMIT: Validación en formulario de contacto
    const formContacto = document.getElementById('formulario-contacto');
    if (formContacto) {
        formContacto.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const email = document.getElementById('email').value;
            const mensajeDiv = document.getElementById('mensaje-exito');
            mensajeDiv.textContent = `¡Gracias por tu mensaje, ${email}! Te contactaremos pronto.`;
            formContacto.reset();
        });
    }
}

// 4. Fetch API: Cargar datos desde fuente externa
function cargarProductosFetch() {
    const contenedorApi = document.getElementById('lista-productos-api');
    if (!contenedorApi) return; // Se ejecuta solo si existe el contenedor

    fetch('https://fakestoreapi.com/products/category/electronics?limit=3')
        .then(respuesta => {
            if (!respuesta.ok) throw new Error('Error al conectar con la API');
            return respuesta.json(); // Manejo de promesas
        })
        .then(datos => {
            datos.forEach(producto => {
                // Manipulación del DOM para visualizar datos dinámicamente
                const divCard = document.createElement('div');
                divCard.className = 'col-md-4';
                divCard.innerHTML = `
                    <div class="card h-100 p-3 shadow-sm">
                        <img src="${producto.image}" class="card-img-top" style="height: 150px; object-fit: contain;" alt="${producto.title}">
                        <div class="card-body text-center">
                            <h6 class="card-title text-truncate">${producto.title}</h6>
                            <p class="card-text fw-bold">$${(producto.price * 900).toFixed(0)} CLP</p>
                        </div>
                    </div>
                `;
                contenedorApi.appendChild(divCard);
            });
        })
        .catch(error => {
            console.error('Fallo en la carga de productos:', error);
            contenedorApi.innerHTML = '<p class="text-danger">No se pudieron cargar los productos en este momento.</p>';
        });
}