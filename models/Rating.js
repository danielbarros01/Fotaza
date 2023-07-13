import { DataTypes } from 'sequelize'
import db from '../config/db.js'
import User from './User.js'
import Publication from './Publication.js'

const Rating = db.define('ratings', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'user_id',
        references: {
            model: User,
            key: 'id'
        }
    },
    publicationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'publication_id',
        references: {
            model: Publication,
            key: 'id'
        }
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    }
})

export default Rating