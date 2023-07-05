const home = async (req, res) => {
    const { user } = req

    if (!user) {
        return res.render('inicio', {
            pagina: 'Inicio',
            barra: true,
            viewBtnsAuth: true,
            imageUrl: "/img/backgrounds/fondo6.jpg",
            nameUserPhoto: "Khaled Ali"
        })
    }

    res.render('inicio', {
        pagina: 'Inicio',
        barra: true,
        viewBtnsAuth: false,
        user: user,
        imageUrl: "/img/backgrounds/fondo6.jpg",
        nameUserPhoto: "Khaled Ali"
    })

}

export {
    home
}