const txtDNI = document.getElementById("dni")
const txtNombre = document.getElementById("nombre")
const txtDomicilio = document.getElementById("domicilio")

const botonGuardar = document.getElementById("btnGuardarA")
const botonEditar = document.getElementById("btnEditarA")
const botonCancelar = document.getElementById("btnCancelarA")

const listaAlumnos = document.getElementById("listaAlumnos")

const url= "http://localhost:3000/alumno"

var idAuxuliar

function crearAlumno() {
    axios.post(url, {
        dni: txtDNI.value,
        nombre: txtNombre.value,
        domicilio: txtDomicilio.value
    }).then(() => {
        listarAlumnos()
        //AQUI VA A IR LA FUNCIÓN PARA LISTAR LOS ALUMNOS
    }).catch(()=>{
        alert("ocurrió un error")
    })
}

function listarAlumnos() {
    axios.get(url)
    .then((resp) => {
      listaAlumnos.innerHTML= ""
      resp.data.forEach(elemento => {
        listaAlumnos.innerHTML += '<button onclick="borrarAlumno(' + elemento.id + ')">X</button>' + '<button onclick="seleccionarAlumno(' + elemento.id + ')">Editar</button>' + " - " + elemento.dni + " - " + elemento.nombre + " - " + elemento.domicilio + "<br>"});
    }) //si la promesa se cumple, con then realizamos una acción
    .catch(() => {

    })//capturamos el error si la promesa no se resuelve
}
listarAlumnos()

function seleccionarAlumno(id) {
    axios.get(url + "/" + id)
    .then((resp) => {
       idAuxuliar = id
       txtDNI.value = resp.data.dni
       txtNombre.value = resp.data.nombre
       txtDomicilio.value = resp.data.domicilio
       BotonEditar.disabled = false
       BotonCancelar.hidden = false
       BotonGuardar.disabled = true
    })
    .catch(() => {})
}

function editarAlumno() {
    axios.put(url + "/" + idAuxuliar, {
        dni: txtDNI.value,
        nombre: txtNombre.value,
        domicilio: txtDomicilio.value
    }).then((resp) => {
        listarAlumnos()
    }).catch(() => {
        alert("ocurrió un error")
    })
}

function borrarAlumno(id) {
    let isConfirm = confirm("desea eliminar éste alumno")
    if(isConfirm == true) {
        axios.delete(url + "/" + id)
        .then(() => {
            listarAlumnos()
        })
        .catch(() => {
            alert("ocurrió un error")
        })
    }
}