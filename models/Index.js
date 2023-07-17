import User from './User.js'
import Category from './Category.js'
import Interest from './Interest.js'
import RightOfUse from './RightOfUse.js'
import Publication from './Publication.js'
import Rating from './Rating.js'
import Tag from './Tag.js'
import Comment from './Comment.js'
import PublicationHasTag from './PublicationHasTag.js'


// Definir la relación muchos a muchos entre Usuario y Categoria
User.belongsToMany(Category, { through: Interest });


//Definir relacion muchos a 1
User.hasMany(Publication, { foreignKey: 'user_id' })
Category.hasMany(Publication, { foreignKey: 'category_id' })
RightOfUse.hasMany(Publication, { foreignKey: 'rights_of_use_id'})

// Definir la relación muchos a muchos entre Publicacion y Tag
Publication.belongsToMany(Tag, { through: PublicationHasTag });

// Definir la relación de rating
Publication.belongsToMany(User, { through: Rating})

// Definir las relaciones de comment
User.hasMany(Comment, {foreignKey:'user_id'})
//Para poder utilizar usuario en comentario
Comment.belongsTo(User, {foreignKey: 'user_id', as: 'user'})
Publication.hasMany(Comment, {foreignKey:'publication_id'})


/* Publication.belongsToMany(User, { through: Comment})
Comment.belongsTo(User, {foreignKey: 'user_id'}) */

export {
    Interest,
    Category,
    User,
    RightOfUse,
    Publication,
    Tag,
    PublicationHasTag,
    Rating,
    Comment
}