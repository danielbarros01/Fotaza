const d = document

const $avatarButton = d.getElementById('avatarButton')
const $avatarInput = d.getElementById('avatarInput')
const $avatar = d.getElementById('avatarImage')
const firstRouteAvatar = d.getElementById('avatarImage').src

$avatarButton.addEventListener('click', () => {
    $avatarInput.click()
})

$avatarInput.addEventListener('change', e => {
    //Si se selecciono un archivo
    if (e.target.files.length > 0) {
        const file = e.target.files[0];
    
        //Si no es una imagen
        if (!file.type.startsWith('image/')) {
            $avatar.setAttribute('src', firstRouteAvatar)
            return alert('Ingrese una imagen valida')
        } else {
            const image = URL.createObjectURL(file)
            $avatar.setAttribute('src', image)
        }
    }
})