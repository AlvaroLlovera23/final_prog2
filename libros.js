const txtTitulo = document.getElementById("titulo")
const txtAutor = document.getElementById("autor")

const botonGuardar = document.getElementById("btnGuardarL")
const botonEditar = document.getElementById("btnEditarL")
const botonCancelar = document.getElementById("btnCancelarL")

const listaLibros = document.getElementById("listaLibros")
const listaLibrosPrestados = document.getElementById("listaLibrosPrestados")
const url= "http://localhost:3000/libro"

var idAuxuliar

let libros= []

function guardarLibro() {
    axios.post(url, {
        titulo: txtTitulo.value,
        autor: txtAutor.value,
        prestado: false
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
      libros= resp.data
      console.log(libros)
      listaLibros.innerHTML= ""
      resp.data.forEach(elemento => {
        let prestado= elemento.prestado
        listaLibros.innerHTML += 
        `<div><button onclick = borrarLibro(${elemento.id})>x</button> 
            <button onclick = seleccionarLibro(${elemento.id})>Editar</button>
            - ${elemento.titulo} - ${elemento.autor} <span class=${elemento.prestado == true ? "visible" : "hidden"}> PRESTADO </span> </div>`})
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
    .catch((error) => {
        alert("ocurrió un error")
    })
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


async function borrarLibro(id) {
    try {    
        let isConfirm = confirm("desea eliminar éste libro")
        if(isConfirm == true) {
            const libroPrestado = await validarLibro(id)
            if(libroPrestado == true){
                alert("El libro fue prestado, por lo tanto no puede ser eliminado.")
            } else {
                await axios.delete(url + "/" + id)
            }
        }
    } catch (error) {
        alert("ocurrio un error")
    }
}

async function validarLibro(id) {
    try{
        const resp= await axios.get(url + "/" + id)
        const data= await resp.data
        return data.prestado
    }
    catch(error) {
        alert("ocurrió un error en validar libro")
    }
}

async function getLibrosEnPrestamos(){
    try {
        let librosEnPrestamos= []
        const resp= await axios.get("http://localhost:3000/prestamo")
        const prestamos= await resp.data
        prestamos.forEach(prestamo => {
            if(prestamo.devolucion == false){
            librosEnPrestamos.push(prestamo.libroId)
            }
        })
        listarLibrosNoDevueltos(librosEnPrestamos)
    } catch (error) {
        alert("ocurrió un error")
    }
}
getLibrosEnPrestamos()

function listarLibrosNoDevueltos(array){
    let librosNoDevueltos= []
    array.forEach(element => {
      let libro= libros.find(libro => libro.id == element)
      if(libro != undefined){
        librosNoDevueltos.push(libro)
    }
    }) 
    listaLibrosPrestados.innerHTML= ""
    librosNoDevueltos.forEach(libro => {
    listaLibrosPrestados.innerHTML += `<li>${libro.titulo}</li>`
    })
}

