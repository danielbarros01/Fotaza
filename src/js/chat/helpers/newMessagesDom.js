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
    debugger
    $template.querySelector('li').dataset.publicationId = msg.transaction.publication.id
    $template.querySelector('.textMsg').textContent = msg.text
    $template.querySelector('.dateMessage span').textContent = moment(msg.date).format('LLL')
    $template.querySelector('.photoProfileChat img').setAttribute('src', `/img/profiles/${msg.user.image_url}`)
    $template.querySelector('.photoProfileChat img').setAttribute('alt', `Imagen de perfil de ${msg.user.username}`)


    $template.querySelector('.titleMsgBuy span').textContent = msg.transaction.publication.title
    $template.querySelector('.imgBackgroundPublication').style.backgroundImage = `url(/publications/image/${msg.transaction.publication.image})`
    $template.querySelector('.linkPublication').setAttribute('href', `/publications/${msg.transaction.publication.id}`)

    const $price = $template.querySelector('.price')
    $price ? $price.textContent = `$${msg.transaction.publication.currency.toUpperCase()} ${msg.transaction.publication.price}` : ''

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

                const div = createPayButton(msg.transaction.publication_id, token)

                $template.querySelector('.status').appendChild(div)
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

        if (msg.transaction && msg.transaction.status == 'sold') {
            const div = $template.querySelector('.status')

            const icon = d.createElement('i')
            const span = d.createElement('span')

            icon.classList.add('fa-solid', 'fa-circle-check', 'text-3xl', 'text-center', 'text-green-600')
            span.textContent = 'Vendida'
            span.classList.add('text-center', 'text-green-600')

            div.style.height = '120px'
            div.innerHTML = ''
            div.appendChild(icon)
            div.appendChild(span)
        }

        //Este codigo se repite en el else para realizar cambios mas adelante, realizar el message mas personalizable segun de quien sea
        if (msg.transaction && msg.transaction.status == 'rejected') {
            const div = $template.querySelector('.status')

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

        if (msg.transaction && msg.transaction.status == 'waiting') {
            const div = $template.querySelector('.status')
            
            const div2 = d.createElement('div')
            div2.classList.add('grid', 'place-content-center')
                
            const icon = d.createElement('i')
            const span = d.createElement('span')

            icon.classList.add('fa-solid', 'fa-clock', 'text-3xl', 'text-center', 'text-white')
            span.textContent = 'En espera'
            span.classList.add('text-center', 'text-white')
            
            div.innerHTML = ''
            
            div2.appendChild(icon)
            div2.appendChild(span)

            div.appendChild(div2)
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
            const div = $template.querySelector('.status')

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

        if (msg.transaction && msg.transaction.status == 'sold') {
            const div = $template.querySelector('.status')

            const icon = d.createElement('i')
            const span = d.createElement('span')

            icon.classList.add('fa-solid', 'fa-circle-check', 'text-3xl', 'text-center', 'text-green-600')
            span.textContent = 'Vendida'
            span.classList.add('text-center', 'text-green-600')

            div.style.height = '120px'
            div.innerHTML = ''
            div.appendChild(icon)
            div.appendChild(span)
        }

        if (msg.transaction && msg.transaction.status == 'approved') {
            const div = $template.querySelector('.status')

            const icon = d.createElement('i')
            const span = d.createElement('span')

            icon.classList.add('fa-solid', 'fa-circle-check', 'text-3xl', 'text-center', 'text-green-600')
            span.textContent = 'Vendida'
            span.classList.add('text-center', 'text-green-600')

            div.style.height = '120px'
            div.innerHTML = ''
            div.appendChild(icon)
            div.appendChild(span)
        }

        if (msg.transaction && msg.transaction.status == 'waiting') {
            const div = $template.querySelector('.status')

            const div2 = d.createElement('div')
            div2.classList.add('grid', 'place-content-center')

            const span = d.createElement('span')
            span.classList.add('text-center', 'text-green-700', 'price')
            span.textContent = `$${msg.transaction.price}`

            div2.appendChild(span)

            const div3 = d.createElement('div')
            div3.classList.add('grid', 'place-content-center', 'space-y-2')

            const buttonAccept = d.createElement('button')
            buttonAccept.classList.add('accept', 'bg-green-700', 'text-white', 'p-2', 'hover:opacity-75', 'w-20')
            buttonAccept.textContent = 'Liberar'

            const buttonDecline = d.createElement('button')
            buttonDecline.classList.add('decline', 'bg-red-500', 'text-white', 'p-2', 'hover:opacity-75', 'w-20')
            buttonDecline.textContent = 'Rechazar'

            div3.appendChild(buttonAccept)
            div3.appendChild(buttonDecline)

            //div.style.height = '120px'
            div.innerHTML = ''
            
            div.appendChild(div2)
            div.appendChild(div3)

            //.status(class= "flex flex-col flex-1 2xl:flex-initial 2xl:w-2/12 justify-center items-center")
            //div(class= "grid place-content-center")
            //    span(class= "price text-green-700")
            //div(class= "")
                //button.accept(type = "button" class= "bg-green-700 text-white p-2 hover:opacity-75 w-20") Liberar
                //button.decline(type = "button" class= "bg-red-500 text-white p-2 hover:opacity-75 w-20") Rechazar
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