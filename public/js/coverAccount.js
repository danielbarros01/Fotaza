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

/***/ "./src/js/user/coverAccount.js":
/*!*************************************!*\
  !*** ./src/js/user/coverAccount.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nconst d = document\r\n\r\nconst btn = d.getElementById('coverBtn')\r\nconst modal = d.querySelector('.modalCover')\r\nconst btnCloseModal = modal.querySelector('.btnClose')\r\nconst radioCovers = d.querySelectorAll('input[name=\"cover-radio\"]')\r\nconst labelCovers = d.querySelectorAll('.label-cover')\r\nlet labelSelected = d.querySelector('.label-checked')\r\n\r\nconst coverImg = d.querySelector('#coverPhoto img')\r\n\r\nbtn.addEventListener('click', () => {\r\n    modal.classList.remove('hidden')\r\n})\r\n\r\nbtnCloseModal.addEventListener('click', () => {\r\n    modal.classList.add('hidden')\r\n})\r\n\r\n\r\nradioCovers.forEach(radioBtn => {\r\n    radioBtn.addEventListener('change', e => {\r\n        const selected = e.target.value\r\n\r\n        //Cambio el fondo de portada\r\n        coverImg.setAttribute(\"src\", `/img/covers/${selected}`)\r\n    })\r\n})\r\n\r\nlabelCovers.forEach(label => {\r\n    label.addEventListener('click', e => {\r\n        //saco el borde al anterior\r\n        labelSelected.classList.remove('border-4', 'border-indigo-500', 'shadow-lg', 'label-checked')\r\n        //Cambio el label seleccionado\r\n        labelSelected = e.target\r\n        //le agrego al nuevo\r\n        labelSelected.classList.add('border-4', 'border-indigo-500', 'shadow-lg', 'label-checked')\r\n    })\r\n})\n\n//# sourceURL=webpack://fotazaproject/./src/js/user/coverAccount.js?");

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
/******/ 	__webpack_modules__["./src/js/user/coverAccount.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;