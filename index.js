import express from 'express';
import startRoutes from './routes/startRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import db from './config/db.js'

const app = express();

//conexion a base de datos
try {
    await db.authenticate()
    console.info("Conexion establecida con la base de datos")
} catch (error) {
    console.error(error)
}

//Habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true }))

//Routing
app.use('/', startRoutes)
app.use('/auth', usersRoutes)

//Carpeta publica
app.use(express.static('public'))

//habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('listening on port ' + port);
})