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

export {
    getAll
}