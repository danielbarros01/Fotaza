import { DataTypes } from "sequelize"
import db from "../config/db.js"

const Message = db.define('messages', {
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    /* Para saber si es un mensaje con estilo predeterminado que puede usar el cliente */
    purchase: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    read: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
})

export default Message