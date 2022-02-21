//CARGA DE PRODUCTOS POR MEDIO DE AJAX//

var articulos = [];
let productosAjaxCall = () => {
    return $.ajax({
        url: "../js/productos.json",
        dataType: "json",
        success: function (response) {
            for (const iterator of response) {
               articulos.push(iterator)
            }
        },
    });
}


