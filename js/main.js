// Полные данные для всех месяцев
const monthsData = [
    {
        id: 'january',
        name: 'Январь',
        description: 'Первый месяц года, время новых начинаний и зимних чудес.',
        image: 'images/january.jpg',
        highlights: ['Новогодние праздники', 'Зимние каникулы'],
        color: '#3498db' // синий
    },
    {
        id: 'february',
        name: 'Февраль',
        description: 'Месяц вьюг и метелей, но уже с первыми признаками весны.',
        image: 'images/february.jpg',
        highlights: ['Обжираловка', 'День защитника Отечества'],
        color: '#e74c3c' // красный
    },
    {
        id: 'march',
        name: 'Март',
        description: 'Весна вступает в свои права, природа просыпается от зимнего сна.',
        image: 'images/march.jpg',
        highlights: ['Международный женский день', 'Первый день весны', 'Обжираловка'],
        color: '#2ecc71' // зеленый
    },
    {
        id: 'april',
        name: 'Апрель',
        description: 'Месяц капризной погоды, первых цветов и теплых дождей.',
        image: 'images/april.jpg',
        highlights: ['Мой день рождения', 'Обжираловкка'],
        color: '#9b59b6' // фиолетовый
    },
    {
        id: 'may',
        name: 'Май',
        description: 'Весна в полном разгаре, природа расцветает буйством красок.',
        image: 'images/may.jpg',
        highlights: ['Выпускной Маши', 'Майские праздники', 'Последний звонок'],
        color: '#f1c40f' // желтый
    },
    {
        id: 'june',
        name: 'Июнь',
        description: 'Начало лета, время долгих дней и коротких ночей.',
        image: 'images/june.jpg',
        highlights: ['Вручение аттестата у Маши', 'Начало летних каникул'],
        color: '#1abc9c' // бирюзовый
    },
    {
        id: 'july',
        name: 'Июль',
        description: 'Середина лета, пора отпусков и пляжного отдыха.',
        image: 'images/july.jpg',
        highlights: ['День рождение Мамы и Бабушки', 'Поездка в Египет', 'Первый совместный отдых'],
        color: '#e67e22' // оранжевый
    },
    {
        id: 'august',
        name: 'Август',
        description: 'Последний месяц лета, время сбора урожая и подготовки к осени.',
        image: 'images/august.jpg',
        highlights: ['День рождения Папы', 'Последние дни отпусков','Поездка в Дагестан'],
        color: '#d35400' // темно-оранжевый
    },
    {
        id: 'september',
        name: 'Сентябрь',
        description: 'Золотая осень, начало учебного года и пора грибов.',
        image: 'images/september.jpg',
        highlights: ['Начало осени', 'Сбор грибочков'],
        color: '#27ae60' // темно-зеленый
    },
    {
        id: 'october',
        name: 'Октябрь',
        description: 'Месяц яркой листвы, прохладных дней и уютных вечеров.',
        image: 'images/october.jpg',
        highlights: ['Обжираловка', 'Семейное времяпрепровождение', 'День рождение Дедушки'],
        color: '#8e44ad' // темно-фиолетовый
    },
    {
        id: 'november',
        name: 'Ноябрь',
        description: 'Предзимье, время первых заморозков и подготовки к холодам.',
        image: 'images/november.jpg',
        highlights: ['День народного единства', 'День рождение Маши и Ларисы', 'Первые морозы'],
        color: '#34495e' // темно-синий
    },
    {
        id: 'december',
        name: 'Декабрь',
        description: 'Зимняя сказка, подготовка к Новому году и ожидание чуда.',
        image: 'images/december.jpg',
        highlights: ['Холодрыга', 'Подготовка к Новому году', 'Семейный сбор'],
        color: '#c0392b' // темно-красный
    }
];

// Иконки для месяцев
const monthIcons = [
    'fas fa-snowflake',
    'fas fa-heart',
    'fas fa-female',
    'fas fa-umbrella',
    'fas fa-flag',
    'fas fa-sun',
    'fas fa-umbrella-beach',
    'fas fa-apple-alt',
    'fas fa-book-open',
    'fas fa-leaf',
    'fas fa-wind',
    'fas fa-gift'
];

// Конвертация HEX в RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
        : '52, 152, 219'; // синий по умолчанию
}

// Создание снежинок
function createSnowflakes() {
    const snowflakesContainer = document.querySelector('.snowflakes');
    if (!snowflakesContainer) return;
    
    snowflakesContainer.innerHTML = '';
    
    const snowflakeCount = 50;
    
    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        
        const size = Math.random() * 10 + 5;
        const startPosition = Math.random() * 100;
        const animationDuration = Math.random() * 10 + 10;
        const opacity = Math.random() * 0.7 + 0.3;
        const delay = Math.random() * 10;
        
        snowflake.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            filter: blur(${Math.random() * 2 + 1}px);
            left: ${startPosition}vw;
            top: -20px;
            opacity: ${opacity};
            animation: fall ${animationDuration}s linear infinite;
            animation-delay: ${delay}s;
            z-index: 1;
        `;
        
        snowflakesContainer.appendChild(snowflake);
    }
    
    // Добавляем стили для анимации
    if (!document.querySelector('#snowfall-styles')) {
        const style = document.createElement('style');
        style.id = 'snowfall-styles';
        style.textContent = `
            @keyframes fall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0.8;
                }
                100% {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Создание карточек месяцев
function createMonthCards() {
    const monthsGrid = document.querySelector('.months-grid');
    if (!monthsGrid) return;
    
    monthsGrid.innerHTML = '';
    
    monthsData.forEach((month, index) => {
        const monthCard = document.createElement('div');
        monthCard.className = 'month-card';
        monthCard.dataset.monthId = month.id;
        
        const rgbColor = hexToRgb(month.color);
        
        monthCard.innerHTML = `
            <div class="month-image" style="--month-color-rgb: ${rgbColor}">
                <img src="${month.image}" alt="${month.name}" 
                     onerror="this.onerror=null; this.src='data:image/svg+xml;charset=UTF-8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400 300\"><rect width=\"400\" height=\"300\" fill=\"%230a2e38\"/><text x=\"200\" y=\"150\" font-family=\"Arial\" font-size=\"24\" fill=\"%230fa\" text-anchor=\"middle\">${month.name}</text></svg>'">
                <div class="month-icon">
                    <i class="${monthIcons[index]}"></i>
                </div>
                <div class="month-number">${(index + 1).toString().padStart(2, '0')}</div>
            </div>
            <div class="month-content">
                <div>
                    <h3>${month.name}</h3>
                    <p>${month.description}</p>
                    <div class="month-highlights">
                        ${month.highlights.map(h => `<span class="highlight-tag">${h}</span>`).join('')}
                    </div>
                </div>
                <a href="months/${month.id}.html" class="view-btn">
                    <i class="fas fa-calendar-alt"></i> Смотреть итоги
                </a>
            </div>
        `;
        
        // Обработчик клика по карточке
        monthCard.addEventListener('click', function(e) {
            if (!e.target.classList.contains('view-btn') && !e.target.closest('.view-btn')) {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    window.location.href = `months/${month.id}.html`;
                }, 150);
            }
        });
        
        // Эффекты при наведении
        monthCard.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = `0 20px 40px ${month.color}40`;
        });
        
        monthCard.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
        
        monthsGrid.appendChild(monthCard);
    });
}

// Отсчет до Нового года
function updateCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const nextYear = currentYear + 1;
    const newYearDate = new Date(`January 1, ${nextYear} 00:00:00`);
    
    const timeDiff = newYearDate - now;
    
    if (timeDiff <= 0) {
        // Новый год наступил
        document.querySelector('.countdown-timer').innerHTML = `
            <div class="new-year-message">
                <i class="fas fa-glass-cheers"></i>
                <h3>С Новым ${nextYear} годом!</h3>
                <p>Пусть этот год принесет много счастья и успехов!</p>
            </div>
        `;
        return;
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    // Обновляем значения с анимацией
    updateNumberWithAnimation('days', days);
    updateNumberWithAnimation('hours', hours);
    updateNumberWithAnimation('minutes', minutes);
    updateNumberWithAnimation('seconds', seconds);
    
    // Добавляем эффект мигания при приближении Нового года
    const countdown = document.querySelector('.countdown');
    if (days < 10) {
        countdown.classList.add('blinking');
        countdown.style.animationDuration = `${1 + days * 0.1}s`;
    } else {
        countdown.classList.remove('blinking');
    }
}

// Анимация изменения чисел
function updateNumberWithAnimation(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const oldValue = parseInt(element.textContent) || 0;
    
    if (oldValue !== newValue) {
        element.style.transform = 'scale(1.2)';
        element.style.color = '#ff9a9e';
        
        setTimeout(() => {
            element.textContent = newValue.toString().padStart(2, '0');
            element.style.transform = 'scale(1)';
            
            setTimeout(() => {
                element.style.color = '';
            }, 300);
        }, 150);
    }
}

// Создание гирлянды
function createGarland() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    const garland = document.createElement('div');
    garland.className = 'garland';
    
    const lightCount = 20;
    const colors = ['#ff0000', '#00ff00', '#ffff00', '#00ffff', '#ff00ff'];
    
    for (let i = 0; i < lightCount; i++) {
        const light = document.createElement('div');
        light.className = 'garland-light';
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        light.style.cssText = `
            position: absolute;
            width: 12px;
            height: 12px;
            background: ${color};
            border-radius: 50%;
            left: ${(i / lightCount) * 100}%;
            top: 10px;
            box-shadow: 0 0 10px ${color};
            animation: blink ${Math.random() * 0.5 + 0.5}s infinite alternate;
        `;
        
        garland.appendChild(light);
    }
    
    header.appendChild(garland);
}

// Создание новогоднего уведомления
function createNewYearNotification() {
    const now = new Date();
    const month = now.getMonth(); // 0-11
    const day = now.getDate();
    
    // Показываем уведомление только в декабре после 20 числа
    if (month === 11 && day > 20) {
        const daysLeft = 31 - day;
        
        // Проверяем, не показывали ли уже уведомление сегодня
        const lastNotification = localStorage.getItem('lastNotificationDate');
        const today = new Date().toDateString();
        
        if (lastNotification !== today) {
            const notification = document.createElement('div');
            notification.className = 'new-year-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-bell"></i>
                    <span>Скоро Новый год! Осталось ${daysLeft} ${getDaysWord(daysLeft)}</span>
                    <button class="close-notification"><i class="fas fa-times"></i></button>
                </div>
            `;
            
            document.body.prepend(notification);
            
            // Закрытие уведомления
            notification.querySelector('.close-notification').addEventListener('click', () => {
                notification.style.animation = 'slideOut 0.5s forwards';
                setTimeout(() => notification.remove(), 500);
                localStorage.setItem('lastNotificationDate', today);
            });
            
            // Автоматическое скрытие через 8 секунд
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideOut 0.5s forwards';
                    setTimeout(() => {
                        notification.remove();
                        localStorage.setItem('lastNotificationDate', today);
                    }, 500);
                }
            }, 8000);
        }
    }
}

// Правильное склонение слова "день"
function getDaysWord(days) {
    if (days % 10 === 1 && days % 100 !== 11) {
        return 'день';
    } else if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) {
        return 'дня';
    } else {
        return 'дней';
    }
}

// Анимация появления элементов
function animateOnLoad() {
    // Анимация заголовка
    const yearTitle = document.querySelector('.year-title');
    if (yearTitle) {
        yearTitle.style.opacity = '0';
        yearTitle.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            yearTitle.style.transition = 'opacity 1s ease, transform 1s ease';
            yearTitle.style.opacity = '1';
            yearTitle.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Анимация карточек месяцев
    setTimeout(() => {
        const monthCards = document.querySelectorAll('.month-card');
        monthCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.95)';
            
            setTimeout(() => {
                card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 100);
        });
    }, 500);
}

// Инициализация приложения
function initializeApp() {
    // Создаем снежинки
    createSnowflakes();
    
    // Создаем гирлянду
    createGarland();
    
    // Создаем карточки месяцев
    createMonthCards();
    
    // Настраиваем отсчет времени
    updateCountdown();
    
    // Создаем новогоднее уведомление
    createNewYearNotification();
    
    // Запускаем анимации
    animateOnLoad();
    
    // Запускаем обновление отсчета каждую секунду
    setInterval(updateCountdown, 1000);
    
    // Пересоздаем снежинки при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            createSnowflakes();
        }, 250);
    });
}

// Запускаем приложение после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Экспортируем функции для использования в других файлах
window.NewYearApp = {
    monthsData,
    createSnowflakes,
    updateCountdown,
    initializeApp
};