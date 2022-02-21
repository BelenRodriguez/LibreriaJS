/*CLASES*/

class Producto {
    constructor(id, descripcion, precio) {
        this.id = id;
        this.descripcion = descripcion;
        this.precio = precio;
    };
};

class Cliente {
    constructor(nombre, email, telefono, productosComprados) {
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.productosComprados = productosComprados;
    };
};

/*VARIABLES GLOBALES*/

let incrementador = 0;
let productos = [];
let productosComprados = [];
let productosCompradosPrecioTotal = [];
let total = 0;

/*VARIABLES CON HTML*/

let grid = $('<div class="grid col-md-10"></div>')
let grid_container = $('<div class="grid-container row d-flex"></div>')
let carrito = $(`
        <div class="carritoInner noMostrar">
        <p class="precioTotal">Total: 
            <span id="precioTotal">0</span>
        </p>
        <a href="#/FinalizaCompra" class="comprar btn btn-primary hidden">Comprar</a>
        </div>
    `);
let carritoVacio = $('<p class="carritoVacio">¡Aún no tienes productos en tu carrito!</p>');


let paginaFinalizarCompra = $(`
    <div class="container-fluid finalizarCompra row">
        <h1 class="titulo">Finalizá tu compra</h1>
        <div class="productos_finalizarCompra col-md-4">
            <div class="total">
                <p>Total</p>
            </div>
        </div>

        <div class="datosPersonales_finalizarCompra col-md-7">
            <h3 class ="titulo">Datos Personales</h3>
            <form onsubmit="return false" class="finalizarCompraForm">
                <div class="form-group">
                    <label class="lead">Nombre</label>
                    <input class="form-control"  type="text" id="nombre" value="">
                </div>
                <div class="form-group">
                    <label class="lead">Email</label>
                    <input class="form-control"  type="email" id="email" value="">
                </div>
                <div class="form-group">
                    <label class="lead" >Teléfono</label>
                    <input class="form-control"  type="text" value="" id="tel">
                </div>
                <br>
                <div class="form-group">
                    <input class="btn btn-primary" type="submit" value="Confirmar compra">
                </div>
            </form>
        </div>
    </div>
    `
);

/* DOCUMENT READY FUNCTION */

$(() => {
    $('section').append(grid_container);
    $('.grid-container').append(grid);
    $('.carrito').append(carrito);

    $.when(productosAjaxCall()).done(() => {
        for (const iterator of articulos) {
            productos.push(new Producto(iterator.id, iterator.descripcion, iterator.precio))
            catalogo(iterator, $('.grid'));
        };
    });


    /* JQUERY Y EVENTOS */

    /* BUSCADOR */

    $('form.buscador').submit((e) => {

        /*El valor ingresado por el usuario lo pasamos a mayúscula para evitar problemas
             de que no coincidan los datos ingresados*/
        let ingresoUsuario = e.target[0].value;
        let convertirEnMayuscula = ingresoUsuario.toUpperCase();

        $('.unProducto').remove();
        $('.grid-container h3').remove();
        $('.grid-container').prepend('<h3 class="col-md-12">Resultados para: ' + ingresoUsuario + '</h3>');

        for (const iterator of articulos) {
            let productoEnMayuscula = iterator.descripcion.toUpperCase();
            if (productoEnMayuscula.indexOf(convertirEnMayuscula) > -1) {
                catalogo(iterator, $('.grid'));
            }
        }
    });

    /* AGREGAR PRODUCTOS AL CARRITO */

    $('.carritoInner').prepend(carritoVacio);
    $('.grid-container').on('click', '.unProducto a.agregar', function (e) {
        e.stopPropagation();
        $('.carritoInner p.carritoVacio').remove();
        incrementador++;
        let contador = $('#contador');
        let precioProducto = e.currentTarget.nextElementSibling.innerHTML;
        let nombreProducto = e.currentTarget.parentElement.parentElement.firstElementChild.innerHTML;
        let productoDiv = e.currentTarget.parentElement.parentElement;
        let productoId = $(productoDiv).attr('class').replaceAll('unProducto fadeIn ', '');
        $(contador).addClass('mostrar');
        contador.html(incrementador);
        /*Guardamos los productos comprados en el localStorage*/
        for (const iterator of articulos) {
            if (iterator.nombre === nombreProducto) {
                sessionStorage.setItem('producto_' + incrementador, JSON.stringify({ iterator }));
            }
        }
        let productoImagen = nombreProducto;
        crearProductoEnCarrito(carrito, nombreProducto, precioProducto, productoImagen, productoId);
        $('a.comprar').removeClass('hidden');
        let totalString = $('span#precioTotal')[0].innerHTML;
        var total = parseInt(totalString);
        let precioN = parseInt(precioProducto);
        var total = total + precioN;
        $('span#precioTotal')[0].textContent = total;
    });

    /* ELIMINAR PRODUCTOS DEL CARRITO */

    $('.carritoInner').on('click', 'a.quitar', (e) => {
        e.stopPropagation();
        let precioProducto = e.currentTarget.previousElementSibling.lastElementChild.innerHTML;
        /*Eliminamos los productos del localStorage*/
        sessionStorage.removeItem('producto_' + incrementador);
        let contador = $('#contador'); 
        incrementador--;
        contador.html(incrementador);
        /*Eliminamos el producto*/
        e.target.parentElement.remove();
        /*Evaluamos el caso de que no hayan productos en el carrito*/
        if (incrementador === 0) {
            $(contador).removeClass('mostrar');
            $('.carritoInner').prepend(carritoVacio);
            $('a.comprar').addClass('hidden');
        }
        let totalString = $('span#precioTotal')[0].innerHTML;
        var total = parseInt(totalString);
        let precioN = parseInt(precioProducto);
        $('span#precioTotal')[0].textContent = total - precioN;
    });


    /* MOSTRAR U OCULTAR LOS PRODUCTOS DEL CARRITO */

    $('.carrito').on('click', (e) => {
        $('.carritoInner').toggleClass('noMostrar');
        $('#carrito').toggleClass('abierto');
        e.stopPropagation();
    });

    /* SE EVITA QUE EL CARRITO SE CIERRA AL HACER CLICK DENTRO DE ÉL*/
    $('.carritoInner').click((e) => { e.stopPropagation(); });

    /* SE CIERRA EL CARRITO AL HACER CLICK FUERA DE ÉL*/
    $('body').click((e) => {
        let carrito = $('.carritoInner');
        if (carrito.hasClass('noMostrar')) {
        } else {
            $('.carritoInner').toggleClass('noMostrar');
            $('#carrito').toggleClass('abierto');
        }
        e.stopPropagation();
    })

    /* BOTÓN COMPRAR DENTRO DEL CARRITO */

    $('a.comprar').click((e) => {
        incrementador = 0;
        $('#contador').removeClass('mostrar');
        $('.carrito').hide();
        $('section').html('');
        $('section').removeClass();
        $('section').addClass('container');
        $('.carritoInner').remove();
        $('section').append(paginaFinalizarCompra);
        let productosEnCarrito = e.target.parentNode.children;
        for (const iterator of productosEnCarrito) {
            incrementador++;
            if ($(iterator).hasClass('carrito-item')) {
                idEnCarrito = iterator.id;
                for (const productos of articulos) {
                    if (idEnCarrito == productos.id) {
                        /* Guardamos los productos comprados en el localStorage */
                        productosComprados.push(productos);
                        sessionStorage.setItem('productoComprado_' + incrementador, JSON.stringify({ productos }));
                    }
                }
            }
        }
        incrementador = 0;
        precios = [];
        /* Guardamos los precios de los productos comprados */
        for (const iterator of productosComprados) {
            incrementador++;
            let preciosAPushear = iterator.precio;
            precios.push(preciosAPushear);
            productosEnFinalizarCompra(iterator, $('.productos_finalizarCompra'));
        }
        let precioTotal = precios.reduce((a, b) => a + b, 0);
        $('.total').append('<p>' + precioTotal + '</p>');
        productosCompradosPrecioTotal.push(precioTotal);
    });

    /* BOTÓN DE FINALIZAR COMPRA */

    $('body').on('submit', '.finalizarCompraForm', function (e) {

        let nombre = e.target[0].value;
        let email = e.target[1].value;
        let tel = e.target[2].value;
        let url = "https://jsonplaceholder.typicode.com/posts";
        new Cliente(nombre, email, tel, productosComprados);

        /*Uso de Ajax*/
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                nombre: nombre,
                email: email,
                tel: tel,
                dataProductosComprados: productosComprados,
                dataPrecioTotal: productosCompradosPrecioTotal[0],
            },
            beforeSend: function () {
                $('.finalizarCompra').html('');
                $('.finalizarCompra').addClass('compraFinalizada');
                $('.finalizarCompra.compraFinalizada').removeClass('finalizarCompra');
                $('#loader').removeClass('hidden');
            },
            success: function (data) {
                compraRealizadaConExito(data);
            },
            complete: function () {
                $('#loader').addClass('hidden');
            }
        });
    });
});


/* Creamos los productos */
let catalogo = (producto, donde) => {
    let estructuraBasica = $(`
        <div class="unProducto fadeIn ${producto.id} ">
            <p class="descripcion">${producto.descripcion}</p>
            <img class="card-img-top" src="images/${producto.imagen}" alt="imagen" width="300" height="300" >
            <div class="d-flex justify-content-between align-items-center">
                <a class="btn btn-light agregar">Agregar</a>
                <p class="precio h5">${producto.precio} </p>
            </div>
        </div>'
    `
    );
    $(donde).append(estructuraBasica);
}
/* Creamos los productos en el carrito */
let crearProductoEnCarrito = (donde, nombre, precio, imagen, productoId) => {
    let nuevoProductoEnCarrito = $(`
        <div id="${productoId}" class="d-flex flex-row carrito-item justify-content-between">
            <img src="../images/${imagen}.jpg" alt="imagen" width="80" height="80">
            <div>
                <p class="carritoNombre">${nombre}</p>
                <p class="carritoPrecio">${precio}</p>
            </div>
            <a class="btn btn-light quitar">X</a>
        </div>
    `
    ).fadeIn(3000);
    $(donde).prepend(nuevoProductoEnCarrito);
};


let productosEnFinalizarCompra = (producto, donde) => {
    let productoDiv = $(`
        <div class="producto_finalizarCompra">
            <img class="card-img-top" src="../images/${producto.descripcion}.jpg" alt="" width="100" height="100">
            <p>${producto.descripcion}</p>
            <p>${producto.precio}</p>
        </div>
        <hr>
    `
    )
    donde.prepend(productoDiv);
};


let compraRealizadaConExito = (data) => {
    let mensajeCompra = `
        <div class="col-md-12">
            <h3 class="nombre">¡Gracias <span class="">${data.nombre}</span> por elegirnos!</h3>
        </div>
    `;
    $('.compraFinalizada').append(mensajeCompra);

}; 