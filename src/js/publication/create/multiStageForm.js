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

const $linkMoreInfoPublications = document.querySelector(".moreInfoPostType")


const $btnContinue = document.querySelector("#btnContinue")
const $btnBack = document.getElementById('btnBack')

/* Cuando le de click a continuar para la segunda parte del formulario */
$btnContinue.addEventListener('click', (e) => {
    const errors = checkFields($form);
    //valido que haya una imagen, si no agrego el nombre del campo a los errores
    validationImage($form, errors)
    
    if (errors.length >= 1) {
        console.log(errors)

        //Si esta incluido price y es mayor a 1, si solo es price el error lo dejo pasar porque es valdidacion del segundo paso del formulario
        if((errors.includes('price') && errors.length > 1) ||  errors.length >= 1){
            return viewErrors(errors, null, $spanErrTitle, $spanErrCategory, $spanErrImg, $spanErrRightOfUse)
        }
    }


    console.log('ok')
    $photoData.classList.add('hidden')
    $policyData.classList.remove('hidden')
    $photoPostSecondary.classList.remove('hidden')
    $linkMoreInfoPublications.classList.remove('hidden')


    //despinto el primer circulo de abajo del formulario
    $circlesForm.firstChild.classList.remove('fa-solid')
    $circlesForm.firstChild.classList.add('fa-regular')

    //pinto el ultimo circulo de abajo del formulario
    $circlesForm.lastElementChild.classList.remove('fa-regular')
    $circlesForm.lastElementChild.classList.add('fa-solid')
})



/* Cuando le de click a volver para la primer parte del formulario */
$btnBack.addEventListener('click', (e) => {
    $policyData.classList.add('hidden')
    $photoData.classList.remove('hidden')
    $photoPostSecondary.classList.add('hidden')
    $linkMoreInfoPublications.classList.add('hidden')

    //pinto el primer circulo de abajo del formulario
    $circlesForm.firstChild.classList.remove('fa-regular')
    $circlesForm.firstChild.classList.add('fa-solid')

    //despinto el ultimo circulo de abajo del formulario
    $circlesForm.lastElementChild.classList.remove('fa-solid')
    $circlesForm.lastElementChild.classList.add('fa-regular')
})