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

/***/ "./src/js/publication/clicksPublication.js":
/*!*************************************************!*\
  !*** ./src/js/publication/clicksPublication.js ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nconst $btnInfo = document.getElementById('btnInfoRightOfUse')\r\nconst $divInfoRightOfUse = document.getElementById('infoRightOfUse')\r\n\r\nconst $btnOptions = document.getElementById('btnOptions')\r\nconst $optionsPublication = document.getElementById('optionsPublication')\r\n\r\n//proximamente paypal\r\nconst $proximamente = document.getElementById('proximamente')\r\n\r\n$btnInfo.addEventListener('click', () => {\r\n  $divInfoRightOfUse.classList.toggle('hidden')\r\n})\r\n\r\nif ($btnOptions) {\r\n  $btnOptions.addEventListener('click', () => {\r\n    if ($optionsPublication)\r\n      $optionsPublication.classList.toggle('hidden')\r\n  })\r\n\r\n}\r\n\r\ndocument.addEventListener('click', (event) => {\r\n  // Verificar si el clic ocurrió dentro de los elementos o en otro lugar\r\n  const isClickInsideInfo = $divInfoRightOfUse.contains(event.target);\r\n  const isClickInsideOptions = $optionsPublication ? $optionsPublication.contains(event.target) : null;\r\n  const isClickInsideBtnInfo = $btnInfo.contains(event.target);\r\n  const isClickInsideBtnOptions = $btnOptions && $btnOptions.contains(event.target);\r\n\r\n  // Si el clic no ocurrió dentro de los elementos, ocultarlos\r\n  if (!isClickInsideInfo && !isClickInsideOptions && !isClickInsideBtnInfo && !isClickInsideBtnOptions) {\r\n    $divInfoRightOfUse.classList.add('hidden');\r\n    if ($optionsPublication) {\r\n      $optionsPublication.classList.add('hidden');\r\n    }\r\n  }\r\n\r\n  //proximamente paypal\r\n  if (event.target.htmlFor == 'radio-paypal') {\r\n    $proximamente.classList.remove('opacity-0')\r\n    $proximamente.classList.add('opacity-1')\r\n\r\n    setTimeout(() => {\r\n      $proximamente.classList.add('opacity-0')\r\n      $proximamente.classList.remove('opacity-1')\r\n    }, 1200);\r\n  }\r\n});\r\n\r\n\n\n//# sourceURL=webpack://fotazaproject/./src/js/publication/clicksPublication.js?");

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
/******/ 	__webpack_modules__["./src/js/publication/clicksPublication.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;