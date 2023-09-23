import { Model } from 'sequelize'
import db from '../config/db.js'
import { User, Publication, Category } from '../models/Index.js'

//GET /users/:username
const getUser = async (req, res) => {
    let { user } = req
    const { username } = req.params

    try {
        //No encuentra al usuario del perfil
        const userProfile = await User.findOne({ where: { username } })
        if (!userProfile) {
            return res.status(404).render('404', { message: 'Uups, no encontramos al usuario' })
        }

        //traigo las publicaciones del usuario que sean publicas
        const publications = await Publication.findAll({
            where: {
                user_id: userProfile.id,
                privacy: 'public'
            },
            include: [
                { model: Category, as: 'category' }
            ]
        })

        console.log(publications.length)

        //----
        //si no estoy logueado, mostra los btns para login
        if (!user) {
            return res.render('users/myProfile', {
                viewBtnsAuth: true,
                userProfile,
                publications
            })
        }

        //si estoy logueado
        return res.render('users/myProfile', {
            csrfToken: req.csrfToken(),
            user,
            userProfile,
            publications
        })


    } catch (error) {
        console.log(error)
    }
}


export {
    getUser
}