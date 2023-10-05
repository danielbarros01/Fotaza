import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { check, validationResult } from 'express-validator'
import { User, Publication, Category } from '../models/Index.js'

// Obtener la ruta del directorio actual del módulo
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Directorio de las imágenes
const imgDirectory = path.join(__dirname, '..', 'public', 'img', 'covers');
// Lee los nombres de los archivos en el directorio de imágenes
const imageNames = fs.readdirSync(imgDirectory);


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

    try {
        return res.render('users/account', {
            csrfToken: req.csrfToken(),
            user,
            covers: imageNames
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send('Error interno del servidor');
    }
}

//POST /users/account  --> Editar
const editAccount = async (req, res) => {
    const { name, lastname, username, 'cover-radio': cover } = req.body
    const user = await User.findByPk(req.user.id)

    // Validar el campo 'name' 'lastname' 'username'
    await Promise.all(validateNameAndLastName('name', 'nombre').map(validation => validation.run(req)));
    await Promise.all(validateNameAndLastName('lastname', 'apellido').map(validation => validation.run(req)));
    await Promise.all(validateUserName().map(validation => validation.run(req)));

    let resultadoValidaciones = validationResult(req)

    //VERIFICAR IMAGEN, actualizar ruta
    if (req.file) {

        if (!req.file.mimetype.match(/^image\/(png|jpg|jpeg)$/)) {
            //Agregar a los errores resultadoValidaciones
            const error = {
                msg: 'Debe ingresar una imagen de tipo "png" o "jpg/jpeg"',
                path: 'avatar'
            }

            resultadoValidaciones.errors.push(error)
        }

        user.image_url = req.file.filename
    }

    //si username se cambio se cambia el nombre del avatar
    if (user.username != username) {
        let verifyAvatar = true
        //Verificar que no exista el username que el usuario quiere
        const usernameExist = await User.findOne({ where: { username: username } })

        if (usernameExist) {
            const error = {
                msg: `El nombre de usuario "${username} ya existe, intenta con otro`,
                path: 'username'
            }

            resultadoValidaciones.errors.push(error)
            verifyAvatar = false
        }

        //Si se puede cambiar el username, cambiar el avatar de nombre
        if (verifyAvatar) {
            const isChange = changeAvatarName(user, username) //true or false
            if (!isChange) {
                const error = {
                    msg: `Hubo un error "${username} al querer cambiar el nombre de usuario"`,
                    path: 'username'
                }

                resultadoValidaciones.errors.push(error)
            }
        }
    }

    //----VALIDAR ERRORES----
    if (!resultadoValidaciones.isEmpty()) {
        return res.render('users/account', {
            errores: resultadoValidaciones.array(),
            user: req.user,
            csrfToken: req.csrfToken(),
            covers: imageNames
        })
    }

    user.name = name
    user.lastname = lastname
    user.username = username

    //Cover_url
    if (imageNames.includes(cover)) user.cover_url = cover

    await user.save()


    return res.render('users/account', {
        user,
        csrfToken: req.csrfToken(),
        save: true,
        covers: imageNames
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

    //cambiar nombre de imagen
    function changeAvatarName(user, newUsername) {
        try {
            const imgDirectory = path.join(__dirname, '..', 'public', 'img', 'profiles');
            // Lee los nombres de los archivos en el directorio de imágenes
            const imageNames = fs.readdirSync(imgDirectory);
            const matchImage = imageNames.find(imageName => imageName.startsWith(user.username)) //busco la imagen

            if (matchImage) {
                const imageExtension = path.extname(matchImage) //obtengo la extension ex. .png

                const newName = newUsername + imageExtension //nuevo nombre con extension

                //rutas completas de la imagen original y nueva con nombre cambiado
                const oldImgPath = path.join(imgDirectory, matchImage);
                const newImgPath = path.join(imgDirectory, newName);

                //cambiar el nombre
                fs.renameSync(oldImgPath, newImgPath)

                //cambiar de la bd
                user.image_url = newName
                return true
            } else {
                return false
            }
        } catch (error) {
            console.error(`Error al cambiar el nombre de la imagen del usuario ${oldUsername}: ${error} `);
            return false; // Devuelve false en caso de error
        }

    }
}

export {
    getUser,
    userAccount,
    editAccount
}