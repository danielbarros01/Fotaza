import moment from "moment";

const d = document

function commonMessage($template, msg) {
    $template.querySelector('.message span').textContent = msg.text
    $template.querySelector('.dateMessage span').textContent = moment(msg.date).format('LLL')
    $template.querySelector('.photoProfileChat img').setAttribute('src', `/img/profiles/${msg.user.image_url}`)
    $template.querySelector('.photoProfileChat img').setAttribute('alt', `Imagen de perfil de ${msg.user.username}`)
}

function buyMessage($template, msg) {
    $template.querySelector('.textMsg').textContent = msg.text
    $template.querySelector('.dateMessage span').textContent = moment(msg.date).format('LLL')
    $template.querySelector('.photoProfileChat img').setAttribute('src', `/img/profiles/${msg.user.image_url}`)
    $template.querySelector('.photoProfileChat img').setAttribute('alt', `Imagen de perfil de ${msg.user.username}`)


    $template.querySelector('.titleMsgBuy span').textContent = msg.publication.title
    $template.querySelector('.imgBackgroundPublication').style.backgroundImage = `url(/publications/image/${msg.publication.image})`
    $template.querySelector('.linkPublication').setAttribute('href', `/publications/${msg.publication.id}`)

    const $price = $template.querySelector('.price')
    $price ? $price.textContent = `$${msg.publication.currency.toUpperCase()} ${msg.publication.price}` : ''
}

function newUser($template, user, conversation) {
    debugger
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