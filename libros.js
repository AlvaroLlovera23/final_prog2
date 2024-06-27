const txtTitulo = document.getElementById("titulo")
const txtAutor = document.getElementById("autor")

const botonGuardar = document.getElementById("btnGuardar")
const botonEditar = document.getElementById("btnEditar")
const botonCancelar = document.getElementById("btnCancelar")

const listaLibros = document.getElementById("listaLibros")

const url= "http://localhost:3000/libro"

var idAuxuliar

function crearLibro() {
    axios.post(url, {
        dni: txtLibro.value,
        nombre: txtAutor.value,
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
        listaLibros.innerHTML += '<button onclick="borrarLibro(' + elemento.id + ')">X</button>' + '<button onclick="seleccionarLibro(' + elemento.id + ')">Editar</button>' + " - " + elemento.titulo + " - " + elemento.autor + "<br>"});
    }) //si la promesa se cumple, con then realizamos una acción
    .catch(() => {

    })//capturamos el error si la promesa no se resuelve
}
listarLibros()

function seleccionarLibro(id) {
    axios.get(url + "/" + id)
    .then((resp) => {
       idAuxuliar = id
       txtTitulo.value = resp.data.titulo
       txtAutor.value = resp.data.autor
       BotonEditar.disabled = false
       BotonCancelar.hidden = false
       BotonGuardar.disabled = true
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

function borrarLibro(id) {
    let isConfirm = confirm("desea eliminar éste libro")
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