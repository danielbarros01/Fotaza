import jwt from 'jsonwebtoken'
import { User } from '../models/Index.js'

const protectRoute = async (req, res, next) => {
    //Verificar token
    const { _token: token } = req.cookies

    if (!token) {
        return res.redirect('/auth/login')
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await User.scope('withoutPassword').findByPk(decodedToken.id)

        //Almacenar el usuario al Req, al almacenarlo va estar disponible en diferentes rutas
        if(user){
            req.user = user
        }else{
            return res.redirect('/auth/login')
        }

        return next()

    } catch (error) {
        //Cualquier error o si ya expiro el token
        return res.clearCookie('_token').redirect('auth/login')
    }
}

export default protectRoute