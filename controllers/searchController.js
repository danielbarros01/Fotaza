import { Op, Sequelize } from 'sequelize'
import { Publication, Category, Tag, User } from '../models/Index.js'

//GET page
const search = async (req, res) => {
    try {
        const { user } = req
        const { value } = req.params

        const categories = await Category.findAll({ raw: true })


        res.render('publications/search', {
            title: value != 'allPublications' ? value : null,
            categories,
            user,
            csrfToken: req.csrfToken(),
        })

    } catch (error) {
        console.error(error)
        return res.status(500)
    }
}

//GET json
const searchPublications = async (req, res) => {
    try {
        const { user } = req
        const { value } = req.params
        const { page = 0, type = 'free', priority = 'qualification', size = 'all', tags, categories } = req.query
        const { per_page = 12 } = req.headers

        let includes = []
        let forTitle = {}

        //Para determinar el tipo de publicacion a traer si es de venta o si es free
        let optionsType = {}
        if (type == 'general' || type == 'unique') {
            optionsType = {
                type: 'sale',
                typeSale: type
            }
        } else {
            optionsType = {
                type
            }
        }
        //--


        //Si no hay usuario solo devolver publicaciones publicas
        const allowedPrivacy = !user ? ['public'] : ['public', 'protected', 'private']
        //--


        //Prioridad por fecha o por calificacion 
        const orderPriority = (priority == 'qualification') ? [['qualification', 'DESC']] : [['date_and_time', 'DESC']]
        //--


        //Por tamaño
        let sizeCondition = {}
        if (size != 'all') {
            switch (size) {
                case 'small':

                    sizeCondition = {
                        [Op.and]: [
                            /* obtener el primer número antes de la 'x' en la columna resolution, convertirlo a un número entero sin signo, y luego verificar si ese número es menor o igual a 640 */
                            Sequelize.literal('CAST(SUBSTRING_INDEX(resolution, "x", 1) AS UNSIGNED) <= 640')
                        ]
                    };
                    break;

                case 'medium':
                    sizeCondition = {
                        [Op.and]: [
                            Sequelize.literal('CAST(SUBSTRING_INDEX(resolution, "x", 1) AS UNSIGNED) BETWEEN 641 AND 1920')
                        ]
                    };
                    break;

                case 'large':
                    sizeCondition = {
                        [Op.and]: [
                            Sequelize.literal('CAST(SUBSTRING_INDEX(resolution, "x", 1) AS UNSIGNED) > 1920')
                        ]
                    };
                    break;
            }
        }
        //--


        //Por etiquetas
        let arrayTags
        let idTags = []

        if (tags.length > 0) {
            arrayTags = tags.split(',')

            //Busco los ids de las etiquetas

            idTags = await Tag.findAll({
                attributes: ['id'],
                where: {
                    name: {
                        [Op.in]: arrayTags
                    }
                }
            })

            includes.push({
                model: Tag,
                where: {
                    id: {
                        [Op.in]: idTags.map(tag => tag.id)
                    }
                }
            })
        }
        //--


        //Por categorias
        if (categories.length > 0) {
            const arrayCategories = categories.split(',')

            includes.push({
                model: Category,
                as: 'category',
                where: {
                    id: {
                        [Op.in]: arrayCategories
                    }
                }
            },)
        }
        //--
        //Si es allPublications, no buscar publicaciones por titulo, esto para cuando busco desde otras paginas
        if (value != 'allPublications') {
            forTitle = {
                title: {
                    [Op.like]: `%${value}%`
                }
            }
        }

        //--

        //Busqueda
        const { count, rows: publications } = await Publication.findAndCountAll({
            where: {
                ...forTitle,
                privacy: allowedPrivacy,
                ...optionsType,
                ...sizeCondition
            },
            include: [
                { model: Category, as: 'category' },
                {
                    model: User, as: 'user', attributes: {
                        exclude: ['email', 'password', 'token', 'confirmed', 'google_id']
                    }
                },
                ...includes
            ],
            order: orderPriority,
            limit: +per_page,
            offset: (+page) * (+per_page)
        })
        //--

        return res.status(200).json({ status: '200 success', count, publications })
    } catch (error) {
        console.error(error)
        return res.status(500)
    }
}

export {
    search,
    searchPublications
}