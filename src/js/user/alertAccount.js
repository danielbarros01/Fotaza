const d = document

const alert = d.getElementById('alertSucces')
const btnClose = d.querySelector('#alertSucces button')

btnClose.addEventListener('click', () => {
    alert.classList.add('hidden')
})