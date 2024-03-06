import axios from 'axios'

const $template = document.getElementById('templateLicense').content
const $fragment = document.createDocumentFragment()
const $sectionLicenses = document.getElementById('licenses')

const $inputsRadioTypes = document.querySelectorAll('input[type=radio][name="typePost"]')
const $inputsRadioTypesSale = document.querySelectorAll('input[type=radio][name="typeSale"]')

const $noLicenses = document.getElementById('unique-licences')

const $alert = document.getElementById('alert')

const $optionPublic = document.getElementById('privacy-public').nextElementSibling
const $optionProtected = document.getElementById('privacy-protected').nextElementSibling

const $edit = document.querySelector('meta[name="edit"]')
let $isEdit

if($edit){
    $isEdit  = $edit.getAttribute('content')
}

//guardo el valor seleccionado de tipo de publicacion //free o sale
$inputsRadioTypes.forEach(type => {
    type.addEventListener('change', (e) => {
        console.log(e.target)
        console.log(e.target.value)
        switch (e.target.value) {
            case 'free':
                //debugger
                //cargar licencias para free
                consultaLicencias('free')
                viewOtherOptions()

                break;
            case 'sale':
                if (document.getElementById('venta-general').checked) {
                    //debugger
                    //cargar licencias para sale verificando que tipo de sale es
                    consultaLicencias('sale', 'general')
                    viewOtherOptions()
                }

                if (document.getElementById('venta-unica').checked) {
                    //debugger
                    consultaLicencias('sale', 'unique')

                    //Solo privada
                    changeOptionPrivate()
                }
                break;
        }
    })
});

//guardo el valor seleccionado de tipo de venta //general o unique
$inputsRadioTypesSale.forEach(type => {
    type.addEventListener('change', (e) => {
        switch (e.target.value) {
            case 'general':
                consultaLicencias('sale', 'general')
                break;
            case 'unique':
                consultaLicencias('sale', 'unique')
                break;
        }
    })
});



document.addEventListener('click', function (event) {
    /* Color en span dentro de input radio */
    /* Lo hago asi ya que voy a inyectar licencias dinamicamente con Ajax */
    if (event.target.matches('input[type=radio][name="license"]')) {
        const $radios = document.querySelectorAll('input[type=radio][name="license"]');

        $radios.forEach(radio => {
            //busco al sobrino .radio-select
            const r = radio.parentElement.querySelector('.radio-select')
            r.classList.remove('bg-black');
        });
        const r = event.target.parentElement.querySelector('.radio-select')
        r.classList.add('bg-black');


        //Validar si elijo copyright la publicacion debe ser privada
        isCopyright(event.target)
    }


    //boton muestra para cambiar marca de agua
    if (event.target.matches('#btnChangeWatermark') || event.target.closest('#btnChooseWatermark')) {
        modalCopyright(true)
    }
});


async function consultaLicencias(typeSelected, typeSaleSelected) {
    let ruta = `/licenses/${typeSelected}`

    if (typeSelected == 'sale') {
        ruta = `/licenses/${typeSelected}?typeSale=${typeSaleSelected}`
    }

    //Unique no tiene licencias que poner
    if (typeSelected == 'sale' && typeSaleSelected == 'unique') {
        $sectionLicenses.innerHTML = ''
        $noLicenses.classList.remove('hidden')

        //Solo privada
        changeOptionPrivate()

        return
    }


    try {
        const response = await axios.get(ruta)
        mostrarLicencias(response.data)
        console.log(response)

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

/* Llenar con los nuevos datos */
function mostrarLicencias(data) {
    data.forEach(l => {
        $template.querySelector('.name-license').textContent = l.name
        $template.querySelector('.description-license').textContent = l.description

        //Agregar imagen y fijarse el tamaño
        const imgLicense = $template.querySelector('.img-license');
        imgLicense.setAttribute('src', `/img/licenses/${l.image_url}`)
        imgLicense.classList.remove('w-20', 'w-8');
        let imgClass;
        if (l.id == 1 || l.id == 2 || l.id == 6) { imgClass = 'w-8'; } else { imgClass = 'w-20'; }
        imgLicense.classList.add(imgClass);

        const radioButton = $template.querySelector('input[type="radio"][name="license"]');
        radioButton.setAttribute('id', `license-${l.id}`);
        radioButton.setAttribute('value', l.id);

        $template.querySelector('.modified-radio').setAttribute('for', `license-${l.id}`)

        let $clone = document.importNode($template, true)
        $fragment.appendChild($clone)
    })

    //Si hay licencias, oculto mensaje de que no hay licencias para unique
    $noLicenses.classList.add('hidden')

    //Borro el contenido e incerto el nuevo
    $sectionLicenses.innerHTML = ''
    $sectionLicenses.appendChild($fragment)

    //Selecciono el primer input
    const $primerInput = $sectionLicenses.querySelector('input[type=radio][name="license"]')
    $primerInput.checked = true

    //Validar si primer input es copyright
    const copyright = isCopyright($primerInput)

    //Mostrar texto para editar marca de agua
    if (copyright && !$isEdit) {
        const b = document.createElement('button')
        b.textContent = 'Cambiar marca de agua'
        b.setAttribute('type', 'button')
        b.setAttribute('id', 'btnChangeWatermark')
        b.classList.add('absolute', 'right-0', 'top-0', 'p-5', 'text-xs', 'text-blue-400', 'hover:underline')

        $primerInput.parentElement.parentElement.classList.add('relative')
        $primerInput.parentElement.parentElement.appendChild(b)
    }

    //Pinto el label que simula ser radio
    const r = $primerInput.parentElement.querySelector('.radio-select')
    r.classList.add('bg-black');
}


//let primeraVez = true

function isCopyright(input) {
    //Si elijo copyright la publicacion debe ser privada
    const isCopyright = input.parentElement.parentElement.querySelector('.name-license').textContent == 'Copyright'

    if (isCopyright) {
        //Publicacion sera solo de tipo privada
        changeOptionPrivate()

        //Mostrar alert informando sobre esto
        $alert.classList.remove('hidden')
        $alert.querySelector('#infoMessage').textContent = 'La publicación será privada si eliges Copyright como licencia'
        setTimeout(() => {
            $alert.classList.add('hidden')
        }, 4000);

        //Mostrar modal para poner marca de agua personalizada solo la primera vez automaticamente
        /* if (primeraVez) {
            modalCopyright(true)
            primeraVez = !primeraVez
        } */

        return true
    } else {
        //Mostrar de nuevo las otras opciones si no elijo copyright
        viewOtherOptions()
    }
}

//mostrar modal para poner marca de agua
const $modalCopyright = document.getElementById('modalCopyright')
const $privacyOptionsAndPhoto = document.getElementById('privacyOptionsAndPhoto')
const $photoData = document.getElementById('photoData')
const $policyData = document.getElementById('policyData')
const $btnsCircle = document.getElementById('btnsCircle')

//True mostrar modal, false ocultarlo
function modalCopyright(show) {
    if (show) {
        $privacyOptionsAndPhoto.classList.add('hidden')

        $btnsCircle.classList.add('hidden')
        $policyData.classList.add('hidden')

        $modalCopyright.classList.remove('hidden')
    } else {
        $privacyOptionsAndPhoto.classList.remove('hidden')

        $btnsCircle.classList.remove('hidden')
        $policyData.classList.remove('hidden')

        $modalCopyright.classList.add('hidden')
    }

}

//Publicacion sera solo de tipo privada
function changeOptionPrivate() {
    const privacyOption = document.getElementById('privacy-private')
    privacyOption.checked = true

    const event = new Event('change')
    privacyOption.dispatchEvent(event)

    //Anular posibilidad de elegir otro que no sea privado
    $optionPublic.classList.add('hidden')
    $optionProtected.classList.add('hidden')
}

//Mostrar los otros tipos de opciones, publica o protegida
function viewOtherOptions() {
    $optionPublic.classList.remove('hidden')
    $optionProtected.classList.remove('hidden')
}

export {
    modalCopyright,
    consultaLicencias,
    viewOtherOptions
}