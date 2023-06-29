import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
    //transport se autentica en mailtrap y accede a sus servicios 
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const { name, lastname, email, token } = datos

    //Enviar el email
    await transport.sendMail({
        from: 'Fotaza.com',
        to: email,
        subject: 'Confirma tu cuenta en Fotaza',
        text: 'Hola!, debes confirmar tu cuenta en Fotaza.com',
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; font-size: 24px; font-weight: bold; margin-bottom: 20px;">¡Hola ${name} ${lastname}!</h2>
            <p style="color: #333; font-size: 16px;">Gracias por registrarte en Fotaza.com.</p>
            <p style="color: #333; font-size: 16px;">Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace:</p>
            <p style="text-align: center;">
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}"
                style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; font-size: 16px; padding: 10px 20px; border-radius: 4px; margin-top: 10px;">
                Confirmar Cuenta
            </a>
            </p>
            <p style="color: #333; font-size: 16px;">Si no creaste esta cuenta, por favor ignora este mensaje.</p>
        </div>
        `
    })
}


const emailRecoveryPassword = async (datos) => {
    //transport se autentica en mailtrap y accede a sus servicios 
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const { name, lastname, email, token } = datos

    //Enviar el email
    await transport.sendMail({
        from: 'Fotaza.com',
        to: email,
        subject: 'Restablece tu contraseña de Fotaza',
        text: 'Hola!, Restablece tu contraseña de tu cuenta en Fotaza.com',
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; font-size: 24px; font-weight: bold; margin-bottom: 20px;">¡Hola ${name} ${lastname}!</h2>
            <p style="color: #333; font-size: 16px;">Hemos recibido una solicitud para restablecer tu contraseña en Fotaza.com.</p>
            <p style="color: #333; font-size: 16px;">Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <p style="text-align: center;">
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/recover-password/${token}"
                style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; font-size: 16px; padding: 10px 20px; border-radius: 4px; margin-top: 10px;">
                Restablecer Contraseña
            </a>
            </p>
            <p style="color: #333; font-size: 16px;">Si no solicitaste un restablecimiento de contraseña, puedes ignorar este mensaje.</p>
        </div>
        `
    })
}


export {
    emailRegistro,
    emailRecoveryPassword
}