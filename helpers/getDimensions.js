export default async function getDimensions(watermarkPath) {
    // Obtener dimensiones de la imagen de marca de agua
    const watermarkMetadata = await sharp(watermarkPath).metadata();
    const watermarkWidth = watermarkMetadata.width || 0;
    const watermarkHeight = watermarkMetadata.height || 0;

    return { width: watermarkWidth, height: watermarkHeight }
}

e