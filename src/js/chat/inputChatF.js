const d = document,
    $divMsg = d.querySelector('.sendMsg'),
    $textareaMsg = d.querySelector('#inputMessage')

$textareaMsg.addEventListener('input', function () {
    this.style.height = 'auto'
    this.style.height = this.scrollHeight + 'px'

    $divMsg.style.height = 'auto'
    $divMsg.style.height = this.scrollHeight + 'px'
})
