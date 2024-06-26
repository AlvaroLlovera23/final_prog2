const fechaEntrega = document.getElementById("fechaEntrega")
const fechaDevolucion = document.getElementById("fechaDevolucion")
const libroId = document.getElementById("libroId")
const alumnoId = document.getElementById("alumnoId")
const listaP = document.getElementById("listaP")
const btnGuardarP = document.getElementById("guardarP")
const btnEditarP = document.getElementById("editarP")
const btnCancelarP = document.getElementById("cancelarP")

let auxiliar
let nombreLibro
listarPrestamos()
cargarSelectLibro()
cargarSelectAlumno()

async function cargarSelectLibro(){
    res = await axios.get("http://localhost:3000/libro")
    res.data.forEach(elemento => {
        libroId.innerHTML += '<option value='+ elemento.id +'>'+ elemento.titulo +'</option>'
    });
    libroId.value = ''
}

async function cargarSelectAlumno(){
    res = await axios.get("http://localhost:3000/alumno")
    res.data.forEach(elemento => {
        alumnoId.innerHTML += '<option value='+ elemento.id +'>'+ elemento.nombre +'</option>'
    })
    alumnoId.value = ''
}

async function guardarP() {
    try {
        await validarPrestamoPorCrear(libroId.value)
        res = await axios.post("http://localhost:3000/prestamo", { fechaEntrega: fechaEntrega.value, fechaDevolucion: fechaDevolucion.value, libroId: libroId.value, alumnoId: alumnoId.value})
        listarPrestamos()
    } catch (error) {
        alert("No se pudo agregar")
        alert(error)
    }
}

async function listarPrestamos() {
    try {
        res = await axios.get("http://localhost:3000/prestamo")
        listaP.innerHTML = ""
        res.data.forEach(async element => {
            const resAlumnos = await axios.get("http://localhost:3000/alumno/" + element.alumnoId)
            const resLibros = await axios.get("http://localhost:3000/libro/" + element.libroId)
            listaP.innerHTML += '<hr> <ul class="listado">' + "<li>" + "Libro: " + resLibros.data.titulo + "</li><li>" + "Alumno: " + resAlumnos.data.nombre + "</li><li>" + "Fecha Ent.: " + element.fechaEntrega + "</li><li>" + "Fecha Dev.: " + element.fechaDevolucion + "</li>" + "<br>" + '<button onclick="borrarP(' + element.id + ')">Borrar</button>' + '<button onclick="mostrarP(' + element.id + ')">Editar</button>' + "</ul> <hr>"
        });
    } catch (error) {
        alert("No se pudo mostrar la lista")
        alert(error)
    }
}

async function borrarP(id) {
    try {
        await axios.delete("http://localhost:3000/prestamo/" + id)
        listarPrestamos()
    } catch (error) {
        alert("No se pudo borrar")
        alert(error)
    }

}

async function mostrarP(id) {
    try {
        auxiliar = id
        res = await axios.get("http://localhost:3000/prestamo/" + id)
        fechaEntrega.value = res.data.fechaEntrega
        fechaDevolucion.value = res.data.fechaDevolucion
        libroId.value = res.data.libroId
        alumnoId.value = res.data.alumnoId
        btnGuardarP.disabled = true
        btnEditarP.disabled = false
        btnCancelarP.hidden = false
        btnCancelarP.disabled = false
        listarPrestamos()
    } catch (error) {
        alert(error)
    }

}

async function modificarP() {
    try {
        res = await axios.put("http://localhost:3000/prestamo/" + auxiliar, {fechaEntrega: fechaEntrega.value, fechaDevolucion: fechaDevolucion.value, libroId: libroId.value, alumnoId: alumnoId.value
        })
        btnGuardarP.disabled = false
        btnEditarP.disabled = true
        btnCancelarP.hidden = true
        btnCancelarP.disabled = true
        listarPrestamos()
    } catch (error) {
        alert("No se pudo actualizar")
        alert(error)
    }

}

function cancelarEditarP() {
    fechaEntrega.value = ""
    fechaDevolucion.value = ""
    libroId.value = ""
    alumnoId.value = ""
    btnGuardarP.disabled = false
    btnEditarP.disabled = true
    btnCancelarP.hidden = true
    btnCancelarP.disabled = true
}

async function validarPrestamoPorCrear(libroId) {
    try {
        res = await axios.get("http://localhost:3000/prestamo")
        console.log(res.data)
    } catch (error) {
        alert(error);
    }
}