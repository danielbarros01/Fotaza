import User from './User.js'
import Category from './Category.js'
import Interest from './Interest.js'


// Definir la relación muchos a muchos entre Usuario y Categoria
User.belongsToMany(Category, { through: Interest });

export { 
    Interest,
    Category,
    User
}