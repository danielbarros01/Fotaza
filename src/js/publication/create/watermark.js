import renderImage from "./renderImage.js"
import { modalCopyright } from "./licenses.js"

const d = document

const $form = d.querySelector("#form")
const $file = d.querySelector("#fileWatermark")
const $image = d.querySelector("#imageWatermark")

const $infoImg = d.querySelector("#infoImgWater")
const $resolutionImg = $infoImg.querySelector("#resolutionImgWater")
const $sizeImg = $infoImg.querySelector("#sizeImgWater")
const $btnCancelImg = d.querySelector("#deleteImgWater")
const $spanErrImg = d.getElementById('errImageWater')

let opcionElegida

$file.addEventListener('change', () => {
    const formData = new FormData($form)
    renderImage(formData, $file, $image, null, $spanErrImg, $infoImg, $btnCancelImg, $sizeImg, $resolutionImg, 'water')
})


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


//
const $options = document.querySelectorAll('input[type=radio][name="optionWatermark"]')
const $watermarkData = document.getElementById('watermarkData')

$options.forEach(type => {
    type.addEventListener('change', (e) => {
        if (e.target.value == 'customized') {
            //Mostrar opciones watermarkData
            $watermarkData.classList.remove('hidden')
            opcionElegida = 'customized'
        } else {
            $watermarkData.classList.add('hidden')
            opcionElegida = 'default'
        }
    })
});


/* Limite de letras en input text */
const $customText = d.getElementById('customTextWater') //es un input:text
const $spanErr = d.getElementById('errCustomTextWater') //es un input:text

$customText.addEventListener('input', () => {
    if ($customText.value.length === 20) {
        $spanErr.textContent = '20 caracteres como máximo'
        $spanErr.classList.remove('hidden')
    } else {
        $spanErr.textContent = ''
        $spanErr.classList.add('hidden')
    }
})


/* Al guardar cambios si es personalizado validar que haya un texto, la foto debe ser opcional */
//Ocultar modal de copyright
const $btnSavedWatermark = d.getElementById('btnSavedWatermark')

$btnSavedWatermark.addEventListener('click', () => {

    //Validar si es personalizado que por lo menos venga el texto
    if (opcionElegida == 'customized' && $customText.value.length === 0) {
        $spanErr.textContent = 'Debe ingresar un texto'
        $spanErr.classList.remove('hidden')

        return
    }

    modalCopyright(false)

})

