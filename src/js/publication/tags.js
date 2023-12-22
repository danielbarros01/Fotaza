function maxTags(tags, $spanErrTag) {
    if (tags.length == 3) {
        $spanErrTag.textContent = 'Máx 3 etiquetas'
        $spanErrTag.classList.remove('hidden')

        return true
    } else {
        $spanErrTag.textContent = null
        $spanErrTag.classList.add('hidden')

        return false
    }
}

function deleteTag(ev, tags) {
    const $tagDelete = ev.target.closest('.tag');
    const textTag = $tagDelete.querySelector('li').textContent;
    const index = tags.indexOf(textTag);

    if (index > -1) {
        tags.splice(index, 1);

        //Evento etiqueta eliminada
        const tagEvent = new CustomEvent('tagRemoved', { detail: { tag: textTag } })
        // Disparar el evento personalizado
        document.dispatchEvent(tagEvent);
    }

    $tagDelete.remove();
}

function createTagElement(textTag) {
    const $div = document.createElement("div");
    const $li = document.createElement("li");
    const $span = document.createElement("span");

    $span.innerHTML = '<svg style="enable-background:new 0 0 24 24;" version="1.1" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="info"/><g id="icons"><path d="M14.8,12l3.6-3.6c0.8-0.8,0.8-2,0-2.8c-0.8-0.8-2-0.8-2.8,0L12,9.2L8.4,5.6c-0.8-0.8-2-0.8-2.8,0   c-0.8,0.8-0.8,2,0,2.8L9.2,12l-3.6,3.6c-0.8,0.8-0.8,2,0,2.8C6,18.8,6.5,19,7,19s1-0.2,1.4-0.6l3.6-3.6l3.6,3.6   C16,18.8,16.5,19,17,19s1-0.2,1.4-0.6c0.8-0.8,0.8-2,0-2.8L14.8,12z" id="exit"/></g></svg>';
    $span.classList.add('btnDeleteTag');
    $div.classList.add('tag', 'flex', 'justify-between', 'items-center');
    $li.innerHTML = textTag;

    $div.appendChild($li);
    $div.appendChild($span);

    return $div;
}


/* 
Añade tag al dom
tag: array con los nombres de taggs
    $tag: input donde insertas el tag
    $tags: elemento del dom donde vas a insertar el nuevo tag
    $spanErrTag: el span donde se va a mostrar el error en caso de que haya 
*/
function addTags(tags, $tag, $tags, $spanErrTag, $btnDeletesTag = false, isUnlimited) {
    let $fragment = document.createDocumentFragment();

    //$tag por parametro
    $tag.addEventListener('keydown', function (e) {
        if (e.code == 'Enter') {
            e.preventDefault();

            const tagText = $tag.value

            addTag(tags, tagText.toLowerCase(), $tags, $spanErrTag, $fragment, isUnlimited = false)

            //Elimino el value~
            $tag.value = null
        }
    })
}

/* 
    $btnDeletesTag: botones de eliminar de los tags
    tags: array de tags
*/
function addDeleteButtons($btnDeletesTag, tags) {
    $btnDeletesTag.forEach(element => {
        element.addEventListener('click', (ev) => {
            deleteTag(ev, tags)
        })
    });
}

/* Agregar tag al dom */
function addTag(tags, tagText, $tags, $spanErrTag, $fragment, isUnlimited) {
    //$spanErrTag por parametro, si debo controlar maximo de 3 tags
    if (!isUnlimited) {
        if (maxTags(tags, $spanErrTag)) return
    }

    //que no exista el tag ya en el array
    if (tags.includes(tagText)) return

    if (tagText.length === 0) return

    if (maxLetters(tagText, $spanErrTag)) return

    //agregar al array el nuevo tag
    tags.push(tagText)

    //Crear tag en el dom
    $fragment.appendChild(createTagElement(tagText));

    //$tags por parametro
    $tags.appendChild($fragment);

    //Evento nueva etiqueta
    const tagEvent = new CustomEvent('tagAdded', { detail: { tag: tagText } })
    // Disparar el evento personalizado
    document.dispatchEvent(tagEvent);

    //ELIMINAR TAG del dom y del array
    const $btnDeletesTag = document.querySelectorAll('.btnDeleteTag')
    addDeleteButtons($btnDeletesTag, tags)
}


function maxLetters(tagText, $spanErrTag) {
    if (tagText.length > 15) {
        $spanErrTag.textContent = 'Máx 15 letras'
        $spanErrTag.classList.remove('hidden')

        return true
    } else {
        $spanErrTag.textContent = null
        $spanErrTag.classList.add('hidden')

        return false
    }
}

export {
    maxTags,
    deleteTag,
    createTagElement,
    addTags,
    addDeleteButtons,
    addTag
}