import fs from 'fs'

//function helper
export default function deleteImage(req, route) {
    if (req) {
        if (req.files['image'][0]) {
            const filePath = req.files['image'][0].path;

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo:', err);
                } else {
                    console.log('Archivo eliminado exitosamente');
                }
            });
        }
    }


    if (route) {
        fs.unlink(route, (err) => {
            if (err) {
                console.error('Error al eliminar el archivo:', err);
            } else {
                console.log('Archivo eliminado exitosamente');
            }
        });
    }
}

