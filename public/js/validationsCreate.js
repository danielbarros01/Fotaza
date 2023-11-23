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

/***/ "./src/js/publication/create/validations.js":
/*!**************************************************!*\
  !*** ./src/js/publication/create/validations.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   checkFields: () => (/* binding */ checkFields),\n/* harmony export */   validationImage: () => (/* binding */ validationImage),\n/* harmony export */   viewErrors: () => (/* binding */ viewErrors)\n/* harmony export */ });\n//Validar campos\r\nfunction checkFields($form) {\r\n    const formData = new FormData($form)\r\n    //debugger\r\n    if (!formData.get('category')) {\r\n        formData.set('category', '')\r\n    }\r\n\r\n    if (!formData.get('typePost')) {\r\n        formData.set('typePost', '')\r\n    }\r\n\r\n    if (!formData.get('typeSale')) {\r\n        formData.set('typeSale', '')\r\n    }\r\n\r\n    const emptyFields = [];\r\n\r\n    if (formData.get('typePost') != 'sale') {\r\n        //No hace falta validar ni tipo de venta ni precio\r\n        formData.delete('typeSale')\r\n        formData.delete('price')\r\n    }\r\n\r\n    let ignoreWatermark = false\r\n    //debugger\r\n    if ((formData.get('typePost') == 'sale' && formData.get('typeSale') != 'unique') || formData.get('license') != 2) { //2 es el id de copyright\r\n        //Ignorar datos de marca de agua personalizado\r\n        ignoreWatermark = true\r\n    }\r\n\r\n\r\n    for (let [name, value] of formData.entries()) {\r\n        //debugger\r\n\r\n        //Si el valor del campo esta vacio\r\n        if (!value) {\r\n\r\n            if (ignoreWatermark && (name != 'optionWatermark' && name != 'imageWatermark' && name != 'textWatermark')) {\r\n                emptyFields.push(name);\r\n            }\r\n\r\n        }\r\n    }\r\n    return emptyFields;\r\n}\r\n\r\n//Validar que es de tipo imagen\r\nfunction validationImage($form, arrayErrors) {\r\n    /* Imagen */\r\n    const formData = new FormData($form)\r\n    const file = formData.get('image')\r\n\r\n    if (file.size === 0) {\r\n        arrayErrors.push('image')\r\n    }\r\n\r\n    if (file.size / (1024 * 1024) > 15) {\r\n        debugger\r\n        arrayErrors.push('imageMaxSize')\r\n    }\r\n}\r\n\r\n//Para mostrar los errores en los span\r\nfunction viewErrors(errors, clientOrServer, spanTitle, spanCategory, spanImg, spanRightOfUse, spanTypePost, spanErrTypeSale, spanErrPrice, spanErrCurrency) {\r\n    debugger\r\n\r\n    errors.forEach(error => {\r\n        switch (clientOrServer == 'server' ? error.path : error) {\r\n            case 'title':\r\n                spanTitle.textContent = error.msg || 'El titulo no debe ir vacio'\r\n                spanTitle.classList.remove('hidden')\r\n                break;\r\n            case 'category':\r\n                spanCategory.textContent = error.msg || 'Debe seleccionar una categoria'\r\n                spanCategory.classList.remove('hidden')\r\n                break;\r\n            case 'image':\r\n                spanImg.textContent = error.msg || 'Debe seleccionar una imagen'\r\n                spanImg.classList.remove('hidden')\r\n                break;\r\n            case 'rightsOfUse':\r\n                spanRightOfUse.textContent = error.msg || 'Debe seleccionar un derecho de uso disponible'\r\n                spanRightOfUse.classList.remove('hidden')\r\n                break;\r\n            case 'typePost':\r\n                spanTypePost.textContent = error.msg || 'Debe seleccionar el tipo de publicación'\r\n                spanTypePost.classList.remove('hidden')\r\n                break;\r\n            case 'typeSale':\r\n                spanErrTypeSale.textContent = error.msg || 'Seleccione un tipo de venta'\r\n                spanErrTypeSale.classList.remove('hidden')\r\n                break;\r\n\r\n            case 'price':\r\n                if (spanErrPrice) {\r\n                    spanErrPrice.textContent = error.msg || 'Ingrese el monto'\r\n                    spanErrPrice.classList.remove('hidden')\r\n                }\r\n                break;\r\n\r\n            case 'currency':\r\n                spanErrCurrency.textContent = error.msg || 'Ingrese un tipo de moneda valido'\r\n                spanErrCurrency.classList.remove('hidden')\r\n                break;\r\n            case 'imageMaxSize':\r\n                spanImg.textContent = error.msg || 'La imagen solo puede pesar hasta 15mb'\r\n                spanImg.classList.remove('hidden')\r\n                break;\r\n            case 'critical':\r\n                alert('Atención: Algunos de los datos del formulario han sido modificados. Por favor, inicia sesión nuevamente')\r\n                window.location.href = `/auth/login`\r\n                break;\r\n        }\r\n    })\r\n}\r\n\r\n\n\n//# sourceURL=webpack://fotazaproject/./src/js/publication/create/validations.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
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
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/publication/create/validations.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;