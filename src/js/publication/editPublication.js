import axios from 'axios'
import serialize from 'form-serialize';
import { viewErrorsInAlert } from './create/errorsBackend.js'
import { addTags, addDeleteButtons, addTag } from './tags.js'
import {  viewErrors } from './create/validations.js'

const d = document
const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

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

const categoryInputs = d.querySelectorAll('input[type="radio"][name="category"]')

const $form = document.querySelector("#form")

const $tags = d.querySelector("#tags"),
    $tag = d.querySelector("#tag")

const tags = []

//--

d.addEventListener('DOMContentLoaded', () => {
    /* Añadir al array los tags */
    const $allTags = $tags.querySelectorAll('.tagNameJs')

    Array.from($allTags).forEach(tag => {
        let $fragment = document.createDocumentFragment();
        addTag(tags, tag.textContent, $tags, $spanErrTag, $fragment)
    })
})


/* ENVIO */
$form.addEventListener("submit", function (e) {
    e.preventDefault()

    document.getElementById('sectionLoader').classList.remove('hidden')

   /*  const formData = new FormData($form)
    //agrego el array de tags
    formData.append('tags', JSON.stringify(tags)) */

    const formData = serialize($form, { hash: true });
    formData.tags = tags;

    /* Verificar que este configurado el metodo de pago en caso de elegir de tipo venta */
    axios.get('/payment/configured')
        .then(res => {
            axios.post($form.action, formData, {
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
                })
        })
        .catch(err => {
            if (err.response.data.success === false) {
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
})

addTags(tags, $tag, $tags, $spanErrTag);


/* Validaciones */
/* Si selecciono alguna categoria */
categoryInputs.forEach(input => {
    input.addEventListener('change', () => {
        if (input.checked) {
            $spanErrCategory.textContent = null
            $spanErrCategory.classList.add('hidden')
        }
    });
});