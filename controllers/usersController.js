import { Model } from 'sequelize'
import db from '../config/db.js'
import { User, Publication } from '../models/Index.js'

//GET /users/:username
const getUser = async (req, res) => {
    let { user } = req
    const { username } = req.params

    try {
        const userProfile = await User.findOne({ where: { username } })
        if (!userProfile) {
            return res.status(404).render('404', { message: 'Uups, no encontramos al usuario' })
        }

        const countPublications = await Publication.findAll({
            where: { user_id: userProfile.id },
            attributes: [[db.literal('COUNT(id)'), 'total']]
        })

        console.log(countPublications)
        if (!user) {
            return res.render('users/myProfile', {
                viewBtnsAuth: true,
                userProfile
            })
        }

        return res.render('users/myProfile', {
            csrfToken: req.csrfToken(),
            user,
            userProfile
        })
    } catch (error) {
        console.log(error)
    }
}


export {
    getUser
}