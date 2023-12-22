import axios from "axios";

const d = document,
    w = window

const username = document.querySelector('meta[name="username"]').getAttribute('content');


const radioButtons = document.querySelectorAll('input[name="slideItem"]');
const $conteo = d.getElementById('textCountPhotos')
const $sectionImages = d.getElementById('images')

const $template = d.getElementById('publication').content
const $loader = d.querySelector('.loader')
const $message = d.querySelector('.messages')

const $templateBtn = d.getElementById('btnPagination').content
const $sectionPagination = d.getElementById('pagination')
const $btnsPagination = d.getElementById('btnsPagination')
const $btnPrevious = d.getElementById('previous')
const $btnNext = d.getElementById('next')

//Para obtener los parámetros de la URL
let url = new URL(w.location.href)
let params = new URLSearchParams(url.search);

//Variables para la paginación
let page = 0, size = 12

//Cant publicaciones
let count = 0

//
let selectedValue = 'all'

//
let cantBtns

d.addEventListener('DOMContentLoaded', async () => {
    getPublications(`/publications/user/${username}?page=${page}` + ((params.has('type')) ? `&type=${params.get('type')}` : ''))
    selectInput()
})


radioButtons.forEach(r => {
    r.addEventListener('change', async function () {
        page = 0
        selectedValue = this.value
        getPublications(`/publications/user/${username}?page=${page}&type=${selectedValue}`)
        changeUrl(selectedValue)
    })
})


function getPublications(route) {
    console.log(route)
    const $fragment = d.createDocumentFragment()

    $sectionImages.innerHTML = ''
    $loader.classList.remove('opacity-0', 'hidden')
    $message.classList.add('hidden')

    axios.get(route, {
        headers: {
            'per_page': size,
        }
    })

        .then((response) => {
            const { publications } = response.data

            publications.forEach(p => {
                addPublicationDOM(p, $fragment)
                $sectionImages.appendChild($fragment)
            });

            const { count: cantidad } = response.data

            $conteo.textContent = cantidad
            count = cantidad

            if (publications.length === 0) {
                $message.classList.remove('hidden')
                $message.textContent = 'No hay publicaciones para mostrar en esta sección'
            }

            addPagination(cantidad, size)
        })

        .catch((error) => {
            console.log(error)
            $message.classList.remove('hidden')
            $message.textContent = 'Ha ocurrido un error, intente de nuevo más tarde'
        })

        .finally(() => {
            $loader.classList.add('opacity-0')
            setTimeout(() => {
                $loader.classList.add('hidden')
            }, 1000);
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

    /* ---------------- */
    $template.querySelector('.linkSearchCategory').setAttribute('href', `/search/allPublications?categories=${publication.category.id}`)
    /* ---------------- */


    let $clone = document.importNode($template, true)

    $fragment.appendChild($clone)
}


function selectInput() {
    let type = params.get('type')

    radioButtons.forEach(r => {
        let change = r.value == type

        if (change) {
            r.checked = true
        }
    })
}

function changeUrl(selectedValue) {
    // Cambiar el valor del parámetro 'type' a un nuevo valor
    params.set('type', selectedValue);
    //Actualiza la URL con los nuevos parámetros sin recargar la página.
    history.replaceState(null, null, '?' + params.toString());
}


function addPagination(count, cantPublicacionesPorPag) {
    $btnsPagination.innerHTML = ''

    cantBtns = Math.ceil(count / cantPublicacionesPorPag)

    if (cantBtns > 1) {
        const $fragment = d.createDocumentFragment()

        // Calcular el rango de botones a mostrar
        let start = Math.max(1, Math.min(page - 2, cantBtns - 4));
        let end = Math.min(cantBtns, start + 4);

        for (let i = start; i <= end; i++) {
            addBtn(i, $fragment)
            $btnsPagination.appendChild($fragment)
        }
    }
}

function addBtn(value, $fragment) {
    $templateBtn.querySelector('button').textContent = value
    $templateBtn.querySelector('button').setAttribute('value', value)

    let $clone = document.importNode($templateBtn, true)
    const $clonedButton = $clone.querySelector('button');

    $clonedButton.addEventListener('click', () => {
        // Obtener las publicaciones para la página seleccionada
        getPublications(`/publications/user/${username}?page=${value - 1}&type=${selectedValue}`);
        page = value - 1
    });

    $fragment.appendChild($clone)
}

$btnNext.addEventListener('click', () => {
    if (((page + 1) * size) < count) {
        page++
        getPublications(`/publications/user/${username}?page=${page}&type=${selectedValue}`)
    }
})

$btnPrevious.addEventListener('click', () => {
    if (page > 0) {
        page--
        getPublications(`/publications/user/${username}?page=${page}&type=${selectedValue}`)
    }
})