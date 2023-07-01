import { Op } from 'sequelize';
import Category from '../models/Category.js'
import Interest from '../models/Interest.js'
import User from '../models/User.js'


const selectCategories = async (req, res) => {
    //Utilizar la opción raw: true en las consultas de Sequelize cuando solo necesites los datos sin instancias de modelos completas:
    //obtener las categorias
    const categories = await Category.findAll({ raw: true })

    const { id: userId } = req.user;
    const categoriesUser = await Interest.findAll({
        where: { userId },
        raw: true
    })

    if (!categoriesUser) { //Si el usuario no tiene intereses seleccionados
        return res.render('categories/viewAllCategories', {
            categories: categories,
            csrfToken: req.csrfToken()
        })
    }

    const categoriesUserIds = categoriesUser.map(interest => interest.categoryId)

    res.render('categories/viewAllCategories', {
        categories: categories,
        csrfToken: req.csrfToken(),
        categoriesUserIds
    })
}

const saveInterests = async (req, res) => {
    const { categoriesSelected } = req.body //obtener los ids
    const { id: userId } = req.user //obtener el usuario

    try {
        const categories = await Category.findAll({
            where: { id: categoriesSelected },
        });

        
        if (categories.length !== categoriesSelected.length) { // Verificar si todas las categorías existen
            console.error('Categorias error, no se encuentran todas las categorias');

            const allCategories = await Category.findAll();

            return res.render('categories/viewAllCategories', {
                categories: allCategories,
                csrfToken: req.csrfToken(),
                error: 'Alguna categoria que seleccionaste no existe, por favor elige entre las que tenemos',
            });
        }

    //Guardar los intereses que no tenga
        const intereses = categories.map((category) => ({
            userId,
            categoryId: category.id,
        }));

        // Crear los intereses que no tenga en una sola operación
        await Interest.bulkCreate(intereses, { ignoreDuplicates: true });

        //Eliminar los que tenga en la bd pero no vengan en el array
        await Interest.destroy({ where: { userId, categoryId: { [Op.notIn]: categoriesSelected } } })

        res.json({ success: true })
    } catch (error) {
        console.error(error)
    }
}

export {
    selectCategories,
    saveInterests
}