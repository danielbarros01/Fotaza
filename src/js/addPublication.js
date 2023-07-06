import axios from 'axios'

const $form = document.querySelector("#form")
const $image = document.querySelector("#image")
const $file = document.querySelector("#file")
const $title = document.querySelector("#title")
const $categories = document.querySelector("#categories")
const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

const spanErrImg = document.getElementById('errImage')
const spanErrTitle = document.getElementById('errTitle')
const spanErrCategory = document.getElementById('errCategory')
const spanErrRightOfUse = document.getElementById('errRightOfUse')

$file.addEventListener('change', () => {
    const formData = new FormData($form)
    renderImage(formData)
})


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
    spanErrTitle.textContent = null
    spanErrTitle.classList.add('hidden')
});

$categories.addEventListener('change', function (e) {
    const selectedOption = e.target.value;

    //si el valor es un numero
    if (!!Number(selectedOption)) {
        spanErrCategory.textContent = null
        spanErrCategory.classList.add('hidden')
    } else {
        spanErrCategory.textContent = 'Debe seleccionar una categoria'
        spanErrCategory.classList.remove('hidden')
    }
});

function renderImage(formData) {
    const file = formData.get('image')

    // Validar el tipo de archivo
    const fileType = file.type;

    if (!fileType.startsWith('image/')) {
        spanErrImg.textContent = 'El archivo seleccionado no es una imagen válida'
        spanErrImg.classList.remove('hidden')
        $file.value = ''; // Limpiar el input de archivo
        $image.setAttribute('src', ''); // Limpiar la imagen previa
    } else {
        const image = URL.createObjectURL(file)
        $image.setAttribute('src', image)
        spanErrImg.textContent = ''
        spanErrImg.classList.add('hidden')
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
                spanErrTitle.textContent = 'El titulo no debe ir vacio'
                spanErrTitle.classList.remove('hidden')
                break;
            case 'category':
                spanErrCategory.textContent = 'Debe seleccionar una categoria'
                spanErrCategory.classList.remove('hidden')
                break;
            case 'image':
                spanErrImg.textContent = 'Debe seleccionar una imagen'
                spanErrImg.classList.remove('hidden')
                break;
            case 'rightsOfUse':
                spanErrRightOfUse.textContent = 'Debe seleccionar un derecho de uso disponible'
                spanErrRightOfUse.classList.remove('hidden')
                break;
        }
    })
}

