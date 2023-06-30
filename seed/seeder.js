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


const deleteData = async () => {
    try {
        // Desactivar la restricción de clave externa temporalmente
        await Category.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

        await Promise.all([Category.destroy({ where: {}, truncate: true })])
        
        // Activar la restricción de clave externa
        await Category.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Datos eliminados correctamente')
        exit(0)
    } catch (error) {
        console.log(error)
        exit(1)
    }
}

//i importar
/* Lo que esta en package.json ("db:importar": "node ./seed/seeder.js -i) accedo de los argumentos la posicion 2 que es -i" */
if (process.argv[2] === "-i") {
    importData();
}


//i importar
/* Lo que esta en package.json ("db:importar": "node ./seed/seeder.js -i) accedo de los argumentos la posicion 2 que es -i" */
if (process.argv[2] === "-e") {
    deleteData();
}