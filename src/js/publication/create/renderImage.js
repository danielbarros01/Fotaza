export default async function renderImage(formData, $file, $image, $secondImage, $spanErrImg, $infoImg, $btnCancelImg, $sizeImg, $resolutionImg, forWater) {
    console.log(formData)

    const file = forWater == 'water' ? formData.get('imageWatermark') : formData.get('image')

    // Validar el tipo de archivo
    const fileType = file.type;

    if (!fileType.startsWith('image/')) {
        $spanErrImg.textContent = 'El archivo seleccionado no es una imagen válida'
        $spanErrImg.classList.remove('hidden')
        $file.value = ''; // Limpiar el input de archivo
        $image.setAttribute('src', ''); // Limpiar la imagen previa
        if ($secondImage) $secondImage.setAttribute('src', '')// Limpiar la segunda imagen previa

        $infoImg.classList.add('hidden')
        $btnCancelImg.classList.add('hidden')

        $sizeImg.textContent = null
        $resolutionImg.textContent = null
    } else {
        const image = URL.createObjectURL(file)
        $image.setAttribute('src', image)
        $image.classList.remove('hidden')
        $spanErrImg.textContent = ''
        $spanErrImg.classList.add('hidden')

        if ($secondImage) {
            //la imagen de la segunda parte del modal
            $secondImage.setAttribute('src', image)
            //$secondImage.classList.remove('hidden')
        }

        $infoImg.classList.remove('hidden')
        $btnCancelImg.classList.remove('hidden')

        $sizeImg.textContent = sizeImg(file.size)
        $resolutionImg.textContent = (forWater == 'water') ? await handleImageUpload(formData.get('imageWatermark')) : await handleImageUpload(formData.get('image'))
    }
}


//Obtener el tamaño de la imagen en mb
function sizeImg(size) {
    let sizeImg = size

    for (let i = 0; i < 2; i++) {
        sizeImg /= 1024
    }

    return sizeImg.toFixed(2) + 'MB'
}

// Función para procesar la imagen y obtener su resolución
const getResolutionFromImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const image = new Image();
            image.src = e.target.result;

            image.onload = () => {
                const width = image.width;
                const height = image.height;

                resolve({ width, height });
            };

            image.onerror = (error) => {
                reject(new Error('No se pudo cargar la imagen'));
            };
        }

        reader.readAsDataURL(file);
    })
}

// Función para manejar el evento de cambio del input file
const handleImageUpload = async (file) => {
    if (!file) {
        return 'No se seleccionó una imagen';
    }

    try {
        const { width, height } = await getResolutionFromImage(file);
        return `${width} x ${height}`;
    } catch (error) {
        console.error(error.message);
        return 'No se pudo cargar la resolución de la imagen';
    }
};