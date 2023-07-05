import axios from 'axios'

const $form = document.querySelector("#form")
const $image = document.querySelector("#image")
const $file = document.querySelector("#file")
const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

function renderImage(formData) {
    const file = formData.get('image')
    const image = URL.createObjectURL(file)
    $image.setAttribute('src', image)

    // Validar el tipo de archivo
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
        // Mostrar un mensaje de error o realizar alguna acción
        alert('El archivo seleccionado no es una imagen válida');
        $file.value = ''; // Limpiar el input de archivo
        $image.setAttribute('src', ''); // Limpiar la imagen previa
    }
}


$file.addEventListener('change', () => {
    const formData = new FormData($form)
    renderImage(formData)
})


$form.addEventListener("submit", function (e) {
    e.preventDefault()
    //currentTarget es $form
    const formData = new FormData(e.currentTarget)


    axios.post('/publications/create', formData, {
        headers: {
            'CSRF-Token': token
        }
    })
        .then(response => {
            console.log('Respuesta del servidor:', response.data);
        })
        .catch(error => {
            if (error.response && error.response.status === 400) {
                console.log('Errores de validación:', error.response.data);
                // Muestra los errores de validación en la interfaz de usuario
            } else {
                console.error('Error al enviar la solicitud:', error);
            }
        });
})