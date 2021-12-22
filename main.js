let codigo;
let descripcion;
let precio;
let cantidad = 0;
const productos = [];

class Producto{

    constructor(codigo,descripcion,precio){
        if(cantidad == 0){
            this.codigo = codigo;
            this.descripcion = descripcion;
            this.precio = precio;
            productos.push(codigo);
        }
        else{
            this.agregarProducto(codigo);
        }
    }

    agregarProducto(codigo){
        for(let index = 0; index < cantidad; index ++){
            productos.push(codigo);
        }
    }

    cantidadProductosIngresados(){
        console.log(productos.length);
    }

    comprar(precio,cant){

        let montoTotal;
    
        if(cantidad != 0){
            montoTotal = precio * cant;
        }
        return montoTotal;
    }
}

function  ingresarDatos(){
        precio = parseFloat(prompt("Ingrese el precio del producto"));
        validarPrecio();

        cantidad = parseInt(prompt("Ingrese la cantidad"));
        validarCantidad();
}

function validarPrecio(){
        while(precio < 0){
            alert("No puede ingresar precios negativos");
            precio = parseFloat(prompt("Ingrese el precio del producto"));
        }
}

function validarCantidad(){
        while(cantidad <= 0){
            alert("No se pueden ingresar cantidades negativas o que sean 0");
            cantidad = parseInt(prompt("Ingrese la cantidad"));
        }
        acumuladorCantidades(cantidad);
}

function acumuladorCantidades(cantidad){
        cantidad = cantidad;
}

const producto1 = new Producto(1,"Plasticola",15);
const producto2 = new Producto(2,"Regla",20);

//Para verificar las entradas y salidas
ingresarDatos();
alert("El monto a pagar es de: " + " " + "$" + producto1.comprar(precio,cantidad));

//Para verificar que el array guarde la información
producto1.cantidadProductosIngresados();