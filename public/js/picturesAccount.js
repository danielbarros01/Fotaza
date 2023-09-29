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

/***/ "./src/js/user/picturesAccount.js":
/*!****************************************!*\
  !*** ./src/js/user/picturesAccount.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nconst d = document\r\n\r\nconst $avatarButton = d.getElementById('avatarButton')\r\nconst $avatarInput = d.getElementById('avatarInput')\r\nconst $avatar = d.getElementById('avatarImage')\r\nconst firstRouteAvatar = d.getElementById('avatarImage').src\r\n\r\n$avatarButton.addEventListener('click', () => {\r\n    $avatarInput.click()\r\n})\r\n\r\n$avatarInput.addEventListener('change', e => {\r\n    //Si se selecciono un archivo\r\n    if (e.target.files.length > 0) {\r\n        const file = e.target.files[0];\r\n    \r\n        //Si no es una imagen\r\n        if (!file.type.startsWith('image/')) {\r\n            $avatar.setAttribute('src', firstRouteAvatar)\r\n            return alert('Ingrese una imagen valida')\r\n        } else {\r\n            const image = URL.createObjectURL(file)\r\n            $avatar.setAttribute('src', image)\r\n        }\r\n    }\r\n})\n\n//# sourceURL=webpack://fotazaproject/./src/js/user/picturesAccount.js?");

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
/******/ 	__webpack_modules__["./src/js/user/picturesAccount.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;