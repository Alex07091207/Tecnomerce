document.addEventListener('DOMContentLoaded', () => {
    // Inicializar carrito leyendo de localStorage
    inicializarCarritoGlobal();
    
    // Funciones de la tienda (cargar API y eventos)
    cargarProductosDesdeJSON();
    inicializarBuscador();
    asignarEventosCarrito();
    
    // Función específica para la página carrito.html
    renderizarPaginaCarrito();
});

let carritoGlobal = [];

function inicializarCarritoGlobal() {
    // Intenta obtener los datos guardados; si no hay, devuelve un arreglo vacío.
    const carritoGuardado = localStorage.getItem('tecnomerce_carrito');
    if (carritoGuardado) {
        carritoGlobal = JSON.parse(carritoGuardado);
    }
}

// 1. Fetch API con JSON Local
function cargarProductosDesdeJSON() {
    const contenedor = document.getElementById('lista-productos-api');
    if (!contenedor) return;

    fetch('productos.json')
        .then(respuesta => {
            if (!respuesta.ok) throw new Error('Error al cargar el archivo JSON');
            return respuesta.json();
        })
        .then(productos => {
            contenedor.innerHTML = '';
            productos.forEach(producto => {
                const col = document.createElement('div');
                col.className = 'col-md-4';
                col.innerHTML = `
                    <div class="card h-100 shadow-sm">
                        <img src="${producto.imagen}" class="card-img-top" style="height: 200px; object-fit: contain;" alt="${producto.nombre}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text fw-bold">$${producto.precio.toLocaleString('es-CL')}</p>
                            <button class="btn btn-primary btn-agregar" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}">Agregar al carrito</button>
                        </div>
                    </div>
                `;
                contenedor.appendChild(col);
            });
            asignarEventosCarrito();
        })
        .catch(error => {
            console.error('Error:', error);
            contenedor.innerHTML = '<div class="alert alert-danger">No se pudieron cargar los productos externos.</div>';
        });
}

// 2. Evento Click: Agregar al Carrito (y guardar en localStorage)
function asignarEventosCarrito() {
    const botones = document.querySelectorAll('.btn-agregar');
    botones.forEach(boton => {
        // Remover listener anterior para evitar duplicados si se llama a la función varias veces
        boton.replaceWith(boton.cloneNode(true));
    });

    // Volver a seleccionar después del cloneNode
    const botonesNuevos = document.querySelectorAll('.btn-agregar');
    botonesNuevos.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const nombre = e.target.getAttribute('data-nombre');
            const precio = parseInt(e.target.getAttribute('data-precio'));
            
            // Agregar al arreglo global
            carritoGlobal.push({ nombre, precio });
            
            // Guardar en localStorage convirtiendo a texto JSON
            localStorage.setItem('tecnomerce_carrito', JSON.stringify(carritoGlobal));
            
            alert(`¡${nombre} agregado al carrito con éxito!`);
        });
    });
}

// 3. Lógica específica para carrito.html
function renderizarPaginaCarrito() {
    const listaCarrito = document.getElementById('lista-carrito-pagina');
    const spanTotal = document.getElementById('total-carrito-pagina');
    const btnVaciar = document.getElementById('btn-vaciar-carrito');
    const btnProcesar = document.getElementById('btn-procesar-pago');
    
    // Si no existen estos elementos, significa que no estamos en carrito.html
    if (!listaCarrito || !spanTotal) return;

    // Calcular el total usando el método reduce de los arreglos
    let total = 0;

    if (carritoGlobal.length === 0) {
        listaCarrito.innerHTML = '<li class="list-group-item text-muted text-center py-4">El carrito está vacío.</li>';
        spanTotal.textContent = "0";
        if (btnProcesar) btnProcesar.disabled = true;
    } else {
        listaCarrito.innerHTML = ''; // Limpiar lista
        
        carritoGlobal.forEach((item) => {
            total += item.precio;
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center py-3';
            li.innerHTML = `
                <span class="fw-bold">${item.nombre}</span> 
                <span class="badge bg-primary rounded-pill fs-6">$${item.precio.toLocaleString('es-CL')}</span>
            `;
            listaCarrito.appendChild(li);
        });

        spanTotal.textContent = total.toLocaleString('es-CL');
        if (btnProcesar) btnProcesar.disabled = false;
    }

    // Funcionalidad del botón para vaciar el carrito
    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => {
            if(confirm("¿Estás seguro que deseas vaciar el carrito?")) {
                carritoGlobal = [];
                localStorage.removeItem('tecnomerce_carrito');
                renderizarPaginaCarrito(); // Volver a dibujar
            }
        });
    }
}

// 4. Evento Submit: Procesar formulario de búsqueda
function inicializarBuscador() {
    const formBusqueda = document.getElementById('formulario-busqueda');
    if (formBusqueda) {
        formBusqueda.addEventListener('submit', (e) => {
            e.preventDefault();
            const termino = document.getElementById('input-busqueda').value;
            alert(`Simulando búsqueda para el término: "${termino}".`);
            formBusqueda.reset();
        });
    }
}