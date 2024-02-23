import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import db from '../config/db.js'
import User from './User.js'

let algorithm = 'aes256';

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
            const accessToken = userPayment.accessToken
            const cipher = crypto.createCipher(algorithm, process.env.JWT_SECRET_KEY);
            const encrypted = cipher.update(accessToken, 'utf8', 'hex') + cipher.final('hex'); //Texto encriptado

            userPayment.accessToken = encrypted
        },
        beforeUpdate: async function (userPayment) {
            // Asegúrate de verificar si el accessToken ha cambiado antes de volver a aplicar la encriptación
            if (userPayment.changed('accessToken')) {
                const accessToken = userPayment.accessToken
                const cipher = crypto.createCipher(algorithm, process.env.JWT_SECRET_KEY);
                const encrypted = cipher.update(accessToken, 'utf8', 'hex') + cipher.final('hex'); //Texto encriptado

                userPayment.accessToken = encrypted
            }
        },
    },
    tableName: 'users_payment_information',
})

UserPayment.prototype.verificarAccessToken = function () {
    const user = this
    const decipher = crypto.createDecipher(algorithm, process.env.JWT_SECRET_KEY);
    const decrypted = decipher.update(user.accessToken, 'hex', 'utf8') + decipher.final('utf8'); //Texto desencriptado

    return decrypted;
}

export default UserPayment