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
    }
})


export default RightOfUse