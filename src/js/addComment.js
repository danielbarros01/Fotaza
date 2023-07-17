import axios from 'axios'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

const $sectionComments = document.getElementById('generalComments')
const $noComments = document.getElementById('noComments') || false
const $commentText = document.getElementById('commentText')
const $btnComment = document.getElementById('btnComment')
const $commentError = document.getElementById('commentError')
const $countText = document.getElementById('countText')

const $template = document.getElementById('templateComment').content
const $fragment = document.createDocumentFragment()

const url = window.location.href;
const parts = url.split("/");
const publicationId = parts[parts.length - 1];

//apenas se carga la pagina
addOptionsForComments()


$btnComment.addEventListener('click', () => {
    const text = $commentText.value.trim()

    if (text === '') {
        $commentError.classList.remove('invisible')
        return $commentError.textContent = 'Escriba un texto'
    }

    if (text.length < 4) {
        $commentError.classList.remove('invisible')
        return $commentError.textContent = 'Minimo 4 caracteres'
    }

    if (text.length > 500) {
        $commentError.classList.remove('invisible')
        return $commentError.textContent = 'Maximo 500 caracteres'
    }

    axios.post('/comments/add', {
        publicationId,
        description: text
    }, { headers: { 'CSRF-Token': token } })
        .then(function (response) {
            $template.querySelector(".commentTimeThatPassed").textContent = 'Recién'
            $template.querySelector(".commentDescription").textContent = text
            $template.querySelector(".btnCommentDelete").setAttribute('data-comment-id', response.data.commentId);


            let $clone = document.importNode($template, true)

            // Obtén el nuevo botón de opciones del comentario recién agregado
            const $newButton = $clone.querySelector('.btnCommentOptions');
            
            $fragment.appendChild($clone)

            const $existingElement = $sectionComments.firstChild;
            if ($existingElement) {
                $sectionComments.insertBefore($fragment, $existingElement)
            } else {
                $sectionComments.appendChild($fragment)
            }


            addOptionsToButton($newButton);

            $commentText.value = ''
            $countText.textContent = 0;

        })
        .catch(function (error) {
            console.log(error);
        });
})

function addOptionsToButton(btn) {
    btn.addEventListener('click', () => {
        const $options = btn.parentElement.querySelector('.commentOptions');
        $options.classList.toggle('hidden');

        const $btnDelete = $options.querySelector('.btnCommentDelete');
        const commentId = $btnDelete.dataset.commentId;

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

//Funcion que permite eliminar comentario
function addOptionsForComments() {
    const $btnOptions = document.querySelectorAll('.btnCommentOptions')
    // Opciones de comentario
    $btnOptions.forEach(addOptionsToButton);
}


$commentText.addEventListener('keydown', () => {
    $commentError.classList.add('invisible')
    $commentError.textContent = null
})

//Conteo de texto
let maxLength = 500
$commentText.addEventListener('input', () => {
    const text = $commentText.value;
    const count = text.length;

    $countText.textContent = count;

    if (count > maxLength) {
        $countText.classList.add('text-red-600');
    } else {
        $countText.classList.remove('text-red-600');
    }
});
//setTimeout de 0 ms para que el evento paste se maneje después de que el texto se haya pegado 
$commentText.addEventListener('paste', (event) => {
    setTimeout(() => {
        const text = $commentText.value;
        const count = text.length;

        $countText.textContent = count;

        if (count > maxLength) {
            $countText.classList.add('text-red-600');
        } else {
            $countText.classList.remove('text-red-600');
        }
    }, 0);
});