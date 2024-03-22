import axios from "axios"
import imagesLoaded from "imagesloaded"
import { addTag } from "../publication/tags.js"

const d = document,
    w = window,
    url = new URL(w.location.href),
    searchedWord = url.pathname.split('/').pop(),
    categoriesValue = url.searchParams.get('categories'),
    tagsValue = url.searchParams.get('tags'),
    $sectionImages = d.getElementById('images'),
    $template = d.getElementById('publication').content

//Variables DOM
const $typeRadios = d.querySelectorAll('input[name="typePost"]')
const $selectQualification = d.getElementById('filterQualification')
const $categories = d.querySelectorAll('input[name="category"]')
const $inputTags = d.getElementById('tag')
const $tags = document.querySelector("#tags")
const $spanErrTag = document.getElementById('errTag')
const $selectSize = d.getElementById('filterSize')

const $loader = d.querySelector('.loader')
const $message = d.querySelector('.messages')
//----------------------------------------------------------------

//Variables para consulta
let page = 0, per_page = 12, prevPage = 0, numberPublications = 0, numberPublicationsDOM = 0, firstTime = true

let typePost = 'free' //free, general o unique
let priority = 'qualification' //qualification o recent
let categories = [] //Las categorias pertinentes
let tags = []
let size = 'all' // all, small, medium, large

//----------------------------------------------------------------


/* Apenas carga la pagina */
d.addEventListener('DOMContentLoaded', () => {
    categoriesValue ? getPublications(categoriesValue) : tagsValue ? getPublications(null, tagsValue) : getPublications()
})

/* -- */

/* SCROLL */
w.addEventListener('scroll', e => {
    const { scrollTop, scrollHeight, clientHeight } = d.documentElement

    if ((Math.ceil(scrollTop) + clientHeight + 10) >= scrollHeight) {
        console.log('mas')
        prevPage = page
        page++
        getPublications()
    }
})
/* -- */


/* Gratis, De pago o unicas */

$typeRadios.forEach(r => {
    r.addEventListener('change', function () {
        typePost = this.value

        //Reiniciar valor de pagina
        page = 0

        //Vaciar seccion imagenes
        $sectionImages.innerHTML = ''
        numberPublicationsDOM = 0

        getPublications()
    })
});

/* -- */

/* Prioridad calificacion o recientes */

$selectQualification.addEventListener('change', function () {
    priority = $selectQualification.value;

    //Reiniciar valor de pagina
    page = 0

    //Vaciar seccion imagenes
    $sectionImages.innerHTML = ''
    numberPublicationsDOM = 0

    getPublications()
});
/* -- */


/* Categorias */
$categories.forEach((checkbox) => {
    checkbox.addEventListener('change', function () {
        let selectedValue = checkbox.value

        //Si existe la palabra eliminala, si no agregala
        categories.includes(selectedValue)
            ? ((categories.indexOf(selectedValue) !== -1) ? categories.splice(categories.indexOf(selectedValue), 1) : '')
            : categories.push(selectedValue)

        page = 0

        //Vaciar seccion imagenes
        $sectionImages.innerHTML = ''
        numberPublicationsDOM = 0

        getPublications()
    })
})
/* -- */

/* Otros Filtros */

/*  Etiquetas */

//Cuando agrego una nueva etiqueta
document.addEventListener('tagAdded', function (event) {
    const tag = event.detail.tag

    //Si no existe la etiqueta agregala
    if (!tags.includes(tag)) {
        tags.push(tag)

        page = 0

        //Vaciar seccion imagenes
        $sectionImages.innerHTML = ''
        numberPublicationsDOM = 0

        getPublications()
    }
});


//Cuando elimino una etiqueta
document.addEventListener('tagRemoved', function (event) {
    const tag = event.detail.tag

    //Si existe la etiqueta eliminala
    if (tags.includes(tag)) {
        const position = tags.indexOf(tag)

        if (position !== -1) {
            tags.splice(position, 1)

            page = 0

            //Vaciar seccion imagenes
            $sectionImages.innerHTML = ''
            numberPublicationsDOM = 0

            getPublications()
        }
    }
});

/* -- */

/*  Tamaño */
$selectSize.addEventListener('change', function () {
    size = $selectSize.value;

    //Reiniciar valor de pagina
    page = 0

    //Vaciar seccion imagenes
    $sectionImages.innerHTML = ''
    numberPublicationsDOM = 0

    getPublications()
});

/* -- */

/* -- */

function getPublications(category, tag) {
    if ((numberPublications > numberPublicationsDOM) || firstTime || (numberPublications == 0 && numberPublicationsDOM == 0)) {
        firstTime = false

        const $fragment = d.createDocumentFragment()
        $message.classList.add('hidden')

        //Loader
        $loader.classList.remove('opacity-0', 'hidden')

        //Manejar si ya vienen category o alguna etiqueta para la busqueda
        let url

        if (category) {
            //agrego al array de categories
            categories.push(category)

            //Activar del DOM la categoria que viene
            const $category = d.getElementById(`category-${category}`)
            if ($category) $category.checked = true
            //--
        } else if (tag) {
            let $fragmentTag = d.createDocumentFragment();

            let arrayTags = tag.split(',')

            arrayTags.forEach(tag => addTag(tags, tag.toLowerCase(), $tags, $spanErrTag, $fragmentTag, true, true))
            
            console.log(tags)
        }
        url = `/search/s/${searchedWord}?page=${page}&type=${typePost}&priority=${priority}&size=${size}&tags=${tags.join(',')}&categories=${categories.join(',')}`

        // --

        axios.get(url, {
            headers: { per_page, }
        })
            .then(response => {
                w.history.pushState({}, "", `/search/${searchedWord}?page=${page}&type=${typePost}&priority=${priority}&size=${size}&tags=${tags.join(',')}&categories=${categories.join(',')}`)

                const { publications, count } = response.data

                if (publications.length === 0 && count == 0) {
                    $message.classList.remove('hidden')
                    $message.textContent = 'No hay publicaciones para mostrar'
                } else {
                    numberPublications = count

                    publications.forEach(p => {
                        addPublicationDOM(p, $fragment)
                        $sectionImages.appendChild($fragment)
                    });

                    resizeAllMasonryItems()

                    //Para la carga del loader interno
                    let imgLoad = imagesLoaded($sectionImages);
                    imgLoad.on('progress', onProgress);
                }
            })

            .catch(err => {
                console.error(err)
                $message.classList.remove('hidden')
                $message.textContent = 'Ha ocurrido un error, intente de nuevo más tarde'
                page = prevPage
            })

            .finally(() => {
                //Fin loader
                $loader.classList.add('opacity-0')
                setTimeout(() => {
                    $loader.classList.add('hidden')
                }, 1000);

                /* Do a resize once more when all the images finish loading */
                waitForImages();
            })
    }
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

    /* ---------------- */
    $template.querySelector('.linkSearchCategory').setAttribute('href', `/search/allPublications?categories=${publication.category.id}`)
    /* ---------------- */

    let $clone = document.importNode($template, true)

    const div = $template.querySelector('.father')

    div.classList.add('is-loading');

    $fragment.appendChild($clone)

    numberPublicationsDOM++
}


//Funcion por si viene del exterior la url
function getData() {

}



/* V2 */

/* Carga de imagenes con loader interno */
// Se activa despues de cargar cada elemento
/*  Hecho en base al ejemplo de https://imagesloaded.desandro.com/*/
function onProgress(imgLoad, image) {
    const item = image.img.parentNode.parentNode

    item.classList.remove('is-loading')
    image.isLoaded ? '' : item.classList.add('is-broken')
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