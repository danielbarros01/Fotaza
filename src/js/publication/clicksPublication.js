const $btnInfo = document.getElementById('btnInfoRightOfUse')
const $divInfoRightOfUse = document.getElementById('infoRightOfUse')

const $btnOptions = document.getElementById('btnOptions')
const $optionsPublication = document.getElementById('optionsPublication')


$btnInfo.addEventListener('click', () => {
  $divInfoRightOfUse.classList.toggle('hidden')
})

if ($btnOptions) {
  $btnOptions.addEventListener('click', () => {
    if ($optionsPublication)
      $optionsPublication.classList.toggle('hidden')
  })

}

document.addEventListener('click', (event) => {
  // Verificar si el clic ocurrió dentro de los elementos o en otro lugar
  const isClickInsideInfo = $divInfoRightOfUse.contains(event.target);
  const isClickInsideOptions = $optionsPublication ? $optionsPublication.contains(event.target) : null;
  const isClickInsideBtnInfo = $btnInfo.contains(event.target);
  const isClickInsideBtnOptions = $btnOptions && $btnOptions.contains(event.target);

  // Si el clic no ocurrió dentro de los elementos, ocultarlos
  if (!isClickInsideInfo && !isClickInsideOptions && !isClickInsideBtnInfo && !isClickInsideBtnOptions) {
    $divInfoRightOfUse.classList.add('hidden');
    if ($optionsPublication) {
      $optionsPublication.classList.add('hidden');
    }
  }
});