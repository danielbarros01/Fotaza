import { DataTypes } from "sequelize"
import db from "../config/db.js"

const Conversation = db.define('conversations', {
    visibleUser1: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'visible_user_1'
    },
    visibleUser2: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'visible_user_2'
    },
})

Conversation.associate = (user) => {
    Conversation.belongsTo(user, {
        foreignKey: {
            name: 'userId1',
            field: 'user_id_1'
        },
        as: 'user1'
    });
    Conversation.belongsTo(user, {
        foreignKey: {
            name: 'userId2',
            field: 'user_id_2'
        },
        as: 'user2'
    });
};

export default Conversation