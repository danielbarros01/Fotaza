import axios from 'axios'

const d = document
const token = d.querySelector('meta[name="csrf-token"]').getAttribute('content')

const $btnViewSection = d.querySelector("#btnDelete")
const $btnConfirmDelete = d.querySelector("#btnConfirmDelete")
const $btnCancelDelete = d.querySelector("#btnCancelDelete")
const $sectionDelete = d.querySelector("#deletePublication") //div padre, lo que se muestra oscuro y ocupa todo

const url = window.location.href;
const parts = url.split("/");
const publicationId = parts[parts.length - 1];

//Experiencia grafica
const $titleDelete = $sectionDelete.querySelector("#titleDelete")
const $img = $sectionDelete.querySelector("img")
const $textDelete = $sectionDelete.querySelector("#textDelete")
const $sectionBtns = $sectionDelete.querySelector("#btnsDeleteOrCancel")
const $viewDelete = $sectionDelete.querySelector("#viewDelete") //la ventana de informacion a la hora de eliminar

$btnViewSection.addEventListener('click', () => {
    $sectionDelete.classList.remove('hidden')
})

$btnCancelDelete.addEventListener('click', () => {
    $sectionDelete.classList.add('hidden')
})

$btnConfirmDelete.addEventListener('click', () => {
    //LOGICA
    $titleDelete.textContent = 'Eliminando Publicación...'
    $img.src = '/img/project/deleteUnDraw2.svg'
    $textDelete.classList.add('hidden') //ocultar texto
    $sectionBtns.classList.add('hidden') //ocultar botones

    //antes del sectionBtns agregar el loader
    // Crear el elemento de imagen
    const $loader = document.createElement('img')
    $loader.src = '/img/project/loader.svg'
    $loader.alt = 'Loader eliminando'
    $loader.classList.add('m-auto', 'w-24')
    $loader.style.marginTop = '60px'
    $loader.style.marginBottom = '60px'
    // Insertar la imagen 
    $viewDelete.appendChild($loader)

    deletePublication(publicationId, $loader)
})

const deletePublication = async (id, loader) => {
    try {
        const response = await axios.delete(`/publications/${id}`, { headers: { 'CSRF-Token': token } });
        console.log(response)
        // Realizar cualquier acción adicional en el cliente después de la eliminación exitosa
        window.location.href = `/my-publications`
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        // Realizar cualquier acción adicional en el cliente después de un error
        //LOGICA
        $titleDelete.textContent = 'Error al eliminar'
        $titleDelete.classList.add('text-red-700')
        $img.src = '/img/project/deleteUnDraw.svg'
        $textDelete.classList.remove('hidden') //ocultar texto
        $textDelete.textContent = error.response.data.message || '' //ocultar texto
        $sectionBtns.classList.remove('hidden') //ocultar botones
        loader.remove()
    }
};