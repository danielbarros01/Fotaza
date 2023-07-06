import { body, validationResult, check } from 'express-validator'
import { Category, RightOfUse, Publication } from '../models/Index.js'
import fs from 'fs'

const viewPublications = (req, res) => {
    res.render('publications/home', {
        pagina: 'Home'
    })
}


const createPublication = async (req, res) => {
    const categories = await Category.findAll()
    const rightsOfUse = await RightOfUse.findAll()
    res.render('publications/create', {
        pagina: 'Create Publication',
        csrfToken: req.csrfToken(),
        user: req.user,
        categories,
        rightsOfUse
    })
}

const savePublication = 
async (req, res) => {
    /* Validaciones */
    //Valido que venga la imagen
    if (!req.file) {
        return res.status(400).json([{ path: 'image', msg: 'Debe seleccionar una imagen' }]);
    }

    //Que los campos tambien vengan
    const errors = []
    for (let campo in req.body) {
        if (!req.body[campo]) {
            errors.push({ path: campo, msg: `${campo} no puede estar vacio` })
        }

        if (campo == 'category' || campo == 'rightsOfUse') {
            if (!(!!Number(req.body[campo]))) { //Si no es numero
                errors.push({ path: campo, msg: `Seleccione ${campo} disponible` })
            }
        }
    }

    //Si hay campos vacios:
    if (errors.length > 0) {
        // Verificar si existe un archivo adjunto y eliminarlo
        deleteImage(req)

        //Retornar errores
        return res.status(400).json(errors)
    }
    /* - - - - */

    const { filename, mimetype } = req.file
    const { title, category: category_id, rightsOfUse: rightId } = req.body
    const { id } = req.user

    try {
        //Guardar publicacion
        const publication = await Publication.create({
            image: filename,
            title,
            date: new Date(),
            format: mimetype,
            resolution: null,
            privacy: 'public', //que el usuario elija si quiere ocultar una foto
            category_id,
            rights_of_use_id: rightId,
            user_id: id
        })

        res.status(201).json({ publicationId: publication.id })
    } catch (error) {
        //Si ocurrio un erro tambien eliminar la imagen
        deleteImage(req)
        console.error(error)
    }


    res.status(200)
}

const saveImage = async (req, res) => {

}

const deleteImage = (req) => {
    if (req.file) {
        const filePath = req.file.path;

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error al eliminar el archivo:', err);
            } else {
                console.log('Archivo eliminado exitosamente');
            }
        });
    }
}

export {
    viewPublications,
    createPublication,
    savePublication,
    saveImage
}