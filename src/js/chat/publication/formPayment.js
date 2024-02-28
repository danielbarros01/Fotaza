import axios from 'axios'

const $form = document.getElementById('formPayment'),
    $alertConfigurePayment = document.getElementById('alertConfigurePayment'),
    $pError = document.getElementById('messageErrorPayment'),
    $btnCloseAlert = $alertConfigurePayment.querySelector('#btnCloseAlertPayment')

if ($form) {
    $form.addEventListener('submit', function (e) {
        debugger
        e.preventDefault()

        axios.post($form.action)
            .then((res) => {
                /* Redirigir */
                window.location.href = res.data.init_point
            })
            .catch((error) => {
                debugger
                console.log(error)
                /* Mostrar error */
                $alertConfigurePayment.classList.remove('hidden')
                $pError.textContent = response.data.message
            })
            .finally(() => { })
    })
}

$btnCloseAlert.addEventListener('click', () => {
    $alertConfigurePayment.classList.add('hidden')
})


alert('anja')