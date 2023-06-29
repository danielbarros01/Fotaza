import { check, validationResult } from 'express-validator'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import { emailRegistro, emailRecoveryPassword } from '../helpers/sendEmail.js'

// auth/login
const formLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Sign In',
        imageUrl: "/img/backgrounds/fondo3.jpg",
        nameUserPhoto: "Set.sj",
        ocultarBtns: true
    })
}

// auth/signup
const formRegister = (req, res) => {
    res.render('auth/register', {
        pagina: 'Sign Up',
        imageUrl: "/img/backgrounds/fondo4.jpg",
        nameUserPhoto: "Luise and Nic",
        ocultarBtns: true
    })
}

// POST /auth/register
const register = async (req, res) => {
    const { name, lastname, email, password } = req.body

    const userExists = await User.findOne({ where: { email } })

    if (userExists) {
        res.render('auth/register', {
            pagina: 'Sign Up',
            imageUrl: "/img/backgrounds/fondo4.jpg",
            nameUserPhoto: "Luise and Nic",
            ocultarBtns: true,
            errEmail: 'El usuario ya esta registrado',
            user: { name, lastname, email }
        })
    }

    //validaciones
    await check('name').notEmpty().withMessage('El nombre no debe ir vacio').run(req)
    await check('lastname').notEmpty().withMessage('El apellido no debe ir vacio').run(req)
    await check('email').isEmail().withMessage('Formato de email no valido').run(req)
    await check('password').isLength({ min: 6 }).withMessage('Contraseña minima de 6 caracteres').run(req)
    let resultadoValidaciones = validationResult(req)

    //verificar que resultadoValidaciones este vacio
    if (!resultadoValidaciones.isEmpty()) {
        //Errores
        return res.render('auth/register', {
            pagina: 'Sign Up',
            imageUrl: "/img/backgrounds/fondo4.jpg",
            nameUserPhoto: "Luise and Nic",
            ocultarBtns: true,
            errores: resultadoValidaciones.array(), //convertimos el resultado a un array
            user: { name, lastname, email }
        })
    }

    //Guardar usuario
    const user = await User.create({
        name, lastname, email, password, token: uuidv4(), username: `@${email.toLowerCase().split('@')[0] + uuidv4().slice(0, 8)}`
    })

    //Enviar email de confirmacion
    emailRegistro({
        name: user.name, lastname: user.lastname, email: user.email, token: user.token
    })

    res.render('templates/sendEmail', {
        pagina: "Cuenta creada correctamente",
        mensajePagina: "Gracias por Registrarte en "
    })
}

// /auth/confirm/:token
const confirmAccount = async (req, res) => {
    const { token } = req.params

    //Verificar si el token es valido
    const user = await User.findOne({ where: { token: token } })

    //No se encontro el usuario, el token no era valido
    if (!user) {
        return res.render('auth/confirmAccount', {
            pagina: "Error al confirmar tu cuenta",
            mensaje: "Hubo un error al confirmar tu cuenta",
            imagen: "/img/project/error.svg",
            ocultarBtns: true,
            error: true
        })
    }

    user.token = null
    user.confirmed = true
    await user.save()

    return res.render('auth/confirmAccount', {
        pagina: "Cuenta confirmada",
        mensaje: "La cuenta se confirmo correctamente",
        imagen: "/img/project/success.svg",
        ocultarBtns: true,
    })
}


// /auth/forgot-password
const recoverPassword = (req, res) => {
    res.render('auth/recoverPassword', {
        pagina: 'Recovery Password',
        imageUrl: "/img/backgrounds/fondo5.jpg",
        nameUserPhoto: "masbebet christianto",
        ocultarBtns: true
    })
}
// POST /auth/forgot-password
const resetPassword = async (req, res) => {
    await check('email').isEmail().withMessage('Formato de email no valido').run(req)
    let resultadoValidaciones = validationResult(req)

    if (!resultadoValidaciones.isEmpty()) {
        return res.render('auth/recoverPassword', {
            pagina: 'Recovery Password',
            imageUrl: "/img/backgrounds/fondo5.jpg",
            nameUserPhoto: "masbebet christianto",
            ocultarBtns: true,
            errores: resultadoValidaciones.array()
        })
    }

    const { email } = req.body
    const user = await User.findOne({ where: { email } })

    if (!user) {
        return res.render('auth/recoverPassword', {
            pagina: 'Recovery Password',
            imageUrl: "/img/backgrounds/fondo5.jpg",
            nameUserPhoto: "masbebet christianto",
            ocultarBtns: true,
            user: { email },
            errores: [{ msg: 'El email no pertenece a ningun usuario' }]
        })
    }

    user.token = uuidv4()
    await user.save()

    //Enviar email de confirmacion
    emailRecoveryPassword({
        name: user.name, lastname: user.lastname, email: user.email, token: user.token
    })

    //Renderizar mensaje
    res.render('templates/sendEmail', {
        pagina: "Recovery Password",
        mensajePagina: "Recupera tu contraseña en "
    })
}

// /recover-password/:token
const comprobarToken = async (req, res) => {
    const { token } = req.params

    const user = await User.findOne({ where: { token } })

    if (!user) {
        return res.render('auth/confirmAccount', {
            pagina: "Reestablece tu contraseña",
            mensaje: "Hubo un error al validar tu informacion",
            imagen: "/img/project/error.svg",
            ocultarBtns: true,
            error: true
        })
    }

    //Mostrar formulario para modificar el password
    res.render('auth/resetPassword', {
        pagina: "Reestablece tu contraseña",
        imageUrl: "/img/backgrounds/fondo4.jpg",
        nameUserPhoto: "Luise and Nic",
        ocultarBtns: true
    })
}


// POST /recover-password/:token
const newPassword = async (req, res) => {
    await check('password').isLength({ min: 6 }).withMessage('Contraseña minima de 6 caracteres').run(req)
    await check('confirmPassword').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req);
    let resultadoValidaciones = validationResult(req)

    if (!resultadoValidaciones.isEmpty()) {
        return res.render('auth/resetPassword', {
            pagina: "Reestablece tu contraseña",
            imageUrl: "/img/backgrounds/fondo4.jpg",
            nameUserPhoto: "Luise and Nic",
            ocultarBtns: true,
            errores: resultadoValidaciones.array()
        })
    }

    const { token } = req.params
    const { password } = req.body

    //verificar quien hace el cambio
    const user = await User.findOne({ where: { token } })

    //Hashear el nuevo password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    user.token = null

    await user.save()

    res.render('auth/confirmAccount', {
        pagina: 'Contraseña reestablecida',
        mensaje: 'El Password se guardo correctamente',
        imagen: "/img/project/success.svg",
        ocultarBtns: true,
        error: false
    })
}

export {
    formLogin,
    formRegister,
    register,
    confirmAccount,
    recoverPassword,
    resetPassword,
    comprobarToken,
    newPassword
}