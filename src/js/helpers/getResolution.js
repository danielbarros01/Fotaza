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

            image.onerror = () => {
                reject(new Error('No se pudo cargar la imagen'));
            };
        }

        reader.readAsDataURL(file);
    })
}

export default getResolutionFromImage