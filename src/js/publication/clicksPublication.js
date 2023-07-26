const $btnInfo = document.getElementById('btnInfoRightOfUse')
const $divInfoRightOfUse = document.getElementById('infoRightOfUse')

const $btnOptions = document.getElementById('btnOptions')
const $optionsPublication = document.getElementById('optionsPublication')


$btnInfo.addEventListener('click', () => {
    $divInfoRightOfUse.classList.toggle('hidden')
})

if ($btnOptions) {
    $btnOptions.addEventListener('click', () => {
        $optionsPublication.classList.toggle('hidden')
    })

}

