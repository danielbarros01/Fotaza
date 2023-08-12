const $inputs = document.querySelectorAll('input[name="typePost"]');
const $containerCardSale = document.getElementById('venta')
const $containerTypesVenta = document.querySelector('.typesVenta')
const $containerInputPrice = document.querySelector('.container-input-price')
const $inputPrice = document.getElementById('input-price')
const $radioTypesSale = document.querySelectorAll('input[name="typeSale"]')
const $currency = document.querySelector('select[name="currency"]')

const $spanErrTypes = document.getElementById('errTypes')
const $spanErrTypeSale = document.getElementById('errTypeSale')
const $spanErrPrice = document.getElementById('errPrice')

/* Los inputs Libre y Venta */
$inputs.forEach(input => {
    input.addEventListener('change', e => {
        const selected = e.target
        $spanErrTypes.textContent = null
        $spanErrTypes.classList.add('hidden')

        $spanErrPrice.textContent = null
        $spanErrPrice.classList.add('hidden')

        if (selected.id == 'input-free') {
            ocultarTypesVenta()
            ocultarPrice()
        }

        if (selected.id == 'input-sale') {
            mostrarTypesVenta()
            mostrarPrice()
        }
    })
})

/*  Cuando selecciono un tipo de venta */
$radioTypesSale.forEach(radio => {
    radio.addEventListener('change', () => {
        $spanErrTypeSale.classList.add('hidden')
    })
})

/* Cuando cambio el tipo de currency reseteo el valor del input */
$currency.addEventListener('change', () => {
    $inputPrice.value = ''
    $spanErrPrice.textContent = null;
    $spanErrPrice.classList.add('hidden');
})
/*  */

/* Para que el input price solo acepte numeros*/
$inputPrice.addEventListener('input', (e) => {
    const currency = $currency.value
    let limit = 60000

    if (currency === 'ars') {
        limit = 4000000;  // 4 millones para ARS
    } else if (currency === 'us') {
        limit = 60000;    // 60 mil para USD
    } else {
        $spanErrPrice.textContent = `Debe seleccionar una moneda que sea ARS o US`;
        $spanErrPrice.classList.remove('hidden');
    }

    let inputText = e.target.value.replace(/[^\d]/g, ''); // Elimina todo excepto los números

    // Limitar a 11 caracteres
    inputText = inputText.slice(0, 11);

    // Limitar según la moneda
    const numericValue = parseInt(inputText, 10);
    if (numericValue > limit) {
        inputText = limit.toString();
        $spanErrPrice.textContent = `El valor máximo es ${formatNumberInput(limit.toString())}`;
        $spanErrPrice.classList.remove('hidden');
    } else {
        $spanErrPrice.textContent = null;
        $spanErrPrice.classList.add('hidden');
    }

    const formattedText = formatNumberInput(inputText);
    e.target.value = formattedText;
});

/* Formatear el numero correctamente */
function formatNumberInput(inputText) {
    if (inputText.length <= 3) {
        return inputText;
    } else if (inputText.length <= 6) {
        return `${inputText.slice(0, -3)}.${inputText.slice(-3)}`;
    } else {
        const integerPart = inputText.slice(0, -6);
        const decimalPart = inputText.slice(-6, -3);
        const fractionalPart = inputText.slice(-3);
        return `${integerPart}.${decimalPart}.${fractionalPart}`;
    }
}
/*  */

/* DOM */
function ocultarTypesVenta() {
    $containerTypesVenta.classList.add('h-0')
    $containerTypesVenta.classList.remove('h-24')
}

function mostrarTypesVenta() {
    $containerTypesVenta.classList.remove('h-0')
    $containerTypesVenta.classList.add('h-24')
}

function ocultarPrice() {
    $containerInputPrice.classList.remove('h-fit', 'opacity-100')
    $containerInputPrice.classList.add('h-0', 'opacity-0')
}

function mostrarPrice() {
    $containerInputPrice.classList.remove('h-0', 'opacity-0')
    $containerInputPrice.classList.add('h-fit', 'opacity-100')
}
/*  */