const $optionsContent = document.querySelector('#privacyOptionsContent')
const $optionSelected = $optionsContent.querySelector('#optionPrivacySelected') //el que se muestra
const $optionText = $optionSelected.querySelector('#textPrivacy') //el texto que se muestra fuera del menu
const $iconPrivacy = $optionSelected.querySelector('#iconPrivacy') //el texto que se muestra fuera del menu
//const $btnViewOptions = $optionSelected.querySelector('#btnViewOptions') 
const $optionsPrivacy = document.querySelector('#privacyOptions') //donde estan los inputs radio y labels
const $options = document.querySelectorAll('.privacy-input')

let optionSelected = null

$optionSelected.addEventListener('click', () => {
    $optionsPrivacy.classList.remove('hidden');
})

document.addEventListener('click', (e) => {
    // Verificar si el clic ocurrió dentro de los elementos o en otro lugar
    const isClickOptionsPrivacy = $optionsContent.contains(e.target);

    if (!isClickOptionsPrivacy) {
        $optionsPrivacy.classList.add('hidden');
    }
})

$options.forEach(option => {
    option.addEventListener('change', () => {
        optionSelected = option
        if (option.id == 'privacy-protected') {
            $optionText.textContent = 'Protegida'
            $iconPrivacy.classList.remove('fa-globe', 'fa-lock')
            $iconPrivacy.classList.add('fa-shield')

            //cambiar orden del menu
            const label = option.nextElementSibling //obtengo el label del elemento
            insertPreppendOption(label, option)

        } else if (option.id == 'privacy-public') {
            $optionText.textContent = 'Publica'
            $iconPrivacy.classList.remove('fa-shield', 'fa-lock')
            $iconPrivacy.classList.add('fa-globe')

            //cambiar orden del menu
            const label = option.nextElementSibling //obtengo el label del elemento
            insertPreppendOption(label, option)
        } else if (option.id == 'privacy-private') {
            $optionText.textContent = 'Privada'
            $iconPrivacy.classList.remove('fa-shield', 'fa-globe')
            $iconPrivacy.classList.add('fa-lock')

            //cambiar orden del menu
            const label = option.nextElementSibling //obtengo el label del elemento
            insertPreppendOption(label, option)
        }

        $optionsPrivacy.classList.add('hidden');
    })
});

//cambiar orden del menu
function insertPreppendOption(label, option) {
    $optionsPrivacy.prepend(label)//inserto el label
    $optionsPrivacy.prepend(option)//inserto el option que se va a insertar arriba del label
}