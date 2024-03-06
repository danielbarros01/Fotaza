import axios from "axios"
import { ocultarTypesVenta, ocultarPrice } from './salePublication.js'
import { consultaLicencias, viewOtherOptions } from "./licenses.js"

const d = document,
    $inputsType = d.querySelectorAll("input[name=typePost"),
    $alert = d.getElementById('alertConfigurePayment'),
    $btnUpload = d.getElementById('btnSave'),
    $btnCloseAlert = d.getElementById('btnCloseAlertPayment')

console.log($inputsType)

$inputsType.forEach($i => {
    $i.addEventListener("change", function (e) {
        if ($i.id == 'input-sale') {
            const $loader = document.getElementById('sectionLoader')
            $loader.querySelector('p').textContent = 'Cargando'
            $loader.classList.remove('hidden')

            axios.get('/payment/configured')
                .then(res => {
                    console.log(res.data)
                })
                .catch(err => {
                    if (err.response.data.success === false) {
                        debugger
                        //Hay error
                        //Mostrar alerta que se debe configurar el metodo de pago
                        $alert.classList.remove('hidden')

                        //Cambiar al input de tipo libre
                        const $inputFree = document.getElementById('input-free');

                        //Buscar lo que hace esto en otro js
                        $inputFree.checked = true
                        ocultarTypesVenta()
                        ocultarPrice()
                        consultaLicencias('free')
                        viewOtherOptions()
                    }


                })
                .finally(() => {
                    $loader.classList.add('hidden')
                    $loader.querySelector('p').textContent = 'Guardando...'
                })
        }
    })
})

$btnCloseAlert.addEventListener('click', () => {
    $alert.classList.add('hidden')
})

function createLinkConfigurePayment() {
    const a = d.createElement('a')
    a.classList.add('bg-gray-input', 'rounded-2xl', 'cursor-pointer', 'w-36', 'h-24', 'hover:bg-gray-input/90')
    a.setAttribute('href', '/users/account/configure-payment')

    return a
}