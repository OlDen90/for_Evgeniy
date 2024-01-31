import cardsData from '../json/cards.json';

document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.querySelector('.pricing-card');
    let currentCurrency = '$';
    let currentTermUnit = 'Months';
    let previousParagraphs = [];  // Массив для хранения элементов списка li из предыдущей карточки

    // Функция для пересчета суммы в зависимости от текущей валюты
    function convertCurrency(amount, currency) {
        if (currency === '$') {
            return amount;
        } else if (currency === '₽') {
            return amount * 90;
        } else if (currency === '€') {
            return amount * 0.85;
        }
    }

    // Функция для обновления цены и единиц измерения в каждой карточке
    function updateCardData(cardElement, isDays) {
        const totalElement = cardElement.querySelector('.card__total');
        const originalAmount = parseFloat(totalElement.dataset.originalAmount);

        if (isDays) {
            totalElement.textContent = convertCurrency(originalAmount / 30, currentCurrency).toFixed(0);
        } else {
            totalElement.textContent = convertCurrency(originalAmount, currentCurrency).toFixed(0);
        }
    }

    // Функция для обработки событий при изменении валюты
    function handleCurrencyChange() {
        // Обновляем глобальную переменную
        if (currentCurrency === '$') {
            currentCurrency = '₽';
        } else if (currentCurrency === '₽') {
            currentCurrency = '€';
        } else if (currentCurrency === '€') {
            currentCurrency = '$';
        }

        // Обновляем все элементы .card__currency во всех карточках
        document.querySelectorAll('.card__currency').forEach(elem => {
            elem.textContent = currentCurrency;
        });

        // Вызываем функцию для обновления цен и единиц измерения в каждой карточке
        document.querySelectorAll('.pricing-cards__card').forEach(cardElem => {
            updateCardData(cardElem, currentTermUnit === 'Days');
        });
    }

    // Функция для обработки событий при изменении единиц измерения
    function handleTermUnitChange(isDays) {
        // Переключаем между Months и Days
        currentTermUnit = isDays ? 'Days' : 'Months';

        // Обновляем текст единиц измерения во всех карточках
        document.querySelectorAll('#term-unit').forEach(elem => {
            elem.textContent = currentTermUnit;
        });

        // Вызываем функцию для обновления цен и единиц измерения в каждой карточке
        document.querySelectorAll('.pricing-cards__card').forEach(cardElem => {
            updateCardData(cardElem, isDays);
        });
    }

    cardsData.cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('pricing-cards__card');

        if (index === 0) {
            cardElement.classList.add('left-card');
        } else if (index === 1) {
            cardElement.classList.add('center-card');
        } else if (index === 2) {
            cardElement.classList.add('right-card');
        }

        cardElement.innerHTML = `
            <div class="card__top">
                <div class="card__top-title">${card.topTitle}</div>
                <div class="card__price">
                    <div class="card__currency">${card.currencyPrice}</div>
                    <div class="card__value">
                        <div class="card__total">${card.price}</div>
                        <div class="card__term">/<span id="term-unit">${card.term}</span>
                        </div>
                    </div>
                </div>
                <div class="card__text">${card.description}
                </div>
            </div>

            <hr class="separator">

            <div class="card__middle">
                <div class="card__middle-title">${card.middleTitle}</div>
                <div class="card__middle-sub-title">${card.middleSubTitle}</div>
                <ul class="card__list">                
                    ${card.features.map(feature => `
                        <li><img src="img/arrow.svg" alt="">
                            <p>${feature}</p>
                        </li>
                    `).join("")}
                </ul>
            </div>
            <div class="btn__container">
                <a href="${card.link}" target="_blank" class="card__btn btn">${card.btnText}${index === 1 ? `<img src="img/arrowImg.png" alt="Img">` : ''}</a>
            </div>
        `;

        const currentParagraphs = cardElement.querySelectorAll('.card__list p');

        // Проверка есть ли такие теги <p> в предыдущих карточках
        currentParagraphs.forEach((currentP) => {
            if (previousParagraphs.includes(currentP.textContent) && currentP.textContent !== `${card.features[5]}`) {
                currentP.classList.add('gray');
            }
        });

        // обновление массива предыдущих тегов <p> для следующей карточки
        previousParagraphs = previousParagraphs.concat(Array.from(currentParagraphs).map(p => p.textContent));


        // -----------------------
        // Обновление цен во всех карточках при изменении валюты
        const currencyElements = cardElement.querySelectorAll('.card__currency');
        const termUnitElement = cardElement.querySelector('#term-unit');

        currencyElements.forEach(currencyElement => {
            currencyElement.addEventListener('click', handleCurrencyChange);
        });

        // Добавляем обработчик событий для #term-unit
        termUnitElement.addEventListener('click', () => {
            // Переключаем между Months и Days
            const isDays = termUnitElement.textContent === 'Months';
            handleTermUnitChange(isDays);
        });


        // Добавляем изначальное значение суммы в dataset для каждого элемента .card__total
        const totalElement = cardElement.querySelector('.card__total');
        totalElement.dataset.originalAmount = card.price;

        // -----------------------
        // задержка появления карточек
        cardContainer.appendChild(cardElement);
        setTimeout(() => {
            cardElement.classList.add('visible');
        }, index * 400);
    });
});
