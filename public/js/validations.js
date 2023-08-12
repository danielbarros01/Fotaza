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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   checkFields: () => (/* binding */ checkFields),\n/* harmony export */   validationImage: () => (/* binding */ validationImage)\n/* harmony export */ });\n//Validar campos\r\nfunction checkFields($form) {\r\n    const formData = new FormData($form)\r\n\r\n    if (!formData.get('category')) {\r\n        formData.set('category', '')\r\n    }\r\n\r\n    const emptyFields = [];\r\n\r\n    for (let [name, value] of formData.entries()) {\r\n        if (!value) {\r\n            emptyFields.push(name);\r\n        }\r\n    }\r\n    return emptyFields;\r\n}\r\n\r\n//Validar que es de tipo imagen\r\nfunction validationImage($form, arrayErrors) {\r\n    /* Imagen */\r\n    const formData = new FormData($form)\r\n    const file = formData.get('image')\r\n\r\n    if (file.size === 0) {\r\n        arrayErrors.push('image')\r\n    }\r\n}\r\n\r\n\n\n//# sourceURL=webpack://fotazaproject/./src/js/publication/create/validations.js?");

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