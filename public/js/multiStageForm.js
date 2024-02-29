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

/***/ "./src/js/publication/create/multiStageForm.js":
/*!*****************************************************!*\
  !*** ./src/js/publication/create/multiStageForm.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _validations_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./validations.js */ \"./src/js/publication/create/validations.js\");\n\r\n\r\nconst $isEdit = document.querySelector('meta[name=\"edit\"]').getAttribute('content')\r\n\r\n/* Spans para los errores */\r\nconst $spanErrImg = document.getElementById('errImage')\r\nconst $spanErrTitle = document.getElementById('errTitle')\r\nconst $spanErrCategory = document.getElementById('errCategory')\r\nconst $spanErrRightOfUse = document.getElementById('errRightOfUse')\r\n/*  */\r\n\r\n\r\nconst $form = document.querySelector(\"#form\")\r\nconst $photoData = document.getElementById(\"photoData\")\r\nconst $policyData = document.getElementById(\"policyData\")\r\nconst $photoPostSecondary = document.getElementById(\"photoPostSecondary\")\r\nconst $circlesForm = document.querySelector(\".circlesForm\")\r\n\r\nconst $linkMoreInfoPublications = document.querySelector(\".moreInfoPostType\")\r\n\r\n\r\nconst $btnContinue = document.querySelector(\"#btnContinue\")\r\nconst $btnBack = document.getElementById('btnBack')\r\n\r\n/* Cuando le de click a continuar para la segunda parte del formulario */\r\n$btnContinue.addEventListener('click', (e) => {\r\n    const errors = (0,_validations_js__WEBPACK_IMPORTED_MODULE_0__.checkFields)($form);\r\n\r\n    if(!Boolean($isEdit)){\r\n        //valido que haya una imagen, si no agrego el nombre del campo a los errores\r\n        (0,_validations_js__WEBPACK_IMPORTED_MODULE_0__.validationImage)($form, errors)\r\n    }\r\n\r\n    //debugger\r\n    //Si esta incluido price y es mayor a 1, si solo es price el error lo dejo pasar porque es valdidacion del segundo paso del formulario\r\n\r\n    if (errors.length >= 1) {\r\n        //Si esta precio y el error es solo 1 no ejecutes lo siguiente\r\n        if ((errors.includes('price') || errors.includes('textWatermark')) && errors.length === 1) {\r\n\r\n        } else {\r\n            return (0,_validations_js__WEBPACK_IMPORTED_MODULE_0__.viewErrors)(errors, null, $spanErrTitle, $spanErrCategory, $spanErrImg, $spanErrRightOfUse)\r\n        }\r\n    }\r\n\r\n\r\n    console.log('ok')\r\n    $photoData.classList.add('hidden')\r\n    $policyData.classList.remove('hidden')\r\n    $photoPostSecondary.classList.remove('hidden')\r\n    $linkMoreInfoPublications.classList.remove('hidden')\r\n\r\n\r\n    //despinto el primer circulo de abajo del formulario\r\n    $circlesForm.firstChild.classList.remove('fa-solid')\r\n    $circlesForm.firstChild.classList.add('fa-regular')\r\n\r\n    //pinto el ultimo circulo de abajo del formulario\r\n    $circlesForm.lastElementChild.classList.remove('fa-regular')\r\n    $circlesForm.lastElementChild.classList.add('fa-solid')\r\n})\r\n\r\n\r\n\r\n/* Cuando le de click a volver para la primer parte del formulario */\r\n$btnBack.addEventListener('click', (e) => {\r\n    $policyData.classList.add('hidden')\r\n    $photoData.classList.remove('hidden')\r\n    $photoPostSecondary.classList.add('hidden')\r\n    $linkMoreInfoPublications.classList.add('hidden')\r\n\r\n    //pinto el primer circulo de abajo del formulario\r\n    $circlesForm.firstChild.classList.remove('fa-regular')\r\n    $circlesForm.firstChild.classList.add('fa-solid')\r\n\r\n    //despinto el ultimo circulo de abajo del formulario\r\n    $circlesForm.lastElementChild.classList.remove('fa-solid')\r\n    $circlesForm.lastElementChild.classList.add('fa-regular')\r\n})\n\n//# sourceURL=webpack://fotazaproject/./src/js/publication/create/multiStageForm.js?");

/***/ }),

/***/ "./src/js/publication/create/validations.js":
/*!**************************************************!*\
  !*** ./src/js/publication/create/validations.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   checkFields: () => (/* binding */ checkFields),\n/* harmony export */   validationImage: () => (/* binding */ validationImage),\n/* harmony export */   viewErrors: () => (/* binding */ viewErrors)\n/* harmony export */ });\n//Validar campos\r\nfunction checkFields($form) {\r\n    const formData = new FormData($form)\r\n    //debugger\r\n    if (!formData.get('category')) {\r\n        formData.set('category', '')\r\n    }\r\n\r\n    if (!formData.get('typePost')) {\r\n        formData.set('typePost', '')\r\n    }\r\n\r\n    if (!formData.get('typeSale')) {\r\n        formData.set('typeSale', '')\r\n    }\r\n\r\n    const emptyFields = [];\r\n\r\n    if (formData.get('typePost') != 'sale') {\r\n        //No hace falta validar ni tipo de venta ni precio\r\n        formData.delete('typeSale')\r\n        formData.delete('price')\r\n    }\r\n\r\n    let ignoreWatermark = false\r\n    //debugger\r\n    if ((formData.get('typePost') == 'sale' && formData.get('typeSale') != 'unique') || formData.get('license') != 2) { //2 es el id de copyright\r\n        //Ignorar datos de marca de agua personalizado\r\n        ignoreWatermark = true\r\n    }\r\n\r\n\r\n    for (let [name, value] of formData.entries()) {\r\n        //debugger\r\n\r\n        //Si el valor del campo esta vacio\r\n        if (!value) {\r\n\r\n            if (ignoreWatermark && (name != 'optionWatermark' && name != 'imageWatermark' && name != 'textWatermark')) {\r\n                emptyFields.push(name);\r\n            }\r\n\r\n        }\r\n    }\r\n    return emptyFields;\r\n}\r\n\r\n//Validar que es de tipo imagen\r\nfunction validationImage($form, arrayErrors) {\r\n    /* Imagen */\r\n    const formData = new FormData($form)\r\n    const file = formData.get('image')\r\n\r\n    if (file.size === 0) {\r\n        arrayErrors.push('image')\r\n    }\r\n\r\n    if (file.size / (1024 * 1024) > 15) {\r\n        debugger\r\n        arrayErrors.push('imageMaxSize')\r\n    }\r\n}\r\n\r\n//Para mostrar los errores en los span\r\nfunction viewErrors(errors, clientOrServer, spanTitle, spanCategory, spanImg, spanRightOfUse, spanTypePost, spanErrTypeSale, spanErrPrice, spanErrCurrency) {\r\n    debugger\r\n\r\n    errors.forEach(error => {\r\n        switch (clientOrServer == 'server' ? error.path : error) {\r\n            case 'title':\r\n                spanTitle.textContent = error.msg || 'El titulo no debe ir vacio'\r\n                spanTitle.classList.remove('hidden')\r\n                break;\r\n            case 'category':\r\n                spanCategory.textContent = error.msg || 'Debe seleccionar una categoria'\r\n                spanCategory.classList.remove('hidden')\r\n                break;\r\n            case 'image':\r\n                spanImg.textContent = error.msg || 'Debe seleccionar una imagen'\r\n                spanImg.classList.remove('hidden')\r\n                break;\r\n            case 'rightsOfUse':\r\n                spanRightOfUse.textContent = error.msg || 'Debe seleccionar un derecho de uso disponible'\r\n                spanRightOfUse.classList.remove('hidden')\r\n                break;\r\n            case 'typePost':\r\n                spanTypePost.textContent = error.msg || 'Debe seleccionar el tipo de publicación'\r\n                spanTypePost.classList.remove('hidden')\r\n                break;\r\n            case 'typeSale':\r\n                spanErrTypeSale.textContent = error.msg || 'Seleccione un tipo de venta'\r\n                spanErrTypeSale.classList.remove('hidden')\r\n                break;\r\n\r\n            case 'price':\r\n                if (spanErrPrice) {\r\n                    spanErrPrice.textContent = error.msg || 'Ingrese el monto'\r\n                    spanErrPrice.classList.remove('hidden')\r\n                }\r\n                break;\r\n\r\n            case 'currency':\r\n                spanErrCurrency.textContent = error.msg || 'Ingrese un tipo de moneda valido'\r\n                spanErrCurrency.classList.remove('hidden')\r\n                break;\r\n            case 'imageMaxSize':\r\n                spanImg.textContent = error.msg || 'La imagen solo puede pesar hasta 15mb'\r\n                spanImg.classList.remove('hidden')\r\n                break;\r\n            case 'critical':\r\n                alert('Atención: Algunos de los datos del formulario han sido modificados. Por favor, inicia sesión nuevamente')\r\n                window.location.href = `/auth/login`\r\n                break;\r\n        }\r\n    })\r\n}\r\n\r\n\n\n//# sourceURL=webpack://fotazaproject/./src/js/publication/create/validations.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/publication/create/multiStageForm.js");
/******/ 	
/******/ })()
;