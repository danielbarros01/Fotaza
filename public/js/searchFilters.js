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

/***/ "./src/js/search/searchFilters.js":
/*!****************************************!*\
  !*** ./src/js/search/searchFilters.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nconst $btn = document.getElementById('btnFilters')\r\nconst $sectionFilters = document.querySelector('.filters')\r\n\r\nlet count = 0\r\n\r\n$btn.addEventListener('click', () => {\r\n    if (!count) {\r\n        $sectionFilters.classList.remove('hidden')\r\n\r\n        setTimeout(() => {\r\n            $sectionFilters.classList.remove('opacity-0')\r\n        }, 200);\r\n\r\n        count = 1\r\n    } else {\r\n        $sectionFilters.classList.add('opacity-0')\r\n\r\n        setTimeout(() => {\r\n            $sectionFilters.classList.add('hidden')\r\n        }, 200);\r\n\r\n        count = 0\r\n    }\r\n\r\n})\n\n//# sourceURL=webpack://fotazaproject/./src/js/search/searchFilters.js?");

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
/******/ 	__webpack_modules__["./src/js/search/searchFilters.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;