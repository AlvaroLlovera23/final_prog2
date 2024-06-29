const fechaEntrega = document.getElementById("fechaEntrega")
const fechaDevolucion = document.getElementById("fechaDevolucion")
const libroId = document.getElementById("libroId")
const alumnoId = document.getElementById("alumnoId")
const listaPrestamos = document.getElementById("listaPrestamos")
const listaDevoluciones = document.getElementById("listaDevoluciones")
const btnGuardarP = document.getElementById("guardarP")
const btnEditarP = document.getElementById("editarP")
const btnCancelarP = document.getElementById("cancelarP")

let auxiliar
let nombreLibro
listarPrestamos()
cargarSelectLibro()
cargarSelectAlumno()

 function cargarSelectLibro(){
    axios.get("http://localhost:3000/libro")
    .then( (resp)=> {
        resp.data.forEach(elemento => {
            libroId.innerHTML += `<option value=${elemento.id}>${elemento.titulo}</option>`
        });
        libroId.value = ''
    })
  }

 function cargarSelectAlumno(){
    axios.get("http://localhost:3000/alumno")
    .then((resp)=> {
        resp.data.forEach(elemento => {
            alumnoId.innerHTML += `<option value=${elemento.id}>${elemento.nombre}</option>`
        })
        alumnoId.value = ''
    })
 }

 function guardarPrestamo() {
            // validarPrestamoPorCrear(libroId.value)
        axios.post("http://localhost:3000/prestamo", {fechaEntrega: fechaEntrega.value, fechaDevolucion: fechaDevolucion.value, libroId: libroId.value, alumnoId: alumnoId.value})
        .then(()=> {
            listarPrestamos()
        })
        .catch(()=> {
            alert(" no se pudo agregar")
        })
    }
 function listarPrestamos() {
    
        axios.get("http://localhost:3000/prestamo")
        .then((resp)=> {
            listaPrestamos.innerHTML = ""
            resp.data.forEach(async element => {
                const resAlumnos = await axios.get("http://localhost:3000/alumno/" + element.alumnoId)
                const resLibros = await axios.get("http://localhost:3000/libro/" + element.libroId)


                listaPrestamos.innerHTML += `
                <tr>
                    <td>${resLibros.data.titulo}</td>
                    <td>${resAlumnos.data.nombre}</td>
                    <td>${element.fechaEntrega}</td>
                    <td>${element.fechaDevolucion}</td>
                    <td class="acciones">
                        <button onclick="mostrarPrestamo(${element.id})">Editar</button>
                        <button onclick="devolucion(${element.id})">Devolución</button>
                    </td>
                </tr>`
            });
        })
        .catch(()=> {
            alert("No se pudo mostrar la lista")
        })
        
    }

function mostrarPrestamo(id) {
    
        auxiliar = id
        axios.get("http://localhost:3000/prestamo/" + id)
        .then((res)=> {
            fechaEntrega.value = res.data.fechaEntrega
            fechaDevolucion.value = res.data.fechaDevolucion
            libroId.value = res.data.libroId
            alumnoId.value = res.data.alumnoId
            btnGuardarP.disabled = true
            btnEditarP.disabled = false
            btnCancelarP.hidden = false
            btnCancelarP.disabled = false
        })
        .catch(()=> {
            alert("ocurrió un error" )
        })
    }



function modificarPrestamo() {
    
        axios.put("http://localhost:3000/prestamo/" + auxiliar, {fechaEntrega: fechaEntrega.value, fechaDevolucion: fechaDevolucion.value, libroId: libroId.value, alumnoId: alumnoId.value
        })
        .then(()=> {
            btnGuardarP.disabled = false
            btnEditarP.disabled = true
            btnCancelarP.hidden = true
            btnCancelarP.disabled = true
            listarPrestamos()
        })
        .catch(()=> {
            alert("No se pudo actualizar")
        })
    }

function cancelarEditarPrestamo() {
    fechaEntrega.value = ""
    fechaDevolucion.value = ""
    libroId.value = ""
    alumnoId.value = ""
    btnGuardarP.disabled = false
    btnEditarP.disabled = true
    btnCancelarP.hidden = true
    btnCancelarP.disabled = true
}

//  function validarPrestamoPorCrear(libroId) {
    
//         axios.get("http://localhost:3000/prestamo")
//         console.log(res.data)
//         alert(error);
//     }
