import db from '../config/db.js'
import bcrypt from 'bcrypt'
import { body, validationResult, check } from 'express-validator'
import { User, Category, RightOfUse, Publication, Tag, PublicationHasTag, Comment } from '../models/Index.js'
import fs from 'fs'
import path from 'path'

// GET /publications
const viewPublications = (req, res) => {
    res.render('publications/home', {
        pagina: 'Home'
    })
}

// GET /publications/create
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
// POST /publications/create
const savePublication = async (req, res) => {
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
    const tags = JSON.parse(req.body.tags)

    //Checkear que solo sean 3 tags
    if (tags.length > 3) {
        return res.status(400).json({ path: 'tags', msg: `Escribe maximo 3 categorias` })
    }


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

        //find or create para obtener el id del tag o crearlo y tambien obtener el id
        const tagsBD = [] //instancias de tag
        for (const tag of tags) {
            const lowercaseTag = tag.toLowerCase(); //convierto en minuscula la palabra
            tagsBD.push(await Tag.findOrCreate({ where: { name: lowercaseTag } }))
        }

        //agregar a la tabla intermedia
        for (const tag of tagsBD) {
            await PublicationHasTag.create({ publicationId: publication.id, tagId: tag[0].id })
        }

        res.status(201).json({ publicationId: publication.id })
    } catch (error) {
        //Si ocurrio un erro tambien eliminar la imagen
        deleteImage(req)
        console.error(error)
    }


    res.status(200)
}

// GET /publications/my-posts
const viewMyPublications = async (req, res) => {

}

// GET /publications/:id
const viewPublication = async (req, res) => {
    //verificar si viene usuario
    const { user } = req
    const { id: idPost } = req.params

    try {
        const publication = await Publication.findByPk(idPost)

        if (!publication) {
            return res.status(404).render('404', { message: 'Uups, no encontramos esta publicación' })
        }

        let userPost = await User.findByPk(publication.user_id)

        /* Las imágenes protegidas podrán solo ser accedidas por usuarios autenticados */
        //No esta autenticado
        if (!user && !publication.privacy == 'public') { //la publicacion es publica?
            return res.status(401).send('Solo usuarios registrados pueden ver esta publicacion')
        } else if (user && (publication.privacy == 'private' && user.id != userPost.id)) {
            return res.status(401).send('Esta publicación es privada')
        }

        //Obtenemos los demas datos
        const tags = await publication.getTags()
        const rightOfUse = await RightOfUse.findByPk(publication.rights_of_use_id)
        const category = await Category.findByPk(publication.category_id)

        //calificacion
        //otras imagenes parecidas

        if (!user) {
            return res.render('publications/publication', {
                publication,
                viewBtnsAuth: user ? false : true,
                userPost,
                tags,
                rightOfUse,
                category,
                csrfToken: req.csrfToken(),
            })
        }


        //si el user_id del post es el mismo del user.id, mostrar para modificar
        return res.render('publications/publication', {
            publication,
            viewBtnsAuth: user ? false : true,
            user,
            userPost,
            tags,
            rightOfUse,
            category,
            myId: user.id ?? '',
            csrfToken: req.csrfToken(),
        })
    } catch (error) {
        console.error(error)
    }
}

//function helper
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

const downloadImage = async (req, res) => {
    const { id: idPublication } = req.params
    const publication = await Publication.findOne({ where: { id: idPublication } })

    if (!publication) {
        return res.status(404).render('404', { message: 'Uups, no encontramos esta publicación' })
    }

    const fileName = publication.image
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)


    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error('Error al descargar un archivo:', err);
            res.status(500).send('Ocurrió un error al descargar el archivo.');
        }
    })
}

export {
    viewPublications,
    createPublication,
    savePublication,
    viewMyPublications,
    viewPublication,
    downloadImage
}