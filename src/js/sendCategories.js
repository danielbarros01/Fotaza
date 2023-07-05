const d = document

//Agarrar categorias
const categories = d.querySelectorAll(".category")

//Agarrar boton
const button = d.querySelector("#btnSendCategories")

//categorias seleccionadas
const categoriesSelected = []

const csrfToken = document.querySelector('#csrfToken').value;

categories.forEach((category) => {
    if(category.dataset.categoryUser){
        agregar(categoriesSelected, category)
    }
    
    category.addEventListener("click", (e) => {
        //agarra el valor del input
        const valueId = e.target.children[0].value

        if (!categoriesSelected.includes(valueId)) {
            agregar(categoriesSelected, category)
        } else {
            eliminar(categoriesSelected, category)
        }
    })

})

button.addEventListener('click', () => {
    const data = {
        categoriesSelected
    };

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
                return window.location.href = "/"
            }
            throw new Error('Error en la solicitud');
        })
        .catch(error => { console.error(error); });
})


function agregar(array, category){
    array.push(category.children[0].value)
    category.style.border = '4px solid #16FF00'
}

function eliminar(array, category){
    category.style.border = null
    const index = array.indexOf(category.children[0].value)
    array.splice(index, 1)
}