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

/***/ "./src/js/homeCarousel.js":
/*!********************************!*\
  !*** ./src/js/homeCarousel.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\r\n//import { Carousel } from 'flowbite'\r\n\r\n/* const d = document;\r\n\r\nconst $carouselPhotos = d.getElementById('carouselPhotos');\r\nconst $carouselIndicators = d.getElementById('carouselIndicators'); */\r\n\r\n/* Busco las mejores fotos */\r\n/* axios.get(\"/publications/best\")\r\n    .then(res => {\r\n        debugger\r\n        \r\n        const items = res.data.items;\r\n\r\n        const itemsForCarrousel = []\r\n\r\n        for (let i = 0; i < items.length; i++) {\r\n            const item = createItem(`/publications/image/${items[i].publication.image}`, i + 1);\r\n            const indicator = createIndicator(i === 0 ? true : false, `Slide ${i + 1}`, i.toString(), i + 1);\r\n\r\n            $carouselPhotos.appendChild(item);\r\n            $carouselIndicators.appendChild(indicator);\r\n\r\n            itemsForCarrousel.push({\r\n                position: i + 1,\r\n                el: item,\r\n            });\r\n        }\r\n\r\n        // options with default values\r\n        const options = {\r\n            defaultPosition: 1,\r\n            interval: 10000,\r\n\r\n            indicators: {\r\n                activeClasses: 'bg-white dark:bg-gray-800',\r\n                inactiveClasses:\r\n                    'bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800',\r\n                itemsForCarrousel\r\n            },\r\n        };\r\n\r\n        // instance options object\r\n        // instance options object\r\n        const instanceOptions = {\r\n            id: 'default-carousel',\r\n            override: true\r\n        };\r\n\r\n        const carousel = new Carousel(\r\n            d.getElementById('default-carousel'),\r\n            itemsForCarrousel,\r\n            options,\r\n            instanceOptions\r\n        );\r\n\r\n        carousel.cycle();\r\n    })\r\n    .catch(err => {\r\n        console.error(err);\r\n    })\r\n    .finally(() => {\r\n        console.log(\"done\");\r\n    });\r\n\r\nfunction createItem(urlImage, number) {\r\n    const div = d.createElement('div');\r\n\r\n    div.classList.add('hidden', 'duration-400', 'ease-in', 'bg-cover', 'bg-center', 'bg-no-repeat');\r\n    div.style.backgroundImage = 'url(' + urlImage + ')';\r\n    div.setAttribute('data-carousel-item', '');\r\n    div.setAttribute('id', `carousel-item-${number}`);\r\n\r\n    return div;\r\n}\r\n\r\nfunction createIndicator(ariaCurrent, ariaLabel, dataCarouselSlideTo, number) {\r\n    const button = d.createElement('button');\r\n\r\n    button.type = \"button\";\r\n    button.classList.add('w-3', 'h-3', 'rounded-full');\r\n    button.setAttribute('aria-current', ariaCurrent);\r\n    button.setAttribute('aria-label', ariaLabel);\r\n    button.setAttribute('data-carousel-slide-to', dataCarouselSlideTo);\r\n    button.setAttribute('id', `carousel-indicator-${number}`);\r\n\r\n    return button;\r\n}\r\n\r\n */\n\n//# sourceURL=webpack://fotazaproject/./src/js/homeCarousel.js?");

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
/******/ 	__webpack_modules__["./src/js/homeCarousel.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;