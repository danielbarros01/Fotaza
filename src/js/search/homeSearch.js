document.getElementById('formSearch').addEventListener('submit', function(event) {
    event.preventDefault();
    var searchValue = document.getElementById('inputSearch').value;
    window.location.href = '/search/' + searchValue;
});

