import db from '../config/db.js'
import { RightOfUse } from '../models/Index.js'

const getAll = async (req, res) => {
    try {
        const all = await RightOfUse.findAll()
        return res.status(200).json(all)
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return res.status(500).json({
            error: "Error del servidor",
            message: "Ocurrió un error al obtener los datos"
        });
    }
}

const getLicenses = async (req, res) => {
    try {
        //obtengo tipo
        const { type } = req.params
        let { typeSale } = req.query

        let queryOptions = {}

        //si es sale tipo de sale
        if (type == 'sale') {
            switch (typeSale) {
                case 'general':
                    queryOptions = { general_sale: 1 }
                    break;
                case 'unique':
                    queryOptions = { unique_sale: 1 }
                    break;
            }
        } else {
            queryOptions = { free: 1 }
        }

        const licenses = await RightOfUse.findAll({ where:  queryOptions  })

        return res.status(200).json(licenses)

    } catch (error) {
        console.error("Error al obtener los datos:", error)
        return res.status(500).json({
            error: "Error del servidor",
            message: "Ocurrió un error al obtener los datos"
        })
    }
}

export {
    getAll,
    getLicenses
}