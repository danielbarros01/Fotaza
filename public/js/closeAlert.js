var closeButton = document.getElementById('btnCloseAlert')

closeButton.addEventListener('click', function () {
    var alertElement = this.closest('[role="alert"]') //se utiliza para encontrar el ancestro más cercano de un elemento que coincide con un selector dado.

    // Ocultar el alert
    alertElement.style.display = 'none';
})