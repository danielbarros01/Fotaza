import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'avatar') {
            cb(null, './public/img/profiles/'); //cuando se llama al callback es porque se esta guardando correctamente
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