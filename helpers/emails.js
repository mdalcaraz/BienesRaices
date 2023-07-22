import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });
    const { email, nombre, token } = datos

    //Envio del mail
    await transport.sendMail({
        from: 'bienesraices@malcaraz.tech',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaices.com',
        text: 'Confirma tu cuenta en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, comprueba tu cuenta en bienesRaices.com</p>

            <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:
            <a href="https://bienesraices.malcaraz.tech/auth/confirmar/${token}">Confirmar Cuenta</a></p>

            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })

}

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });
    const { email, nombre, token } = datos

    //Envio del mail
    await transport.sendMail({
        from: 'bienesraices@malcaraz.tech',
        to: email,
        subject: 'Recupera tu acceso a BienesRaices',
        text: 'Recupera tu acceso a BienesRaices',
        html: `
            <p>Hola ${nombre}! Has solicitado restablecer tu contraseña en BienesRaices.com</p>

            <p>Abre el siguiente enlace para generar una nueva contraseña
            <a href="https://bienesraices.malcaraz.tech/auth/olvide-password/${token}">Resetear Contraseña</a></p>

            <p>Si tu no hiciste esta petición, puedes ignorar el mensaje</p>
        `
    })

}


export {
    emailRegistro,
    emailOlvidePassword
}