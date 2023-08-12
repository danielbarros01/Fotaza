const $btnLeft = document.getElementById('btnLeft')
const $btnRight = document.getElementById('btnRight')
const $calle = document.querySelector(".calle")
const $categories = document.querySelector(".categories")


let calleAncho = $calle.clientWidth;
let containerAncho = $categories.clientWidth

let move = 80
let maxMove = calleAncho - containerAncho
let moveCount = 0

$btnLeft.addEventListener('click', (e) => {
    console.log('aqui')
    moveCount += move;

    if (moveCount >= 0) moveCount = 0

    $calle.style.transform = `translateX(${moveCount}px)`
})

$btnRight.addEventListener('click', (e) => {
    console.log('aqui')
    moveCount -= move;

    if (moveCount <= -maxMove) moveCount = -maxMove;

    $calle.style.transform = `translateX(${moveCount}px)`

})

window.addEventListener('resize', () => {
    calleAncho = $calle.clientWidth;
    containerAncho = $categories.clientWidth
    maxMove = calleAncho - containerAncho
});