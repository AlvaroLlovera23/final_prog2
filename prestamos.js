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
            libroId.innerHTML += '<option value='+ elemento.id +'>'+ elemento.titulo +'</option>'
        });
        libroId.value = ''
    })
  }

 function cargarSelectAlumno(){
    axios.get("http://localhost:3000/alumno")
    .then((resp)=> {
        res.data.forEach(elemento => {
            alumnoId.innerHTML += '<option value='+ elemento.id +'>'+ elemento.nombre +'</option>'
        })
        alumnoId.value = ''
    })
 }

 function guardarP() {
            // validarPrestamoPorCrear(libroId.value)
        axios.post("http://localhost:3000/prestamo", { fechaEntrega: fechaEntrega.value, fechaDevolucion: fechaDevolucion.value, libroId: libroId.value, alumnoId: alumnoId.value})
        .then(()=> {
            listarPrestamos()
        })
        .catch(()=> {
            alert(" no se pudo agregar")
        })
    }
 function listarPrestamos() {
    
        axios.get("http://localhost:3000/prestamo")
        listaP.innerHTML = ""
        res.data.forEach(async element => {
            const resAlumnos = await axios.get("http://localhost:3000/alumno/" + element.alumnoId)
            const resLibros = await axios.get("http://localhost:3000/libro/" + element.libroId)
            listaP.innerHTML += '<hr> <ul class="listado">' + "<li>" + "Libro: " + resLibros.data.titulo + "</li><li>" + "Alumno: " + resAlumnos.data.nombre + "</li><li>" + "Fecha Ent.: " + element.fechaEntrega + "</li><li>" + "Fecha Dev.: " + element.fechaDevolucion + "</li>" + "<br>" + '<button onclick="borrarP(' + element.id + ')">Borrar</button>' + '<button onclick="mostrarP(' + element.id + ')">Editar</button>' + "</ul> <hr>"
        });
        alert("No se pudo mostrar la lista")
        alert(error)
    }


 function borrarP(id) {
    
        axios.delete("http://localhost:3000/prestamo/" + id)
        listarPrestamos()
        alert("No se pudo borrar")
        alert(error)
    }



function mostrarP(id) {
    
        auxiliar = id
        axios.get("http://localhost:3000/prestamo/" + id)
        fechaEntrega.value = res.data.fechaEntrega
        fechaDevolucion.value = res.data.fechaDevolucion
        libroId.value = res.data.libroId
        alumnoId.value = res.data.alumnoId
        btnGuardarP.disabled = true
        btnEditarP.disabled = false
        btnCancelarP.hidden = false
        btnCancelarP.disabled = false
        listarPrestamos()
        alert(error)
    }



function modificarP() {
    
        axios.put("http://localhost:3000/prestamo/" + auxiliar, {fechaEntrega: fechaEntrega.value, fechaDevolucion: fechaDevolucion.value, libroId: libroId.value, alumnoId: alumnoId.value
        })
        btnGuardarP.disabled = false
        btnEditarP.disabled = true
        btnCancelarP.hidden = true
        btnCancelarP.disabled = true
        listarPrestamos()
        alert("No se pudo actualizar")
        alert(error)
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

 function validarPrestamoPorCrear(libroId) {
    
        axios.get("http://localhost:3000/prestamo")
        console.log(res.data)
        alert(error);
    }
