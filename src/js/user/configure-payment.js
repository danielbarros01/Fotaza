const d = document


const $alert = d.getElementById('alertInfo'),
    $btnCloseAlert = d.getElementById('btnCloseAlert'),
    $btnViewToken = d.getElementById('viewToken'),
    $inputAccessToken = d.getElementById('inputAccessToken'),
    $form = d.getElementById('formAccessToken'),
    $stepsMercadoPago = d.getElementById('stepsMercadoPago'),
    $btnHelp = d.getElementById('btnHelp'),
    $spanError = d.querySelector('.error'),
    $btnCloseSuccess = d.getElementById('btnCloseSuccess'),
    $alertSuccess = d.getElementById('alertSuccess'),
    $sectionAccessTokenSuccess = d.getElementById('AccessTokenSuccess'),
    $btnEdit = d.getElementById('btnEdit'),
    $btnCancelEdit = d.getElementById('btnCancelEdit')

const urlParams = new URLSearchParams(window.location.search);
const errorCode = urlParams.get('error');

d.addEventListener('click', function (e) {
    //Cerrar alerta
    if ($btnCloseAlert.contains(e.target)) {
        $alert.classList.add('hidden')
    }

    //Para ver el texto oculto
    if (e.target == $btnViewToken) {
        if ($btnViewToken.classList.contains('fa-eye')) {
            $inputAccessToken.type = 'text'
        } else if ($btnViewToken.classList.contains('fa-eye-slash')) {
            $inputAccessToken.type = 'password'
        }

        $btnViewToken.classList.toggle('fa-eye')
        $btnViewToken.classList.toggle('fa-eye-slash')
    }

    //Mostrar pasos para mercado pago
    if (!$btnEdit) {
        if ($btnHelp.contains(e.target)) {
            $form.classList.toggle('hidden')
            $stepsMercadoPago.classList.toggle('hidden')

            //Le cambio el icono y le pongo Cerrar
            $btnHelp.querySelector('i').classList.toggle('fa-circle-question')
            $btnHelp.querySelector('i').classList.toggle('fa-circle-xmark')

            $btnHelp.querySelector('span').textContent.includes('Ayuda')
                ? $btnHelp.querySelector('span').textContent = 'Cerrar'
                : $btnHelp.querySelector('span').textContent = 'Ayuda'
        }
    } else {
        if ($btnHelp.contains(e.target)) {
            $stepsMercadoPago.classList.toggle('hidden')

            //Le cambio el icono y le pongo Cerrar
            $btnHelp.querySelector('i').classList.toggle('fa-circle-question')
            $btnHelp.querySelector('i').classList.toggle('fa-circle-xmark')

            $btnHelp.querySelector('span').textContent.includes('Ayuda')
                ? $btnHelp.querySelector('span').textContent = 'Cerrar'
                : $btnHelp.querySelector('span').textContent = 'Ayuda'

            $form.classList.toggle('hidden')
            $sectionAccessTokenSuccess.classList.toggle('hidden')
        }
    }


    if ($alertSuccess) {
        //Cerrar el alert de exito
        if ($btnCloseSuccess.contains(e.target) || !$alertSuccess.contains(e.target)) {
            $alertSuccess.classList.add('hidden')
        }
    }

    if ($btnEdit) {
        if ($btnEdit.contains(e.target)) {
            $sectionAccessTokenSuccess.classList.add('transform', '-translate-x-full')
            $form.classList.remove('-translate-x-full')
        }

        if ($btnCancelEdit.contains(e.target)) {
            $sectionAccessTokenSuccess.classList.remove('transform', '-translate-x-full')
            $form.classList.add('-translate-x-full')
        }
    }
})

$form.addEventListener('submit', function (e) {
    e.preventDefault()

    if ($inputAccessToken.value.trim() === '') {
        $spanError.textContent = 'Debe ingresar el ACCESS_TOKEN'
        $spanError.classList.remove('hidden')

        return
    }

    $form.submit()
})

$inputAccessToken.addEventListener('input', function (e) {
    $spanError.classList.add('hidden')
})

if (errorCode) {
    // Remueve el parámetro de consulta '?error=500'
    let newUrl = currentUrl.replace(/\?error=500/, '');
    // Modifica la URL sin recargar la página
    window.history.replaceState({}, '', newUrl);
}