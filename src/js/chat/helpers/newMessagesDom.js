import moment from "moment";
import { createPayButton } from "../acceptOrDecline.js";
import { token } from "../chat.js";

const d = document

function commonMessage($template, msg) {
    $template.querySelector('.message span').textContent = msg.text
    $template.querySelector('.dateMessage span').textContent = moment(msg.date).format('LLL')
    $template.querySelector('.photoProfileChat img').setAttribute('src', `/img/profiles/${msg.user.image_url}`)
    $template.querySelector('.photoProfileChat img').setAttribute('alt', `Imagen de perfil de ${msg.user.username}`)
}

function buyMessage($template, msg, transaction) {
    $template.querySelector('li').dataset.publicationId = msg.publication.id
    $template.querySelector('.textMsg').textContent = msg.text
    $template.querySelector('.dateMessage span').textContent = moment(msg.date).format('LLL')
    $template.querySelector('.photoProfileChat img').setAttribute('src', `/img/profiles/${msg.user.image_url}`)
    $template.querySelector('.photoProfileChat img').setAttribute('alt', `Imagen de perfil de ${msg.user.username}`)


    $template.querySelector('.titleMsgBuy span').textContent = msg.publication.title
    $template.querySelector('.imgBackgroundPublication').style.backgroundImage = `url(/publications/image/${msg.publication.image})`
    $template.querySelector('.linkPublication').setAttribute('href', `/publications/${msg.publication.id}`)

    const $price = $template.querySelector('.price')
    $price ? $price.textContent = `$${msg.publication.currency.toUpperCase()} ${msg.publication.price}` : ''

    debugger
    //Si el mensaje es mio significa que yo estoy mandando la solicitud
    if (msg.mine) {
        if (msg.transaction && msg.transaction.status == 'hold') {
            const icon = $template.querySelector('.status .fa-clock')
            const span = $template.querySelector('.status span')
            debugger
            if (icon) {
                icon.classList.remove('fa-clock')
                icon.classList.add('fa-circle-check')
                span.textContent = 'Aceptado'
                const form = createPayButton(msg.transaction.publication_id, token)

                $template.querySelector('.status').appendChild(form)
            }
        }

        if (msg.transaction && msg.transaction.status == 'approved') {
            const div = $template.querySelector('.status')

            const icon = d.createElement('i')
            const span = d.createElement('span')

            icon.classList.add('fa-solid', 'fa-circle-check', 'text-3xl', 'text-center', 'text-green-600')
            span.textContent = 'Adquirido'
            span.classList.add('text-center', 'text-green-600')

            div.style.height = '120px'
            div.innerHTML = ''
            div.appendChild(icon)
            div.appendChild(span)
        }

        //Este codigo se repite en el else para realizar cambios mas adelante, realizar el message mas personalizable segun de quien sea
        if (msg.transaction && msg.transaction.status == 'rejected') {
            rejectedMessage($template)
        }
    }
    //Si el mensaje no es mio significa que alguien me esta mandando la solicitud
    else {
        debugger

        if (msg.transaction && msg.transaction.status == 'hold') {
            const div = $template.querySelector('.status')

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

        if (msg.transaction && msg.transaction.status == 'rejected') {
            rejectedMessage($template)
        }
    }

}

function rejectedMessage(t) {
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

function newUser($template, user, conversation) {
    $template.querySelector('input[name="contact"]').setAttribute('id', `user-${user.id}`)
    $template.querySelector('input[name="contact"]').setAttribute('value', `conversation-${conversation.id}`)

    $template.querySelector('.contact').setAttribute('for', `user-${user.id}`)

    $template.querySelector('.photoProfile img').setAttribute('src', `/img/profiles/${user.image_url}`)
    $template.querySelector('.photoProfile img').setAttribute('alt', `Imagen de perfil de ${user.username}`)

    $template.querySelector('.name span').textContent = `${user.name} ${user.lastname}`

    $template.querySelector('.cutMessage span').textContent = conversation.lastMessage.text

    $template.querySelector('.time span').textContent = conversation.lastMessage.date

    $template.querySelector('.countMessages span').textContent = '+1'

}

export {
    commonMessage,
    buyMessage,
    newUser
}