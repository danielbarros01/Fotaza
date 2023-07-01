import Category from '../models/Category.js'
import Interest from '../models/Interest.js'


const selectCategories = async (req, res) => {
    //obtener las categorias
    const categories = await Category.findAll()

    res.render('categories/viewAllCategories', {
        categories: categories,
        csrfToken: req.csrfToken()
    })
}

const saveInterests = async (req, res) => {
    //obtener los ids
    const { categoriesSelected } = req.body

    //obtener el usuario
    const { id: userId } = req.user

    try {
        //iterar por cada id
        for (const categoryId of categoriesSelected) {
            //validar que las categorias existen
            const category = await Category.findByPk(categoryId)

            //Si no existe la categoria
            if (!category) {
                //obtener las categorias
                const categories = await Category.findAll()
                console.error(`Categorias error, no se encuentra una categoria con id: ${categoryId}`)

                //Volver a cargar la pagina
                return res.render('categories/viewAllCategories', {
                    categories: categories,
                    csrfToken: req.csrfToken(),
                    error: 'Alguna categoria que seleccionaste no existe, por favor elige entre las que tenemos'
                })
            }

            await Interest.create({ userId, categoryId })
        };

        res.json({ success: true })
    } catch (error) {
        console.error(error)
    }

    //validar que los ids de las categorias existan en la base de datos


    //obtenemos las categorias y las vinculamos con el usuario
    console.log(categoriesSelected)
    console.log("POSTS")
}

export {
    selectCategories,
    saveInterests
}