import axios from 'axios';
//import { Carousel } from 'flowbite'

/* const d = document;

const $carouselPhotos = d.getElementById('carouselPhotos');
const $carouselIndicators = d.getElementById('carouselIndicators'); */

/* Busco las mejores fotos */
/* axios.get("/publications/best")
    .then(res => {
        debugger
        
        const items = res.data.items;

        const itemsForCarrousel = []

        for (let i = 0; i < items.length; i++) {
            const item = createItem(`/publications/image/${items[i].publication.image}`, i + 1);
            const indicator = createIndicator(i === 0 ? true : false, `Slide ${i + 1}`, i.toString(), i + 1);

            $carouselPhotos.appendChild(item);
            $carouselIndicators.appendChild(indicator);

            itemsForCarrousel.push({
                position: i + 1,
                el: item,
            });
        }

        // options with default values
        const options = {
            defaultPosition: 1,
            interval: 10000,

            indicators: {
                activeClasses: 'bg-white dark:bg-gray-800',
                inactiveClasses:
                    'bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800',
                itemsForCarrousel
            },
        };

        // instance options object
        // instance options object
        const instanceOptions = {
            id: 'default-carousel',
            override: true
        };

        const carousel = new Carousel(
            d.getElementById('default-carousel'),
            itemsForCarrousel,
            options,
            instanceOptions
        );

        carousel.cycle();
    })
    .catch(err => {
        console.error(err);
    })
    .finally(() => {
        console.log("done");
    });

function createItem(urlImage, number) {
    const div = d.createElement('div');

    div.classList.add('hidden', 'duration-400', 'ease-in', 'bg-cover', 'bg-center', 'bg-no-repeat');
    div.style.backgroundImage = 'url(' + urlImage + ')';
    div.setAttribute('data-carousel-item', '');
    div.setAttribute('id', `carousel-item-${number}`);

    return div;
}

function createIndicator(ariaCurrent, ariaLabel, dataCarouselSlideTo, number) {
    const button = d.createElement('button');

    button.type = "button";
    button.classList.add('w-3', 'h-3', 'rounded-full');
    button.setAttribute('aria-current', ariaCurrent);
    button.setAttribute('aria-label', ariaLabel);
    button.setAttribute('data-carousel-slide-to', dataCarouselSlideTo);
    button.setAttribute('id', `carousel-indicator-${number}`);

    return button;
}

 */