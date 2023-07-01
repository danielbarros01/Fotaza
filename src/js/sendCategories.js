const d = document

//Agarrar categorias
const categories = d.querySelectorAll(".category")

//Agarrar boton
const button = d.querySelector("#btnSendCategories")

//categorias seleccionadas
const categoriesSelected = []

const csrfToken = document.querySelector('#csrfToken').value;


categories.forEach((category) => {

    category.addEventListener("click", (e) => {
        //agarra el valor del input
        const valueId = e.target.children[0].value

        if (!categoriesSelected.includes(valueId)) {
            categoriesSelected.push(category.children[0].value)
            category.style.border = '4px solid #16FF00'
            console.log(categoriesSelected)
        } else {
            category.style.border = null
            const index = categoriesSelected.indexOf(category.children[0].value)
            categoriesSelected.splice(index, 1)
            console.log(categoriesSelected)
        }
    })

})

button.addEventListener('click', () => {
    const data = {
        categoriesSelected
    };

    console.log(csrfToken)


    // Crear el objeto de opciones para la solicitud POST
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken  // Agregar el token CSRF como encabezado personalizado
        },
        body: JSON.stringify(data)
    };


    fetch('/categories/select', options)
        .then(response => {
            if (response.ok) {
                window.location.href = "/publications"
            }
            throw new Error('Error en la solicitud');
        })
        .catch(error => { console.error(error); });
})