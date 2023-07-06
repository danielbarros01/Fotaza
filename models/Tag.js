import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Tag = db.define('tags', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default Tag