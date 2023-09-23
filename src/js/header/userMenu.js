const d = document

const imgProfile = d.getElementById('profileImage')
const menu = d.getElementById('menu')

imgProfile.addEventListener('click', e => {
    menu.classList.toggle('hidden')
    console.log('si')
    e.stopPropagation()
})