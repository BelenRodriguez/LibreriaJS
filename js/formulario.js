/*Variables*/
let miFormulario = document.getElementById("formulario");
miFormulario.addEventListener("submit", validarFormulario);

/*Funciones*/
function validarFormulario(e) {
    e.preventDefault();
    guardarDato();
    mostrarDato();
}

function limpiarFormulario() {
    miFormulario.reset();
}

function guardarDato() {
    localStorage.setItem('nombre', miFormulario.children[0].children[3].value);
    localStorage.setItem('apellido', miFormulario.children[0].children[7].value);
    localStorage.setItem('e-mail', miFormulario.children[0].children[11].value);
}

function mostrarDato() {
    let email = localStorage.getItem('e-mail');
    console.log("El e-mail guardado es:", email);
}
