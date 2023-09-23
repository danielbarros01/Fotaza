import { Op } from 'sequelize'
import db from '../config/db.js'
import sharp from 'sharp'
import { User, Category, RightOfUse, Publication, Tag, PublicationHasTag, Comment } from '../models/Index.js'
import fs from 'fs'
import path from 'path'
import { routeImages } from '../config/generalConfig.js'

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

    /* Campos obligatorios */
    let camposObligatorios = ['title', 'category', /* 'rightsOfUse', */ 'privacyItem', 'typePost']

    //verifico si es de tipo venta
    if (req.body['typePost'] == 'sale') {
        camposObligatorios = [...camposObligatorios, 'typeSale', 'price', 'currency'] //agrego valores obligatorios si es de tipo venta
    }
    /* const camposPresentes = camposObligatorios.every(campo => campo in req.body);
    if (!camposPresentes) {
        res.clearCookie('_token')
        return res.status(400).json([{ path: 'critical', error: 'Faltan campos obligatorios en el formulario' }]);
    } */
    /*  */

    //Que los campos que vengan no esten vacios
    const errors = []

    //Para validar que si es de tipo free no me importen estos campos a la hora de agregar los errores si vienen vacios
    let camposExcluidos = []
    if (req.body['typePost'] != 'sale') {
        camposExcluidos = ['price', 'typeSale'];
    }

    for (let campo in req.body) {
        if (!req.body[campo] && !camposExcluidos.includes(campo)) {
            errors.push({ path: campo, msg: `${campo} no puede estar vacio` })
        }

        if (campo == 'category' || campo == 'rightsOfUse') {
            if (!(!!Number(req.body[campo]))) { //Si no es numero
                errors.push({ path: campo, msg: `Seleccione ${campo} disponible` })
            }
        }

        if (campo == 'privacyItem') {
            switch (req.body[campo]) {
                case 'public': break;
                case 'protected': break;
                default: errors.push({ path: campo, msg: `${campo} debe ser public o protected` })
            }
        }

        //type debe ser free o sale
        if (campo == 'typePost' && (req.body[campo] != 'free' && req.body[campo] != 'sale')) {
            errors.push({ path: campo, msg: `${campo} debe ser libre o de venta` })
        }
    }

    //si es de tipo sale
    if (req.body['typePost'] == 'sale') {
        //typeVenta puede ser general o unique
        const typeSale = req.body['typeSale']
        if (typeSale != 'general' && typeSale != 'unique') {
            errors.push({ path: 'typeSale', msg: `El tipo de venta solamente puede ser general o unico` })
        }

        //price de tipo numero
        const price = req.body['price']

        if (isNaN(price) || price <= 0) {
            errors.push({ path: 'price', msg: `Debe ingresar un numero valido mayor a 0 y menor a 100 millones` })
        }


        //currency ars o us
        const currency = req.body['currency']
        if (currency != 'ars' && currency != 'us') {
            errors.push({ path: 'currency', msg: `El tipo de moneda puede ser ars o us` })
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

    const { filename, mimetype, path: imagePath } = req.file

    const { title, category: category_id, rightsOfUse: rightId, privacyItem: privacy, typePost: type } = req.body
    const { id } = req.user
    const tags = JSON.parse(req.body.tags)

    //Checkear que solo sean 3 tags
    if (tags.length > 3) {
        return res.status(400).json({ path: 'tags', msg: `Escribe maximo 3 categorias` })
    }


    try {
        //Validar que exista esta licencia
        const rightOfUse = await RightOfUse.findByPk(1)
        if (!rightOfUse) {
            return res.status(400).json({ path: 'rightOfUse', msg: 'No existe este Derecho de uso' })
        }

        //Validar que exista la categoria
        const category = await Category.findByPk(category_id)
        if (!category) {
            return res.status(400).json({ path: 'category', msg: 'No existe la categoria' })
        }

        //Obtener resolucion
        const imageInfo = await sharp(imagePath).metadata();
        const resolution = `${imageInfo.width}x${imageInfo.height}`;

        let camposPublication = {
            image: filename,
            title,
            date: new Date(),
            format: mimetype,
            resolution,
            privacy, //que el usuario elija si quiere ocultar una foto
            category_id,
            rights_of_use_id: rightOfUse.id,
            user_id: id,
            type
        }

        let publication
        if (type == 'sale') {
            camposPublication.typeSale = req.body['typeSale']
            camposPublication.price = req.body['price']
            camposPublication.currency = req.body['currency']

            publication = await Publication.create(camposPublication)
        } else if (type == 'free') {
            //Guardar publicacion
            publication = await Publication.create(camposPublication)
        }


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
    res.render('publications/myPublications', {
        pagina: 'Mis publicaciones'
    })
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

        /* RECOMENDACIONES */
        //otras imagenes parecidas
        //Primero busco por las etiquetas
        let recomendations = await Publication.findAll({
            include: [{
                model: Tag,
                where: {
                    name: {
                        [Op.in]: tags.map(tag => tag.name)
                    }
                }
            }],
            where: {
                id: {
                    [Op.not]: parseInt(publication.id) // Excluir el ID 19, que es la publicación actual
                }
            },
            order: [['date_and_time', 'DESC']],
            limit: 10
        });

        //si la busqueda por etiquetas me devuelve 5 o menos publicaciones le agrego por categoria
        if (recomendations.length < 6) {
            const recomendationsByCategory = await Publication.findAll({
                where: {
                    id: {
                        [Op.not]: [parseInt(publication.id), ...recomendations.map(r => r.id)] // Excluir el ID 19 y los que haya traido del anterior recomendations
                    },
                    category_id: publication.category_id
                },
                order: [['date_and_time', 'DESC']],
                limit: 5
            });

            //Unir los arrays
            recomendations = [...recomendations, ...recomendationsByCategory]
        }
        /* RECOMENDACIONES */

        if (!user) {
            return res.render('publications/publication', {
                publication,
                viewBtnsAuth: user ? false : true,
                userPost,
                tags,
                rightOfUse,
                category,
                recomendations,
                csrfToken: req.csrfToken(),
            })
        }


        const categories = await Category.findAll()
        const rightsOfUse = await RightOfUse.findAll()
        //si el user_id del post es el mismo del user.id, mostrar para modificar
        return res.render('publications/publication', {
            publication,
            viewBtnsAuth: user ? false : true,
            user,
            userPost,
            tags,
            rightOfUse,
            category,
            recomendations,
            categories,
            rightsOfUse,
            myId: user.id ?? '',
            csrfToken: req.csrfToken(),
        })
    } catch (error) {
        console.error(error)
    }
}

// GET /publications/:id/download 
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

//PATCH /publications/:id
const editPublication = async (req, res) => {
    const { user } = req
    const { id: publicationId } = req.params
    const updates = req.body

    /* VALIDACIONES */
    //Si no hay usuario
    if (!user) {
        return res.status(401).json({ key: 'no user', msg: 'Debe estar autenticado' });
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
        //Retornar errores
        return res.status(400).json(errors)
    }

    //Checkear que solo sean 3 tags
    if (updates.tags.length > 3) {
        return res.status(400).json({ path: 'tags', msg: `Escribe maximo 3 categorias` })
    }
    /* - - - - */

    /*  */

    // Iniciar la transacción
    const transaction = await db.transaction();

    try {
        //valido publicacion
        const publication = await Publication.findOne({ where: { id: publicationId, user_id: user.id }, transaction, })
        if (!publication) {
            return res.status(404).json({ key: 'no publication', msg: 'No existe la publicacion' });
        }

        if (updates.category != publication.category_id) publication.category_id = updates.category
        if (updates.rightsOfUse != publication.rights_of_use_id) publication.rights_of_use_id = updates.rightsOfUse
        if (updates.title != publication.title) publication.title = updates.title


        let publicationTags = null
        //si esta vacio tags eliminar los tags de la publicacion si existiesen
        if (updates.tags.length === 0) {
            await PublicationHasTag.destroy({ where: { publicationId }, transaction })
        } else {
            //Traer los tags de la publication de la bd si existiesen
            publicationTags = await publication.getTags({ transaction })

            //Comparar array del cliente con publicationTags
            if (publicationTags.length > updates.tags.length) {

                //array de ids que deben quedar
                const idsOk = publicationTags
                    .filter((tag, index) => {
                        return tag.name == updates.tags[index]
                    })
                    .map(tag => tag.id)

                //hay que borrar algun dato
                await PublicationHasTag.destroy({
                    where: {
                        [Op.and]: [
                            { tagId: { [Op.notIn]: idsOk } },
                            { publication_id: publication.id }
                        ]
                    },
                    include: [
                        {
                            model: Tag
                        }
                    ]
                })
            }

            //Recorro los tags que traigo del cliente
            for (const tag of updates.tags) {
                let newTagBd = await Tag.findOrCreate({ where: { name: tag.toLowerCase() }, transaction }) //busco o creo en tabla TAGS

                //si newTagBd NO esta en PublicationHasTag crearlo
                const existingPublicationHasTag = await PublicationHasTag.findOne({
                    where: {
                        tag_id: newTagBd[0].id,
                        publication_id: publication.id
                    }, transaction
                });

                if (!existingPublicationHasTag) {
                    await PublicationHasTag.create({ publicationId: publication.id, tagId: newTagBd[0].id }, { transaction })  //Relacionar con la tabla intermedia PublicationHasTag
                }
            }
        }

        // Guardamos los cambios
        await publication.save({ transaction });
        // Confirmar la transacción
        await transaction.commit();

        res.sendStatus(204)
    } catch (error) {
        // Si ocurre un error, deshacemos la transacción y manejamos el error
        await transaction.rollback(); //redundante?
        res.status(500).json({ error: 'Error en la actualización de la publicación.' });
    }
}

//DELETE /publications/:id
const deletePublication = async (req, res) => {
    const { user } = req
    const { id: publicationId } = req.params

    if (!user) {
        return res.status(401).json({ key: 'no user', msg: 'Debe estar autenticado' });
    }

    //valido publicacion
    const publication = await Publication.findOne({ where: { id: publicationId, user_id: user.id } })
    if (!publication) {
        return res.status(404).json({ key: 'no publication', msg: 'No existe la publicacion' });
    }

    try {
        const rutePublication = publication.image
        const imagePath = path.join(routeImages.uploadsFolder, rutePublication) //rutaServidor/public/uploads/imagenNombre


        deleteImage(null, imagePath)
        await publication.destroy()

        return res.status(200).json({ message: 'Publicación eliminada' })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: 'Hubo un error al querer eliminar la publicación, intentalo más tarde' })
    }
}

//function helper
const deleteImage = (req, route) => {
    if (req) {
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



export {
    viewPublications,
    createPublication,
    savePublication,
    viewMyPublications,
    viewPublication,
    downloadImage,
    editPublication,
    deletePublication
}