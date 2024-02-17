import axios from "axios";

const d = document,
    $photo = d.querySelector('#photoProfileConversation img'),
    $name = d.querySelector('#nameProfileConversation  span')


//Url
const currentUrl = window.location.href;
const url = new URL(currentUrl);

//Por si ya viene lo de mandar un mensaje a un usuario
const toUser = url.searchParams.get("touser");

if (toUser) {
    getUser(toUser)
}


function getUser(toUser) {
    axios.get(`/users/api/${toUser}`)
        .then(res => {
            const { user } = res.data
            console.log(res);
            $photo.src = `/img/profiles/${user.image_url}`
            $name.textContent = `${user.name} ${user.lastname}`
        })
        .catch(err => {
            console.log(err);
        })
        .finally(() => { })
}



//Buscar los contactos
const $chatSearch = d.getElementById('inputSearchContacts')

$chatSearch.addEventListener('input', (e) => {
    //Obtenemos todos los contactos
    const $contacts = d.getElementById('contacts') //ul
    const labels = Array.from($contacts.querySelectorAll('label'))

    labels.forEach(l => {
        l.querySelector('.name span').textContent.toLowerCase().includes(e.target.value.toLowerCase())
            ? l.classList.remove('hidden')
            : l.classList.add('hidden')
    })
});