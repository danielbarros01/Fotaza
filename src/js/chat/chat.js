import axios from "axios";
import moment from "moment";
import { getChatsDOM, userId, $templateSent, $templateSentBuy, $templateReceived, $templateReceivedBuy, addListenerChange, closeConversation } from "./helpers/getChatsDom.js"
import { commonMessage, buyMessage, newUser } from "./helpers/newMessagesDom.js"

const socket = io()
const d = document

//DOM
const $form = d.getElementById('form'),
    $message = d.getElementById('inputMessage'), //textarea
    $messages = d.getElementById('messages'), //ul
    $contacts = d.getElementById('contacts'), //ul
    token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

const $templateNewConversation = d.getElementById('templateNewConversation').content

//Url
let currentUrl = window.location.href;
let url = new URL(currentUrl);

socket.on('new-user', (user) => {
    console.log('Usuario conectado', user)
})


//Cuando cargue la pagina
d.addEventListener('DOMContentLoaded', () => {
    //Verificar url
    if (url.pathname.includes('/chat/c/')) {
        //Funcion para abrir ese chat
    }

    //funcion para traer los mensajes de cada conversacion
    getChatsDOM()
})

//Mandar mensajes
$form.addEventListener('submit', (e) => {
    e.preventDefault()

    if ($message.value) {
        socket.emit('new-message', { message: $message.value.trim(), toUser: userId })
        $message.value = ''
    }
})

socket.on('new-message-ok', ({ message, msgUserId, fromUser, toUser, transaction }) => {
    //Buscar en chats si aparece el msgUserId
    const $chats = d.querySelectorAll('input[name="contact"]')
    const $fragment = d.createDocumentFragment()
    let $clone

    //Si toUser es igual a userId, userId es el id del usuario donde tengo abierta la conversacion, por lo tanto puedo, o si tengo abierto el chat del usuario que esta mandand
    //mostrar el nuevo mensaje
    if (toUser == userId || fromUser == userId) {
        //Si el userId del mensaje es el mismo que al usuario del chat, entonces estoy recibiendo el mensaje
        if (toUser == userId) {
            if (message.purchase) {//Si es un mensaje para adquirir
                buyMessage($templateSentBuy, message, transaction)
                $clone = d.importNode($templateSentBuy, true)
            } else {
                commonMessage($templateSent, message)
                $clone = d.importNode($templateSent, true)
            }

        } else if (fromUser == userId) { //Si no, lo estoy enviando yo
            if (message.purchase) {
                buyMessage($templateReceivedBuy, message, transaction)
                $clone = d.importNode($templateReceivedBuy, true)
            } else {
                commonMessage($templateReceived, message)
                $clone = d.importNode($templateReceived, true)
            }
        }

        $fragment.appendChild($clone)
        $messages.appendChild($fragment)
        $messages.scrollTop = $messages.scrollHeight

        //Pongo el ultimo mensaje y le sumo a los mensajes
        const $label = document.querySelector(`label[for="user-${toUser}"]`);
        $label.querySelector('.cutMessage span').textContent = message.text
    } else {
        //Cuando no tengo abierto ese chat, busco el chat, modifico el ultimo last message, subo el chat a arriba de todos y le sumo +1 a la pelotita verde
        const $chat = Array.from($chats).find($chatActual => {
            let chatId = $chatActual.id.split('-')[1]

            return chatId == fromUser
        })

        //Selecciono el contenedor padre $contacts
        //div padre -> input hijo - label hermano

        const $divsChats = $contacts.children

        if ($chat !== undefined) {
            //Mover el chat arriba de todo
            const i = Array.from($chats).indexOf($chat)

            if ($divsChats.length >= i) {
                const $divParent = $chat.parentElement //selecciono el div padre del input para moverlo
                $contacts.insertBefore($divParent, $divsChats[0]) //mover antes del segundo div si lo hay
            }
            //-----

            //Pongo el ultimo mensaje y le sumo a los mensajes
            const $label = document.querySelector(`label[for="${$chat.id}"]`);
            $label.querySelector('.cutMessage span').textContent = message.text


            let $count = $label.querySelector('.countMessages span')
            $count.parentElement.classList.remove('invisible')
            let str = $count.textContent ? $count.textContent : '0'
            let num = parseInt(str, 10)

            $count.textContent = `+${++num}`
            //----
        } else {
            const $fragmentTwo = d.createDocumentFragment()

            //Si chat es undefined significa que no tenemos en el DOM la conversacion
            newUser($templateNewConversation, message.user, message.conversation)

            const $cloneConversation = d.importNode($templateNewConversation, true)

            addListenerChange($cloneConversation.querySelector('input[name="contact"]'))

            $fragmentTwo.appendChild($cloneConversation)
            $contacts.insertBefore($fragmentTwo, $divsChats[0])
        }


    }
})

socket.on('read-messages-ok', ({ conversationId, total, toUserId }) => {
    /* El toUser se justifica porque si soy yo el que esta leyendo el mensaje al otro no se le tiene
    que modificar, entonces lo que logramos con esto es que solo se me modifique a mi */
    const $chat = d.querySelector(`input[value="conversation-${conversationId}"][id="user-${toUserId}"]`)

    if ($chat) {
        //Restar al total
        const $countTotal = d.getElementById('cantMgs')
        let str = $countTotal.textContent.replace(/\(|\)/g, '')
        let num = parseInt(str, 10)
        $countTotal.textContent = (num - total) > 0 ? `(${num - total})` : ''

        //Poner en 0 el contador del chat
        let $count = $chat.parentElement.querySelector('.countMessages span')
        $count.textContent = `0`

        //Sacar el countMessages
        $chat.parentElement.querySelector('.countMessages').classList.add('invisible')
    }
})

//Opciones de chat
const $btnOptions = d.getElementById('btnOptionsChat') //F
const $optionsChat = d.getElementById('optionsChat') //F
const $btnDeleteChat = d.getElementById('btnDeleteChat')

const $contactInfo = d.getElementById('contactInfo')

$btnDeleteChat.addEventListener('click', () => {
    //Obtener valor del input radio seleccionado
    const $chats = d.querySelectorAll('input[name="contact"]')

    const $chat = Array.from($chats).find(c => c.checked === true)
    const chatId = $chat.value.split('-')[1]

    axios.delete(`/chat/delete-chat/${chatId}`, {
        headers: {
            'CSRF-Token': token
        }
    })
        .then((res) => {
            closeConversation(() => {
                //Eliminar el div con el usuario de las conversaciones
                $chat.parentElement.remove()
            })
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => { })
})

//Mas info del usuario
const $btnMoreInfo = d.getElementById('btnContactInfo')
//Cerrar info del usuario
const $btnClosePersonalInfo = d.getElementById('btnClosePersonalInfo')
const $nameContact = d.getElementById('nameProfileConversation')

$btnMoreInfo.addEventListener('click', () => {
    //Buscar informacion del usuario
    getUserInfo()
})

$btnClosePersonalInfo.addEventListener('click', () => {
    //Ocultamos el moreInfo
    $contactInfo.classList.add('translate-x-96')
})


function getUserInfo() {
    axios.get(`/users/api/id/${userId}`)
        .then((res) => {
            const { user } = res.data

            //Mostramos el moreInfo
            $contactInfo.classList.remove('translate-x-96')

            //Completamos los campos
            $contactInfo.querySelector('#background').style.backgroundImage = user.cover_url ? `url(/img/covers/${user.cover_url})` : 'url(/img/covers/greenViolet.png)'
            $contactInfo.querySelector('#photoInfo').style.backgroundImage = user.image_url ? `url(/img/profiles/${user.image_url})` : 'url(/img/profiles/profilePredeterminated.png)'

            $contactInfo.querySelector('#nameMoreInfo').textContent = `${user.name} ${user.lastname}`
            $contactInfo.querySelector('#usernameMoreInfo').textContent = user.username

            $contactInfo.querySelector('#linkUserMoreInfo').setAttribute('href', `/users/${user.username}`)

        })
        .catch((err) => { })
        .finally(() => { })
}

//Frontend

d.addEventListener('click', (e) => {
    if (e.target.id != 'btnOptionsChat') {
        $optionsChat.classList.add('hidden')
    }

    // Verificar si el clic ocurrió dentro del div "contactInfo" o no
    if (e.target !== $contactInfo && !$contactInfo.contains(e.target)) {
        //Ocultamos el moreInfo
        $contactInfo.classList.add('translate-x-96')
    }

    //Si hago click en el nombre de la conversacion
    if (d.getElementById("contactHeader").contains(e.target)) {
        getUserInfo()
    }
})

$btnOptions.addEventListener('click', () => {
    $optionsChat.classList.toggle('hidden')
})

const $btnCloseChat = d.getElementById('btnCloseChat')

$btnCloseChat.addEventListener('click', () => {
    closeConversation()
})



export {
    socket,
    token
}