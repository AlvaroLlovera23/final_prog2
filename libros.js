const txtTitulo = document.getElementById("titulo")
const txtAutor = document.getElementById("autor")

const botonGuardar = document.getElementById("btnGuardarL")
const botonEditar = document.getElementById("btnEditarL")
const botonCancelar = document.getElementById("btnCancelarL")

const listaLibros = document.getElementById("listaLibros")

const url= "http://localhost:3000/libro"

var idAuxuliar

function guardarLibro() {
    axios.post(url, {
        titulo: txtTitulo.value,
        autor: txtAutor.value,
    }).then(() => {
        listarLibros()
        //AQUI VA A IR LA FUNCIÓN PARA LISTAR LOS LIBROS
    }).catch(()=>{
        alert("ocurrió un error")
    })
}

function listarLibros() {
    axios.get(url)
    .then((resp) => {
      listaLibros.innerHTML= ""
      resp.data.forEach(elemento => {
        listaLibros.innerHTML += 
        `<div><button onclick = borrarLibro(${elemento.id})>x</button> 
            <button onclick = seleccionarLibro(${elemento.id})>Editar</button>
            - ${elemento.titulo} - ${elemento.autor}</div>`})
    }) //si la promesa se cumple, con then realizamos una acción
    .catch(() => {
        alert("no se pudo obtener los libros")
    })//capturamos el error si la promesa no se resuelve
}
listarLibros()

function seleccionarLibro(id) {
    axios.get(url + "/" + id)
    .then((resp) => {
       idAuxuliar = id
       txtTitulo.value = resp.data.titulo
       txtAutor.value = resp.data.autor
       botonEditar.disabled = false
       botonCancelar.hidden = false
       botonGuardar.disabled = true
    })
    .catch(() => {})
}

function editarLibro() {
    axios.put(url + "/" + idAuxuliar, {
        titulo: txtTitulo.value,
        autor: txtAutor.value,
    }).then((resp) => {
        listarLibros()
    }).catch(() => {
        alert("ocurrió un error")
    })
}

function cancelarEditarLibro() {
    botonCancelar.hidden = true
    botonEditar.disabled = true
    botonGuardar.disabled = false
    txtTitulo.value = ""
    txtAutor.value = ""
}

function borrarLibro(id) {
    let isConfirm = confirm("desea eliminar éste libro")
    if(isConfirm == true) {
        axios.delete(url + "/" + id)
        .then(() => {
            listarLibros()
        })
        .catch(() => {
            alert("ocurrió un error")
        })
    }
}