import axios from 'axios'
import { addTags } from './tags.js'
import { checkFields, validationImage, viewErrors } from './create/validations.js'
import renderImage from './create/renderImage.js'
import { viewErrorsInAlert } from './create/errorsBackend.js'
import { ocultarPrice, ocultarTypesVenta } from './create/salePublication.js'
import { consultaLicencias, viewOtherOptions } from './create/licenses.js'

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
const $alert = document.getElementById('alertConfigurePayment')

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
const tags = []

$file.addEventListener('change', () => {
    const formData = new FormData($form)
    renderImage(formData, $file, $image, $secondImage, $spanErrImg, $infoImg, $btnCancelImg, $sizeImg, $resolutionImg)
})

/* ENVIO */
$form.addEventListener("submit", function (e) {
    e.preventDefault()
    //currentTarget es $form
    const formData = new FormData(e.currentTarget)


    const errors = checkFields($form);

    //valido que haya una imagen, si no agrego el nombre del campo a los errores
    validationImage($form, errors)

    if (errors.length > 0) {
        console.log(errors)
        return viewErrors(errors, null, $spanErrTitle, $spanErrCategory, $spanErrImg, $spanErrRightOfUse, $spanErrTypes, $spanErrTypeSale, $spanErrPrice, $spanErrCurrency)
    }

    //agrego el array de tags
    formData.append('tags', JSON.stringify(tags))

    document.getElementById('sectionLoader').classList.remove('hidden')

    /* Verificar que este configurado el metodo de pago en caso de elegir de tipo venta */
    axios.get('/payment/configured')
        .then(res => {
            console.log(res.data)

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

                    document.getElementById('sectionLoader').classList.add('hidden')

                    if (error.response && error.response.status === 400) {
                        console.log('Errores de validación:', error.response.data);
                        // Muestra los errores de validación en la interfaz de usuario
                        viewErrors(error.response.data, 'server', $spanErrTitle, $spanErrCategory, $spanErrImg, $spanErrRightOfUse, $spanErrTypes, $spanErrTypeSale, $spanErrPrice, $spanErrCurrency)
                        viewErrorsInAlert(error.response.data)
                    } else {
                        console.error('Error al enviar la solicitud:', error);
                        viewErrorsInAlert(error.response.data)
                    }
                });
        })
        .catch(err => {
            if (err.response.data.success === false) {
                debugger
                //Hay error
                //Mostrar alerta que se debe configurar el metodo de pago
                $alert.classList.remove('hidden')

                //Cambiar al input de tipo libre
                const $inputFree = document.getElementById('input-free');
                $inputFree.checked = true
                ocultarTypesVenta()
                ocultarPrice()
                consultaLicencias('free')
                viewOtherOptions()
            }
        })
        .finally(() => {
            document.getElementById('sectionLoader').classList.add('hidden')
        })

    /* ---- */

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


