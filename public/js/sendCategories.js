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

/***/ "./src/js/sendCategories.js":
/*!**********************************!*\
  !*** ./src/js/sendCategories.js ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nconst d = document\r\n\r\n//Agarrar categorias\r\nconst categories = d.querySelectorAll(\".category\")\r\n\r\n//Agarrar boton\r\nconst button = d.querySelector(\"#btnSendCategories\")\r\n\r\n//categorias seleccionadas\r\nconst categoriesSelected = []\r\n\r\nconst csrfToken = document.querySelector('#csrfToken').value;\r\n\r\n\r\ncategories.forEach((category) => {\r\n\r\n    category.addEventListener(\"click\", (e) => {\r\n        //agarra el valor del input\r\n        const valueId = e.target.children[0].value\r\n\r\n        if (!categoriesSelected.includes(valueId)) {\r\n            categoriesSelected.push(category.children[0].value)\r\n            category.style.border = '4px solid #16FF00'\r\n            console.log(categoriesSelected)\r\n        } else {\r\n            category.style.border = null\r\n            const index = categoriesSelected.indexOf(category.children[0].value)\r\n            categoriesSelected.splice(index, 1)\r\n            console.log(categoriesSelected)\r\n        }\r\n    })\r\n\r\n})\r\n\r\nbutton.addEventListener('click', () => {\r\n    const data = {\r\n        categoriesSelected\r\n    };\r\n\r\n    console.log(csrfToken)\r\n\r\n\r\n    // Crear el objeto de opciones para la solicitud POST\r\n    const options = {\r\n        method: 'POST',\r\n        headers: {\r\n            'Content-Type': 'application/json',\r\n            'CSRF-Token': csrfToken  // Agregar el token CSRF como encabezado personalizado\r\n        },\r\n        body: JSON.stringify(data)\r\n    };\r\n\r\n\r\n    fetch('/categories/select', options)\r\n        .then(response => {\r\n            if (response.ok) {\r\n                window.location.href = \"/publications\"\r\n            }\r\n            throw new Error('Error en la solicitud');\r\n        })\r\n        .catch(error => { console.error(error); });\r\n})\n\n//# sourceURL=webpack://fotazaproject/./src/js/sendCategories.js?");

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
/******/ 	__webpack_modules__["./src/js/sendCategories.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;