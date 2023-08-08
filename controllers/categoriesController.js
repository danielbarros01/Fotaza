import { Category } from '../models/Index.js'

const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({ raw: true })

        return res.status(200).json(categories)
    } catch (error) {
        console.error(`Hubo un error al obtener las categorias: ${error.message}`)
        return res.status(500).json({ message: 'Hubo un error al obtener las categorias' })
    }

}


export {
    getCategories
}