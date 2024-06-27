const txtDNI = document.getElementById("dni")
const txtNombre = document.getElementById("nombre")
const txtDomicilio = document.getElementById("domicilio")

const botonGuardar = document.getElementById("btnGuardarA")
const botonEditar = document.getElementById("btnEditarA")
const botonCancelar = document.getElementById("btnCancelarA")

const listaAlumnos = document.getElementById("listaAlumnos")
//Para todos los casos anteriores lo que estamos haciendo es asignar los elementos html, como los inputs, botones y el div donde se renderiza la lista de los alumnos registrados. Esto para más tarde poder manipularlos. Por ejemplo de los inputs podemos obtener el valor ingresado o asignarles un valor como en el caso de que seleccionamos un alumno para editar. Con los botones podemos habilitarlos o deshabilitarlos segun nos convenga.

const url= "http://localhost:3000/alumno" //Aqui asignamos la url que utilizamos para hacer las peticiones al servidor.

var idAuxuliar //Esta variable auxiliar nos sirve para guardar el id del alumno que seleccionamos para editar. Para luego agregarla a la url de la peticion y asi editar el alumno que se selecciono previamente.

function crearAlumno() {
    axios.post(url, { 
        dni: txtDNI.value,
        nombre: txtNombre.value,
        domicilio: txtDomicilio.value
    }).then(() => { //si la promesa se cumple, con then realizamos una acción
        listarAlumnos()
    }).catch(()=>{ //capturamos el error si la promesa no se resuelve
        alert("ocurrió un error")
    })
}

function listarAlumnos() {
    axios.get(url)
    .then((resp) => {
      listaAlumnos.innerHTML= ""
      resp.data.forEach(elemento => {
        listaAlumnos.innerHTML += '<button onclick="borrarAlumno(' + elemento.id + ')">X</button>' + '<button onclick="seleccionarAlumno(' + elemento.id + ')">Editar</button>' + " - " + elemento.dni + " - " + elemento.nombre + " - " + elemento.domicilio + "<br>"});
    }) 
    .catch(() => {

    })
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