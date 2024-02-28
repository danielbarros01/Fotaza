import User from './User.js'
import Category from './Category.js'
import Interest from './Interest.js'
import RightOfUse from './RightOfUse.js'
import Publication from './Publication.js'
import Rating from './Rating.js'
import Tag from './Tag.js'
import Comment from './Comment.js'
import PublicationHasTag from './PublicationHasTag.js'
import Conversation from './Conversation.js'
import Message from './Message.js'
import UserPayment from './UserPayment.js'
import Transaction from './Transaction.js'

// Definir la relación muchos a muchos entre Usuario y Categoria
User.belongsToMany(Category, { through: Interest });


//Definir relacion muchos a 1
User.hasMany(Publication, { foreignKey: 'user_id' })
Category.hasMany(Publication, { foreignKey: 'category_id' })
RightOfUse.hasMany(Publication, { foreignKey: 'rights_of_use_id' })

// Definir la relación muchos a muchos entre Publicacion y Tag
Publication.belongsToMany(Tag, { through: PublicationHasTag });

Publication.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Definir la relación de rating
Publication.belongsToMany(User, { through: Rating })

//Para consultar desde rating
Rating.belongsTo(Publication);

// Definir las relaciones de comment
User.hasMany(Comment, { foreignKey: 'user_id' })
//Para poder utilizar usuario en comentario
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' })
Publication.hasMany(Comment, { foreignKey: 'publication_id' })


/* Publication.belongsToMany(User, { through: Comment})
Comment.belongsTo(User, {foreignKey: 'user_id'}) */

/* Interes tiene una categoria */
Interest.belongsTo(Category, { foreignKey: 'category_id', as: 'category' })

/* Publicacion tiene un usuario */
Publication.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

/* Publicacion tiene una licencia */
Publication.belongsTo(RightOfUse, { foreignKey: 'rights_of_use_id', as: 'license' })


/* Chat */
User.associate(Conversation);
Conversation.associate(User);

Conversation.hasMany(Message, {
    foreignKey: 'conversation_id',
    as: 'messages',
    onDelete: 'CASCADE'
});

Message.belongsTo(Conversation, {
    foreignKey: 'conversation_id',
    as: 'conversation',
});

User.hasMany(Message, {
    foreignKey: 'user_id',
    as: 'messages'
})

Message.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
});

Message.belongsTo(Transaction, {
    foreignKey: 'transaction_id',
    as: 'transaction'
})
/* -- */

/* Pagos */
UserPayment.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

User.hasOne(UserPayment, {
    foreignKey: 'user_id',
    as: 'userPayment'
})

/* Transactions */
User.hasMany(Transaction, {
    foreignKey: 'user_id',
    as: 'transaction'
});

Transaction.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

Publication.hasMany(Transaction, {
    foreignKey: 'publication_id',
    as: 'transaction'
});

Transaction.belongsTo(Publication, {
    foreignKey: 'publication_id',
    as: 'publication'
});

export {
    Interest,
    Category,
    User,
    RightOfUse,
    Publication,
    Tag,
    PublicationHasTag,
    Rating,
    Comment,
    Conversation,
    Message,
    UserPayment,
    Transaction
}