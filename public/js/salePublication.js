/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/publication/create/salePublication.js":
/*!******************************************************!*\
  !*** ./src/js/publication/create/salePublication.js ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nconst $inputs = document.querySelectorAll('input[name=\"typePost\"]');\r\nconst $containerCardSale = document.getElementById('venta')\r\nconst $containerTypesVenta = document.querySelector('.typesVenta')\r\nconst $containerInputPrice = document.querySelector('.container-input-price')\r\nconst $inputPrice = document.getElementById('input-price')\r\nconst $radioTypesSale = document.querySelectorAll('input[name=\"typeSale\"]')\r\nconst $currency = document.querySelector('select[name=\"currency\"]')\r\n\r\nconst $spanErrTypes = document.getElementById('errTypes')\r\nconst $spanErrTypeSale = document.getElementById('errTypeSale')\r\nconst $spanErrPrice = document.getElementById('errPrice')\r\n\r\n/* Los inputs Libre y Venta */\r\n$inputs.forEach(input => {\r\n    input.addEventListener('change', e => {\r\n        const selected = e.target\r\n        $spanErrTypes.textContent = null\r\n        $spanErrTypes.classList.add('hidden')\r\n\r\n        $spanErrPrice.textContent = null\r\n        $spanErrPrice.classList.add('hidden')\r\n\r\n        if (selected.id == 'input-free') {\r\n            ocultarTypesVenta()\r\n            ocultarPrice()\r\n        }\r\n\r\n        if (selected.id == 'input-sale') {\r\n            mostrarTypesVenta()\r\n            mostrarPrice()\r\n        }\r\n    })\r\n})\r\n\r\n/*  Cuando selecciono un tipo de venta */\r\n$radioTypesSale.forEach(radio => {\r\n    radio.addEventListener('change', () => {\r\n        $spanErrTypeSale.classList.add('hidden')\r\n    })\r\n})\r\n\r\n/* Cuando cambio el tipo de currency reseteo el valor del input */\r\n$currency.addEventListener('change', () => {\r\n    $inputPrice.value = ''\r\n    $spanErrPrice.textContent = null;\r\n    $spanErrPrice.classList.add('hidden');\r\n})\r\n/*  */\r\n\r\n/* Para que el input price solo acepte numeros*/\r\n$inputPrice.addEventListener('input', (e) => {\r\n    const currency = $currency.value\r\n    let limit = 60000\r\n\r\n    if (currency === 'ars') {\r\n        limit = 4000000;  // 4 millones para ARS\r\n    } else if (currency === 'us') {\r\n        limit = 60000;    // 60 mil para USD\r\n    } else {\r\n        $spanErrPrice.textContent = `Debe seleccionar una moneda que sea ARS o US`;\r\n        $spanErrPrice.classList.remove('hidden');\r\n    }\r\n\r\n    let inputText = e.target.value.replace(/[^\\d]/g, ''); // Elimina todo excepto los números\r\n\r\n    // Limitar a 11 caracteres\r\n    inputText = inputText.slice(0, 11);\r\n\r\n    // Limitar según la moneda\r\n    const numericValue = parseInt(inputText, 10);\r\n    if (numericValue > limit) {\r\n        inputText = limit.toString();\r\n        $spanErrPrice.textContent = `El valor máximo es ${formatNumberInput(limit.toString())}`;\r\n        $spanErrPrice.classList.remove('hidden');\r\n    } else {\r\n        $spanErrPrice.textContent = null;\r\n        $spanErrPrice.classList.add('hidden');\r\n    }\r\n\r\n    const formattedText = formatNumberInput(inputText);\r\n    e.target.value = formattedText;\r\n});\r\n\r\n/* Formatear el numero correctamente */\r\nfunction formatNumberInput(inputText) {\r\n    if (inputText.length <= 3) {\r\n        return inputText;\r\n    } else if (inputText.length <= 6) {\r\n        return `${inputText.slice(0, -3)}.${inputText.slice(-3)}`;\r\n    } else {\r\n        const integerPart = inputText.slice(0, -6);\r\n        const decimalPart = inputText.slice(-6, -3);\r\n        const fractionalPart = inputText.slice(-3);\r\n        return `${integerPart}.${decimalPart}.${fractionalPart}`;\r\n    }\r\n}\r\n/*  */\r\n\r\n/* DOM */\r\nfunction ocultarTypesVenta() {\r\n    $containerTypesVenta.classList.add('h-0')\r\n    $containerTypesVenta.classList.remove('h-24')\r\n}\r\n\r\nfunction mostrarTypesVenta() {\r\n    $containerTypesVenta.classList.remove('h-0')\r\n    $containerTypesVenta.classList.add('h-24')\r\n}\r\n\r\nfunction ocultarPrice() {\r\n    $containerInputPrice.classList.remove('h-fit', 'opacity-100')\r\n    $containerInputPrice.classList.add('h-0', 'opacity-0')\r\n}\r\n\r\nfunction mostrarPrice() {\r\n    $containerInputPrice.classList.remove('h-0', 'opacity-0')\r\n    $containerInputPrice.classList.add('h-fit', 'opacity-100')\r\n}\r\n/*  */\n\n//# sourceURL=webpack://fotazaproject/./src/js/publication/create/salePublication.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/publication/create/salePublication.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;