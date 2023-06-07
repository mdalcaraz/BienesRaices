import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import Usuario from '../models/Usuario.js'
import { generarJWT, generarId } from '../helpers/tokens.js'
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesion',
        csrfToken: req.csrfToken()
    })
}

const autenticar = async (req, res) => {
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)
    await check('password').notEmpty().withMessage('La contraseña es obligatoria').run(req)
    let resultado = validationResult(req)

    //verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                email: req.body.email,
            }
        })
    }

    const { email, password } = req.body

    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({ where: { email } })
    if (!usuario) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario no Existe' }],
        })
    }

    // confirmar si el usuario esta confirmado
    if (!usuario.confirmado) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario no esta activado' }],
        })
    }


    //Revisar el Password

    if (!usuario.verificarPassword(password)) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesion',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'La contraseña es incorrecta' }],
            usuario: {
                email: req.body.email,
            }
        })
    }

    //Autenticar al usuario
    const token = generarJWT( {id: usuario.id, nombre:usuario.nombre })

    //Almacenar en un cookie
    
    return res.cookie('_token', token, {
        httpOnly: true,
        // expires: 9000,
        //secure: true,
        //sameSite: true,
    } ).redirect('/mis-propiedades')
}

const cerrrarSesion = (req,res) => {
    return res.clearCookie('_token').status(200).redirect('/')
}

const formularioRegistro = (req, res) => {

    res.render('auth/registro', {
        pagina: 'Crear cuenta',
        csrfToken: req.csrfToken()
    })
}

const registrar = async (req, res) => {
    //Reglas de Validacion
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req)
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)
    await check('password').isLength({ min: 6 }).withMessage('El pw debe ser de al menos 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password ?? '').withMessage('Los PW no son iguales').run(req)

    let resultado = validationResult(req)


    //verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }

    const { nombre, email, password } = req.body

    //verificar usuario duplicado
    const existeUsuario = await Usuario.findOne({ where: { email } })
    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario ya esta registrado' }],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }

    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    //envia email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    // Mostar mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un mail de activación a tu correo'
    })

}
// Funcion que verifica cuenta
const confirmar = async (req, res) => {
    const { token } = req.params

    const usuario = await Usuario.findOne({ where: { token } })

    if (!usuario) {
        return res.render("auth/confirmar-cuenta", {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, por favor intenta mas tarde',
            error: true
        })
    }

    usuario.token = null
    usuario.confirmado = true
    await usuario.save();

    res.render("auth/confirmar-cuenta", {
        pagina: 'Cuenta confirmada!',
        mensaje: 'La cuenta se confirmo correctamente'
    })

}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recuperar acceso',
        csrfToken: req.csrfToken()
    })
}

const resetPassword = async (req, res) => {

    await check('email').isEmail().withMessage('Eso no parece un email').run(req)

    let resultado = validationResult(req)

    //verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render('auth/olvide-password', {
            pagina: 'Recuperar acceso',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    //Buscar si existe el email
    const { email } = req.body

    const usuario = await Usuario.findOne({ where: { email } })

    if (!usuario) {
        return res.render('auth/olvide-password', {
            pagina: 'Recuperar acceso',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El Email no pertenece a ningun usuario' }]
        })
    }
    usuario.token = generarId();
    await usuario.save();

    //Enviar mail
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    // Mostar mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: 'Restablecer tu contraseña',
        mensaje: 'Hemos enviado un email con las instrucciones'
    })
}

const comprobarToken = async (req, res) => {

    const { token } = req.params


    const usuario = await Usuario.findOne({ where: { token } })

    if (!usuario) {
        return res.render("auth/confirmar-cuenta", {
            pagina: 'Error al restablecer tu contraseña',
            mensaje: 'Hubo un error al procesar tus datos',
            error: true
        })
    }

    res.render("auth/reset-password", {
        pagina: 'Restablece tu password',
        csrfToken: req.csrfToken()
    })
}

const nuevoPassword = async (req, res) => {
    // console.log("Guardando password")
    await check('password').isLength({ min: 6 }).withMessage('El pw debe ser de al menos 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password ?? '').withMessage('Los PW no son iguales').run(req)

    let resultado = validationResult(req)


    //verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        return res.render("auth/reset-password", {
            pagina: 'Restablece tu password',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }

    const { token } = req.params
    const { password } = req.body

    const usuario = await Usuario.findOne({ where: { token } })

    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt)
    usuario.token = ''

    await usuario.save()

    res.render("auth/confirmar-cuenta", {
        pagina: 'Contraseña cambiada',
        mensaje: 'La contraseña ha sido modificada con exito'
    })

}

export {
    formularioLogin,
    autenticar,
    cerrrarSesion,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword

}