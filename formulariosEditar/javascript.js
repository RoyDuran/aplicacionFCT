
function editar(idInput) {
    const input = document.getElementById(idInput);
    if (input.hasAttribute("readonly")) {
        input.removeAttribute("readonly");
        input.focus();
    } else {
        input.focus();
    }
}
function mostrarEstado(){
    //cada que se llame la funcion se cierran para que no queden abiertos de otra llamada
    document.getElementById("realizacion_convenio").style.display="none";
    document.getElementById("relacion_alumnos").style.display="none";
    document.getElementById("programa_horario").style.display="none";
    //abrimos solo el que deseamos
    var fase=document.getElementById("fase").value;
    document.getElementById(fase).style.display="flex";
}
