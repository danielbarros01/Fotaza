import axios from "axios"
import imagesLoaded from "imagesloaded"

const d = document
const w = window

const $sectionImages = d.getElementById('images')
const $template = d.getElementById('publication').content

let page = 0
let size = 6
let count = 0
let totalPublications = 0

d.addEventListener('DOMContentLoaded', () => {
    getPublications()
})

w.addEventListener('scroll', e => {
    const { scrollTop, scrollHeight, clientHeight } = d.documentElement

    if ((Math.ceil(scrollTop) + clientHeight + 5) >= scrollHeight) {
        page++
        getPublications()
    }
})


/* Carga de imagenes con loader interno */
// Se activa despues de cargar cada elemento
/*  Hecho en base al ejemplo de https://imagesloaded.desandro.com/*/
function onProgress(imgLoad, image) {
    const item = image.img.parentNode.parentNode

    item.classList.remove('is-loading')
    image.isLoaded ? '' : item.classList.add('is-broken')
}

function getPublications() {
    const $fragment = d.createDocumentFragment()

    axios.get(`/publications?page=${page}&size=${size}`)

        .then((response) => {
            const { publications } = response.data
            count = response.data.total

            publications.forEach(p => {
                addPublicationDOM(p, $fragment)
                $sectionImages.appendChild($fragment)
                totalPublications++
            });

            resizeAllMasonryItems()

            //Para la carga del loader interno
            let imgLoad = imagesLoaded($sectionImages);
            imgLoad.on('progress', onProgress);
        })

        .catch((error) => {
            console.error(error)
        })

        .finally(() => {
            /* Do a resize once more when all the images finish loading */
            waitForImages();
        })
}



function addPublicationDOM(publication, $fragment) {
    $template.querySelector('.linkPublication').setAttribute('href', `/publications/${publication.id}`)

    $template.querySelector('.principalImage').setAttribute('src', `/publications/image/${publication.image}`)
    $template.querySelector('.principalImage').setAttribute('alt', `Imagen ${publication.title}`)

    $template.querySelector('.linkUser').setAttribute('href', `/users/${publication.user.username}`)

    $template.querySelector('.imgProfileUser').setAttribute('src', `/img/profiles/${publication.user.image_url}`)
    $template.querySelector('.imgProfileUser').setAttribute('alt', `Imagen de usuario ${publication.user.username}`)

    $template.querySelector('.name').textContent = publication.user.name

    $template.querySelector('.title').textContent = publication.title

    $template.querySelector('.categoryImage').setAttribute('src', `/img/backgroundsCategories/${publication.category.image}`)
    $template.querySelector('.categoryImage').setAttribute('alt', `Imagen de categoria ${publication.category.name}`)
    $template.querySelector('.categoryName').textContent = publication.category.name

    let $clone = document.importNode($template, true)

    const div = $template.querySelector('.father')
    //resizeMasonryItem(div) 

    div.classList.add('is-loading');

    $fragment.appendChild($clone)
}


/* Codigo obtenido de https://w3bits.com/css-grid-masonry/ */
/* Para acomodar los elementos publicaciones correctamente */

function resizeMasonryItem(item) {
    /* Obtén el objeto de la cuadrícula, su espacio entre filas y el tamaño de sus filas implícitas */
    var cuadricula = document.querySelector('#images'),
        espacioFilas = parseInt(window.getComputedStyle(cuadricula).getPropertyValue('grid-row-gap')),
        alturaFila = parseInt(window.getComputedStyle(cuadricula).getPropertyValue('grid-auto-rows'));

    /*
     * Extensión para cualquier ladrillo = S
     * Espacio entre filas de la cuadrícula = G
     * Tamaño de la fila de la cuadrícula creada implícitamente = R
     * Altura del contenido del elemento = H
     * Altura neta del elemento = H1 = H + G
     * Altura neta de la fila de la cuadrícula implícita = T = G + R
     * S = H1 / T
     */
    var extensionFila = Math.ceil((item.querySelector('.masonry-content').getBoundingClientRect().height + espacioFilas) / (alturaFila + espacioFilas));

    /* Establece la extensión calculada anteriormente (S) */
    item.style.gridRowEnd = 'span ' + extensionFila;

}

function resizeAllMasonryItems() {
    // Get all item class objects in one list
    var allItems = document.getElementsByClassName('item');

    /*
     * Loop through the above list and execute the spanning function to
     * each list-item (i.e. each masonry item)
     */
    for (var i = 0; i < allItems.length; i++) {
        resizeMasonryItem(allItems[i]);
    }
}

/**
* Resize the items when all the images inside the masonry grid 
* finish loading. This will ensure that all the content inside our
* masonry items is visible.
*
* @uses ImagesLoaded
* @uses resizeMasonryItem
*/

function waitForImages() {
    var allItems = document.getElementsByClassName('item');


    for (var i = 0; i < allItems.length; i++) {
        imagesLoaded(allItems[i], function (instance) {
            var item = instance.elements[0];
            resizeMasonryItem(item);
        });
    }
}

/* Resize all the grid items on the load and resize events */
var masonryEvents = ['load', 'resize'];
masonryEvents.forEach(function (event) {
    window.addEventListener(event, resizeAllMasonryItems);
});




