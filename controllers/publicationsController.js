const home = (req, res) => {
    res.render('inicio', {
        pagina: 'Inicio',
        barra: true,
        imageUrl: "/img/backgrounds/fondo2.jpeg",
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