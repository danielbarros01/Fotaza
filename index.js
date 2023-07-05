import express from 'express'
import cookieParser from 'cookie-parser'
import csurf from 'csurf'
import homeRoutes from './routes/homeRoutes.js'
import usersRoutes from './routes/usersRoutes.js'
import publicationsRoutes from './routes/publicationsRoutes.js'
import interestsRoutes from './routes/interestsRoutes.js'
import db from './config/db.js'

const app = express()

//conexion a base de datos
try {
    await db.authenticate()
    console.info("Conexion establecida con la base de datos")
} catch (error) {
    console.error(error)
}

//Habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true }))

//Habilitar cookieParser
app.use(cookieParser())

//Habilitar CSURF(Cross-Site Request Forgery)
app.use(csurf({ cookie: true }))

// Configurar el middleware para analizar el cuerpo de la solicitud JSON
app.use(express.json());

//Routing
app.use('/', homeRoutes)
app.use('/publications', publicationsRoutes)
app.use('/auth', usersRoutes)
app.use('/categories', interestsRoutes)

//Carpeta publica
app.use(express.static('public'))

//habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('listening on port ' + port);
})