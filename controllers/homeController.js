import { Op, Sequelize } from 'sequelize'
import { Publication, Category, Interest, User } from '../models/Index.js'

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

//const uploadsDir = path.join(__dirname, 'images', 'uploads')
//const watermarkPath = path.join(__dirname, 'images', 'watermarks', 'watermarkDefault.png')


const home = async (req, res) => {
    const { user } = req

    let publications

    try {
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


            //Guardar todos los nombres de las imagenes
            const nameImages = publications.map(publication => publication.image)

            //Traer de la carpeta todas las imagenes


            //Aplicarles marca de agua
            //Guardarlas en un nuevo array


            return res.render('inicio', {
                viewBtnsAuth: true,
                imageUrl: "/img/backgrounds/fondo6.jpg",
                nameUserPhoto: "Khaled Ali",
                csrfToken: req.csrfToken(),
                publications
            })
        }

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