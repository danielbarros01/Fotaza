import axios from 'axios'
import moment from 'moment'

const d = document,
    $loader = d.querySelector('.loader'),
    $btnPurchases = d.getElementById('btnPurchases'),
    $sectionShopping = d.getElementById('shopping'),
    $containerShopping = d.getElementById('containerSectionShopping'),
    $parentContainerShopping = d.getElementById('myShopping'),
    $template = d.getElementById('templateTransaction').content,
    $templateBtn = d.getElementById('btnPagination').content,
    $btnsPagination = d.getElementById('btnsPagination'),
    $btnPrevious = d.getElementById('previous'),
    $btnNext = d.getElementById('next')

//Variables para la paginación
let page = 0, size = 2, count = 0, cantBtns = 0

let iBtnPurchase = 0

d.addEventListener('DOMContentLoaded', function () {
    rotateBtn()
    getTransactions()
})

$btnPurchases.addEventListener('click', function (e) {
    rotateBtn()

    if (iBtnPurchase == 0) {
        //Ocultar section
        $containerShopping.style.transform = 'translateY(-1000px)';

        setTimeout(() => {
            $parentContainerShopping.style.height = '60px'
        }, 300);

        iBtnPurchase = 1
    } else {
        //Mostrar section
        $containerShopping.style.transform = '';
        $parentContainerShopping.style.height = ''

        iBtnPurchase = 0
    }
})

$btnNext.addEventListener('click', () => {
    if (((page + 1) * size) < count) {
        page++
        getTransactions()
    }
})

$btnPrevious.addEventListener('click', () => {
    if (page > 0) {
        page--
        getTransactions()
    }
})

function getTransactions() {
    addLoader()

    const $fragment = d.createDocumentFragment()
    axios.get(`/transactions/api?page=${page}`, {
        headers: {
            'per_page': size,
        }
    })
        .then(res => {
            $sectionShopping.innerHTML = ''

            const { transactions, count: cant } = res.data

            transactions.forEach(t => {
                addTransactionDOM(t, $template, $fragment)
                $sectionShopping.appendChild($fragment)
            })

            count = cant
            addPagination(count, size)
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
        })
}

function addTransactionDOM(transaction, $template, $fragment) {
    const publication = transaction.publication

    $template.querySelector('.image').style.backgroundImage = `url(/publications/image/${publication.image})`
    $template.querySelector('.dateTransaction').textContent = moment(transaction.date).format('ll')

    if (transaction.status == 'approved') {
        $template.querySelector('.status').textContent = 'Compra efectuada'
    }

    $template.querySelector('.price').textContent = '$' + transaction.price
    $template.querySelector('.category-content').style.backgroundImage = `url(/img/backgroundsCategories/${publication.category.image})`
    $template.querySelector('.category-content span').textContent = publication.category.name

    $template.querySelector('.info-resolution span').textContent = `${publication.resolution}/${publication.format.split('/')[1].toUpperCase()}`

    $template.querySelector('.linkPublication').setAttribute('href', `/publications/${publication.id}`)
    $template.querySelector('.linkDownload').setAttribute('href', `/publications/${publication.id}/download`)

    let $clone = document.importNode($template, true)

    $fragment.appendChild($clone)
}

function rotateBtn() {
    if ($btnPurchases.querySelector('i').style.transform === "rotate(180deg)") {
        $btnPurchases.querySelector('i').style.transform = "rotate(360deg)"
    } else {
        $btnPurchases.querySelector('i').style.transform = "rotate(180deg)"
    }
}

function addLoader() {
    const loaderClone = $loader.cloneNode(true)
    loaderClone.classList.remove('hidden')
    $sectionShopping.appendChild(loaderClone)
}

function removeLoader(section) {
    section.querySelector('.loader').remove()
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
        page = value - 1
        getTransactions();
    });

    $fragment.appendChild($clone)
}