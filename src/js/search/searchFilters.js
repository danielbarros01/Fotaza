const $btn = document.getElementById('btnFilters')
const $sectionFilters = document.querySelector('.filters')

let count = 0

$btn.addEventListener('click', () => {
    if (!count) {
        $sectionFilters.classList.remove('hidden')

        setTimeout(() => {
            $sectionFilters.classList.remove('opacity-0')
        }, 200);

        count = 1
    } else {
        $sectionFilters.classList.add('opacity-0')

        setTimeout(() => {
            $sectionFilters.classList.add('hidden')
        }, 200);

        count = 0
    }

})