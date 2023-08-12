import axios from 'axios'
import { addTags } from './tags.js'
import { checkFields, validationImage, viewErrors } from './create/validations.js'

const $form = document.querySelector("#form")

const $image = document.querySelector("#image")
const $secondImage = document.querySelector("#photoPostSecondary")

const $infoImg = document.querySelector(".infoImg")
const $resolutionImg = $infoImg.querySelector("#resolutionImg")
const $sizeImg = $infoImg.querySelector("#sizeImg")
const $btnCancelImg = document.querySelector("#deleteImg")
const $file = document.querySelector("#file")
const $title = document.querySelector("#title")
const $tag = document.querySelector("#tag")
const $tags = document.querySelector("#tags")
const categoryInputs = document.querySelectorAll('input[type="radio"][name="category"]');

const $spanErrImg = document.getElementById('errImage')
const $spanErrTitle = document.getElementById('errTitle')
const $spanErrCategory = document.getElementById('errCategory')
const $spanErrRightOfUse = document.getElementById('errRightOfUse')
const $spanErrTag = document.getElementById('errTag')
const $spanErrTypes = document.getElementById('errTypes')
const $spanErrTypeSale = document.getElementById('errTypeSale')
const $spanErrPrice = document.getElementById('errPrice')
const $spanErrCurrency = document.getElementById('errCurrency')

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
const tags = []

$file.addEventListener('change', () => {
    const formData = new FormData($form)
    renderImage(formData, handleImageUpload)
})

/* ENVIO */
$form.addEventListener("submit", function (e) {
    e.preventDefault()
    //currentTarget es $form
    const formData = new FormData(e.currentTarget)

    const errors = checkFields($form);

    //valido que haya una imagen, si no agrego el nombre del campo a los errores
    validationImage($form, errors)

    console.log(formData)
    if (errors.length > 0) {
        console.log(errors)
        return viewErrors(errors, null, $spanErrTitle, $spanErrCategory, $spanErrImg, $spanErrRightOfUse, $spanErrTypes, $spanErrTypeSale, $spanErrPrice, $spanErrCurrency)
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
                viewErrors(error.response.data, 'server', $spanErrTitle, $spanErrCategory, $spanErrImg, $spanErrRightOfUse, $spanErrTypes, $spanErrTypeSale, $spanErrPrice, $spanErrCurrency)
            } else {
                console.error('Error al enviar la solicitud:', error);
            }
        });
})

//Cuando empiezo a escribir un titulo
$title.addEventListener('keyup', function (event) {
    $spanErrTitle.textContent = null
    $spanErrTitle.classList.add('hidden')
});

//Cancelar la imagen que seleccione
$btnCancelImg.addEventListener('click', function (e) {
    e.preventDefault()
    $file.value = ''
    $image.setAttribute('src', null)
    $image.classList.add('hidden')
    $infoImg.classList.add('hidden')
    $btnCancelImg.classList.add('hidden')

    $sizeImg.textContent = null
    $resolutionImg.textContent = null
})


/* Si selecciono alguna categoria */
categoryInputs.forEach(input => {
    input.addEventListener('change', () => {
        if (input.checked) {
            $spanErrCategory.textContent = null
            $spanErrCategory.classList.add('hidden')
        }
    });
});


addTags(tags, $tag, $tags, $spanErrTag);

async function renderImage(formData, cb) {
    const file = formData.get('image')

    // Validar el tipo de archivo
    const fileType = file.type;
    console.log(file)
    if (!fileType.startsWith('image/')) {
        $spanErrImg.textContent = 'El archivo seleccionado no es una imagen válida'
        $spanErrImg.classList.remove('hidden')
        $file.value = ''; // Limpiar el input de archivo
        $image.setAttribute('src', ''); // Limpiar la imagen previa
        $secondImage.setAttribute('src', '')// Limpiar la segunda imagen previa

        $infoImg.classList.add('hidden')
        $btnCancelImg.classList.add('hidden')

        $sizeImg.textContent = null
        $resolutionImg.textContent = null
    } else {
        const image = URL.createObjectURL(file)
        $image.setAttribute('src', image)
        $image.classList.remove('hidden')
        $spanErrImg.textContent = ''
        $spanErrImg.classList.add('hidden')

        //la imagen de la segunda parte del modal
        $secondImage.setAttribute('src', image)
        //$secondImage.classList.remove('hidden')

        $infoImg.classList.remove('hidden')
        $btnCancelImg.classList.remove('hidden')

        $sizeImg.textContent = sizeImg(file.size)
        $resolutionImg.textContent = await cb(formData.get('image'))
    }
}


//Obtener el tamaño de la imagen en mb
function sizeImg(size) {
    let sizeImg = size

    for (let i = 0; i < 2; i++) {
        sizeImg /= 1024
    }

    return sizeImg.toFixed(2) + 'MB'
}


// Función para procesar la imagen y obtener su resolución
const getResolutionFromImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const image = new Image();
            image.src = e.target.result;

            image.onload = () => {
                const width = image.width;
                const height = image.height;

                resolve({ width, height });
            };

            image.onerror = () => {
                reject(new Error('No se pudo cargar la imagen'));
            };
        }

        reader.readAsDataURL(file);
    })
}

// Función para manejar el evento de cambio del input file
const handleImageUpload = async (file) => {
    if (!file) {
        return 'No se seleccionó una imagen';
    }

    try {
        const { width, height } = await getResolutionFromImage(file);
        return `${width} x ${height}`;
    } catch (error) {
        console.error(error.message);
        return 'No se pudo cargar la resolución de la imagen';
    }
};