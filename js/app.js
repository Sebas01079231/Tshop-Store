// menu desplegable
const abrirCarrito = document.querySelector('#abrir_carrito');
const menu = document.querySelector('.submenu');

// carrito de compras
const productos = document.querySelector('#productos');
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarrito = document.querySelector('#vaciar-carrito');
let productosCarrito = [];

/* functiones 
------------------------------------------------------------*/
cargarEventListeners();
function cargarEventListeners() {
    abrirCarrito.addEventListener('click', (e)=>{
        e.preventDefault();
        if (menu.classList.contains('submenu_visible')) {
            menu.classList.remove('submenu_visible');
        }else{
            menu.classList.add('submenu_visible');
        }
    });


    productos.addEventListener('click', agregarCarrito);

    vaciarCarrito.addEventListener('click', ()=>{
        limpiarArray();
        insertarHTML();
        // console.log(productosCarrito);
    });


    contenedorCarrito.addEventListener('click', eliminarCarrito);

    document.addEventListener('DOMContentLoaded', ()=>{
        productosCarrito = JSON.parse(localStorage.getItem('productosCarrito')) || [];

        // console.log(productosCarrito);
        insertarHTML();
    });
}


  


// agregar a carrito 
function agregarCarrito(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const productoSeleccionado = e.target.parentElement.parentElement.parentElement.parentElement;

        leerProducto(productoSeleccionado);
        scrollToTop();
    }
}

// leer datos del Producto
function leerProducto(producto) {
    const leerProducto = {
        imagen: producto.querySelector('picture img').src,
        nombre: producto.querySelector('.producto_nombre').textContent,
        precio: producto.querySelector('.producto_precio span').textContent,
        id: producto.querySelector('.agregar-carrito').getAttribute('data-id'),
        cantidad: 1,
    };

    // evitar duplicidad de productos
    const existente = productosCarrito.some( producto => producto.id === leerProducto.id );

    if (existente) {
        const productos = productosCarrito.map( producto => {
            if (producto.id === leerProducto.id) {
                producto.cantidad++;
                return producto;
            } else{
                return producto;
            }
        })
        // agregando al arreglo el array productos
        productosCarrito = [...productos];
    } else{

        // agregando al arreglo
        productosCarrito = [...productosCarrito, leerProducto];
    }

    // console.log(productosCarrito);

    // insertar al HTML ese arreglo
    insertarHTML();
}

// insertar al HTML
function insertarHTML() {
    

    // limpiar HTML
    limpiarHTML();

    if (productosCarrito.length > 0) {

        productosCarrito.forEach( producto =>{
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${producto.imagen}" alt="imagen carrito" width="300"></td>
                <td>${producto.nombre}</td>
                <td>$${producto.precio}</td>
                <td>${producto.cantidad}</td>
                <td><a href="#" class="btn--eliminar" data-id="${producto.id}">X</a></td>
            `
            contenedorCarrito.appendChild(tr);
        });
    
        const suma = productosCarrito.reduce( (total,producto)=> total + producto.precio*producto.cantidad, 0);
    
        const trSuma = document.createElement('tr');
        trSuma.innerHTML = `
            <td class="total-pagar">Total a pagar: $${suma}</td>
        `
        contenedorCarrito.appendChild(trSuma);
    }

    const totalProductos = productosCarrito.reduce( (total, producto) => total + producto.cantidad, 0);
    // console.log(totalProductos);
    const numeroProductos = document.querySelector('.numero_productos');
    numeroProductos.innerHTML = `${totalProductos}`;

    const imgVacio = document.querySelector('.img_vacio img')
    const separacionBtn = document.querySelector('.lista_carrito'); 
    if (totalProductos > 0) {
        imgVacio.classList.remove('vacio');
        separacionBtn.classList.add('separacion_btn');
    } else{
        imgVacio.classList.add('vacio');
        separacionBtn.classList.remove('separacion_btn');
        // console.log(productosCarrito);
    }


    sincronizarStorage(productosCarrito);
}

// limpiar HTML
function limpiarHTML() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    };
}

// limpiar Array
function limpiarArray() {
    while (productosCarrito.length > 0) {
        productosCarrito.pop();
    }
}

// eliminar del carrito por btn X
function eliminarCarrito(e) {
    if (e.target.classList.contains('btn--eliminar')) {
        e.preventDefault();
        const productoID = e.target.getAttribute('data-id');

        // condicion en cantidad > 5
        const existente = productosCarrito.some( producto => producto.cantidad > 1 && producto.id === productoID );
        if (existente) {
            const productos = productosCarrito.map( producto =>{
                if (producto.cantidad > 1 && producto.id === productoID) {
                    producto.cantidad--;
                    return producto;
                } else{
                    return producto;
                }
            }) 
            productosCarrito = [...productos];
        } else{
            productosCarrito = productosCarrito.filter( producto => producto.id !== productoID );
        }

        insertarHTML();
    }
}

// scroll suave a la parte superior
function scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth' // para un scroll suave
    });
}

function sincronizarStorage(productosCarrito) {
    localStorage.setItem('productosCarrito', JSON.stringify(productosCarrito));
}