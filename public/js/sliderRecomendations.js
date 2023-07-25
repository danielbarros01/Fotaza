document.addEventListener("DOMContentLoaded", function () {
    const slideTrack = document.getElementById("slideTrack");
    const slides = slideTrack.getElementsByClassName("slide");
    const numSlides = slides.length; // Obtenemos la cantidad de slides

    let totalScroll = 0;
    let slideWidth = 0;

    // Calculamos el recorrido total y el ancho máximo de los slides
    for (const slide of slides) {
        totalScroll += slide.offsetWidth;
    }

    // Actualizamos el ancho del slideTrack para que se ajuste al recorrido infinito
    slideTrack.style.width = totalScroll * 2 + "px";

    // Clonamos los slides para lograr el recorrido infinito
    for (let i = 0; i < numSlides; i++) {
        const clonedSlide = slides[i].cloneNode(true);
        slideTrack.appendChild(clonedSlide);
    }

    // Actualizamos la animación con el recorrido calculado
    const animationCSS = `@keyframes scroll {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-${totalScroll}px);
        }
    }`;

    // Creamos un nuevo estilo con la animación actualizada
    const style = document.createElement("style");
    style.innerHTML = animationCSS;
    document.head.appendChild(style);
});
