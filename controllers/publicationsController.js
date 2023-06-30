const home = (req, res) => {
    res.render('inicio', {
        pagina: 'Inicio',
        barra: true,
        viewBtnsAuth: true,
        imageUrl: "/img/backgrounds/fondo6.jpg",
        nameUserPhoto: "Khaled Ali"
    })
}

const viewPublications = (req, res) => {
    res.render('publications/home', {
        pagina: 'Home'
    })
}


export {
    home,
    viewPublications
}