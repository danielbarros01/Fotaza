import axios from 'axios'
import { socket, token } from "./chat.js"
import { userId } from './helpers/getChatsDom.js'

const d = document

function buttonFunctionality() {
    const $btnsAccept = d.querySelectorAll('.accept'),
        $btnsDecline = d.querySelectorAll('.decline')

    Array.from($btnsAccept).forEach(btn => {
        //Consigo el dateset con el id de la publicacion
        const publicationId = btn.closest('li').dataset.publicationId

        btn.addEventListener('click', () => {
            //Evento socket
            socket.emit('accept-transaction', { publicationId, requestingUserId: userId })
        })

    })

    Array.from($btnsDecline).forEach(btn => {
        //Consigo el dateset con el id de la publicacion
        const publicationId = btn.closest('li').dataset.publicationId

        //POST se acepto la venta de la publicacion
        btn.addEventListener('click', () => {
            //Evento socket
            socket.emit('decline-transaction', { publicationId, requestingUserId: userId })
        })
    })
}

d.addEventListener('DOMContentLoaded', () => {
    socket.on('accept-transaction-ok', (transaction) => {
        //Si userId es el mismo que de transaction tengo el chat abierto
        //Si tengo abierto el chat y yo solicite una compra
        if (userId == transaction.publication.user_id) {
            //Buscar todas las publicaciones que tengan el id de publication de transaction
            //Marcarlas como aceptadas o rechazadas
            const transactionsAccept = d.querySelectorAll(`li[data-publication-id="${transaction.publication_id}"]`)

            Array.from(transactionsAccept).forEach(t => {
                if (transaction.status == 'hold') {
                    const icon = t.querySelector('.status .fa-clock')
                    const span = t.querySelector('.status span')

                    if (icon) {
                        icon.classList.remove('fa-clock')
                        icon.classList.add('fa-circle-check')
                        span.textContent = 'Aceptado'
                        const form = createPayButton(transaction.publication_id, token)

                        t.querySelector('.status').appendChild(form)
                    }
                }
            })
        } else {
            //Entonces yo soy el dueño
            const transactionsAccept = d.querySelectorAll(`li[data-publication-id="${transaction.publication_id}"]`)

            Array.from(transactionsAccept).forEach(t => {
                if (transaction.status == 'hold') {
                    const div = t.querySelector('.status')

                    const icon = d.createElement('i')
                    const span = d.createElement('span')

                    icon.classList.add('fa-solid', 'fa-circle-check', 'text-3xl', 'text-center', 'text-green-600')
                    span.textContent = 'Liberado'
                    span.classList.add('text-center', 'text-green-600')

                    div.style.height = '120px'
                    div.innerHTML = ''
                    div.appendChild(icon)
                    div.appendChild(span)
                }
            })
        }
    })

    socket.on('decline-transaction-ok', (transaction) => {
        const transactionsDecline = d.querySelectorAll(`li[data-publication-id="${transaction.publication_id}"]`)

        Array.from(transactionsDecline).forEach(t => {
            if (transaction.status == 'rejected') {
                const div = t.querySelector('.status')

                const icon = d.createElement('i')
                const span = d.createElement('span')

                icon.classList.add('fa-solid', 'fa-circle-xmark', 'text-3xl', 'text-center', 'text-red-600')
                span.textContent = 'Rechazado'
                span.classList.add('text-center', 'text-red-600')

                div.style.height = '120px'
                div.innerHTML = ''
                div.appendChild(icon)
                div.appendChild(span)
            }
        })
    })
})

function createPayButton(publicationId, csrfToken) {
    const form = d.createElement('form')
    form.setAttribute('method', `POST`)
    form.setAttribute('action', `/payment/new-order/${publicationId}/?_csrf=${csrfToken}`)
    
    const button = d.createElement('button')
    button.type = 'submit'
    button.classList.add('bg-green-700', 'text-white', 'p-2', 'hover:opacity-75', 'w-20', 'm-auto')
    button.textContent = 'Pagar'

    form.appendChild(button)

    return form
}

export {
    buttonFunctionality,
    createPayButton
}

