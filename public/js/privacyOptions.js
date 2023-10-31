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

/***/ "./src/js/publication/create/privacyOptions.js":
/*!*****************************************************!*\
  !*** ./src/js/publication/create/privacyOptions.js ***!
  \*****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nconst $optionsContent = document.querySelector('#privacyOptionsContent')\r\nconst $optionSelected = $optionsContent.querySelector('#optionPrivacySelected') //el que se muestra\r\nconst $optionText = $optionSelected.querySelector('#textPrivacy') //el texto que se muestra fuera del menu\r\nconst $iconPrivacy = $optionSelected.querySelector('#iconPrivacy') //el texto que se muestra fuera del menu\r\n//const $btnViewOptions = $optionSelected.querySelector('#btnViewOptions') \r\nconst $optionsPrivacy = document.querySelector('#privacyOptions') //donde estan los inputs radio y labels\r\nconst $options = document.querySelectorAll('.privacy-input')\r\n\r\nlet optionSelected = null\r\n\r\n$optionSelected.addEventListener('click', () => {\r\n    $optionsPrivacy.classList.remove('hidden');\r\n})\r\n\r\ndocument.addEventListener('click', (e) => {\r\n    // Verificar si el clic ocurrió dentro de los elementos o en otro lugar\r\n    const isClickOptionsPrivacy = $optionsContent.contains(e.target);\r\n\r\n    if (!isClickOptionsPrivacy) {\r\n        $optionsPrivacy.classList.add('hidden');\r\n    }\r\n})\r\n\r\n$options.forEach(option => {\r\n    option.addEventListener('change', () => {\r\n        optionSelected = option\r\n        if (option.id == 'privacy-protected') {\r\n            $optionText.textContent = 'Protegida'\r\n            $iconPrivacy.classList.remove('fa-globe', 'fa-lock')\r\n            $iconPrivacy.classList.add('fa-shield')\r\n\r\n            //cambiar orden del menu\r\n            const label = option.nextElementSibling //obtengo el label del elemento\r\n            insertPreppendOption(label, option)\r\n\r\n        } else if (option.id == 'privacy-public') {\r\n            $optionText.textContent = 'Publica'\r\n            $iconPrivacy.classList.remove('fa-shield', 'fa-lock')\r\n            $iconPrivacy.classList.add('fa-globe')\r\n\r\n            //cambiar orden del menu\r\n            const label = option.nextElementSibling //obtengo el label del elemento\r\n            insertPreppendOption(label, option)\r\n        } else if (option.id == 'privacy-private') {\r\n            $optionText.textContent = 'Privada'\r\n            $iconPrivacy.classList.remove('fa-shield', 'fa-globe')\r\n            $iconPrivacy.classList.add('fa-lock')\r\n\r\n            //cambiar orden del menu\r\n            const label = option.nextElementSibling //obtengo el label del elemento\r\n            insertPreppendOption(label, option)\r\n        }\r\n\r\n        $optionsPrivacy.classList.add('hidden');\r\n    })\r\n});\r\n\r\n//cambiar orden del menu\r\nfunction insertPreppendOption(label, option) {\r\n    $optionsPrivacy.prepend(label)//inserto el label\r\n    $optionsPrivacy.prepend(option)//inserto el option que se va a insertar arriba del label\r\n}\n\n//# sourceURL=webpack://fotazaproject/./src/js/publication/create/privacyOptions.js?");

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
/******/ 	__webpack_modules__["./src/js/publication/create/privacyOptions.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;