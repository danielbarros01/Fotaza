//Validar campos
function checkFields($form) {
    const formData = new FormData($form)
    //debugger
    if (!formData.get('category')) {
        formData.set('category', '')
    }

    if (!formData.get('typePost')) {
        formData.set('typePost', '')
    }

    if (!formData.get('typeSale')) {
        formData.set('typeSale', '')
    }

    const emptyFields = [];

    if (formData.get('typePost') != 'sale') {
        //No hace falta validar ni tipo de venta ni precio
        formData.delete('typeSale')
        formData.delete('price')
    }

    let ignoreWatermark = false
    //debugger
    if ((formData.get('typePost') == 'sale' && formData.get('typeSale') != 'unique') || formData.get('license') != 2) { //2 es el id de copyright
        //Ignorar datos de marca de agua personalizado
        ignoreWatermark = true
    }


    for (let [name, value] of formData.entries()) {
        //debugger

        //Si el valor del campo esta vacio
        if (!value) {

            if (ignoreWatermark && (name != 'optionWatermark' && name != 'imageWatermark' && name != 'textWatermark')) {
                emptyFields.push(name);
            }

        }
    }
    return emptyFields;
}

//Validar que es de tipo imagen
function validationImage($form, arrayErrors) {
    /* Imagen */
    const formData = new FormData($form)
    const file = formData.get('image')

    if (file.size === 0) {
        arrayErrors.push('image')
    }

    if (file.size / (1024 * 1024) > 15) {
        arrayErrors.push('imageMaxSize')
    }
}

//Para mostrar los errores en los span
function viewErrors(errors, clientOrServer, spanTitle, spanCategory, spanImg, spanRightOfUse, spanTypePost, spanErrTypeSale, spanErrPrice, spanErrCurrency) {

    errors.forEach(error => {
        switch (clientOrServer == 'server' ? error.path : error) {
            case 'title':
                spanTitle.textContent = error.msg || 'El titulo no debe ir vacio'
                spanTitle.classList.remove('hidden')
                break;
            case 'category':
                spanCategory.textContent = error.msg || 'Debe seleccionar una categoria'
                spanCategory.classList.remove('hidden')
                break;
            case 'image':
                spanImg.textContent = error.msg || 'Debe seleccionar una imagen'
                spanImg.classList.remove('hidden')
                break;
            case 'rightsOfUse':
                spanRightOfUse.textContent = error.msg || 'Debe seleccionar un derecho de uso disponible'
                spanRightOfUse.classList.remove('hidden')
                break;
            case 'typePost':
                spanTypePost.textContent = error.msg || 'Debe seleccionar el tipo de publicación'
                spanTypePost.classList.remove('hidden')
                break;
            case 'typeSale':
                spanErrTypeSale.textContent = error.msg || 'Seleccione un tipo de venta'
                spanErrTypeSale.classList.remove('hidden')
                break;

            case 'price':
                if (spanErrPrice) {
                    spanErrPrice.textContent = error.msg || 'Ingrese el monto'
                    spanErrPrice.classList.remove('hidden')
                }
                break;

            case 'currency':
                spanErrCurrency.textContent = error.msg || 'Ingrese un tipo de moneda valido'
                spanErrCurrency.classList.remove('hidden')
                break;
            case 'imageMaxSize':
                spanImg.textContent = error.msg || 'La imagen solo puede pesar hasta 15mb'
                spanImg.classList.remove('hidden')
                break;
            case 'critical':
                alert('Atención: Algunos de los datos del formulario han sido modificados. Por favor, inicia sesión nuevamente')
                window.location.href = `/auth/login`
                break;
        }
    })
}

export {
    checkFields,
    validationImage,
    viewErrors
}