import axios from 'axios'

const section = document.querySelector(".allCategories")
const $template = document.getElementById('categoryOfAll').content
const $fragmentSecciones = document.createDocumentFragment()
const $btnViewAllCategories = document.getElementById('btnViewAllCategories')
const $btnCloseAllCategories = document.getElementById('btnCloseAllCategories')
const $modalAllCategories = document.getElementById('modalAllCategories')

axios.get('/categories')
  .then(function (response) {
    // handle success
    const categorias = response.data
    const letras = []

    //ordenar array de actores
    const categoriasOrdenadas = categorias.sort((a, b) => a.name.localeCompare(b.name))

    categoriasOrdenadas.forEach(category => {
      const letra = getLetraInicial(category.name)
      if (!letras.includes(letra)) {
        letras.push(letra)
      }
    })

    //agregar secciones y sus categorias
    const letrasOrdenadas = letras.sort()
    letrasOrdenadas.forEach(letra => {
      addSector(letra, categoriasOrdenadas.filter(category => category.name.startsWith(letra)))
    })
    section.appendChild($fragmentSecciones)
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })

// Función para obtener la letra inicial de un nombre
function getLetraInicial(nombre) {
  return nombre.charAt(0).toUpperCase();
}

function addCategory(category, $fragment) {
  //$template.querySelector('input[name="category"]').value = category.id
  //$template.querySelector('input[name="category"]').id = `category-${category.id}`

  $template.querySelector("label").setAttribute('for', `category-${category.id}`)

  $template.querySelector(".category").style.backgroundImage = `url(/img/backgroundsCategories/${category.image})`;
  $template.querySelector("#name").textContent = category.name


  let $clone = document.importNode($template, true)
  $fragment.appendChild($clone)
}

function addSector(letra, categories) {
  const $fragment = document.createDocumentFragment()

  const newDiv = document.createElement("div");
  newDiv.classList.add('sectionLetra')
  newDiv.setAttribute('id', `section-${letra}`)
  newDiv.classList.add('flex')
  const containerLetra = document.createElement("div");
  containerLetra.classList.add('container-letra')

  const containerCategories = document.createElement("div");
  containerCategories.classList.add('container-categories')

  const text = document.createElement("p")
  text.classList.add('letra')
  text.textContent = letra

  containerLetra.appendChild(text) //agrego la letra

  newDiv.appendChild(containerLetra)
  newDiv.appendChild(containerCategories)

  //agrego las categories que existan para esta seccion
  categories.forEach(category => {
    addCategory(category, $fragment)
    arrayCategories.push(category)
  })

  containerCategories.appendChild($fragment)

  $fragmentSecciones.appendChild(newDiv)

  sectionsLetra.push(newDiv)
}


$btnViewAllCategories.addEventListener("click", () => {
  $modalAllCategories.classList.remove("ocultar")
  $modalAllCategories.classList.add("mostrar")
})

$btnCloseAllCategories.addEventListener("click", () => {
  ocultarModal()
})

function ocultarModal() {
  $modalAllCategories.classList.remove("mostrar")
  $modalAllCategories.classList.add("ocultar")
}



//Estilo para cuando selecciono un label
let prevLabels = []

document.addEventListener('click', (e) => {
  if (e.target.name == 'category') { //si le doy click a un input de nombre category
    prevLabels.forEach(label => {
      label.firstChild.classList.remove('labelSelected')
    })

    const input = e.target
    const labels = document.querySelectorAll(`label[for="${input.id}"]`)
    prevLabels = labels

    labels.forEach(label => {
      label.firstChild.classList.add('labelSelected')
    })

    ocultarModal()
  }
})



//Buscador dentro del modal
let sectionsLetra = []
let arrayCategories = []

document.addEventListener('DOMContentLoaded', () => {
  const $buscador = document.getElementById('search')

  $buscador.addEventListener('keyup', () => {
    const palabra = $buscador.value.toLowerCase()

    sectionsLetra.forEach((section) => {
      if (palabra === "" || section.innerHTML.toLowerCase().includes(palabra)) {
        section.classList.remove("hidden");
      } else {
        section.classList.add("hidden");
      }
    });
  });
});



