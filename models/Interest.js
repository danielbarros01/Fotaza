import { DataTypes } from 'sequelize'
import User from './User.js'
import Category from './Category.js'
import db from '../config/db.js'

const Interest = db.define('interests', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'user_id',
        references: {
            model: User,
            key: 'id',
        },
    },
    categoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'category_id',
        references: {
            model: Category,
            key: 'id',
        },
    },
}, { timestamps: false });

export default Interest