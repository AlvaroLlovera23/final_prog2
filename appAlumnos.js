const dni = document.getElementById("dni")
const nombre = document.getElementById("nombre")
const domicilio = document.getElementById("domicilio")
const listaAlumnos = document.getElementById("listaAlumnos")
const btnGuardarA = document.getElementById("btnGuardarA")
const btnEditarA = document.getElementById("btnEditarA")
const btnCancelarA = document.getElementById("btnCancelarA")

let auxiliar
let indAux
let deudores = []
listarAlumnos()

function guardarAlumno() {
    axios.post("http://localhost:3000/alumno", { dni: dni.value, nombre: nombre.value, domicilio: domicilio.value })
        .then(function (res) {
            listarAlumnos()
        })
        .catch(function (error) {
            alert("Error al guardar alumno")
            alert(error)
        })
}

function listarAlumnos() {
    axios.get("http://localhost:3000/alumno")
        .then(function (res) {
            listaAlumnos.innerHTML = ""
            res.data.forEach(elemento => {
                listaAlumnos.innerHTML += '<button onclick="borrarAlumno(' + elemento.id + ')">X</button>' + '<button onclick="mostrarAlumno(' + elemento.id + ')">Editar</button>' + " - " + elemento.dni + " - " + elemento.nombre + " - " + elemento.domicilio + "<br>"
            });
        })
        .catch(function (error) {
            alert("Error al mostrar alumnos")
            alert(error)
        })
}

function borrarAlumno(id) {
    axios.delete("http://localhost:3000/alumno/" + id)
    .then(function(res){
        listarAlumnos()
    })
    .catch(function(error){
        alert("No se pudo eliminar")
        alert(error)
    })
}

function mostrarAlumno(id) {
    axios.get("http://localhost:3000/alumno/" + id)
        .then(function (res) {
            auxiliar = id
            btnGuardarA.disabled = true
            btnEditarA.disabled = false
            btnCancelarA.disabled = false
            btnCancelarA.hidden = false
            dni.value = res.data.dni
            nombre.value = res.data.nombre
            domicilio.value = res.data.domicilio
        })
        .catch(function (error) {
            alert(error)
        })
}

function editarAlumno() {
    axios.put("http://localhost:3000/alumno/" + auxiliar, { dni: dni.value, nombre: nombre.value, domicilio: domicilio.value })
        .then(function (res) {
            alert("Los datos se modificaron correctamente")
            listarAlumnos()
            btnGuardarA.disabled = false
            btnEditarA.disabled = true
            btnCancelarA.disabled = true
            btnCancelarA.hidden = true
        })
        .catch(function (error) {
            alert("No se pudo modificar")
            alert(error)
        })
}

function cancelarEditarA() {
    dni.value = ""
    nombre.value = ""
    domicilio.value = ""
    btnGuardarA.disabled = false
    btnEditarA.disabled = true
    btnCancelarA.disabled = true
    btnCancelarA.hidden = true
}
