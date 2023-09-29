import { Model } from 'sequelize'
import { check, validationResult } from 'express-validator'
import db from '../config/db.js'
import { User, Publication, Category } from '../models/Index.js'

//GET /users/:username
const getUser = async (req, res) => {
    let { user } = req
    const { username } = req.params

    try {
        //No encuentra al usuario del perfil
        const userProfile = await User.findOne({ where: { username } })
        if (!userProfile) {
            return res.status(404).render('404', { message: 'Uups, no encontramos al usuario' })
        }

        //traigo las publicaciones del usuario que sean publicas
        const publications = await Publication.findAll({
            where: {
                user_id: userProfile.id,
                privacy: 'public'
            },
            include: [
                { model: Category, as: 'category' }
            ]
        })

        console.log(publications.length)

        //----
        //si no estoy logueado, mostra los btns para login
        if (!user) {
            return res.render('users/myProfile', {
                viewBtnsAuth: true,
                userProfile,
                publications
            })
        }

        //si estoy logueado
        return res.render('users/myProfile', {
            csrfToken: req.csrfToken(),
            user,
            userProfile,
            publications
        })


    } catch (error) {
        console.log(error)
    }
}

//GET /users/account
const userAccount = async (req, res) => {
    const { user } = req

    return res.render('users/account', {
        csrfToken: req.csrfToken(),
        user
    })
}

//POST /users/account  --> Editar
const editAccount = async (req, res) => {
    // Validar el campo 'name' 'lastname' 'username'
    await Promise.all(validateNameAndLastName('name', 'nombre').map(validation => validation.run(req)));
    await Promise.all(validateNameAndLastName('lastname', 'apellido').map(validation => validation.run(req)));
    await Promise.all(validateUserName().map(validation => validation.run(req)));

    let resultadoValidaciones = validationResult(req)

    if (!resultadoValidaciones.isEmpty()) {
        return res.render('users/account', {
            errores: resultadoValidaciones.array(),
            user: req.user,
            csrfToken: req.csrfToken()
        })
    }

    const { name, lastname, username } = req.body
    const user = await User.findByPk(req.user.id)

    user.name = name
    user.lastname = lastname
    user.username = username

    //VERIFICAR IMAGEN, actualizar ruta
    if(req.file) user.image_url = req.file.filename

    await user.save()

    return res.render('users/account', {
        user,
        csrfToken: req.csrfToken(),
        save: true
    })

    //validar nombre y apellido
    function validateNameAndLastName(field, fieldName) {
        return [
            check(field)
                .notEmpty().withMessage(`Ingrese un ${fieldName}`)
                .isLength({ max: 45 }).withMessage(`El ${fieldName} debe tener un máximo de 45 caracteres`)
                .matches(/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]+$/).withMessage(`El ${fieldName} no debe contener números`)
                .custom((value) => {
                    // Reemplazar múltiples espacios por uno solo y comparar con el valor original
                    const cleanedValue = value.replace(/\s+/g, ' ');
                    return cleanedValue === value;
                }).withMessage(`No se permiten múltiples espacios consecutivos en ${fieldName}`)
        ];
    }

    //validar username
    function validateUserName() {
        return [
            check('username')
                .notEmpty().withMessage('Ingresa un nombre de usuario')
                .matches(/^@[A-Za-z0-9]+$/).withMessage('El nombre de usuario debe comenzar con @ y contener solo letras y números')
                .custom((value) => !/\s/.test(value)).withMessage('El nombre de usuario no debe contener espacios')
                .isLength({ max: 145 }).withMessage('El nombre de usuario debe tener un máximo de 145 caracteres')
        ]
    }
}

export {
    getUser,
    userAccount,
    editAccount
}