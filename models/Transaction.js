import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Transaction = db.define('transactions', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    typeSale: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'type_sale'
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: true
    },
})

export default Transaction