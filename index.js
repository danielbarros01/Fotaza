import express from 'express'
import cookieParser from 'cookie-parser'
import csurf from 'csurf'

import passport from 'passport'
import "./Middlewares/google.js"

import { createServer } from 'node:http'

import { Server } from 'socket.io'

import homeRoutes from './routes/homeRoutes.js'
import authRoutes from './routes/authRoutes.js'
import publicationsRoutes from './routes/publicationsRoutes.js'
import interestsRoutes from './routes/interestsRoutes.js'
import ratingsRoutes from './routes/ratingsRoutes.js'
import commentsRoutes from './routes/commentsRoutes.js'
import usersRoutes from './routes/usersRoutes.js'
import categoriesRoutes from './routes/categoriesRoutes.js'
import rightOfUseRoutes from './routes/rightOfUseRoutes.js'
import searchRoutes from './routes/searchRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import transactionsRoutes from './routes/transactionsRoutes.js'

import db from './config/db.js'
import execSocket from './socket.js'
import conditionalCSRF from './Middlewares/conditionalCSRF.js'

const app = express()
const server = createServer(app)
const io = new Server(server);

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
app.use(conditionalCSRF)

// Configurar el middleware para analizar el cuerpo de la solicitud JSON
app.use(express.json())

// Inicializa Passport
app.use(passport.initialize());


//Routing
app.use('/', homeRoutes)
app.use('/publications', publicationsRoutes)
app.use('/auth', authRoutes)
app.use('/categories', interestsRoutes)
app.use('/categories', categoriesRoutes)
app.use('/rating', ratingsRoutes)
app.use('/comments', commentsRoutes)
app.use('/users', usersRoutes)
app.use('/licenses', rightOfUseRoutes)
app.use('/search', searchRoutes)
app.use('/chat', chatRoutes)
app.use('/payment', paymentRoutes)
app.use('/transactions', transactionsRoutes)

//Carpeta publica
app.use(express.static('public'))

//habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('listening on port ' + port);
})

execSocket()

export {
    io
}