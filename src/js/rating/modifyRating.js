import axios from 'axios'
import { getOverallRating } from './getOverallRating.js'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

let stars = document.querySelectorAll(".star")

const alertLogin = document.querySelector('#alertLogin')
const btnCloseAlertLogin = document.querySelector('#btnCloseAlertLogin')

let numero = 0 //num of stars
const url = window.location.href;
const parts = url.split("/");
const idPublication = parts[parts.length - 1];
let ultimaEstrella = null

//Recorro cada estrella
stars.forEach((star, index) => {
    star.addEventListener("click", async () => {
        numero = index + 1

        //Agarrar la ultima estrella que tenga el checked
        console.log(stars)
        console.log(star)

        const remove = sameStar(star) //Hay que eliminar la puntuación?
        if (remove) {
            axios.delete(`/rating/delete/${idPublication}`, { headers: { 'CSRF-Token': token } })
                .then(function (response) {
                    console.log(response)
                    deleteChecked(stars, -1)
                    ultimaEstrella = null
                    getOverallRating()
                })
                .catch(function (error) {
                    const errKey = error.response.data.key
                    if (errKey && errKey == 'not user') {
                        alertLogin.classList.remove('hidden')
                    }
                });

            return;
        }

        //Si le estoy dando click a esa misma entonces tengo que eliminar la valoracion

        axios.post(`/rating/save`, { idPublication, stars: numero }, { headers: { 'CSRF-Token': token } })
            .then(function (response) {
                addChecked(stars, index)
                deleteChecked(stars, index)
                ultimaEstrella = stars[index];
                getOverallRating()
            })
            .catch(function (error) {
                const errKey = error.response.data.key
                if (errKey && errKey == 'not user') {
                    alertLogin.classList.remove('hidden')
                }
            });
    })
})

function getStars() {
    return document.querySelectorAll(".star")
}

//saber si la estrella que le hago click es la ultima que tiene checked, para saber si debo eliminar la puntuacion
function sameStar(star) {
    // Iterar en sentido inverso desde el último elemento hasta el primero
    for (let i = stars.length - 1; i >= 0; i--) {
        const star = stars[i];
        if (star.classList.contains('checked')) {
            ultimaEstrella = star
            break // Detener el bucle una vez que encuentres el último elemento con la clase
        }
    }

    if (ultimaEstrella == star) {
        return true
    }
}

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
            const rating = response.data.value
            addChecked(stars, rating - 1)
        })
        .catch(function (error) {
            const errKey = error.response.data.key
            if (errKey && errKey == 'not user') {
                console.log('Debera iniciar sesion para calificar la imagen')
            }
        })
});


if (btnCloseAlertLogin) {
    //Cerrar alerta de iniciar sesion
    btnCloseAlertLogin.addEventListener("click", function () {
        alertLogin.classList.add('hidden')
    })
}

