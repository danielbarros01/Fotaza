import { DataTypes } from 'sequelize'
import User from './User.js'
import db from '../config/db.js'

const Publication = db.define('publications', {
    image: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'date_and_time'
    },
    format: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resolution: {
        type: DataTypes.STRING,
        allowNull: true
    },
    privacy: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    typeSale: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'type_sale'
    },
    price: {
        type: DataTypes.STRING,
        allowNull: true
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: true
    }
})


export default Publication