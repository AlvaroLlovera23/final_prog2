//Las tres constantes a continuación son los inputs de la seccion alumnos. Donde cargamos los datos para crear o editar un alumno.
const txtDNI = document.getElementById("dni") 
const txtNombre = document.getElementById("nombre")
const txtDomicilio = document.getElementById("domicilio")

//Las tres constantes a continuación son los botones de la sección alumno. Que utilizamos para activar las funcion de crear, editar y cancelar edición.
const botonGuardar = document.getElementById("btnGuardarA")
const botonEditar = document.getElementById("btnEditarA")
const botonCancelar = document.getElementById("btnCancelarA")

//Esta constante es la lista donde se renderizan(muestran) los alumnos que existen actualmente.
const listaAlumnos = document.getElementById("listaAlumnos")

const url= "http://localhost:3000/alumno" //Aqui asignamos la url a una constante para luego hacer las peticiones al servidor.

var idAuxuliar //Esta variable auxiliar nos sirve para guardar el id del alumno que seleccionamos para editar. Para luego agregarla a la url de la peticion y asi editar el alumno que se selecciono previamente.

//Funcion crear alumno.
function crearAlumno() {
    axios.post(url, { //POST para crear un nuevo recurso. Le pasamos como parametro la url y los datos del alumno a crear.
        dni: txtDNI.value, //Con .value accedemos al valor del input DNI.
        nombre: txtNombre.value, //Con .value accedemos al valor del input Nombre.
        domicilio: txtDomicilio.value //Con .value accedemos al valor del input Domicilio.
    }).then(() => { //si la promesa se cumple, con then realizamos una acción
        listarAlumnos() //cuando se cumple la promesa traemos todos los alumnos de la api.
    }).catch(()=>{ //capturamos el error si la promesa no se resuelve
        alert("ocurrió un error")
    })
}

//Funcion para listar los alumnos existentes.
function listarAlumnos() {
    axios.get(url) //GET para obtener, traer recursos. Pasamos como parametro solo la url.
    .then((resp) => { //Si la promesa se cumple, realizamos una accion.
      listaAlumnos.innerHTML= "" //Borramos el contenido html de la lista.
      resp.data.forEach(elemento => { //Luego con la respuesta utilizamos el metodo foreach, y por cada valor de la respuesta.
                                        //accedemos al html de la lista y le agregamos el contenido como mejor nos parezca.
        listaAlumnos.innerHTML += 
            `<div><button onclick = borrarAlumno(${elemento.id})>x</button> 
            <button onclick = seleccionarAlumno(${elemento.id})>Editar</button>
            - ${elemento.dni} - ${elemento.nombre} - ${elemento.domicilio}</div>`});
    }) //si la promesa se cumple, con then realizamos una acción
    .catch(() => {

    })
}
listarAlumnos()

//Esta funcion es para seleccionar el alumno que se quiere editar. La función recibe como parametro el id del alumno.
function seleccionarAlumno(id) {
    axios.get(url + "/" + id) //Con GET obtenemos los datos del alumno seleccionado.
    .then((resp) => {
       idAuxuliar = id //Guardamos el id en la variable idAuxiliar para luego usarlo para editar el alumno.
    
       //Asignamos al valor de los inputs el valor que nos llego en la respuesta.
       txtDNI.value = resp.data.dni 
       txtNombre.value = resp.data.nombre
       txtDomicilio.value = resp.data.domicilio

       //Habilitamos el boton Modificar, deshabilitamos el boton Guardar y mostramos el boton Cancelar que estaba oculto.
       botonEditar.disabled = false
       botonCancelar.hidden = false
       botonGuardar.disabled = true
    })
    .catch(() => {})
}

//Esta funcion es para modificar los datos del alumno.
function editarAlumno() {
    axios.put(url + "/" + idAuxuliar, { //PUT para actualizar un recurso. Pasamos como parametro la url y le agregamos una barra y el id. Tambien le pasamos los datos que vamos a editar.
        dni: txtDNI.value,
        nombre: txtNombre.value,
        domicilio: txtDomicilio.value
    }).then((resp) => {
        listarAlumnos() //En caso de que salga todo bien se ejecuta la funcion listarAlumnos.
    }).catch(() => {
        alert("ocurrió un error")
    }) 
}

//Esta funcion es para cancelar la edición. Se activa cuando se presiona sobre el boton Cancelar
function cancelarEditarAlumno(){
    //Escondemos el boton Cancelar, deshabilitamos el boton Modificar y habilitamos el boton Guardar
    botonCancelar.hidden= true
    botonEditar.disabled= true
    botonGuardar.disabled= false

    //Borramos el valor de los input para que estos se vuelvan a ver en blanco 
    txtDNI.value= ""
    txtNombre.value= ""
    txtDomicilio.value= ""
}

//Esta funcion es para borrar un alumno, se activa cuando presionamos el boton Borrar.
async function borrarAlumno(id) {
    try {
        let isConfirm = confirm("desea eliminar éste alumno") //Se dispara una alerta para confirmar o no el borrado.
        if(isConfirm == true) { //Si se confirma entramos por esta rama del if.
            const alumnoConDeuda = await validarAlumno(id)  //Ejecuta la funcion para validar si el alumno aun tiene una deuda.
            if(alumnoConDeuda) { //Si el alumno tiene una deuda muesta una alerta.
                alert("El alumno no puede ser dado de baja, porque presenta deudas")
            } else { //Si el alumno no tiene deuda procede con el borrado
                axios.delete(url + "/" + id) //Utilizamos DELETE para eliminar un recurso. Le pasamos como parametro la url y le agregamos una barra y el id del alumno que queremos borrar.
                 .then(() => {
                    listarAlumnos() //Si sale todo bien listamos los alumnos.
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

//Esta funcion es para validar si el alumno aun tiene deuda. Recibe como parametro el id del alumno
async function validarAlumno(id) { 
    try {
        let prestamo = [] //Creamos una variable local prestamos, que es un array vacio.
        const resPrestamo= await axios.get("http://localhost:3000/prestamo")// Con un GET traemos una lista de todos los prestamos y la respuesta la asiganmos a una constante.
        const dataPrestamo= await resPrestamo.data //Accedemos a los datos de la respuesta y la asignamos a la constante dataPrestamo.
        prestamo= dataPrestamo
        const alumnoConDeuda= await prestamo.find(element=> element.alumnoId == id) //Con el metodo find buscamos dentro del array un elemento que contenga la propiedad alumnoId con el mismo valor del id que recibio la funcion. Si algun elemento cumple con la condición returna ese elemento.
        if(alumnoConDeuda.devolucion === false){ //Luego accedemos a la propiedad devolucion del objeto y si es false retorna true y viceversa.
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
    }
}