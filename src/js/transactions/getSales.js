import axios from 'axios'
import moment from 'moment'
import { addTransactionDOM, addPagination, rotateBtnP } from './getPurchases.js'

const d = document,
    $loader = d.querySelector('.loader'),
    $btnSales = d.getElementById('btnSales'),
    $sectionSales = d.getElementById('sales'),
    $containerSales = d.getElementById('containerSectionSales'),
    $parentContainerSales = d.getElementById('mySales'),
    $template = d.getElementById('templateTransaction').content,
    $templateBtn = d.getElementById('btnPagination').content,
    $btnsPagination = d.getElementById('btnsPaginationSales'),
    $btnPrevious = d.getElementById('previousSales'),
    $btnNext = d.getElementById('nextSales')

moment.locale('es');

//Variables para la paginación
let page = 0, size = 3, count = 0, cantBtns = 0

let iBtnPurchase = 0

d.addEventListener('DOMContentLoaded', function () {
    getTransactions()
})

/* 
$btnSales.addEventListener('click', function (e) {
    if (iBtnPurchase == 0) {
        //Ocultar section
     Arreglar problema de disposicion, para que se oculte dentro de su padre y no del body 
       $containerSales.style.transform = 'translateY(-1000px)';

        setTimeout(() => {
            $parentContainerSales.style.height = '60px'
        }, 300);

        iBtnPurchase = 1 
    } else {
        //Mostrar section
        $containerSales.style.transform = '';
        $parentContainerSales.style.height = ''

        iBtnPurchase = 0
    }
}) */

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
    axios.get(`/transactions/api/sales?page=${page}`, {
        headers: {
            'per_page': size,
        }
    })
        .then(res => {
            $sectionSales.innerHTML = ''

            const { transactions, count: cant, mine } = res.data

            transactions.forEach(t => {
                addTransactionDOM(t, $template, $fragment, mine)
                $sectionSales.appendChild($fragment)
            })

            count = cant
            addPagination($btnsPagination, count, size)
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
        })
}

function addLoader() {
    const loaderClone = $loader.cloneNode(true)
    loaderClone.classList.remove('hidden')
    $sectionSales.appendChild(loaderClone)
}

