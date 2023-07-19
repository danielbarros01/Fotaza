import axios from 'axios'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

const $noComments = document.getElementById('noComments')
const $sectionComments = document.getElementById('generalComments')
const $template = document.getElementById('templateComment2').content
const $fragment = document.createDocumentFragment()
const $seeMoreButton = document.getElementById('seeMoreButton');

const url = window.location.href;
const parts = url.split("/");
const publicationId = parts[parts.length - 1];

let page = 1;
const pageSize = 4;

//Traigo los comentarios
getMoreComments(verifyNoComments)

//Cuando le doy click a ver más
$seeMoreButton.addEventListener('click', () => {
    getMoreComments()
})

//Traer mas comentarios
function getMoreComments(cb) {
    axios.get(`/comments/${publicationId}?page=${page}&pageSize=${pageSize}`)
        .then(response => {
            const comentarios = response.data;

            //Armar esqueletos de comentarios y Agregarlos al DOM
            comentarios.forEach(c => {
                addCommentDom(c)
            });

            //agrego todos los comentarios al dom
            $sectionComments.appendChild($fragment)

            // Mostrar u ocultar el botón "Ver más"
            if (comentarios.length < pageSize) {
                $seeMoreButton.classList.add('hidden')
            } else {
                $seeMoreButton.classList.remove('hidden')
            }

            if(page == 1){
                cb()
            }

            page++
        })
        .catch(() => {
            console.error('Error al obtener los comentarios');
        })
}

//Agregar comentario al DOM
function addCommentDom(comment) {
    $template.querySelector(".commentUserImage").style.backgroundImage = `url(${comment.user.image_url})`
    $template.querySelector(".commentTimeThatPassed").textContent = comment.timeThatPassed
    $template.querySelector(".commentFullName").textContent = `${comment.user.name} ${comment.user.lastname}`
    $template.querySelector(".commentDescription").textContent = comment.description


    let $clone = document.importNode($template, true)

    // Obtén el nuevo botón de opciones del comentario recién agregado
    const $newButton = $clone.querySelector('.btnCommentOptions');

    $fragment.appendChild($clone)

    const myId = document.querySelector('meta[name="my-id"]').getAttribute('content')
    if (comment.user.id == myId) {
        $newButton.classList.remove('hidden')
        addOptionsToButton($newButton, comment.id)
    }
}

//Opciones de eliminacion para el usuario logueado si tiene comentarios
function addOptionsToButton(btn, commentId) {
    btn.addEventListener('click', () => {
        const $options = btn.parentElement.querySelector('.commentOptions');
        $options.classList.toggle('hidden');

        const $btnDelete = $options.querySelector('.btnCommentDelete');

        $btnDelete.addEventListener('click', () => {
            const myId = document.querySelector('meta[name="my-id"]').getAttribute('content')

            axios
                .delete('/comments/delete', {
                    headers: {
                        'CSRF-Token': token,
                    },
                    data: {
                        commentId,
                        publicationId,
                        myId
                    },
                })
                .then((response) => {
                    btn.closest('.comment').remove();
                })
                .catch((error) => {
                    console.error('Error al eliminar un comentario');
                });
        });
    });
}

function verifyNoComments(){
    if($sectionComments.childElementCount === 0){
        $noComments.classList.remove('hidden')
    }else{
        $noComments.classList.add('hidden')
    }
}
