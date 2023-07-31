import axios from 'axios'

const $average = document.getElementById('averageRating')
const $totalOpinions = document.getElementById('totalOpinions')
const $stars = document.querySelectorAll(".starGeneral")

const url = window.location.href;
const parts = url.split("/");
const idPublication = parts[parts.length - 1];

getOverallRating()

function getOverallRating() {
    axios.get(`/rating/overall/${idPublication}`)
        .then(response => {
            const count = response.data.count
            const average = response.data.average

            $totalOpinions.textContent = `${response.data.count} ${count == 1 ? 'valoración' : 'valoraciones'}`
            $average.textContent = average


            for (let i = 0; i < $stars.length; i++) {
                // Agrega la clase "checked" a las estrellas con índice menor que el valor promedio
                if (i < Math.floor(average)) {
                    $stars[i].classList.add('checked');
                } else { // Elimina la clase "checked" de las estrellas con índice mayor o igual al valor promedio
                    $stars[i].classList.remove('checked');
                }
            }
        })
        .catch(err => { })
}


export {
    getOverallRating
}