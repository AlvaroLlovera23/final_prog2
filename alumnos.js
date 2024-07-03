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
        listaAlumnos.innerHTML += 
            `<div><button onclick = borrarAlumno(${elemento.id})>x</button> 
            <button onclick = seleccionarAlumno(${elemento.id})>Editar</button>
            - ${elemento.dni} - ${elemento.nombre} - ${elemento.domicilio}</div>`});
    }) //si la promesa se cumple, con then realizamos una acción
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
       botonEditar.disabled = false
       botonCancelar.hidden = false
       botonGuardar.disabled = true
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

function cancelarEditarAlumno(){
    botonCancelar.hidden= true
    botonEditar.disabled= true
    botonGuardar.disabled= false
    txtDNI.value= ""
    txtNombre.value= ""
    txtDomicilio.value= ""
}

async function borrarAlumno(id) {
    try {
        let isConfirm = confirm("desea eliminar éste alumno")
        if(isConfirm == true) {
            const alumnoConDeuda = await validarAlumno(id)    
            console.log(alumnoConDeuda)
            if(alumnoConDeuda) {
                alert("El alumno no puede ser dado de baja, porque presenta deudas")
            } else {
                axios.delete(url + "/" + id)
                .then(() => {
                    listarAlumnos()
                })
                .catch(() => {
                    alert("ocurrió un error")
                })
            }    
        }

    } catch (error) {
        console.log(error)
    }
}

async function validarAlumno(id) {
    try {
        let prestamo = []
        const resPrestamo= await axios.get("http://localhost:3000/prestamo")
        const dataPrestamo= await resPrestamo.data
        console.log(dataPrestamo)
        prestamo= dataPrestamo
        const alumnoConDeuda= await prestamo.find(element=> element.alumnoId == id)
        if(alumnoConDeuda.devolucion === false){
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
    }
}