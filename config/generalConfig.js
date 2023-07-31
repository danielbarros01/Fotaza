import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//rutas que necesito
const routeImages = {
    publicFolder: path.join(__dirname, '..', 'public'),
    uploadsFolder: path.join(__dirname, '..', 'public', 'uploads'), //donde van las imagenes publicas
};

export{
    routeImages
}