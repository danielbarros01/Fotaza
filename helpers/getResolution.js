import sharp from 'sharp'

//function helper
export default async function getResolution(imagePath) {
    const imageInfo = await sharp(imagePath).metadata();
    const resolution = `${imageInfo.width}x${imageInfo.height}`;

    return resolution
}
