import { checkFields, validationImage, viewErrors } from './validations.js'

/* Spans para los errores */
const $spanErrImg = document.getElementById('errImage')
const $spanErrTitle = document.getElementById('errTitle')
const $spanErrCategory = document.getElementById('errCategory')
const $spanErrRightOfUse = document.getElementById('errRightOfUse')
/*  */


const $form = document.querySelector("#form")
const $photoData = document.getElementById("photoData")
const $policyData = document.getElementById("policyData")
const $photoPostSecondary = document.getElementById("photoPostSecondary")
const $circlesForm = document.querySelector(".circlesForm")


const $btnContinue = document.querySelector("#btnContinue")
const $btnBack = document.getElementById('btnBack')

/* Cuando le de click a continuar para la segunda parte del formulario */
$btnContinue.addEventListener('click', (e) => {
    const errors = checkFields($form);

    //valido que haya una imagen, si no agrego el nombre del campo a los errores
    validationImage($form, errors)

    if (errors.includes('input-price')) {
        if (errors.length > 1) {
            console.log(errors)
            return viewErrors(errors, null, $spanErrTitle, $spanErrCategory, $spanErrImg, $spanErrRightOfUse)
        }
    }

    console.log('ok')
    $photoData.classList.add('hidden')
    $policyData.classList.remove('hidden')
    $photoPostSecondary.classList.remove('hidden')
})



/* Cuando le de click a volver para la primer parte del formulario */
$btnBack.addEventListener('click', (e) => {
    $policyData.classList.add('hidden')
    $photoData.classList.remove('hidden')
    $photoPostSecondary.classList.add('hidden')
})