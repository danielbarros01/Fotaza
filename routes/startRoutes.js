import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('inicio', {
        pagina: 'Inicio',
        barra: true,
        imageUrl: "/img/backgrounds/fondo2.jpeg",
        nameUserPhoto: "Khaled Ali"
    })
})

export default router