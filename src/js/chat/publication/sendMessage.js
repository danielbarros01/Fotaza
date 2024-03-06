const socket = io()

const $btn = document.getElementById('sendMessage')
const id = $btn.dataset.id

if($btn){
    $btn.addEventListener('click', function (event) {
        socket.emit('acquire', { publicationId: id, message: 'Quisiera adquirir su publicación. ¿Estaría dispuesto a venderla?' })
    })
}

socket.on('acquire-ok', (conversationId) => {
    console.log('Si puedes mandarle una solicitud', conversationId)

    window.location.href = `/chat/c/${conversationId}`
})

socket.on('acquire-not')