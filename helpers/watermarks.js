import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import svg2img from 'svg2img'

import deleteImage from './deleteImage.js'

// Combinar la imagen de marca de agua y el texto en una nueva imagen
async function newWatermark(watermarkPath, textColor, watermarkText, uuidExtraido) {
    try {
        let imageBuffer
        let imageMetadata
        let fontSize

        if (watermarkPath) {
            // Leer la imagen
            imageBuffer = await sharp(watermarkPath)
                .resize({
                    height: 100, // Altura deseada
                    fit: sharp.fit.contain,
                    background: { r: 0, g: 0, b: 0, alpha: 0 } // Fondo transparente
                })
                .grayscale()
                .toBuffer();

            // Obtén las dimensiones de la imagen base
            imageMetadata = await sharp(imageBuffer).metadata();

            fontSize = Math.floor(imageMetadata.height / 1.5);
        }


        const textWidth = Math.ceil(fontSize ? fontSize * watermarkText.length * 0.5 : watermarkText.length * 30); // Ajuste según la relación de aspecto típica de las fuentes

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${textWidth}px" height="${imageMetadata ? imageMetadata.height : 200}" style="background-color: transparent">
    <text x="8" y="${imageMetadata ? ((imageMetadata.height / 2) + 8) : 100}" font-size="${fontSize ? fontSize : 70}" fill="${textColor}" dominant-baseline="middle" text-anchor="start">${watermarkText}</text>
</svg>`;

        // Convertir el SVG en una imagen
        svg2img(svg, function (error, buffer) {
            fs.writeFileSync(`images/watermarks/text-${uuidExtraido}.png`, buffer);
        });

        const svgBuffer = await sharp(`images/watermarks/text-${uuidExtraido}.png`).toBuffer();
        const svgBufferMetadata = await sharp(`images/watermarks/text-${uuidExtraido}.png`).metadata();

        // Crear una nueva imagen que tenga suficiente espacio para la imagen y el SVG
        const newImageBuffer = await sharp({
            create: {
                width: imageMetadata ? imageMetadata.width + svgBufferMetadata.width : svgBufferMetadata.width,
                height: imageMetadata ? imageMetadata.height + 100 : 300,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        })
            .png()
            .toBuffer();


        let watermark
        if (watermarkPath) {
            // Superponer la imagen y el SVG en la nueva imagen
            watermark = await sharp(newImageBuffer)
                .composite([
                    { input: imageBuffer, gravity: 'west' },
                    { input: svgBuffer, gravity: 'east' },
                    //Aplicar opacidad
                    {
                        input: Buffer.from([0, 0, 0, 80]),
                        raw: {
                            width: 1,
                            height: 1,
                            channels: 4,
                        },
                        tile: true,
                        blend: 'dest-in',
                    }
                ])
                .png()
                //.toFile(path.join('images/uploadsWithWatermark/', `watermark_${path.basename(imagePath)}`));
                .toBuffer()
        } else {
            watermark = await sharp(newImageBuffer)
                .composite([
                    { input: svgBuffer, gravity: 'east' },
                    //Aplicar opacidad
                    {
                        input: Buffer.from([0, 0, 0, 80]),
                        raw: {
                            width: 1,
                            height: 1,
                            channels: 4,
                        },
                        tile: true,
                        blend: 'dest-in',
                    }
                ])
                .png()
                .toBuffer()
        }

        return watermark
    } catch (error) {
        console.log(error)
    }
}

//function helper
//personalized true or false

const setWatermark = async (imagePath, personalized, watermarkText, nameImageWatermark) => {

    // Utilizando expresión regular para extraer el UUID
    const nameImage = imagePath.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i);
    // Verificando si se encontró una coincidencia y obteniendo el primer grupo capturado
    const uuidExtraido = nameImage ? nameImage[0] : null;

    try {
        //Busco la imagen
        const image = sharp(imagePath); // Carga la imagen utilizando sharp



        let watermarkPath;
        let watermarkImageBuffer;
        let watermarkBuffer

        //Marca de agua personalizada
        if (personalized) {

            if (nameImageWatermark) { //Si viene el nombre de la imagen de marca de agua
                // Obtener la imagen de marca de agua
                watermarkPath = nameImageWatermark
                    ? `images/watermarks/${nameImageWatermark}`
                    : 'images/watermarks/watermarkDefault.png';

                // Traer la marca de agua lista con foto
                watermarkBuffer = await newWatermark(watermarkPath, '#808080', watermarkText, uuidExtraido);
            } else {
                // Traer la marca de agua lista solo con el texto
                watermarkBuffer = await newWatermark(null, '#808080', watermarkText, uuidExtraido);
            }


            watermarkImageBuffer = await image
                .composite([{ input: watermarkBuffer, tile: true }])
                .toBuffer();
        }
        //Marca de agua por defecto
        else {
            watermarkPath = 'images/watermarks/watermarkDefault.png'; // Ruta de tu marca de agua

            let imgInfo = await image.metadata()

            let imageBuffer = await sharp(watermarkPath)
                .resize({
                    height: Math.round(imgInfo.height / 2), // Altura deseada
                    fit: sharp.fit.contain,
                    background: { r: 0, g: 0, b: 0, alpha: 0 } // Fondo transparente
                })
                .toBuffer();

            watermarkImageBuffer = await image.composite([{ input: imageBuffer, tile: true }]).toBuffer()
        }

        // Guardar la imagen con marca de agua en la carpeta deseada
        const watermarkedImagePath = path.join('images/uploadsWithWatermark/', `watermark_${path.basename(imagePath)}`);
        await fs.promises.writeFile(watermarkedImagePath, watermarkImageBuffer);


        //Eliminar logo para la marca de agua que cargo el usuario
        if (nameImageWatermark) deleteImage(null, watermarkPath)
        //Eliminar texto para la marca de agua que cargo el usuario
        if (personalized) deleteImage(null, `images/watermarks/text-${uuidExtraido}.png`)

        return true
    } catch (error) {
        console.log(error)

        //Eliminar logo para la marca de agua que cargo el usuario
        if (nameImageWatermark) deleteImage(null, `images/watermarks/${nameImageWatermark}`)

        //Eliminar texto para la marca de agua que cargo el usuario
        if (personalized) deleteImage(null, `images/watermarks/text-${uuidExtraido}.png`)

        return false
    }
}

export{
    setWatermark
}