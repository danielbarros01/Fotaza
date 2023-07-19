import axios from 'axios'

const $average = document.getElementById('averageRating')
const $totalOpinions = document.getElementById('totalOpinions')
const $stars = document.querySelectorAll(".starGeneral")

const url = window.location.href;
const parts = url.split("/");
const idPublication = parts[parts.length - 1];

axios.get(`/rating/overall/${idPublication}`)
    .then(response => {
        console.log(response.data)

        const count = response.data.count
        const average = response.data.average

        $totalOpinions.textContent = `${response.data.count} ${count == 1 ? 'valoración' : 'valoraciones'}`
        $average.textContent = average


        for (let i = 0; i < Math.floor(average); i++) {
            $stars[i].classList.add('checked');
        }
    })
    .catch(err => { })