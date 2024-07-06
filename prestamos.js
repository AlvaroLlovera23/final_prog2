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
        let id_libro= libroId.value
        axios.post("http://localhost:3000/prestamo", {fechaEntrega: fechaEntrega.value, fechaDevolucion: fechaDevolucion.value, libroId: libroId.value, alumnoId: alumnoId.value, devolucion: false})
        .then(()=> {
            actualizarEstadoLibro(id_libro)
            listarPrestamos()
        })
        .catch(()=> {
            alert(" no se pudo agregar")
        })
    }

async function actualizarEstadoLibro(id) {
         try {
            const resp= await axios.get("http://localhost:3000/libro/" + id)
            const data= await resp.data
            console.log(data)
            await axios.put("http://localhost:3000/libro/" + id, {
                titulo: data.titulo,
                autor: data.autor,
                prestado: true
            })
         }
         catch (error) {
            alert("ocurrió un error")
         } 
}

 function listarPrestamos() {
    
        axios.get("http://localhost:3000/prestamo")
        .then((resp)=> {
            listaPrestamos.innerHTML = ""
            resp.data.forEach(async element => {
                const resAlumnos = await axios.get("http://localhost:3000/alumno/" + element.alumnoId)
                const resLibros = await axios.get("http://localhost:3000/libro/" + element.libroId)
                const devolucion= element.devolucion
                if (devolucion == true){
                    listaPrestamos.innerHTML += `
                    <tr class="devuelto">
                        <td>${resLibros.data.titulo}</td>
                        <td>${resAlumnos.data.nombre}</td>
                        <td>${element.fechaEntrega}</td>
                        <td>${element.fechaDevolucion}</td>
                        <td>
                            Devuelto <button onclick= borrar(${element.id})>X</button>
                        </td>
                    </tr>`
                }
                else {
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
                }
            });
        })
        .catch(()=> {
            alert("No se pudo mostrar la lista")
        })
    }

async function devolucion(id){
    try {
        const prestamo = await getPrestamo(id)

        await axios.put("http://localhost:3000/prestamo/" + id, {
            devolucion: true,
            fechaEntrega: prestamo.fechaEntrega, 
            fechaDevolucion: prestamo.fechaDevolucion, 
            libroId: prestamo.libroId, 
            alumnoId: prestamo.alumnoId,
        })
        listarPrestamos()
    }
    catch(error){
        alert("ocurrió un error")
    }
}
    
async function getPrestamo(id) {
    try{ 
        const res = await axios.get("http://localhost:3000/prestamo/" + id)
        const prestamo = await res.data
        return prestamo
    }
    catch(error){
        alert("ocurrió un error")
    }
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

function borrar(id) {
    axios.delete("http://localhost:3000/prestamo/" + id)
    .then(()=> {
        listarPrestamos()
    })
    .catch(()=> {
        alert("ocurrió un error")
    })
}

