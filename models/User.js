import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import db from '../config/db.js'


const User = db.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    token: DataTypes.STRING,
    confirmed: DataTypes.BOOLEAN
}, {
    hooks: {
        //hashear contraseña
        //usuario es en realidad req.body
        //se ejecuta antes de crear el usuario, despues ya no, a la hora de actualizar la contraseña hay que usar otra forma
        beforeCreate: async function (user) {
            const salt = await bcrypt.genSalt(10) //generar salt con 10 rondas
            user.password = await bcrypt.hash(user.password, salt)
        }
    }
})

/*this es la instancia de la base de datos, por eso utilizamos function en vez de funcion flecha*/
User.prototype.verificarPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

export default User