import { Op, Sequelize } from 'sequelize'
import db from '../config/db.js'
import sharp from 'sharp'

import format from '../helpers/dateFormat.js'

import deleteImage from '../helpers/deleteImage.js'
import { setWatermark } from '../helpers/watermarks.js'
import getResolution from '../helpers/getResolution.js'

import { User, Category, RightOfUse, Publication, Tag, PublicationHasTag, Comment, Interest, Rating, UserPayment, Transaction } from '../models/Index.js'

import path from 'path'
import { routeImages } from '../config/generalConfig.js'

//----------------------

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//----------------------


// GET /publications
const viewPublications = async (req, res) => {
    //Traer usuario de req
    const { user } = req

    //Valores para la paginacion
    const { page = 0, size = 5 } = req.query

    //Verificar que haya usuario
    try {
        //let publications

        /* USUARIO NO AUTENTICADO */
        //Si el usuario no esta autenticado devolver publicaciones publicas
        if (!user) {
            const { count, rows: publications } = await Publication.findAndCountAll({
                where: {
                    privacy: 'public'
                },
                order: [
                    ['qualification', 'DESC'],
                    ['date', 'DESC']
                ],
                include: [
                    { model: Category, as: 'category' },
                    {
                        model: User, as: 'user', attributes: {
                            exclude: ['email', 'password', 'token', 'confirmed', 'google_id']
                        }
                    }
                ],
                limit: +size,
                offset: (+page) * (+size)
            })

            return res.status(200).json({ status: 'success', count, publications })
        }
        /* -- */

        /* USUARIO AUTENTICADO */

        //Traigo sus intereses
        const interests = await Interest.findAll({
            where: { userId: req.user.id },
            include: [{ model: Category, as: 'category' }],
            raw: true,
            attributes: ['category.name']
        })

        //Solo me interesa el nombre de la categoria
        const categoryNames = interests.map(interest => interest['category.name'])
        let ordenConsulta = []

        /* Traigo sus intereses, si no tiene intereses, traigo las publicaciones mejor calificadas mas recientes */
        if (categoryNames.length > 0) {
            ordenConsulta =
                [
                    [Sequelize.literal(`CASE WHEN category.name IN (${categoryNames.map(name => `'${name}'`).join(',')}) THEN 0 ELSE 1 END`), 'ASC'],
                    ['date', 'DESC']
                ]

        } else {
            ordenConsulta =
                [
                    ['qualification', 'DESC'],
                    ['date', 'DESC']
                ]
        }

        //Traigo las publicaciones
        const { count, rows: publications } = await Publication.findAndCountAll({
            where: {
                [Op.or]: [
                    { privacy: 'public' },
                    { privacy: 'protected' },
                    {
                        /* Si es privado pero no esta a la venta, solo la puede visualizar el usuario */
                        [Op.and]: [
                            { privacy: 'private' },
                            { type: 'sale' }
                        ]
                    }
                ],
            },
            include: [
                { model: Category, as: 'category' },
                {
                    model: User, as: 'user', attributes: {
                        exclude: ['email', 'password', 'token', 'confirmed', 'google_id']
                    }
                }
            ],
            order: ordenConsulta,
            limit: +size,
            offset: (+page) * (+size)
        })
        /* -- */


        return res.status(200).json({ status: 'success', count, publications })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ status: 'error' })
    }


    //Traer publicaciones publicas o protegidas
    //Traer segun sus intereses
    //Si no tiene intereses segun fecha y calificacion de publicacion

    //Traer publicaciones solamente publicas con marca de agua

    /*La ruta de imagen con marca de agua o sin marca de agua se decide en el controlador de devolucion de imagen*/

    //Devolver json
}

//GET /publications/@user?tipo
const viewPublicationsOf = async (req, res) => {
    const { user } = req
    const { username } = req.params
    const { type = 'all', page = 0 } = req.query
    const { per_page = 4 } = req.headers;

    try {
        const userProfile = await User.findOne({ where: { username } })

        if (!userProfile) {
            return res.status(404).json({ status: '404 Not Found', msg: 'No se encontro al usuario' })
        }

        let options = {
            user_id: userProfile.id,
            //Si es unique o general que busque en typeSale, o si no es all, que no agregue el filtro de busqueda por tipo
            ...(
                ((type == 'unique' || type == 'general') && { typeSale: type })
                ||
                (type != 'all' && { type: type })
            )
        }

        //Si el perfil no es el mio
        if (user.id !== userProfile.id) {
            /*El perfil de usuario no es el mio
                Solo se pueden ver las privadas que no sean de tipo publica
                Op.ne = no es igual a
                */

            options = {
                ...options,
                [Op.and]: [
                    {
                        [Op.or]: [
                            { privacy: 'private', type: { [Op.ne]: 'free' } },
                            { privacy: { [Op.in]: ['public', 'protected'] } },
                        ],
                    },
                ],
            }
        }

        let { count, rows: publications } = await Publication.findAndCountAll(
            {
                where: options,
                order: [['date_and_time', 'DESC']],
                include: [
                    { model: Category, as: 'category' },
                    {
                        model: User, as: 'user', attributes: {
                            exclude: ['email', 'password', 'token', 'confirmed', 'google_id']
                        }
                    },
                ],
                limit: +per_page,
                offset: (+page) * (+per_page)
            })

        return res.status(200).json({ status: '200 success', count, publications })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ status: '500 error' })
    }
}

// GET /publications/create
const createPublication = async (req, res) => {
    const categories = await Category.findAll()
    const rightsOfUse = await RightOfUse.findAll({ where: { free: true } })

    //Buscar las licencias que sean compatibles con Publicacion de tipo libre

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

    try {
        /*---Abro Validaciones ----*/
        {
            //Valido que venga la imagen
            if (!req.files['image'][0]) {
                return res.status(400).json([{ path: 'image', msg: 'Debe seleccionar una imagen' }]);
            }

            /* Campos obligatorios */
            let camposObligatorios = ['title', 'category', 'privacyItem', 'typePost']

            //verifico si es de tipo venta para agregar mas campos obligatorios
            if (req.body['typePost'] == 'sale') {
                camposObligatorios = [...camposObligatorios, 'typeSale', 'price', 'currency'] //agrego valores obligatorios si es de tipo venta
            }

            const errors = []

            if ((req.files['image'][0].size / (1024 * 1024)) > 15) {
                errors.push({ path: 'image', msg: 'La imagen no puede pesar mas de 15mb' })
            }

            for (let campo in req.body) {
                if (!req.body[campo] && camposObligatorios.includes(campo)) {  //si viene vacio el campo y esta entre los obligatorios
                    errors.push({ path: campo, msg: `${campo} no puede estar vacio` })
                }

                //Si es categoria entro a validar tambien entra si es distinto a tipo de venta unico ya que si es unico no necesita una licencia
                if (campo == 'category' || (campo == 'license' && req.body['typeSale'] != 'unique')) {
                    if (!(!!Number(req.body[campo]))) { //Si no es numero, ya que me tiene que enviar solo el id
                        errors.push({ path: campo, msg: `Seleccione ${campo} disponible` })
                    }

                }

                if (campo == 'privacyItem') {
                    switch (req.body[campo]) {
                        case 'public': break;
                        case 'protected': break;
                        case 'private': break;
                        default: errors.push({ path: campo, msg: `${campo} debe ser public, protected o private` })
                    }
                }

                //type debe ser free o sale
                if (campo == 'typePost' && (req.body[campo] != 'free' && req.body[campo] != 'sale')) {
                    errors.push({ path: campo, msg: `${campo} debe ser libre o de venta` })
                }
            }

            //si es de tipo sale
            if (req.body['typePost'] == 'sale') {
                /* Validar que exista un pago */
                const userPayment = await UserPayment.findByPk(req.user.id)

                if (!userPayment) {
                    errors.push({ path: 'payment', msg: `No tienes configurado el metodo de pago` })
                }
                /*  */

                //typeVenta puede ser general o unique
                const typeSale = req.body['typeSale']

                if (typeSale != 'general' && typeSale != 'unique') {
                    errors.push({ path: 'typeSale', msg: `El tipo de venta solamente puede ser general o unico` })
                }

                //price de tipo numero
                const priceWithCommas = req.body['price']
                const price = parseFloat(priceWithCommas.replace(/[,.]/g, ''));

                if (isNaN(price) || price <= 0 || price > 4000000) {
                    errors.push({ path: 'price', msg: `Debe ingresar un numero valido mayor a 0 y menor a 4 millones` })
                }


                //currency ars (us no disponible)
                const currency = req.body['currency']
                if (currency != 'ars' /* && currency != 'us' */) {
                    errors.push({ path: 'currency', msg: `El tipo de moneda puede ser ars (Moneda Argentina)` })
                }
            }



            //Si hay campos vacios:
            if (errors.length > 0) {
                // Verificar si existe un archivo adjunto y eliminarlo
                deleteImage(req)

                if (req.body.optionWatermark == 'customized') {
                    //Obtengo los datos de imagen de marca de agua si la hay
                    let imageWatermark = req.files['imageWatermark'] ? req.files['imageWatermark'][0] : null
                    if (imageWatermark) {
                        deleteImage(null, `images/watermarks/${imageWatermark.filename}`)
                    }
                }

                //Retornar errores
                return res.status(400).json(errors)
            }
        }
        /*---Cierro Validaciones ----*/


        /*---Abro Recibo de datos ----*/

        //Datos de la imagen
        const { filename, mimetype, path: imagePath } = req.files['image'][0]

        //Datos del body
        const { title, category: category_id, license, privacyItem: privacy, typePost: type, typeSale, optionWatermark, textWatermark } = req.body

        //Id del usuario autenticado
        const { id } = req.user

        //Etiquetas
        const tags = JSON.parse(req.body.tags)

        //Checkear que solo sean 3 tags
        if (tags.length > 3) {
            return res.status(400).json({ path: 'tags', msg: `Escribe maximo 3 categorias` })
        }

        /*---Abro Validar licencia ----*/
        const rightOfUse = await RightOfUse.findByPk(license)

        //Validar que exista esta licencia
        if (!rightOfUse && typeSale != 'unique') {
            return res.status(400).json({ path: 'rightOfUse', msg: 'No existe la licencia que solicito' })
        }

        //Validar que la licencia este disponible para el tipo de publicacion
        if (type == 'free' && !rightOfUse.free) {
            return res.status(400).json({ path: 'rightOfUse', msg: 'La licencia no esta disponible para tipos de publicacion gratuita' })
        }
        else if ((type == 'sale' && typeSale == 'general') && !rightOfUse.general_sale) {
            return res.status(400).json({ path: 'rightOfUse', msg: 'La licencia no esta disponible para tipos de publicacion de venta general' })
        }

        /*---Cierro Validar licencia ----*/


        //Validar que exista la categoria
        const category = await Category.findByPk(category_id)
        if (!category) {
            return res.status(400).json({ path: 'category', msg: 'No existe la categoria' })
        }

        //Obtener resolucion
        const resolution = await getResolution(imagePath)


        /*---Abro campos a guardar ----*/
        //Publicacion a crear
        let publication

        //Campos base, los que se guardan si o si
        let camposPublication = {
            image: filename,
            title,
            date: new Date(),
            format: mimetype,
            resolution,
            privacy, //que el usuario elija si quiere ocultar una foto
            category_id,
            user_id: id,
            type
        }

        // Guardar licencia si no es unique
        if (type == 'free' || (type == 'sale' && typeSale != 'unique')) {
            camposPublication.rights_of_use_id = rightOfUse.id
        }

        //si es copyright o tipo de venta unica debe ser privada
        //si es copyright o unique validar si viene la opcion de marca de agua personalizada
        if ((type == 'sale' && typeSale == 'unique') || rightOfUse.name == 'Copyright') {
            camposPublication.privacy = 'private'
        }

        //Si es de tipo sale hace falta: typeSale, price y currency
        if (type == 'sale') {
            camposPublication.typeSale = req.body['typeSale']
            camposPublication.price = parseFloat(req.body['price'].replace(/[,.]/g, ''));
            camposPublication.currency = req.body['currency']

        }

        /*---Cierro campos a guardar ----*/


        /*---Abro marcas de agua ----*/
        let imageWatermark

        if ((type == 'sale' || typeSale == 'unique') || rightOfUse.name == 'Copyright') {
            //Si elegi marca de agua personalizada
            if (optionWatermark == 'customized') {
                //El texto es obligatorio, asi que debo validar que exista
                if (!textWatermark) return res.status(400).json({ path: 'watermarkText', msg: 'Debe ingresar un texto para una marca de agua personalizada' })

                //Obtengo los datos de imagen si la hay
                imageWatermark = req.files['imageWatermark'] ? req.files['imageWatermark'][0] : null

                if (imageWatermark) {
                    const { filename } = imageWatermark
                    //y si no viene imagen?
                    const watermark = await setWatermark(imagePath, true, textWatermark, filename)

                    if (!watermark) throw new Error('Error al generar la imagen con la marca de agua')
                } else {
                    const watermark = await setWatermark(imagePath, true, textWatermark)

                    if (!watermark) throw new Error('Error al generar la imagen con la marca de agua')
                }
            } else {
                const watermark = await setWatermark(imagePath, false)

                if (!watermark) throw new Error('Error al generar la imagen con la marca de agua')
            }
        } else {
            const watermark = await setWatermark(imagePath, false)

            if (!watermark) throw new Error('Error al generar la imagen con la marca de agua')
        }

        /*--- Guardar publicacion ---*/
        publication = await Publication.create(camposPublication)

        /*---Abro etiquetas ----*/
        const tagsBD = [] //instancias de tag
        {
            //find or create para obtener el id del tag o crearlo y tambien obtener el id
            for (const tag of tags) {
                const lowercaseTag = tag.toLowerCase(); //convierto en minuscula la palabra
                tagsBD.push(await Tag.findOrCreate({ where: { name: lowercaseTag } }))
            }

            //agregar a la tabla intermedia
            //findOrCreate asi si el usuario mando por ej, A y a, es lo mismo a y a y apuntan al mismo tag, no hace falta crear la relacion por 2da vez
            for (const tag of tagsBD) {
                await PublicationHasTag.findOrCreate({ where: { publicationId: publication.id, tagId: tag[0].id } })
            }
        }
        /*---Cierro etiquetas ----*/


        res.status(201).json({ publicationId: publication.id })
    } catch (error) {
        //Si ocurrio un erro tambien eliminar la imagen
        deleteImage(req)

        //Elimino logo para la marca de agua si se cargo
        let imageWatermark = req.files['imageWatermark'] ? req.files['imageWatermark'][0] : null
        if (imageWatermark) deleteImage(null, `images/watermarks/${imageWatermark.filename}`)

        console.error(error)

        //Eliminar publicacion y todo lo relacionada a ella

        /*  */

        return res.status(500).json([{ path: '-', msg: 'Hemos tenido un error al procesar tu solicitud, intenta nuevamente más tarde' }]);
    }
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
        if (!user && publication.privacy != 'public') { //la publicacion es publica?
            return res.status(401).send('Solo usuarios registrados pueden ver esta publicacion')
        } else if (user && (publication.privacy == 'private' && publication.type != 'sale')) {
            if (user.id != userPost.id) {
                return res.status(401).send('Esta publicación es privada')
            }
        }

        // || (publication.privacy == 'private' && publication.type != 'sale')

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

        //formatear fecha
        let fechaFormateada = format(publication.date)

        if (!user) {
            return res.render('publications/publication', {
                publication,
                fechaFormateada,
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

        /* Verificar que no haya comprado ya la publicacion */
        const transaction = await Transaction.findOne({
            where: {
                user_id: user.id,
                publication_id: publication.id
            }
        })
        /*  */

        //si el user_id del post es el mismo del user.id, mostrar para modificar
        return res.render('publications/publication', {
            publication,
            fechaFormateada,
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
            imageUrl: `/publications/image/${publication.image}`,
            transaction
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
    let filePath

    //Si la imagen no es de venta descargar imagen sin marca de agua
    if (publication.type != 'sale') {
        filePath = path.join(process.cwd(), 'images', 'uploads', fileName)
    } else {
        //Si la imagen es de venta pero ya la adquiri descargar sin marca de agua
        const transaction = await Transaction.findOne({
            where: {
                user_id: req.user.id,
                publication_id: publication.id,
                status: 'approved'
            }
        })

        if (transaction && transaction.status == 'approved') {
            filePath = path.join(process.cwd(), 'images', 'uploads', fileName)
        } else {
            //Si la imagen es de venta descargar con marca de agua
            filePath = path.join(process.cwd(), 'images', 'uploadsWithWatermark', `watermark_${fileName}`)
        }
    }

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

// GET /publications/best
const bestPublications = async (req, res) => {
    const { user } = req

    const minRatings = 3 //minimo de valoraciones, requisito es 50
    const minPromRating = 4 //promedio minimo, requisito es 4
    const limit = 4

    //Hace una semana
    let weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    let items

    if (user) {
        //Traigo las publicaciones
        const { rows } = await Rating.findAndCountAll(
            {
                attributes: [
                    'publicationId',
                    [Sequelize.fn('AVG', Sequelize.col('value')), 'averageValue'],
                    [Sequelize.fn('COUNT', 'publicationId'), 'count']
                ],
                group: ['publicationId'],
                having: [
                    Sequelize.where(Sequelize.fn('COUNT', 'publicationId'), '>=', minRatings),
                    Sequelize.where(Sequelize.fn('AVG', Sequelize.col('value')), '>=', minPromRating),
                ],
                include: [{
                    model: Publication,
                    where: {
                        date: { [Op.gte]: weekAgo },    //Op.gte (mayor o igual que)
                        /* Una publicación privada que no este a la venta, solo estará visible para el usuario propietario */
                        /* WHERE NOT (type <> 'sale' AND privacy = 'private') */
                        [Op.not]: {
                            [Op.and]: [
                                { type: { [Op.ne]: 'sale' } },
                                { privacy: 'private' }
                            ]
                        }
                    },
                    include: [{
                        model: User, as: 'user', attributes: {
                            exclude: ['email', 'password', 'token', 'confirmed', 'google_id']
                        }
                    }]
                }],
                limit,
            })

        items = rows
    } else {
        //Si no estoy autenticado mostrar las mejores que no sean unicas
        const { rows } = await Rating.findAndCountAll(
            {
                attributes: [
                    'publicationId',
                    [Sequelize.fn('AVG', Sequelize.col('value')), 'averageValue'],
                    [Sequelize.fn('COUNT', 'publicationId'), 'count']
                ],
                group: ['publicationId'],
                having: [
                    Sequelize.where(Sequelize.fn('COUNT', 'publicationId'), '>=', minRatings),
                    Sequelize.where(Sequelize.fn('AVG', Sequelize.col('value')), '>=', minPromRating),
                ],
                include: [
                    {
                        model: Publication,
                        where: {
                            date: { [Op.gte]: weekAgo },    //Op.gte (mayor o igual que)
                            privacy: { [Op.notIn]: ['private', 'protected'] }
                        },
                        include: [{
                            model: User, as: 'user', attributes: {
                                exclude: ['email', 'password', 'token', 'confirmed', 'google_id']
                            }
                        }]
                    }
                ],
                limit
            })

        items = rows
    }


    /* En caso de que la cantidad de imagenes sea menor a limit, buscar demás imágenes deberán seguir un criterio 
    aleatorio que comprenda no más de una imagen del mismo usuario y cuyas imágenes no sean más de 1 año de antigüedad. */
    const additionalItems = limit - items.length

    if (additionalItems > 0) {
        //Hace un año
        let oneYearGo = new Date();
        oneYearGo.setFullYear(oneYearGo.getFullYear() - 1);

        let randomImages

        if (user) {
            randomImages = await Publication.findAll({
                where: {
                    id: {
                        [Op.notIn]: items.map(item => item.publication.id), // Excluir las publicaciones que ya hay
                    },
                    date: { [Op.gte]: oneYearGo },
                    [Op.not]: {
                        [Op.and]: [
                            { type: { [Op.ne]: 'sale' } },
                            { privacy: 'private' }
                        ]
                    }
                },
                include: [{
                    model: User, as: 'user',
                    attributes: {
                        exclude: ['email', 'password', 'token', 'confirmed', 'google_id']
                    }
                }],
                order: Sequelize.literal('rand()'),
                subQuery: false, // Deshabilitar la subconsulta para mejorar la compatibilidad con MySQL,
                group: ['User.id'],
                limit: additionalItems,
                having: Sequelize.literal('COUNT(DISTINCT `user`.`id`) = 1') // Hacer que solo haya una publicación por usuario
            })
        } else {
            randomImages = await Publication.findAll({
                where: {
                    id: {
                        [Op.notIn]: items.map(item => item.publication.id), // Excluir las publicaciones que ya hay
                    },
                    date: { [Op.gte]: oneYearGo },
                    privacy: { [Op.notIn]: ['private', 'protected'] }
                },
                include: [{
                    model: User, as: 'user',
                    attributes: {
                        exclude: ['email', 'password', 'token', 'confirmed', 'google_id']
                    }
                }],
                order: Sequelize.literal('rand()'),
                subQuery: false, // Deshabilitar la subconsulta para mejorar la compatibilidad con MySQL,
                group: ['User.id'],
                limit: additionalItems,
                having: Sequelize.literal('COUNT(DISTINCT `user`.`id`) = 1') // Hacer que solo haya una publicación por usuario
            })

        }

        /* La estrucutura de items funciona asi, con un item padre, por eso hago esto */
        randomImages.forEach(i => {
            const item = {}
            item.publication = i

            items.push(item)
        })
    }

    return items
}

export {
    viewPublications,
    viewPublicationsOf,
    createPublication,
    savePublication,
    viewMyPublications,
    viewPublication,
    downloadImage,
    editPublication,
    deletePublication,
    bestPublications
}