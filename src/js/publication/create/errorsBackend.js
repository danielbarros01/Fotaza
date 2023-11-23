const d = document

const $alert = d.getElementById('alertErrorsBackend')
const $btnClose = document.querySelector('#alertErrorsView button')
const $errorsBackend = d.getElementById('errorsBackend')

$btnClose.addEventListener('click', () => {
    console.log('close')
    $alert.classList.add('hidden')
})

function viewErrorsInAlert(errors){
    errors.forEach(error => {
        const li = document.createElement('li')
        li.textContent = error.msg

        $errorsBackend.appendChild(li)
    })

    $alert.classList.remove('hidden')
}

export{
    viewErrorsInAlert
}