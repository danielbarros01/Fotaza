import axios from "axios"
import { commonMessage, buyMessage } from "./newMessagesDom.js"
import { socket } from "../chat.js"
import { buttonFunctionality } from "../acceptOrDecline.js"

const d = document

const $templateSent = d.getElementById('templateMessageSentContainer').content
const $templateSentBuy = d.getElementById('templateMessageBuySentContainer').content
const $templateReceived = d.getElementById('templateMessageReceivedContainer').content
const $templateReceivedBuy = d.getElementById('templateMessageBuyReceivedContainer').content

const $sectionConversation = d.querySelector('.sectionConversation')
const $presentation = d.querySelector('.presentation')
const $nameUser = $sectionConversation.querySelector('#nameProfileConversation span')
const $imgUser = $sectionConversation.querySelector('#photoProfileConversation img')

/* Mostrar chat cuando selecciono alguno */
let userId;

//Traer los chats disponibles
function getChatsDOM() {
    const $chats = d.querySelectorAll('input[name="contact"]')
    console.log($chats)
    $chats.forEach($chat => {
        //Deselecciono por defecto
        $chat.checked = false;

        addListenerChange($chat)
    })
}

function addListenerChange($chat) {
    $chat.addEventListener('change', async function () {
        const idConversation = this.value.split('-')[1]

        const res = await axios.get(`/chat/api/c/${idConversation}`)
        const conversation = res.data.conversation

        const messages = conversation.messages

        //Funcion para abrir el chat al costado derecho
        openConversation(this, () => {
            showMessages(messages)
            userId = this.id.split('-')[1]

            //Leer mensajes
            socket.emit('read-messages', conversation.id)
            debugger
            buttonFunctionality()
        })
    })
}

function openConversation(input, cb) {
    $presentation.classList.add('hidden')
    $sectionConversation.classList.remove('hidden')

    //2 opciones, solicitud ajax o recuperar el hermano del input "label" y tomar los datos del usuario de alli
    const $label = input.nextSibling
    const name = $label.querySelector('.name span').textContent
    const valueImg = $label.querySelector('.photo img').src

    $nameUser.textContent = name
    $imgUser.src = valueImg

    cb()
}

function showMessages(messages, $messages = d.getElementById('messages')) {
    const $fragment = d.createDocumentFragment()
    messages.forEach(msg => {
        let $clone

        if (msg.purchase) { //si es mensaje de compra
            if (msg.mine) { //si el mensaje es mio
                buyMessage($templateSentBuy, msg)
                $clone = d.importNode($templateSentBuy, true)
            } else {
                buyMessage($templateReceivedBuy, msg)
                $clone = d.importNode($templateReceivedBuy, true)
            }
        } else {
            if (msg.mine) {
                commonMessage($templateSent, msg)
                $clone = d.importNode($templateSent, true)
            } else {
                commonMessage($templateReceived, msg)
                $clone = d.importNode($templateReceived, true)
            }

        }

        $fragment.appendChild($clone)
    })

    $messages.innerHTML = ''
    $messages.appendChild($fragment)
    $messages.scrollTop = $messages.scrollHeight
}

function closeConversation(cb) {
    const $messages = d.getElementById('messages')
    
    $presentation.classList.remove('hidden')
    $sectionConversation.classList.add('hidden')

    $messages.innerHTML = ''
    $nameUser.textContent = ''
    $imgUser.src = ''

    //Buscar el input radio
    const input = d.getElementById(`user-${userId}`)
    //Deseleccionar el input radio
    input.checked = false

    //Hacer null el usuario que estaba seleccionado
    userId = null

    cb()
}


export {
    getChatsDOM,
    userId,
    $templateSent,
    $templateSentBuy,
    $templateReceived,
    $templateReceivedBuy,
    addListenerChange,
    closeConversation
}