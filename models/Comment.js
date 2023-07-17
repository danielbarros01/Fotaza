import moment from 'moment/moment.js'
import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Comment = db.define('comments', {
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: {
                args: [4, 500],
                msg: 'El comentario debe tener como minimo 4 caracteres y como máximo 500'
            }
        }
    },
    timeThatPassed: {
        type: DataTypes.VIRTUAL,
        get() {
            const now = moment()
            const commentDate = moment(this.date)

            const years = now.diff(commentDate, 'years');
            commentDate.add(years, 'years');

            const months = now.diff(commentDate, 'months');
            commentDate.add(months, 'months');

            const days = now.diff(commentDate, 'days');
            commentDate.add(days, 'days');

            const hours = now.diff(commentDate, 'hours');
            commentDate.add(hours, 'hours');

            const minutes = now.diff(commentDate, 'minutes');
            commentDate.add(minutes, 'minutes');

            if (years > 0) {
                if (months > 0) {
                    return `Hace ${years} años y ${months} meses`
                }
                return `Hace ${years} años`
            }

            if (days > 0) {
                return `Hace ${days} dias`
            }

            if (hours > 0) {
                return `Hace ${hours} horas`
            }

            if (minutes > 0) {
                return `Hace ${minutes} minutos`
            }else{
                return `Recién`
            }
        }
    }
})

export default Comment