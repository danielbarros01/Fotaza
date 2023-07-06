import axios from 'axios'

const $form = document.querySelector("#form")
const $image = document.querySelector("#image")
const $file = document.querySelector("#file")
const $title = document.querySelector("#title")
const $categories = document.querySelector("#categories")
const $tag = document.querySelector("#tag")
const $tags = document.querySelector("#tags")

const $spanErrImg = document.getElementById('errImage')
const $spanErrTitle = document.getElementById('errTitle')
const $spanErrCategory = document.getElementById('errCategory')
const $spanErrRightOfUse = document.getElementById('errRightOfUse')
const $spanErrTag = document.getElementById('errTag')

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
const tags = []

$file.addEventListener('change', () => {
    const formData = new FormData($form)
    renderImage(formData)
})

/* ENVIO */
$form.addEventListener("submit", function (e) {
    e.preventDefault()
    //currentTarget es $form
    const formData = new FormData(e.currentTarget)

    const errors = checkFields();

    //valido que haya una imagen, si no agrego el nombre del campo a los errores
    validationImage(errors)

    if (errors.length > 0) {
        viewErrors(errors)
    }

    //agrego el array de tags
    formData.append('tags', JSON.stringify(tags))

    axios.post('/publications/create', formData, {
        headers: {
            'CSRF-Token': token
        }
    })
        .then(response => {
            const publicationId = response.data.publicationId;
            window.location.href = `/publications/${publicationId}`
        })
        .catch(error => {
            if (error.response && error.response.status === 400) {
                console.log('Errores de validación:', error.response.data);
                // Muestra los errores de validación en la interfaz de usuario
                viewErrors(error.response.data, 'server')
            } else {
                console.error('Error al enviar la solicitud:', error);
            }
        });
})


$title.addEventListener('keyup', function (event) {
    $spanErrTitle.textContent = null
    $spanErrTitle.classList.add('hidden')
});

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

addTags();

function renderImage(formData) {
    const file = formData.get('image')

    // Validar el tipo de archivo
    const fileType = file.type;

    if (!fileType.startsWith('image/')) {
        $spanErrImg.textContent = 'El archivo seleccionado no es una imagen válida'
        $spanErrImg.classList.remove('hidden')
        $file.value = ''; // Limpiar el input de archivo
        $image.setAttribute('src', ''); // Limpiar la imagen previa
    } else {
        const image = URL.createObjectURL(file)
        $image.setAttribute('src', image)
        $spanErrImg.textContent = ''
        $spanErrImg.classList.add('hidden')
    }
}

function validationImage(arrayErrors) {
    /* Imagen */
    const formData = new FormData($form)
    const file = formData.get('image')

    if (file.size === 0) {
        arrayErrors.push('image')
    }
}

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
            case 'image':
                $spanErrImg.textContent = 'Debe seleccionar una imagen'
                $spanErrImg.classList.remove('hidden')
                break;
            case 'rightsOfUse':
                $spanErrRightOfUse.textContent = 'Debe seleccionar un derecho de uso disponible'
                $spanErrRightOfUse.classList.remove('hidden')
                break;
        }
    })
}

function addTags() {
    let $fragment = document.createDocumentFragment();

    $tag.addEventListener('keydown', function (e) {
        if (e.code == 'Enter') {
            e.preventDefault(); 

            if (maxTags(tags)) return

            const tagText = $tag.value

            //que no exista el tag ya en el array
            if (tags.includes(tagText)) return

            //agregar al array el nuevo tag
            tags.push(tagText)

            //Crear tag en el dom
            $fragment.appendChild(createTagElement(tagText));
            $tags.appendChild($fragment);
            //Elimino el value~
            $tag.value = null


            //ELIMINAR TAG del dom y del array
            const $btnDeletesTag = document.querySelectorAll('.btnDeleteTag')
            $btnDeletesTag.forEach(element => {
                element.addEventListener('click', (ev) => {
                    deleteTag(ev, tags)
                })
            });
        }
    })
}

function deleteTag(ev, tags) {
    const $tagDelete = ev.target.closest('.tag');
    const textTag = $tagDelete.querySelector('li').textContent;
    const index = tags.indexOf(textTag);

    if (index > -1) {
        tags.splice(index, 1);
    }

    $tagDelete.remove();
}

function createTagElement(textTag) {
    const $div = document.createElement("div");
    const $li = document.createElement("li");
    const $span = document.createElement("span");

    $span.innerHTML = '<svg style="enable-background:new 0 0 24 24;" version="1.1" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="info"/><g id="icons"><path d="M14.8,12l3.6-3.6c0.8-0.8,0.8-2,0-2.8c-0.8-0.8-2-0.8-2.8,0L12,9.2L8.4,5.6c-0.8-0.8-2-0.8-2.8,0   c-0.8,0.8-0.8,2,0,2.8L9.2,12l-3.6,3.6c-0.8,0.8-0.8,2,0,2.8C6,18.8,6.5,19,7,19s1-0.2,1.4-0.6l3.6-3.6l3.6,3.6   C16,18.8,16.5,19,17,19s1-0.2,1.4-0.6c0.8-0.8,0.8-2,0-2.8L14.8,12z" id="exit"/></g></svg>';
    $span.classList.add('btnDeleteTag');
    $div.classList.add('tag', 'flex', 'justify-between', 'items-center');
    $li.innerHTML = textTag;

    $div.appendChild($li);
    $div.appendChild($span);

    return $div;
}

function maxTags(tags) {
    if (tags.length == 3) {
        $spanErrTag.textContent = 'Máx 3 etiquetas'
        $spanErrTag.classList.remove('hidden')

        return true
    } else {
        $spanErrTag.textContent = null
        $spanErrTag.classList.add('hidden')

        return false
    }
}