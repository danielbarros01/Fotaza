import axios from 'axios'
import { addTags, addDeleteButtons } from './tags.js'

const d = document
const token = d.querySelector('meta[name="csrf-token"]').getAttribute('content')

const $btnEdit = d.getElementById('btnEdit')
const $sectionEdit = d.getElementById('editPublication')
const $btnClose = d.getElementById('btnCloseEdit')
const $btnSave = d.getElementById('btnSave')

const $form = d.querySelector("#formEdit")
const $title = d.querySelector("#titleEdit")
const $categories = d.querySelector("#categoriesEdit")
const $tag = d.querySelector("#tagEdit")
const $tags = d.querySelector("#tagsEdit")

const $spanErrTitle = d.getElementById('errTitle')
const $spanErrCategory = d.getElementById('errCategory')
const $spanErrRightOfUse = d.getElementById('errRightOfUse')
const $spanErrTag = d.getElementById('errTag')

const tags = []

const url = window.location.href;
const parts = url.split("/");
const publicationId = parts[parts.length - 1];

//click boton mostrar seccion editar
$btnEdit.addEventListener('click', () => {
    $sectionEdit.classList.remove('hidden')
})

//click boton ocultar seccion editar
$btnClose.addEventListener('click', () => {
    $sectionEdit.classList.add('hidden')
})


//Insertar en tags
d.querySelectorAll('.tag').forEach(tag => {
    tags.push(tag.querySelector('li').textContent);
});

console.log(tags)

d.addEventListener('DOMContentLoaded', () => {
    addTags(tags, $tag, $tags, $spanErrTag)

    //cargo los botones que ya existen
    //COMPROBAR QUE NO FALLE SI UNA PUBLICACION NO TIENE TAGS
    const $btnsDeleteTag = d.querySelectorAll('.btnDeleteTag')
    addDeleteButtons($btnsDeleteTag, tags)
})


/* ENVIO */
$form.addEventListener("submit", (e) => {
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
        .catch(err => {
            console.error('Error al enviar la solicitud:', err);
        })

})

/*  */


//validaciones

//Validar que se elija una categoria
$categories.addEventListener('change', function (e) {
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

//Validar campos
function checkFields() {
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