import express from 'express'
import cookieParser from 'cookie-parser'
import csrf from 'csurf'
import bodyParser from 'body-parser'
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js'

//Crea la app
const app = express()

//Habilitar lectura de datos de formulario
app.use(bodyParser.urlencoded({ extended: false }))

//Habilitar CookieParser
app.use(cookieParser())

//Habilitar CSRF
app.use(csrf({ cookie: true }))

//Conexion a DB
try {
    await db.authenticate();
    db.sync()
    console.log('Conexion correcta a la DB')
} catch (error) {
    console.log(error)
}

//Habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')

// Carpeta publica
app.use(express.static('public'))


// Routing
// app.use('/auth', usuarioRoutes)
app.use('/', appRoutes)
app.use("/auth", usuarioRoutes);
app.use("/", propiedadesRoutes);
app.use('/api', apiRoutes)




//Define el puerto
const port = process.env.PORT || 3000;
//Inicia el servicor
app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto: ${port}`)
});