import { check, validationResult } from 'express-validator'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import generateJWT from '../helpers/generateJwt.js'
import User from '../models/User.js'
import { emailRegistro, emailRecoveryPassword } from '../helpers/sendEmail.js'

// auth/login
const formLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Sign In',
        imageUrl: "/img/backgrounds/fondo3.jpg",
        nameUserPhoto: "Set.sj",
        csrfToken: req.csrfToken()
    })
}

// POST auth/login
const authenticate = async (req, res) => {
    await check('email').isEmail().withMessage('Formato de email no valido').run(req)
    await check('password').notEmpty().withMessage('Ingresa la contraseña').run(req)
    let resultadoValidaciones = validationResult(req)

    if (!resultadoValidaciones.isEmpty()) {
        return res.render('auth/login', {
            pagina: 'Sign In',
            imageUrl: "/img/backgrounds/fondo3.jpg",
            nameUserPhoto: "Set.sj",
            errores: resultadoValidaciones.array(),
            user: { email: req.body.email },
            csrfToken: req.csrfToken()
        })
    }


    const { email, password } = req.body

    const user = await User.findOne({ where: { email: email } })
    if (!user) {
        return res.render('auth/login', {
            pagina: 'Sign In',
            imageUrl: "/img/backgrounds/fondo3.jpg",
            nameUserPhoto: "Set.sj",
            ocultarBtns: true,
            errUserLogin: "Parece que los datos no coinciden con un usuario registrado",
            user: { email: req.body.email },
            csrfToken: req.csrfToken()
        })
    }

    //Comprobar que esta confirmado el usuario
    if (!user.confirmed) {
        return res.render('auth/login', {
            pagina: 'Sign In',
            imageUrl: "/img/backgrounds/fondo3.jpg",
            nameUserPhoto: "Set.sj",
            ocultarBtns: true,
            errUserLogin: "Tienes que validar tu cuenta, revisa tu correo electronico",
            user: { email: req.body.email },
            csrfToken: req.csrfToken()
        })
    }

    //verificar el password
    if (!user.verificarPassword(password)) {
        return res.render('auth/login', {
            pagina: 'Sign In',
            imageUrl: "/img/backgrounds/fondo3.jpg",
            nameUserPhoto: "Set.sj",
            ocultarBtns: true,
            errores: [{ path: 'password', msg: "La contraseña es incorrecta" }],
            user: { email: req.body.email },
            csrfToken: req.csrfToken()
        })
    }

    //Autenticar con jwt
    const token = generateJWT(user.id)

    //Almacenar en cookie
    return res.cookie('_token', token, {
        httpOnly: true
    }).redirect('/')
}

// auth/google
const authGoogle = async (req, res) => {
    //Autenticar con jwt
    const token = generateJWT(req.user.id)

    //Almacenar en cookie
    return res.cookie('_token', token, {
        httpOnly: true
    }).redirect('/')
}

// auth/signup
const formRegister = (req, res) => {
    res.render('auth/register', {
        pagina: 'Sign Up',
        imageUrl: "/img/backgrounds/fondo4.jpg",
        nameUserPhoto: "Luise and Nic",
        csrfToken: req.csrfToken()
    })
}

// POST /auth/register
const register = async (req, res) => {
    const { name, lastname, email, password } = req.body

    const userExists = await User.findOne({ where: { email } })

    if (userExists) {
        return res.render('auth/register', {
            pagina: 'Sign Up',
            imageUrl: "/img/backgrounds/fondo4.jpg",
            nameUserPhoto: "Luise and Nic",
            errEmail: 'El usuario ya esta registrado',
            user: { name, lastname, email },
            csrfToken: req.csrfToken()
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
            user: { name, lastname, email },
            csrfToken: req.csrfToken()
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
            error: true
        })
    }

    user.token = null
    user.confirmed = true
    await user.save()

    //Autenticar con jwt
    const tokenJwt = generateJWT(user.id)

    //Almacenar en cookie
    return res.cookie('_token', tokenJwt, {
        httpOnly: true
    }).redirect('/categories/select')
}


// /auth/recover-password
const recoverPassword = (req, res) => {
    res.render('auth/recoverPassword', {
        pagina: 'Recovery Password',
        imageUrl: "/img/backgrounds/fondo5.jpg",
        nameUserPhoto: "masbebet christianto",
        csrfToken: req.csrfToken()
    })
}

// POST /auth/recover-password
const resetPassword = async (req, res) => {
    await check('email').isEmail().withMessage('Formato de email no valido').run(req)
    let resultadoValidaciones = validationResult(req)

    if (!resultadoValidaciones.isEmpty()) {
        return res.render('auth/recoverPassword', {
            pagina: 'Recovery Password',
            imageUrl: "/img/backgrounds/fondo5.jpg",
            nameUserPhoto: "masbebet christianto",
            errores: resultadoValidaciones.array(),
            csrfToken: req.csrfToken()
        })
    }

    const { email } = req.body
    const user = await User.findOne({ where: { email } })

    if (!user) {
        return res.render('auth/recoverPassword', {
            pagina: 'Recovery Password',
            imageUrl: "/img/backgrounds/fondo5.jpg",
            nameUserPhoto: "masbebet christianto",
            user: { email },
            errores: [{ msg: 'El email no pertenece a ningun usuario' }],
            csrfToken: req.csrfToken()
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
            error: true
        })
    }

    //Mostrar formulario para modificar el password
    res.render('auth/resetPassword', {
        pagina: "Reestablece tu contraseña",
        imageUrl: "/img/backgrounds/fondo4.jpg",
        nameUserPhoto: "Luise and Nic",
        csrfToken: req.csrfToken()
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
        error: false
    })
}

//POST /sign-off
const signOff = async (req, res) => {
    res.clearCookie('_token').status(200).redirect('/auth/login')
}

export {
    formLogin,
    authenticate,
    authGoogle,
    formRegister,
    register,
    confirmAccount,
    recoverPassword,
    resetPassword,
    comprobarToken,
    newPassword,
    signOff
}