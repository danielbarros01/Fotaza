import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'avatar') {
            // Ruta donde se guardarán las imágenes de perfil
            const profileImagePath = './public/img/profiles/'

            // Ruta completa del archivo existente (sin importar la extensión)
            const existingFilePath = path.join(profileImagePath, req.user.username);

            // Eliminar el archivo existente si existe
            if (fs.existsSync(existingFilePath)) {
                fs.unlinkSync(existingFilePath);
            }

            cb(null, profileImagePath);
        } else {
            cb(null, './public/uploads/');
        }
    },
    filename: function (req, file, cb) {
        if (file.fieldname === 'avatar') {
            cb(null, req.user.username + path.extname(file.originalname))
        } else {
            cb(null, uuidv4() + path.extname(file.originalname)) //path.extname trae la extension de un archivo //se llama al callback es porque se subio correctamente la imagen
        }

    }
})


const upload = multer({ storage })

export default upload