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

//guardo el valor seleccionado de tipo de publicacion //free o sale
$inputsRadioTypes.forEach(type => {
    type.addEventListener('change', (e) => {
        console.log(e.target)
        console.log(e.target.value)
        switch (e.target.value) {
            case 'free':
                //cargar licencias para free
                consultaLicencias('free')

                break;
            case 'sale':
                if (document.getElementById('venta-general').checked) {
                    //cargar licencias para sale verificando que tipo de sale es
                    consultaLicencias('sale', 'general')
                }

                if (document.getElementById('venta-unica').checked) {
                    consultaLicencias('sale', 'unique')
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
    isCopyright($primerInput)

    //Pinto el label que simula ser radio
    const r = $primerInput.parentElement.querySelector('.radio-select')
    r.classList.add('bg-black');
}



function isCopyright(input) {
    //Si elijo copyright la publicacion debe ser privada
    const isCopyright = input.parentElement.parentElement.querySelector('.name-license').textContent == 'Copyright'

    if (isCopyright) {
        const privacyOption = document.getElementById('privacy-private')
        privacyOption.checked = true

        const event = new Event('change')
        privacyOption.dispatchEvent(event)

        //Mostrar alert informando sobre esto
        $alert.classList.remove('hidden')
        $alert.querySelector('#infoMessage').textContent = 'La publicación será privada si eliges Copyright como licencia'
        setTimeout(() => {
            $alert.classList.add('hidden')
        }, 4000);

        //Anular posibilidad de elegir otro que no sea privado
        $optionPublic.classList.add('hidden')
        $optionProtected.classList.add('hidden')
    } else {
        //Mostrar de nuevo las otras opciones si no elijo copyright
        $optionPublic.classList.remove('hidden')
        $optionProtected.classList.remove('hidden')
    }
}