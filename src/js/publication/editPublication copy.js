import axios from 'axios'
import { addTags, addDeleteButtons, addTag } from './tags.js'

const d = document
const token = d.querySelector('meta[name="csrf-token"]').getAttribute('content')

const $btnEdit = d.getElementById('btnEdit')
const $sectionEdit = d.getElementById('editPublication')
const $btnClose = d.getElementById('btnCloseEdit')
const $btnSave = d.getElementById('btnSave')

const $form = d.querySelector("#formEdit")
const $title = d.querySelector("#titleEdit")
const $categories = d.querySelector("#categoriesEdit")
const $rightsOfUse = d.querySelector("#rightsOfUse")
const $tag = d.querySelector("#tagEdit")
const $tags = d.querySelector("#tagsEdit")

const title = $title.value
const category = $categories.value
const rightOfUse = $rightsOfUse.value

const $spanErrTitle = d.getElementById('errTitle')
const $spanErrCategory = d.getElementById('errCategory')
const $spanErrRightOfUse = d.getElementById('errRightOfUse')
const $spanErrTag = d.getElementById('errTag')

const originalTags = []
const tags = []

const url = window.location.href;
const parts = url.split("/");
const publicationId = parts[parts.length - 1];

//click boton mostrar seccion editar
/* $btnEdit.addEventListener('click', () => {
    $sectionEdit.classList.remove('hidden')
}) */

//click boton ocultar seccion editar
/* $btnClose.addEventListener('click', () => {
    fillOriginalFields()
    $sectionEdit.classList.add('hidden')
})

//Insertar en tags
d.querySelectorAll('.tag').forEach(tag => {
    tags.push(tag.querySelector('li').textContent);
    originalTags.push(tag.querySelector('li').textContent);
}); */


/* d.addEventListener('DOMContentLoaded', () => {
    //Agrega funcionalidad de agregar tags al array con el teclado
    addTags(tags, $tag, $tags, $spanErrTag)

    //cargo los botones que ya existen
    //COMPROBAR QUE NO FALLE SI UNA PUBLICACION NO TIENE TAGS
    const $btnsDeleteTag = d.querySelectorAll('.btnDeleteTag')
    addDeleteButtons($btnsDeleteTag, tags)
}) */

/* ENVIO */
/* $form.addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const errors = checkFields();

    if (errors.length > 0) {
        viewErrors(errors)
    }


    const formDataObject = {};
    for (const [name, value] of formData.entries()) {
        formDataObject[name] = value;
    }

    //agrego el array de tags
    formDataObject.tags = tags

    console.log(formDataObject)
    axios.patch(`/publications/${publicationId}`, formDataObject, {
        headers: {
            'CSRF-Token': token
        }
    })
        .then((response) => {
            console.log(response)
            window.location.reload()
        })
        .catch(error => {
            if (error.response && error.response.status === 400) {
                console.log('Errores de validación:', error.response.data);
                // Muestra los errores de validación en la interfaz de usuario
                viewErrors(error.response.data, 'server')
            } else {
                console.error('Error al enviar la solicitud:', error);
            }
        })

}) */

/*  */


//validaciones

//Validar que se elija una categoria
/* $categories.addEventListener('change', function (e) {
    const selectedOption = e.target.value;

    //si el valor es un numero
    if (!!Number(selectedOption)) {
        $spanErrCategory.textContent = null
        $spanErrCategory.classList.add('hidden')
    } else {
        $spanErrCategory.textContent = 'Debe seleccionar una categoria'
        $spanErrCategory.classList.remove('hidden')
    }
});
 */
//Validar campos
/* function checkFields() {
    const formData = new FormData($form)
    const emptyFields = [];

    for (let [name, value] of formData.entries()) {
        if (!value) {
            emptyFields.push(name);
        }
    }

    return emptyFields;
}

//Muestra los errores en sus span
function viewErrors(errors, clientOrServer) {

    if (clientOrServer == 'server') {
        errors = errors.map(err => err.path)
    }

    errors.forEach(fieldName => {
        switch (fieldName) {
            case 'title':
                $spanErrTitle.textContent = 'El titulo no debe ir vacio'
                $spanErrTitle.classList.remove('hidden')
                break;
            case 'category':
                $spanErrCategory.textContent = 'Debe seleccionar una categoria'
                $spanErrCategory.classList.remove('hidden')
                break;
            case 'rightsOfUse':
                $spanErrRightOfUse.textContent = 'Debe seleccionar un derecho de uso disponible'
                $spanErrRightOfUse.classList.remove('hidden')
                break;
        }
    })
}

//Funcion para llenar con los datos originales
function fillOriginalFields() {
    $title.value = title
    $categories.value = category
    $rightsOfUse.value = rightOfUse

    //Reinicio tags
    let $fragment = document.createDocumentFragment();
    originalTags.forEach(tag => {
        addTag(tags, tag, $tags, $spanErrTag, $fragment)
    });
} */