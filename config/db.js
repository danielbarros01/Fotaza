import Sequelize from "sequelize"
import dotenv from 'dotenv'

dotenv.config({path: '.env'})

const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASSWORD ?? '', {
    host: process.env.BD_HOST,
    port: 3306,
    dialect: 'mysql',
    define: { 
        timestamps: false 
    },
    pool: {
        max: 4,
        min: 0,
        acquire: 30000, //segundos tratando de elaborar una conexion antes de marcar un error
        idle: 10000 //segundos si nadie utiliza da 10seg para que la conexion se finalice
    },
    operatorAliases: false
})

export default db