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

/***/ "./src/js/user/configure-payment.js":
/*!******************************************!*\
  !*** ./src/js/user/configure-payment.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nconst d = document\r\n\r\n\r\nconst $alert = d.getElementById('alertInfo'),\r\n    $btnCloseAlert = d.getElementById('btnCloseAlert'),\r\n    $btnViewToken = d.getElementById('viewToken'),\r\n    $inputAccessToken = d.getElementById('inputAccessToken'),\r\n    $form = d.getElementById('formAccessToken'),\r\n    $stepsMercadoPago = d.getElementById('stepsMercadoPago'),\r\n    $btnHelp = d.getElementById('btnHelp'),\r\n    $spanError = d.querySelector('.error'),\r\n    $btnCloseSuccess = d.getElementById('btnCloseSuccess'),\r\n    $alertSuccess = d.getElementById('alertSuccess'),\r\n    $sectionAccessTokenSuccess = d.getElementById('AccessTokenSuccess'),\r\n    $btnEdit = d.getElementById('btnEdit'),\r\n    $btnCancelEdit = d.getElementById('btnCancelEdit')\r\n\r\nconst urlParams = new URLSearchParams(window.location.search);\r\nconst errorCode = urlParams.get('error');\r\n\r\nd.addEventListener('click', function (e) {\r\n    //Cerrar alerta\r\n    if ($btnCloseAlert.contains(e.target)) {\r\n        $alert.classList.add('hidden')\r\n    }\r\n\r\n    //Para ver el texto oculto\r\n    if (e.target == $btnViewToken) {\r\n        if ($btnViewToken.classList.contains('fa-eye')) {\r\n            $inputAccessToken.type = 'text'\r\n        } else if ($btnViewToken.classList.contains('fa-eye-slash')) {\r\n            $inputAccessToken.type = 'password'\r\n        }\r\n\r\n        $btnViewToken.classList.toggle('fa-eye')\r\n        $btnViewToken.classList.toggle('fa-eye-slash')\r\n    }\r\n\r\n    //Mostrar pasos para mercado pago\r\n    if (!$btnEdit) {\r\n        if ($btnHelp.contains(e.target)) {\r\n            $form.classList.toggle('hidden')\r\n            $stepsMercadoPago.classList.toggle('hidden')\r\n\r\n            //Le cambio el icono y le pongo Cerrar\r\n            $btnHelp.querySelector('i').classList.toggle('fa-circle-question')\r\n            $btnHelp.querySelector('i').classList.toggle('fa-circle-xmark')\r\n\r\n            $btnHelp.querySelector('span').textContent.includes('Ayuda')\r\n                ? $btnHelp.querySelector('span').textContent = 'Cerrar'\r\n                : $btnHelp.querySelector('span').textContent = 'Ayuda'\r\n        }\r\n    } else {\r\n        if ($btnHelp.contains(e.target)) {\r\n            $stepsMercadoPago.classList.toggle('hidden')\r\n\r\n            //Le cambio el icono y le pongo Cerrar\r\n            $btnHelp.querySelector('i').classList.toggle('fa-circle-question')\r\n            $btnHelp.querySelector('i').classList.toggle('fa-circle-xmark')\r\n\r\n            $btnHelp.querySelector('span').textContent.includes('Ayuda')\r\n                ? $btnHelp.querySelector('span').textContent = 'Cerrar'\r\n                : $btnHelp.querySelector('span').textContent = 'Ayuda'\r\n\r\n            $form.classList.toggle('hidden')\r\n            $sectionAccessTokenSuccess.classList.toggle('hidden')\r\n        }\r\n    }\r\n\r\n\r\n    if ($alertSuccess) {\r\n        //Cerrar el alert de exito\r\n        if ($btnCloseSuccess.contains(e.target) || !$alertSuccess.contains(e.target)) {\r\n            $alertSuccess.classList.add('hidden')\r\n        }\r\n    }\r\n\r\n    if ($btnEdit) {\r\n        if ($btnEdit.contains(e.target)) {\r\n            $sectionAccessTokenSuccess.classList.add('transform', '-translate-x-full')\r\n            $form.classList.remove('-translate-x-full')\r\n        }\r\n\r\n        if ($btnCancelEdit.contains(e.target)) {\r\n            $sectionAccessTokenSuccess.classList.remove('transform', '-translate-x-full')\r\n            $form.classList.add('-translate-x-full')\r\n        }\r\n    }\r\n})\r\n\r\n$form.addEventListener('submit', function (e) {\r\n    e.preventDefault()\r\n\r\n    if ($inputAccessToken.value.trim() === '') {\r\n        $spanError.textContent = 'Debe ingresar el ACCESS_TOKEN'\r\n        $spanError.classList.remove('hidden')\r\n\r\n        return\r\n    }\r\n\r\n    $form.submit()\r\n})\r\n\r\n$inputAccessToken.addEventListener('input', function (e) {\r\n    $spanError.classList.add('hidden')\r\n})\r\n\r\nif (errorCode) {\r\n    // Remueve el parámetro de consulta '?error=500'\r\n    let newUrl = currentUrl.replace(/\\?error=500/, '');\r\n    // Modifica la URL sin recargar la página\r\n    window.history.replaceState({}, '', newUrl);\r\n}\n\n//# sourceURL=webpack://fotazaproject/./src/js/user/configure-payment.js?");

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
/******/ 	__webpack_modules__["./src/js/user/configure-payment.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;