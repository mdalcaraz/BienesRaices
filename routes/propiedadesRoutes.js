import express from 'express'
import { body } from 'express-validator'
import protegerRuta from '../middleware/protegerRutas.js'
import identificarUsuario from '../middleware/identificarUsuario.js'
import { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminar, cambiarEstado, mostrarPropiedad, enviarMensaje, verMensajes } from '../controllers/propiedadController.js'
import upload from '../middleware/subirImagen.js'

const router = express.Router()

router.get('/mis-propiedades', protegerRuta, admin)
router.get('/propiedades/crear', protegerRuta, crear)
router.post('/propiedades/crear', protegerRuta,
    body('titulo').notEmpty().withMessage('El titulo no puede estar vacio'),
    body('descripcion')
        .notEmpty().withMessage('La descripcion no puede estar vacia')
        .isLength({ max: 200 }).withMessage('La descripcion es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una categoría'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precios'),
    body('habitaciones').isNumeric().withMessage('Selecciona numero de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona numero de estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de WC'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),

    guardar
)

router.get('/propiedades/agregar-imagen/:id', protegerRuta, agregarImagen)

router.post('/propiedades/agregar-imagen/:id',
    protegerRuta,
    upload.single('imagen'),
    almacenarImagen
)

router.get('/propiedades/editar/:id',
    protegerRuta,
    editar
)
router.post('/propiedades/editar/:id', protegerRuta,
    body('titulo').notEmpty().withMessage('El titulo no puede estar vacio'),
    body('descripcion')
        .notEmpty().withMessage('La descripcion no puede estar vacia')
        .isLength({ max: 200 }).withMessage('La descripcion es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una categoría'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precios'),
    body('habitaciones').isNumeric().withMessage('Selecciona numero de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona numero de estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de WC'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),

    guardarCambios
)

router.post('/propiedades/eliminar/:id',
    protegerRuta,
    eliminar
)

router.put('/propiedades/:id',
    protegerRuta,
    cambiarEstado
)

// Area publica

router.get('/propiedad/:id',
    identificarUsuario,
    mostrarPropiedad
)

//Almacenar los mensajes
router.post('/propiedad/:id',
    identificarUsuario,
    body("mensaje").isLength({ min: 20 }).withMessage('El mensaje no puede ir vacio o es muy corto'),
    enviarMensaje
)

router.get('/mensajes/:id',
    protegerRuta,
    verMensajes
)

export default router