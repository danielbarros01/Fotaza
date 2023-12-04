import axios from "axios"

const d = document
const w = window

const $sectionImages = d.getElementById('images')
const $template = d.getElementById('publication').content

const $loader = d.querySelector('.loader')

let page = 0
let size = 5

d.addEventListener('DOMContentLoaded', () => {
    getPublications()
})

w.addEventListener('scroll', e => {
    const { scrollTop, scrollHeight, clientHeight } = d.documentElement

    console.log(Math.ceil(scrollTop), scrollHeight, clientHeight)

    if ((Math.ceil(scrollTop) + clientHeight + 5) >= scrollHeight) {
        console.log("cargar mas")
        page++
        getPublications()
    }
})

function getPublications() {
    const $fragment = d.createDocumentFragment()

    $loader.classList.remove('hidden')

    axios.get(`/publications?page=${page}&size=${size}`)

        .then((response) => {
            const { publications } = response.data

            publications.forEach(p => {
                addPublicationDOM(p, $fragment)
                $sectionImages.appendChild($fragment)
            });
        })

        .catch((error) => {
            console.error(error)
        })

        .finally(() => {
            $loader.classList.add('hidden')
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

    $fragment.appendChild($clone)
}