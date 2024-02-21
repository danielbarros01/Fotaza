import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import db from '../config/db.js'
import User from './User.js'

const UserPayment = db.define('usersPaymentInformation', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'user_id',
        references: {
            model: User,
            key: 'id'
        }
    },
    accessToken: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'access_token_mp'
    },
}, {
    hooks: {
        beforeCreate: async function (userPayment) {
            const salt = await bcrypt.genSalt(12)
            userPayment.accessToken = await bcrypt.hash(userPayment.accessToken, salt)
        },
        beforeUpdate: async function (userPayment) {
            // Asegúrate de verificar si el accessToken ha cambiado antes de volver a aplicar la encriptación
            if (userPayment.changed('accessToken')) {
                const salt = await bcrypt.genSalt(12);
                userPayment.accessToken = await bcrypt.hash(userPayment.accessToken, salt);
            }
        },
    },
    tableName: 'users_payment_information',
})

UserPayment.prototype.verificarAccessToken = function (accessToken) {
    return bcrypt.compareSync(accessToken, this.accessToken)
}

export default UserPayment