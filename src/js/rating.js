import axios from 'axios'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

const stars = document.querySelectorAll(".star")

const alertLogin = document.querySelector('#alertLogin')
const btnCloseAlertLogin = document.querySelector('#btnCloseAlertLogin')

let numero = 0
const url = window.location.href;
const parts = url.split("/");
const idPublication = parts[parts.length - 1];

stars.forEach((star, index) => {
    star.addEventListener("click", async () => {
        numero = index + 1

        axios.post(`/rating/save/${idPublication}`, { stars: numero }, { headers: { 'CSRF-Token': token } })
            .then(function (response) {
                addChecked(stars, index)
                deleteChecked(stars, index)
                console.log(response.data);
            })
            .catch(function (error) {
                const errKey = error.response.data.key
                if (errKey && errKey == 'not user') {
                    alertLogin.classList.remove('hidden')
                }
            });
    })
})

function addChecked(stars, index) {
    for (let i = 0; i <= index; i++) {
        stars[i].classList.add("checked");
    }
}

function deleteChecked(stars, index) {
    for (let i = index + 1; i < stars.length; i++) { //recorre todos los elementos star después del índice actual
        stars[i].classList.remove("checked")
    }
}


document.addEventListener("DOMContentLoaded", function () {
    axios.get(`/rating/${idPublication}`)
        .then(function (response) {
            const rating = response.data.value;
            addChecked(stars, rating - 1);
        })
        .catch(function (error) {
            const errKey = error.response.data.key
            if (errKey && errKey == 'not user') {
                console.log('Debera iniciar sesion para calificar la imagen')
            }
        })
});

btnCloseAlertLogin.addEventListener("click", function () {
    alertLogin.classList.add('hidden')
})
