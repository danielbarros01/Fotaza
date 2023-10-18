import { Op, Sequelize } from 'sequelize'
import { Publication, Category, Interest, User } from '../models/Index.js'

const home = async (req, res) => {
    const { user } = req

    let publications

    if (!user) {
        publications = await Publication.findAll({
            where: {
                privacy: 'public'
            },
            order: [['date', 'DESC']],
            include: [
                { model: Category, as: 'category' },
                {
                    model: User, as: 'user', attributes: {
                        exclude: ['password', 'token', 'confirmed', 'google_id']
                    }
                }
            ],
            limit: 6
        })

        return res.render('inicio', {
            viewBtnsAuth: true,
            imageUrl: "/img/backgrounds/fondo6.jpg",
            nameUserPhoto: "Khaled Ali",
            csrfToken: req.csrfToken(),
            publications
        })
    }

    try {
        //si usuario esta autenticado
        const interests = await Interest.findAll({
            where: { userId: req.user.id },
            include: [{ model: Category, as: 'category' }],
            raw: true,
            attributes: ['category.name']
        })

        const categoryNames = interests.map(interest => interest['category.name'])

        publications = await Publication.findAll({
            where: {
                [Op.or]: [{ privacy: 'public' }, { privacy: 'protected' }],
                /* '$category.name$': {
                    [Op.or]: categoryNames
                } */
            },
            include: [
                { model: Category, as: 'category' },
                {
                    model: User, as: 'user', attributes: {
                        exclude: ['password', 'token', 'confirmed', 'google_id']
                    }
                }
            ],
            order: [
                [Sequelize.literal(`CASE WHEN category.name IN (${categoryNames.map(name => `'${name}'`).join(',')}) THEN 0 ELSE 1 END`), 'ASC'],
                ['date', 'DESC']
            ],
            limit: 6
        })


        res.render('inicio', {
            viewBtnsAuth: false,
            user: user,
            imageUrl: "/img/backgrounds/fondo6.jpg",
            nameUserPhoto: "Khaled Ali",
            csrfToken: req.csrfToken(),
            publications
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    home
}