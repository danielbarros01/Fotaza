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
                $stars[i].classList.add('checked');
                if (i < Math.floor(average)) {
                    $stars[i].classList.add('checked');
                } else {
                    $stars[i].classList.remove('checked');
                }
            }
        })
        .catch(err => { })
}


export {
    getOverallRating
}