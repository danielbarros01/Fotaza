const d = document

const btn = d.getElementById('coverBtn')
const modal = d.querySelector('.modalCover')
const btnCloseModal = modal.querySelector('.btnClose')
const radioCovers = d.querySelectorAll('input[name="cover-radio"]')
const labelCovers = d.querySelectorAll('.label-cover')
let labelSelected = d.querySelector('.label-checked')

const coverImg = d.querySelector('#coverPhoto img')

btn.addEventListener('click', () => {
    modal.classList.remove('hidden')
})

btnCloseModal.addEventListener('click', () => {
    modal.classList.add('hidden')
})


radioCovers.forEach(radioBtn => {
    radioBtn.addEventListener('change', e => {
        const selected = e.target.value

        //Cambio el fondo de portada
        coverImg.setAttribute("src", `/img/covers/${selected}`)
    })
})

labelCovers.forEach(label => {
    label.addEventListener('click', e => {
        //saco el borde al anterior
        labelSelected.classList.remove('border-4', 'border-indigo-500', 'shadow-lg', 'label-checked')
        //Cambio el label seleccionado
        labelSelected = e.target
        //le agrego al nuevo
        labelSelected.classList.add('border-4', 'border-indigo-500', 'shadow-lg', 'label-checked')
    })
})