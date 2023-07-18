import axios from 'axios'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
const myId = document.querySelector('meta[name="my-id"]').getAttribute('content')

const $sectionComments = document.getElementById('generalComments')
const $template = document.getElementById('templateComment2').content
const $fragment = document.createDocumentFragment()

const url = window.location.href;
const parts = url.split("/");
const publicationId = parts[parts.length - 1];


let page = 1;
const pageSize = 4;

axios.get(`/comments/${publicationId}?page=${page}&pageSize=${pageSize}`)
    .then(response => {
        const comentarios = response.data;
        console.log(comentarios);
        //Armar esqueletos de comentarios y Agregarlos al DOM
        comentarios.forEach(c => {
            addCommentDom(c)
        });

        //agrego todos los comentarios al dom
        $sectionComments.appendChild($fragment)
    })
    .catch(err => {
        console.error(err);
    })


function addCommentDom(comment) {
    $template.querySelector(".commentUserImage").style.backgroundImage = `url(${comment.user.image_url})`
    $template.querySelector(".commentTimeThatPassed").textContent = comment.timeThatPassed
    $template.querySelector(".commentFullName").textContent = `${comment.user.name} ${comment.user.lastname}`
    $template.querySelector(".commentDescription").textContent = comment.description


    let $clone = document.importNode($template, true)

    // Obtén el nuevo botón de opciones del comentario recién agregado
    const $newButton = $clone.querySelector('.btnCommentOptions');

    $fragment.appendChild($clone)

    if (comment.user.id == myId) {
        $newButton.classList.remove('hidden')
        addOptionsToButton($newButton, comment.id)
    }
}

function addOptionsToButton(btn, commentId) {
    btn.addEventListener('click', () => {
        const $options = btn.parentElement.querySelector('.commentOptions');
        $options.classList.toggle('hidden');

        const $btnDelete = $options.querySelector('.btnCommentDelete');

        $btnDelete.addEventListener('click', () => {
            axios
                .delete('/comments/delete', {
                    headers: {
                        'CSRF-Token': token,
                    },
                    data: {
                        commentId,
                        publicationId,
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    btn.closest('.comment').remove();
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    });
}