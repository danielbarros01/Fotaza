import Cropper from 'cropperjs'

const d = document
let cropper = null

const $avatarInput = d.getElementById('avatarInput')
const $avatar = d.getElementById('avatarImage')
const firstRouteAvatar = d.getElementById('avatarImage').src

let generalUrl = $avatar.src
let generalFile = null

$avatarInput.addEventListener('change', e => {
    //Si se selecciono un archivo
    if (e.target.files.length > 0) {
        const file = e.target.files[0];

        //Si no es una imagen
        if (!file.type.startsWith('image/') || !/(jpeg|jpg|png)/.test(file.type)) {
            $avatar.setAttribute('src', firstRouteAvatar)
            return alert('Ingrese una imagen valida con formato "jpeg", "jpg" o "png"')
        } else {
            let $imageCropper = d.getElementById('img-cropper')

            const imageUrl = URL.createObjectURL(file)
            $imageCropper.setAttribute('src', imageUrl)

            cropper = new Cropper($imageCropper, {
                aspectRatio: 1, //1:1 cuadrado
                preview: '.img-sample', //ver en tiempo real la imagen
                zoomable: false, //no zoom
                viewMode: 1, //que la imagen no se estire
                responsive: false,
                dragMode: 'none', //al arrastrar no haga nada
                ready() {
                    //.cropper-container es propia de cropper.js
                    d.querySelector('.cropper-container').classList.add('w-full', 'h-full')
                }
            })

            //Mostrar el modal
            d.querySelector('.modal').classList.remove('hidden', 'opacity-0')
            d.querySelector('.modal').classList.add('flex')

            d.querySelector('.modal-content').classList.remove('hidden', 'opacity-0')
        }
    }
})

d.getElementById('btn-close').addEventListener('click', () => {
    //cerrar el modal
    closeModal()

    // Restablecer el campo de entrada de tipo archivo a vacío
    if(generalFile){
        clearFileInput($avatarInput)
        $avatarInput.files = generalFile;
        $avatar.setAttribute('src', generalUrl)
    }else{
        clearFileInput($avatarInput)
    }
})

d.getElementById('btn-cut').addEventListener('click', () => {
    let canva = cropper.getCroppedCanvas() //obtengo la img recortada que esta en el preview

    canva.toBlob((blob) => {
        //Genero la url
        let url_cut = URL.createObjectURL(blob)

        // Nombre de archivo personalizado
        const fileName = 'avatar_cropped.png';

        // Crea un nuevo archivo a partir del Blob
        const newFile = createFileFromBlob(blob, fileName);

        // Crea una lista de archivos (FileList) con un solo archivo
        const fileList = new DataTransfer();
        fileList.items.add(newFile);

        // Asigna la lista de archivos al campo de entrada
        $avatarInput.files = fileList.files;

        generalFile = fileList.files;
        generalUrl = url_cut

        $avatar.setAttribute('src', url_cut)
    })

    closeModal()
})


// others functions
function closeModal() {

    //limpio el cropper
    cropper.destroy()

    d.querySelector('.modal').classList.add('hidden', 'opacity-0')
    d.querySelector('.modal').classList.remove('flex')

    d.querySelector('.modal-content').classList.add('hidden', 'opacity-0')

}

function createFileFromBlob(blob, fileName) {
    // Crea un nuevo objeto File a partir del Blob
    const file = new File([blob], fileName, { type: blob.type });
    return file;
}

function clearFileInput(inputElement) {
    inputElement.value = ''; // Establece el valor del campo de entrada en cadena vacía
    if (inputElement.files && inputElement.files.length > 0) {
        // Borra todos los archivos de la lista de archivos (FileList)
        const fileList = new DataTransfer();
        inputElement.files = fileList.files;
    }
}
