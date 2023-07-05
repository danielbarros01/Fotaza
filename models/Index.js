import User from './User.js'
import Category from './Category.js'
import Interest from './Interest.js'
import RightOfUse from './RightOfUse.js'
import Publication from './Publication.js'


// Definir la relación muchos a muchos entre Usuario y Categoria
User.belongsToMany(Category, { through: Interest });


//Definir relacion muchos a 1
User.hasMany(Publication, { foreignKey: 'user_id' })
Category.hasMany(Publication, { foreignKey: 'category_id' })
RightOfUse.hasMany(Publication, { foreignKey: 'rights_of_use_id'})

export {
    Interest,
    Category,
    User,
    RightOfUse,
    Publication
}