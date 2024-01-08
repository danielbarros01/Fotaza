import { Op, Sequelize } from 'sequelize'
import { Publication, Category, Interest, User, RightOfUse } from '../models/Index.js'

import { bestPublications } from './publicationsController.js'

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

//const uploadsDir = path.join(__dirname, 'images', 'uploads')
//const watermarkPath = path.join(__dirname, 'images', 'watermarks', 'watermarkDefault.png')


const home = async (req, res) => {
    const { user } = req

    let publications

    try {
        /* Si el usuario no está autenticado, se obtienen las publicaciones públicas ordenadas por fecha descendente */
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
                limit: 10
            })


            /* Obtener mejores publicaciones */
            let best = await bestPublications(req, res)

            if (best.length == 0) {
                best = null
            }

            return res.render('inicio', {
                viewBtnsAuth: true,
                imageUrl: "/img/backgrounds/fondo6.jpg",
                nameUserPhoto: "Khaled Ali",
                csrfToken: req.csrfToken(),
                publications,
                bestPublications: best
            })
        }

        /* Si el usuario está autenticado, se recuperan los intereses del usuario y se utiliza esa 
        información para ordenar las publicaciones de manera personalizada. */
        const interests = await Interest.findAll({
            where: { userId: req.user.id },
            include: [{ model: Category, as: 'category' }],
            raw: true,
            attributes: ['category.name']
        })

        const categoryNames = interests.map(interest => interest['category.name'])

        let orden = []

        if (categoryNames.length > 0) {
            orden =
                [
                    [Sequelize.literal(`CASE WHEN category.name IN (${categoryNames.map(name => `'${name}'`).join(',')}) THEN 0 ELSE 1 END`), 'ASC'],
                    ['date', 'DESC']
                ]

        } else {
            orden =
                [
                    ['date', 'DESC']
                ]
        }

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
            order: orden,
            limit: 6
        })

        /* Se obtiene la calificación para cada publicación y se crea un nuevo array de publicaciones con esa información. */
        const publicationsWithQualification =
            await Promise.all(
                publications.map(async p => {
                    const qualification = await p.qualification
                    return { ...p.get(), qualification }
                }))

        /* Obtener mejores publicaciones */
        let best = await bestPublications(req, res)

        if (best.length == 0) {
            best = null
        }

        res.render('inicio', {
            viewBtnsAuth: false,
            user: user,
            imageUrl: "/img/backgrounds/fondo6.jpg",
            nameUserPhoto: "Khaled Ali",
            csrfToken: req.csrfToken(),
            publications: publicationsWithQualification,
            bestPublications: best
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    home
}