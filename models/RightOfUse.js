import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const RightOfUse = db.define('rights_of_uses', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    free: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    general_sale: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    unique_sale: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
})


export default RightOfUse