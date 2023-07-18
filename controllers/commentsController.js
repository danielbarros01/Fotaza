import db from '../config/db.js'
import { Publication, Comment, User } from '../models/Index.js'

const saveComment = async (req, res) => {
    //validar que publicacion exista
    const { publicationId, description } = req.body
    const { user } = req

    //validar que usuario exista
    if (!user) {
        return res.status(400).json({ key: 'not user', msg: 'Debe estar autenticado para poder comentar una publicacion' });
    }

    const publication = await Publication.findByPk(publicationId)
    //Si no existe la publicacion
    if (!publication) {
        return res.status(400).json([{ path: '', msg: 'No existe la publicacion a comentar' }]);
    }

    //validar que no venga vacio
    if (description == '') {
        return res.status(400).json([{ path: 'commentText', msg: 'El comentario esta vacio' }]);
    }

    //validar min 4 caracteres y max 500
    if (description.length < 4 || description.length > 500) {
        return res.status(400).json([{ path: 'commentText', msg: 'El comentario debe tener entre 4 y 5 caracteres' }]);
    }
    try {
        //cargar
        const comment = await Comment.create({ user_id: user.id, publication_id: publicationId, date: new Date(), description })
        return res.status(200).json({ message: 'Comentario creado', commentId: comment.id });
    } catch (error) {
        console.error(error)
        return res.status(500).send("Error al cargar un comentario");
    }

}

const deleteComment = async (req, res) => {
    //validar el usuario
    const { user } = req
    if (!user) {
        return res.status(400).json({ key: 'not user', msg: 'Debe estar autenticado para poder comentar una publicacion' });
    }

    //obtener el id del comentario
    const { commentId, publicationId, myId } = req.body

    if(parseInt(myId) != user.id){
        return res.sendStatus(403);
    }

    try {
        //que comentario exista
        const comment = await Comment.findOne({ where: { id: commentId, publication_id: publicationId, user_id: user.id } })

        if (!comment) {
            return res.status(400).json({ key: 'no comment', msg: 'No existe el comentario que quieres eliminar' });
        }

        //eliminar
        await comment.destroy()
        return res.status(200).json({ msg: 'El comentario ha sido eliminado' });
    } catch (error) {
        console.error('Ocurrió un error al eliminar un comentario', error)
        return res.status(500).json({ msg: 'Ocurrió un error al eliminar el comentario' });
    }
}

const getComments = async (req, res) => {
    const { idPublication } = req.params
    const { page, pageSize } = req.query;
    const { user } = req

    try {
        if(!user){
            return res.status(401).send('Autenticación necesaria para ver los comentarios')
        }

        const publication = await Publication.findByPk(idPublication)

        if (!publication) {
            return res.status(400).json([{ path: '', msg: 'No existe la publicacion' }]);
        }

        const offset = (page - 1) * pageSize;

        const comments = await Comment.findAll({
            where: { publication_id: publication.id },
            offset,
            limit: parseInt(pageSize),
            include: [{ model: User.scope('withoutPassword'), as: 'user' }],
            order: [
                db.literal(`(user_id = ${user.id}) DESC`), // 
                ['date', 'DESC']
            ]
        })

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los comentarios' });
    }
}

export {
    saveComment,
    deleteComment,
    getComments
}