import jwt from 'jsonwebtoken'
import { User } from '../models/Index.js'

const getUser = async (socket, next) => {
    try {


        // Acceder a la solicitud HTTP original desde el socket
        const { headers } = socket.handshake;

        // Obtener la cadena de cookies
        const cookiesString = headers.cookie;

        // Separar las cookies por ';' en un array
        const cookiesArray = cookiesString.split(';')

        // Encontrar la cookie que contiene '_token'
        const tokenCookie = cookiesArray.find(cookie => cookie.includes('_token'))

        //Cookie en clave y valor
        const [cookieKey, cookieValue] = tokenCookie.split('=')

        // Limpiar espacios en blanco alrededor del valor
        const token = cookieValue.trim()

        if (!token) {
            // Puedes emitir un evento o realizar alguna acción específica para manejar la falta de token
            return next(new Error('No se proporcionó un token'));
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.scope('withoutPassword').findByPk(decodedToken.id);

        if (user) {
            // Asignar el usuario al objeto socket para que esté disponible en la conexión
            socket.user = user;
        } else {
            return next(new Error('Usuario no encontrado'));
        }

        return next();

    } catch (error) {
        // Cualquier error o si ya expiró el token
        return next(new Error('Error al verificar el token'));
    }
};

export default getUser