import { exit } from 'node:process'
import db from '../config/db.js'
import Category from '../models/Category.js'
import categories from "./categories.js";


const importData = async () => {
    try {
        //Autenticar en la bd
        await db.authenticate()

        //Generar las columnas
        //await db.sync()

        //Insertamos los datos
        await Promise.all([Category.bulkCreate(categories)])

        console.log('Datos importados correctamente')
        exit(0)
    } catch (error) {
        console.log(error)
        exit(1)
    }
}


export {
    importData
}