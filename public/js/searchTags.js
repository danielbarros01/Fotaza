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

/***/ "./src/js/publication/tags.js":
/*!************************************!*\
  !*** ./src/js/publication/tags.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addDeleteButtons: () => (/* binding */ addDeleteButtons),\n/* harmony export */   addTag: () => (/* binding */ addTag),\n/* harmony export */   addTags: () => (/* binding */ addTags),\n/* harmony export */   createTagElement: () => (/* binding */ createTagElement),\n/* harmony export */   deleteTag: () => (/* binding */ deleteTag),\n/* harmony export */   maxTags: () => (/* binding */ maxTags)\n/* harmony export */ });\nfunction maxTags(tags, $spanErrTag) {\r\n    if (tags.length == 3) {\r\n        $spanErrTag.textContent = 'Máx 3 etiquetas'\r\n        $spanErrTag.classList.remove('hidden')\r\n\r\n        return true\r\n    } else {\r\n        $spanErrTag.textContent = null\r\n        $spanErrTag.classList.add('hidden')\r\n\r\n        return false\r\n    }\r\n}\r\n\r\nfunction deleteTag(ev, tags, fromUrl) {\r\n    const $tagDelete = ev.target.closest('.tag');\r\n    const textTag = $tagDelete.querySelector('li').textContent;\r\n    const index = tags.indexOf(textTag);\r\n\r\n    if (index > -1) {\r\n        !fromUrl ? tags.splice(index, 1) : ''\r\n\r\n        //Evento etiqueta eliminada\r\n        const tagEvent = new CustomEvent('tagRemoved', { detail: { tag: textTag } })\r\n        // Disparar el evento personalizado\r\n        document.dispatchEvent(tagEvent);\r\n    }\r\n\r\n    $tagDelete.remove();\r\n}\r\n\r\nfunction createTagElement(textTag) {\r\n    const $div = document.createElement(\"div\");\r\n    const $li = document.createElement(\"li\");\r\n    const $span = document.createElement(\"span\");\r\n\r\n    $span.innerHTML = '<svg style=\"enable-background:new 0 0 24 24;\" version=\"1.1\" viewBox=\"0 0 24 24\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><g id=\"info\"/><g id=\"icons\"><path d=\"M14.8,12l3.6-3.6c0.8-0.8,0.8-2,0-2.8c-0.8-0.8-2-0.8-2.8,0L12,9.2L8.4,5.6c-0.8-0.8-2-0.8-2.8,0   c-0.8,0.8-0.8,2,0,2.8L9.2,12l-3.6,3.6c-0.8,0.8-0.8,2,0,2.8C6,18.8,6.5,19,7,19s1-0.2,1.4-0.6l3.6-3.6l3.6,3.6   C16,18.8,16.5,19,17,19s1-0.2,1.4-0.6c0.8-0.8,0.8-2,0-2.8L14.8,12z\" id=\"exit\"/></g></svg>';\r\n    $span.classList.add('btnDeleteTag');\r\n    $div.classList.add('tag', 'flex', 'justify-between', 'items-center');\r\n    $li.innerHTML = textTag;\r\n\r\n    $div.appendChild($li);\r\n    $div.appendChild($span);\r\n\r\n    return $div;\r\n}\r\n\r\n\r\n/* \r\nAñade tag al dom\r\ntag: array con los nombres de taggs\r\n    $tag: input donde insertas el tag\r\n    $tags: elemento del dom donde vas a insertar el nuevo tag\r\n    $spanErrTag: el span donde se va a mostrar el error en caso de que haya \r\n*/\r\nfunction addTags(tags, $tag, $tags, $spanErrTag, $btnDeletesTag = false, isUnlimited) {\r\n    let $fragment = document.createDocumentFragment();\r\n\r\n    //$tag por parametro\r\n    $tag.addEventListener('keydown', function (e) {\r\n        if (e.code == 'Enter') {\r\n            e.preventDefault();\r\n\r\n            const tagText = $tag.value\r\n\r\n            addTag(tags, tagText.toLowerCase(), $tags, $spanErrTag, $fragment, isUnlimited = false)\r\n\r\n            //Elimino el value~\r\n            $tag.value = null\r\n\r\n            console.log(tags)\r\n        }\r\n    })\r\n}\r\n\r\n/* \r\n    $btnDeletesTag: botones de eliminar de los tags\r\n    tags: array de tags\r\n*/\r\nfunction addDeleteButtons($btnDeletesTag, tags, fromUrl) {\r\n    $btnDeletesTag.forEach(element => {\r\n        element.addEventListener('click', (ev) => {\r\n            deleteTag(ev, tags, fromUrl)\r\n        })\r\n    });\r\n}\r\n\r\n/* Agregar tag al dom */\r\nfunction addTag(tags, tagText, $tags, $spanErrTag, $fragment, isUnlimited, fromUrl) {\r\n    //$spanErrTag por parametro, si debo controlar maximo de 3 tags\r\n    if (!isUnlimited) {\r\n        if (maxTags(tags, $spanErrTag)) return\r\n    }\r\n\r\n    //que no exista el tag ya en el array\r\n    if (tags.includes(tagText)) return\r\n\r\n    if (tagText.trim().length === 0) return\r\n\r\n    if (maxLetters(tagText, $spanErrTag)) return\r\n\r\n    //agregar al array el nuevo tag\r\n    tags.push(tagText)\r\n\r\n    //Crear tag en el dom\r\n    $fragment.appendChild(createTagElement(tagText));\r\n\r\n    //$tags por parametro\r\n    $tags.appendChild($fragment);\r\n\r\n    //Evento nueva etiqueta\r\n    const tagEvent = new CustomEvent('tagAdded', { detail: { tag: tagText } })\r\n    // Disparar el evento personalizado\r\n    document.dispatchEvent(tagEvent);\r\n\r\n    //ELIMINAR TAG del dom y del array\r\n    const $btnDeletesTag = document.querySelectorAll('.btnDeleteTag')\r\n    addDeleteButtons($btnDeletesTag, tags, fromUrl)\r\n}\r\n\r\n\r\nfunction maxLetters(tagText, $spanErrTag) {\r\n    if (tagText.length > 15) {\r\n        $spanErrTag.textContent = 'Máx 15 letras'\r\n        $spanErrTag.classList.remove('hidden')\r\n\r\n        return true\r\n    } else {\r\n        $spanErrTag.textContent = null\r\n        $spanErrTag.classList.add('hidden')\r\n\r\n        return false\r\n    }\r\n}\r\n\r\n\n\n//# sourceURL=webpack://fotazaproject/./src/js/publication/tags.js?");

/***/ }),

/***/ "./src/js/search/searchTags.js":
/*!*************************************!*\
  !*** ./src/js/search/searchTags.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _publication_tags_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../publication/tags.js */ \"./src/js/publication/tags.js\");\n\r\n\r\n/* TAGS */\r\nconst $tag = document.querySelector(\"#tag\")\r\nconst $tags = document.querySelector(\"#tags\")\r\nconst $spanErrTag = document.getElementById('errTag')\r\nconst tags = []\r\n\r\n;(0,_publication_tags_js__WEBPACK_IMPORTED_MODULE_0__.addTags)(tags, $tag, $tags, $spanErrTag, undefined, true);\r\n/*-- TAGS --*/\r\n\r\n\r\n\n\n//# sourceURL=webpack://fotazaproject/./src/js/search/searchTags.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/search/searchTags.js");
/******/ 	
/******/ })()
;