import { Publication, Rating } from '../models/Index.js'


//GET /rating/:idPublication
const getRating = async (req, res) => {
    try {
        const { idPublication } = req.params
        const { user } = req

        const publication = await Publication.findOne({ where: { id: idPublication } })
        //Si no existe la publicacion
        if (!publication) {
            return res.status(400).json([{ path: '', msg: 'No existe la publicacion a calificar' }]);
        }
        //Si no existe el usuario
        if (!user) {
            return res.status(400).json({ key: 'not user', msg: 'Debe estar autenticado para poder calificar una publicacion' });
        }

        const rating = await Rating.findOne({ where: { userId: user.id, publicationId: idPublication } })

        if (rating) {
            return res.status(200).json({ value: rating.value, message: 'Rating encontrado' })
        } else {
            return res.status(204)
        }
    } catch (error) {
        console.log('Ocurrió un error al obtener el rating:', error);
        return res.status(500).json({ message: 'Error al obtener el rating' });
    }
}

//POST /rating/save/:idPublication
const saveRating = async (req, res) => {
    try {
        //obtener el usuario
        const { user } = req
        //obtener la publicacion
        //obtener el numero
        const { stars, idPublication } = req.body

        //Si no existe el usuario
        if (!user) {
            return res.status(400).json({ key: 'not user', msg: 'Debe estar autenticado para poder calificar una publicacion' });
        }

        const publication = await Publication.findOne({ where: { id: idPublication } })
        //Si no existe la publicacion
        if (!publication) {
            return res.status(400).json([{ path: '', msg: 'No existe la publicacion a calificar' }]);
        }

        //validar que sea entre 1 y 5
        if (stars < 1 || stars > 5) {
            return res.status(400).json([{ path: 'rating', msg: 'La calificacion esta permitida entre 1 y 5 estrellas' }]);
        }

        //verificar si ya existe la calificacion por parte del usuario
        const rating = await Rating.findOne({ where: { userId: user.id, publicationId: publication.id } })

        if (rating) {
            //actualizar
            rating.value = stars
            await rating.save()
            return res.status(200).json({ message: 'Rating updated', rating });
        } else {
            //crear
            const newRating = await Rating.create({ userId: user.id, publicationId: publication.id, value: stars })
            return res.status(201).json({ message: 'Rating created', newRating });
        }
    } catch (error) {
        console.log('Ocurrió un error al crear o actualizar el registro:', error);
        return res.status(500);
    }
}

//GET /rating/overall
const getOverallRating = async (req, res) => {
    try {
        const { idPublication } = req.params

        const publication = await Publication.findOne({ where: { id: idPublication } })

        //Si no existe la publicacion
        if (!publication) {
            return res.status(400).json([{ path: '', msg: 'No existe la publicacion a calificar' }]);
        }

        //Contar cantidad de opiniones
        const ratings = await Rating.findAll({ where: { publicationId: idPublication } })
        const count = ratings.length

        //Hacer un promedio
        let total = 0
        ratings.forEach(r => {
            total += r.value
        });

        const average = count > 0 ? total / count : 0;

        return res.status(200).json({ count, average })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ path: '', msg: 'No se pudo obtener la calificación general de la publicación' })
    }
}


export {
    getRating,
    saveRating,
    getOverallRating
}