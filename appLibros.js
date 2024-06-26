const titulo = document.getElementById("titulo")
const autor = document.getElementById("autor")
const listaLibros = document.getElementById("listaLibros")
const btnGuardarL = document.getElementById("btnGuardarL")
const btnEditarL = document.getElementById("btnEditarL")
const btnCancelarL = document.getElementById("btnCancelarL")

let auxiliar
listarLibros()

function guardarLibro(){
    axios.post("http://localhost:3000/libro", {titulo: titulo.value, autor: autor.value})
    .then(function(res){
        listarLibros()
    })
    .catch(function(error){
        alert("Los datos no se guardaron")
        alert(error)
    })
}

function listarLibros(){
    axios.get("http://localhost:3000/libro")
    .then(function(res){
        listaLibros.innerHTML = ""
        res.data.forEach(elemento => {
            listaLibros.innerHTML += '<button onclick="borrarLibro('+ elemento.id +')">X</button>' + '<button onclick="mostrarLibro('+ elemento.id +')">Editar</button>' + "   " + elemento.titulo + " - " + elemento.autor + "<br>"
        });
    })
    .catch(function(error){
        alert("Error al mostrar libros")
        alert(error)
    })
}

function borrarLibro(id){
    axios.delete("http://localhost:3000/libro/" + id)
    .then(function(res){
        listarLibros()
    })
    .catch(function(error){
        alert("No se pudo eliminar")
        alert(error)
    })
}

function mostrarLibro(id){
    axios.get("http://localhost:3000/libro/" + id)
    .then(function(res){
        auxiliar = id
        btnGuardarL.disabled = true
        btnEditarL.disabled = false
        btnCancelarL.disabled = false
        btnCancelarL.hidden = false
        titulo.value = res.data.titulo
        autor.value = res.data.autor
    })
    .catch(function(error){
        alert(error)
    })
}

function editarLibro(){
    axios.put("http://localhost:3000/libro/" + auxiliar, {titulo: titulo.value, autor: autor.value})
    .then(function(res){
        alert("Los datos se modificaron correctamente")
        listarLibros()
        btnGuardarL.disabled = false
        btnEditarL.disabled = true
        btnCancelarL.disabled = true
        btnCancelarL.hidden = true
    })
    .catch(function(error){
        alert("No se modificaron los datos")
        alert(error)
    })
}

function cancelarEditarL(){
    titulo.value =""
    autor.value = ""
    btnGuardarL.disabled = false
    btnEditarL.disabled = true
    btnCancelarL.disabled = true
    btnCancelarL.hidden = true
}
