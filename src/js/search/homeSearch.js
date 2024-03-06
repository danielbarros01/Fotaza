document.getElementById('formSearch').addEventListener('submit', function(event) {
    event.preventDefault();
    var searchValue = document.getElementById('inputSearch').value;

    if(!searchValue){
        searchValue = 'allPublications'
    }

    window.location.href = '/search/' + searchValue;
});

