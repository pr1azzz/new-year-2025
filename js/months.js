// Файл: months.js
// Лайтбокс для фотографий месяцев с исправленным шарингом

// Функция для загрузки данных о месяце
function loadMonthData() {
    // Получаем имя файла из URL
    const pathParts = window.location.pathname.split('/');
    const monthFileName = pathParts[pathParts.length - 1];
    const monthId = monthFileName.replace('.html', '');
    
    // Находим данные о месяце
    const monthsData = [
        {
            id: 'january',
            name: 'Январь',
            image: '../images/january.jpg',
            description: 'Самые лучшие и популярные фразы/события этого месяца.',
            highlights: ['"Десять долларов"- Бабушка / самая крутая фраза', 'Магнитные бури / самая популярная фраза', 'Крещение / событие месяца'],
            photos: [
                { src: '../images/january1.jpg', caption: '' },
                { src: '../images/january2.jpg', caption: '' },
                { src: '../images/january3.jpg', caption: '' }
            ]
        },
        {
            id: 'february',
            name: 'Февраль',
            image: '../images/february.jpg',
            description: 'Самые лучшие и популярные фразы/события этого месяца.',
            highlights: ['"Ларис, у вас там зомби апокалипсис" - Мама / самая крутая фраза', 'Лечение / самая популярная фраза', 'День защитника Отечества / событие месяца'],
            photos: [
                { src: '../images/february1.jpg', caption: '' },
                { src: '../images/february2.jpg', caption: '' },
                { src: '../images/february3.jpg', caption: '' }
            ]
        },
        // ... аналогичные данные для остальных месяцев
    ];
    
    const monthData = monthsData.find(month => month.id === monthId);
    
    if (monthData) {
        // Обновляем заголовок
        document.querySelector('.month-title h1').textContent = monthData.name;
        
        // Обновляем описание
        document.querySelector('.month-description').textContent = monthData.description;
        
        // Заполняем highlights
        const highlightsList = document.querySelector('.highlights-list');
        highlightsList.innerHTML = '';
        
        monthData.highlights.forEach(highlight => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-star"></i> ${highlight}`;
            highlightsList.appendChild(li);
        });
        
        // Заполняем фотографии
        const photosGrid = document.querySelector('.photos-grid');
        photosGrid.innerHTML = '';
        
        monthData.photos.forEach(photo => {
            const photoItem = document.createElement('div');
            photoItem.className = 'photo-item';
            photoItem.innerHTML = `
                <img src="${photo.src}" alt="${photo.caption}" class="photo-image">
                <div class="photo-caption">${photo.caption}</div>
            `;
            photosGrid.appendChild(photoItem);
        });
        
        // Устанавливаем фоновое изображение для заголовка
        document.querySelector('.month-header').style.backgroundImage = `url('${monthData.image}')`;
    }
}

// Основная функция лайтбокса с исправленным шарингом
function initPhotoLightbox() {
    const photos = document.querySelectorAll('.photo-image');
    const allPhotos = Array.from(photos);
    let currentPhotoIndex = 0;
    let scale = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    
    // Проверяем параметры URL при загрузке страницы
    const urlParams = new URLSearchParams(window.location.search);
    const photoParam = urlParams.get('photo');
    
    // Если есть параметр photo в URL, открываем эту фотографию сразу
    if (photoParam) {
        const photoIndex = parseInt(photoParam) - 1; // Преобразуем в индекс
        if (photoIndex >= 0 && photoIndex < allPhotos.length) {
            // Ждем загрузки страницы, затем открываем фото
            setTimeout(() => {
                currentPhotoIndex = photoIndex;
                allPhotos[photoIndex].click(); // Симулируем клик по фото
            }, 500);
        }
    }
    
    photos.forEach((photo, index) => {
        photo.style.cursor = 'pointer';
        
        photo.addEventListener('click', function() {
            currentPhotoIndex = index;
            scale = 1;
            translateX = 0;
            translateY = 0;
            createLightbox(this.src);
        });
    });
    
    function createLightbox(src) {
        // Проверяем, не открыт ли уже лайтбокс
        if(document.querySelector('.lightbox')) {
            return;
        }
        
        // Получаем название месяца из URL
        const monthName = getCurrentMonthName();
        const monthEnglish = getMonthFromUrl();
        
        // Создаём лайтбокс
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <div class="lightbox-header">
                    <div class="lightbox-title">
                        ${monthName} - Фото ${currentPhotoIndex + 1} из ${allPhotos.length}
                    </div>
                    <div class="lightbox-controls">
                        <button class="lightbox-btn zoom-in" title="Увеличить">
                            <i class="fas fa-search-plus"></i>
                        </button>
                        <button class="lightbox-btn zoom-out" title="Уменьшить">
                            <i class="fas fa-search-minus"></i>
                        </button>
                        <button class="lightbox-btn reset-zoom" title="Сбросить масштаб">
                            <i class="fas fa-expand-arrows-alt"></i>
                        </button>
                        <button class="lightbox-btn share-btn" title="Поделиться фото">
                            <i class="fas fa-share-alt"></i>
                        </button>
                        <button class="lightbox-btn download-btn" title="Сохранить">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="close-lightbox" title="Закрыть (Esc)">
                            &times;
                        </button>
                    </div>
                </div>
                
                <div class="image-container">
                    <img src="${src}" 
                         alt="Фото ${currentPhotoIndex + 1} - ${monthName}" 
                         class="lightbox-image"
                         style="transform: scale(${scale}) translate(${translateX}px, ${translateY}px);">
                </div>
                
                <div class="photo-navigation">
                    <button class="nav-btn prev-photo" title="Предыдущее фото (←)">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    
                    <div class="photo-info">
                        <span class="photo-counter">${currentPhotoIndex + 1} / ${allPhotos.length}</span>
                        <button class="fullscreen-btn" title="Полный экран (F)">
                            <i class="fas fa-expand"></i>
                        </button>
                    </div>
                    
                    <button class="nav-btn next-photo" title="Следующее фото (→)">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden'; // Блокируем скролл
        
        setupLightboxControls(lightbox, monthEnglish);
        addKeyboardNavigation(lightbox);
    }
    
    function setupLightboxControls(lightbox, monthEnglish) {
        const image = lightbox.querySelector('.lightbox-image');
        const imageContainer = lightbox.querySelector('.image-container');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-photo');
        const nextBtn = lightbox.querySelector('.next-photo');
        const zoomInBtn = lightbox.querySelector('.zoom-in');
        const zoomOutBtn = lightbox.querySelector('.zoom-out');
        const resetBtn = lightbox.querySelector('.reset-zoom');
        const shareBtn = lightbox.querySelector('.share-btn');
        const downloadBtn = lightbox.querySelector('.download-btn');
        const fullscreenBtn = lightbox.querySelector('.fullscreen-btn');
        
        // Закрытие
        closeBtn.addEventListener('click', () => closeLightbox(lightbox));
        lightbox.addEventListener('click', (e) => {
            if(e.target === lightbox) closeLightbox(lightbox);
        });
        
        // Навигация
        prevBtn.addEventListener('click', () => navigatePhoto(-1, lightbox, monthEnglish));
        nextBtn.addEventListener('click', () => navigatePhoto(1, lightbox, monthEnglish));
        
        // Zoom
        zoomInBtn.addEventListener('click', () => zoomImage(1.2, image));
        zoomOutBtn.addEventListener('click', () => zoomImage(0.8, image));
        resetBtn.addEventListener('click', () => resetZoom(image));
        
        // Скачивание
        downloadBtn.addEventListener('click', () => downloadImage(image.src));
        
        // Поделиться (ОБНОВЛЕННАЯ ФУНКЦИЯ!)
        shareBtn.addEventListener('click', () => shareImage(image.src, monthEnglish, currentPhotoIndex + 1));
        
        // Полный экран
        fullscreenBtn.addEventListener('click', () => toggleFullscreen(imageContainer));
        
        // Перетаскивание (для zoom режима)
        image.addEventListener('mousedown', startDrag);
        image.addEventListener('touchstart', startDragTouch);
        
        // Zoom колесом мыши
        imageContainer.addEventListener('wheel', handleWheelZoom, { passive: false });
        
        function startDrag(e) {
            if(scale === 1) return;
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            image.style.cursor = 'grabbing';
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
        }
        
        function startDragTouch(e) {
            if(scale === 1) return;
            isDragging = true;
            const touch = e.touches[0];
            startX = touch.clientX - translateX;
            startY = touch.clientY - translateY;
            image.style.cursor = 'grabbing';
            
            document.addEventListener('touchmove', dragTouch);
            document.addEventListener('touchend', stopDrag);
        }
        
        function drag(e) {
            if(!isDragging) return;
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateImageTransform(image);
        }
        
        function dragTouch(e) {
            if(!isDragging) return;
            e.preventDefault();
            const touch = e.touches[0];
            translateX = touch.clientX - startX;
            translateY = touch.clientY - startY;
            updateImageTransform(image);
        }
        
        function stopDrag() {
            isDragging = false;
            image.style.cursor = scale > 1 ? 'grab' : 'default';
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', dragTouch);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);
        }
        
        function handleWheelZoom(e) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            zoomImage(delta, image);
        }
    }
    
    function navigatePhoto(direction, lightbox, monthEnglish) {
        currentPhotoIndex += direction;
        
        // Циклическая навигация
        if(currentPhotoIndex < 0) currentPhotoIndex = allPhotos.length - 1;
        if(currentPhotoIndex >= allPhotos.length) currentPhotoIndex = 0;
        
        // Сброс zoom при смене фото
        scale = 1;
        translateX = 0;
        translateY = 0;
        
        // Обновляем фото
        const newSrc = allPhotos[currentPhotoIndex].src;
        const image = lightbox.querySelector('.lightbox-image');
        const counter = lightbox.querySelector('.photo-counter');
        const title = lightbox.querySelector('.lightbox-title');
        const monthName = getCurrentMonthName();
        
        // Плавная смена фото
        image.style.opacity = '0.5';
        image.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            image.src = newSrc;
            image.style.opacity = '1';
            image.style.transform = 'scale(1)';
            updateImageTransform(image);
        }, 200);
        
        // Обновляем счётчик и заголовок
        if(counter) counter.textContent = `${currentPhotoIndex + 1} / ${allPhotos.length}`;
        if(title) title.textContent = `${monthName} - Фото ${currentPhotoIndex + 1} из ${allPhotos.length}`;
    }
    
    function zoomImage(factor, image) {
        scale *= factor;
        scale = Math.max(0.5, Math.min(scale, 5)); // Ограничения zoom
        
        // Сбрасываем позицию при маленьком масштабе
        if(scale <= 1) {
            translateX = 0;
            translateY = 0;
        }
        
        updateImageTransform(image);
        image.style.cursor = scale > 1 ? 'grab' : 'default';
    }
    
    function resetZoom(image) {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateImageTransform(image);
        image.style.cursor = 'default';
    }
    
    function updateImageTransform(image) {
        if(image) {
            image.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        }
    }
    
    function downloadImage(src) {
        try {
            const link = document.createElement('a');
            link.href = src;
            link.download = `family-photo-${currentPhotoIndex + 1}-${new Date().getFullYear()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch(error) {
            alert('Не удалось скачать фото. Попробуйте правой кнопкой мыши → "Сохранить как"');
        }
    }
    
    // ОБНОВЛЕННАЯ ФУНКЦИЯ ШАРИНГА!
    async function shareImage(src, monthEnglish, photoNumber) {
        // Создаем правильную ссылку с параметром фото
        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${baseUrl}?photo=${photoNumber}`;
        const monthName = getRussianMonthName(monthEnglish);
        
        if(navigator.share) {
            try {
                await navigator.share({
                    title: `Семейное фото - ${monthName} 2025`,
                    text: `Посмотрите наше фото за ${monthName}! Фото ${photoNumber} из ${allPhotos.length}`,
                    url: shareUrl
                });
            } catch(err) {
                console.log('Поделиться отменено');
                // Если отменили, показываем альтернативу
                copyToClipboardWithNotification(shareUrl);
            }
        } else {
            // Для браузеров без Share API
            copyToClipboardWithNotification(shareUrl);
        }
    }
    
    function toggleFullscreen(element) {
        if(!document.fullscreenElement) {
            element.requestFullscreen?.() ||
            element.webkitRequestFullscreen?.() ||
            element.mozRequestFullScreen?.();
        } else {
            document.exitFullscreen?.() ||
            document.webkitExitFullscreen?.() ||
            document.mozCancelFullScreen?.();
        }
    }
    
    function addKeyboardNavigation(lightbox) {
        const keyHandler = (e) => {
            const image = lightbox.querySelector('.lightbox-image');
            if(!image) return;
            
            switch(e.key) {
                case 'Escape':
                    closeLightbox(lightbox);
                    break;
                case 'ArrowLeft':
                    navigatePhoto(-1, lightbox, getMonthFromUrl());
                    break;
                case 'ArrowRight':
                    navigatePhoto(1, lightbox, getMonthFromUrl());
                    break;
                case '+':
                case '=':
                    if(e.ctrlKey || e.metaKey) return;
                    zoomImage(1.2, image);
                    break;
                case '-':
                    zoomImage(0.8, image);
                    break;
                case '0':
                    resetZoom(image);
                    break;
                case 'f':
                case 'F':
                    toggleFullscreen(lightbox.querySelector('.image-container'));
                    break;
            }
        };
        
        document.addEventListener('keydown', keyHandler);
        
        // Сохраняем ссылку для удаления
        lightbox.dataset.keyHandler = keyHandler;
    }
    
    function closeLightbox(lightbox) {
        // Удаляем обработчик клавиатуры
        const keyHandler = lightbox.dataset.keyHandler;
        if(keyHandler) {
            document.removeEventListener('keydown', keyHandler);
        }
        
        lightbox.style.animation = 'fadeOut 0.3s ease';
        lightbox.style.opacity = '0';
        
        setTimeout(() => {
            if(lightbox.parentNode) {
                document.body.removeChild(lightbox);
            }
            document.body.style.overflow = '';
        }, 300);
    }
}

// Вспомогательные функции для шаринга
function getMonthFromUrl() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop();
    return fileName.replace('.html', '');
}

function getCurrentMonthName() {
    const englishMonth = getMonthFromUrl();
    return getRussianMonthName(englishMonth);
}

function getRussianMonthName(englishMonth) {
    const monthsMap = {
        'january': 'Январь',
        'february': 'Февраль',
        'march': 'Март',
        'april': 'Апрель',
        'may': 'Май',
        'june': 'Июнь',
        'july': 'Июль',
        'august': 'Август',
        'september': 'Сентябрь',
        'october': 'Октябрь',
        'november': 'Ноябрь',
        'december': 'Декабрь'
    };
    return monthsMap[englishMonth] || englishMonth;
}

function copyToClipboardWithNotification(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showNotification('✅ Ссылка скопирована! Отправьте её в сообщении.');
        })
        .catch(() => {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('✅ Ссылка скопирована! Отправьте её в сообщении.');
        });
}

function showNotification(message) {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'share-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #0fa, #0af);
        color: #0a2e38;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10001;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2s forwards;
        box-shadow: 0 5px 15px rgba(0,255,170,0.3);
        font-weight: bold;
        max-width: 300px;
        word-break: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем через 2.5 секунды
    setTimeout(() => {
        if(notification.parentNode) {
            notification.remove();
        }
    }, 2500);
}

// Добавляем стили для анимации уведомления
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// Инициализация при загрузке страницы месяца
document.addEventListener('DOMContentLoaded', function() {
    // Создаем снежинки
    const snowflakesContainer = document.querySelector('.snowflakes');
    if (snowflakesContainer) {
        for (let i = 0; i < 30; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            
            const size = Math.random() * 8 + 4;
            const startPosition = Math.random() * 100;
            const animationDuration = Math.random() * 10 + 10;
            const opacity = Math.random() * 0.7 + 0.3;
            
            snowflake.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: white;
                border-radius: 50%;
                filter: blur(1px);
                left: ${startPosition}vw;
                top: -20px;
                opacity: ${opacity};
                animation: fall ${animationDuration}s linear infinite;
                animation-delay: ${Math.random() * 10}s;
            `;
            
            snowflakesContainer.appendChild(snowflake);
        }
    }
    
    // Загружаем данные о месяце
    loadMonthData();
    
    // Инициализируем лайтбокс с шарингом
    initPhotoLightbox();
    
    // Добавляем обработчик для кнопки "Назад"
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
});
// Файл: months.js - ИСПРАВЛЕННАЯ ВЕРСИЯ ДЛЯ МОБИЛЬНЫХ

// Функция для загрузки данных о месяце
function loadMonthData() {
    // ... (оставляем без изменений, твой существующий код) ...
}

// Основная функция лайтбокса с исправлениями для мобильных
function initPhotoLightbox() {
    const photos = document.querySelectorAll('.photo-image');
    const allPhotos = Array.from(photos);
    let currentPhotoIndex = 0;
    let scale = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    
    // Проверяем параметры URL при загрузке страницы
    const urlParams = new URLSearchParams(window.location.search);
    const photoParam = urlParams.get('photo');
    
    // Если есть параметр photo в URL, открываем эту фотографию сразу
    if (photoParam) {
        const photoIndex = parseInt(photoParam) - 1;
        if (photoIndex >= 0 && photoIndex < allPhotos.length) {
            setTimeout(() => {
                currentPhotoIndex = photoIndex;
                allPhotos[photoIndex].click();
            }, 500);
        }
    }
    
    photos.forEach((photo, index) => {
        photo.style.cursor = 'pointer';
        
        photo.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            currentPhotoIndex = index;
            scale = 1;
            translateX = 0;
            translateY = 0;
            createLightbox(this.src);
        });
    });
    
    function createLightbox(src) {
        if(document.querySelector('.lightbox')) return;
        
        const monthName = getCurrentMonthName();
        
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 46, 56, 0.98);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            touch-action: none;
        `;
        
        lightbox.innerHTML = `
            <div class="lightbox-content" style="
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.05);
                overflow: hidden;
                display: flex;
                flex-direction: column;
                position: relative;
            ">
                <!-- Кнопка закрытия - УВЕЛИЧЕНА ДЛЯ МОБИЛЬНЫХ -->
                <button class="close-lightbox" style="
                    position: absolute;
                    top: env(safe-area-inset-top, 20px);
                    right: 20px;
                    background: rgba(255, 154, 158, 0.9);
                    border: 2px solid rgba(255, 154, 158, 0.3);
                    color: #0a2e38;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 2.5rem;
                    font-weight: bold;
                    z-index: 10001;
                    transition: all 0.3s ease;
                    touch-action: manipulation;
                ">&times;</button>
                
                <!-- Изображение -->
                <div class="image-container" style="
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    padding: 20px;
                    touch-action: pan-x pan-y pinch-zoom;
                ">
                    <img src="${src}" 
                         alt="Фото ${currentPhotoIndex + 1} - ${monthName}" 
                         class="lightbox-image"
                         style="
                            max-width: 100%;
                            max-height: 100%;
                            object-fit: contain;
                            transition: transform 0.3s ease;
                            transform: scale(${scale}) translate(${translateX}px, ${translateY}px);
                            -webkit-user-select: none;
                            user-select: none;
                         ">
                </div>
                
                <!-- Панель управления - УПРОЩЕННАЯ ДЛЯ МОБИЛЬНЫХ -->
                <div class="mobile-controls" style="
                    position: absolute;
                    bottom: calc(20px + env(safe-area-inset-bottom, 0px));
                    left: 0;
                    right: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 20px;
                    padding: 15px;
                    z-index: 10001;
                ">
                    <button class="mobile-btn prev-btn" style="
                        background: rgba(0, 255, 170, 0.8);
                        border: 2px solid #0fa;
                        color: #0a2e38;
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        font-size: 1.5rem;
                        touch-action: manipulation;
                    "><i class="fas fa-chevron-left"></i></button>
                    
                    <div class="photo-info" style="
                        background: rgba(0, 0, 0, 0.7);
                        color: white;
                        padding: 10px 20px;
                        border-radius: 25px;
                        font-size: 1.1rem;
                        font-weight: bold;
                    ">${currentPhotoIndex + 1} / ${allPhotos.length}</div>
                    
                    <button class="mobile-btn next-btn" style="
                        background: rgba(0, 255, 170, 0.8);
                        border: 2px solid #0fa;
                        color: #0a2e38;
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        font-size: 1.5rem;
                        touch-action: manipulation;
                    "><i class="fas fa-chevron-right"></i></button>
                </div>
                
                <!-- Панель действий (появляется по тапу) -->
                <div class="action-panel" style="
                    position: absolute;
                    top: calc(60px + env(safe-area-inset-top, 20px));
                    right: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    z-index: 10001;
                ">
                    <button class="action-btn share-btn" title="Поделиться" style="
                        background: rgba(255, 215, 0, 0.8);
                        border: 2px solid #ffd700;
                        color: #0a2e38;
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        font-size: 1.2rem;
                        touch-action: manipulation;
                    "><i class="fas fa-share-alt"></i></button>
                    
                    <button class="action-btn download-btn" title="Сохранить" style="
                        background: rgba(0, 255, 170, 0.8);
                        border: 2px solid #0fa;
                        color: #0a2e38;
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        font-size: 1.2rem;
                        touch-action: manipulation;
                    "><i class="fas fa-download"></i></button>
                    
                    <button class="action-btn fullscreen-btn" title="Полный экран" style="
                        background: rgba(154, 206, 235, 0.8);
                        border: 2px solid #9aceeb;
                        color: #0a2e38;
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        font-size: 1.2rem;
                        touch-action: manipulation;
                    "><i class="fas fa-expand"></i></button>
                </div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        setupMobileLightboxControls(lightbox);
    }
    
    function setupMobileLightboxControls(lightbox) {
        const image = lightbox.querySelector('.lightbox-image');
        const imageContainer = lightbox.querySelector('.image-container');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');
        const shareBtn = lightbox.querySelector('.share-btn');
        const downloadBtn = lightbox.querySelector('.download-btn');
        const fullscreenBtn = lightbox.querySelector('.fullscreen-btn');
        const actionPanel = lightbox.querySelector('.action-panel');
        const photoInfo = lightbox.querySelector('.photo-info');
        
        // Показ/скрытие панели действий по тапу
        let tapTimer;
        let lastTap = 0;
        
        imageContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            // Двойной тап для zoom
            if (tapLength < 300 && tapLength > 0) {
                if (scale === 1) {
                    zoomImage(2, image);
                } else {
                    resetZoom(image);
                }
            } else {
                // Одинарный тап - показ/скрытие панелей
                if (actionPanel.style.opacity === '1') {
                    actionPanel.style.opacity = '0';
                    photoInfo.style.opacity = '0';
                } else {
                    actionPanel.style.opacity = '1';
                    photoInfo.style.opacity = '1';
                    
                    // Автоматически скрываем через 3 секунды
                    clearTimeout(tapTimer);
                    tapTimer = setTimeout(() => {
                        actionPanel.style.opacity = '0';
                        photoInfo.style.opacity = '0';
                    }, 3000);
                }
            }
            
            lastTap = currentTime;
        });
        
        // Закрытие лайтбокса - ФИКС ДЛЯ МОБИЛЬНЫХ
        function closeLightbox() {
            lightbox.style.animation = 'fadeOut 0.3s ease';
            lightbox.style.opacity = '0';
            
            setTimeout(() => {
                if (lightbox.parentNode) {
                    document.body.removeChild(lightbox);
                }
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            }, 300);
        }
        
        // Закрытие по клику на крестик
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeLightbox();
        });
        
        // Закрытие по клику на фон (только если не нажали на контент)
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Предотвращаем закрытие при клике на контент
        lightbox.querySelector('.lightbox-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Навигация
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigatePhoto(-1, lightbox);
        });
        
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigatePhoto(1, lightbox);
        });
        
        // Swipe для навигации
        let touchStartX = 0;
        let touchStartY = 0;
        
        imageContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        imageContainer.addEventListener('touchend', (e) => {
            if (scale > 1) return; // Не реагируем на свайп при зуме
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            // Если горизонтальный свайп больше вертикального
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Свайп влево - следующее фото
                    navigatePhoto(1, lightbox);
                } else {
                    // Свайп вправо - предыдущее фото
                    navigatePhoto(-1, lightbox);
                }
            }
        }, { passive: true });
        
        // Zoom жестами
        let initialDistance = 0;
        
        imageContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                initialDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
            }
        }, { passive: false });
        
        imageContainer.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
                
                if (initialDistance > 0) {
                    const zoomFactor = currentDistance / initialDistance;
                    scale = Math.max(0.5, Math.min(zoomFactor, 5));
                    updateImageTransform(image);
                }
            }
        }, { passive: false });
        
        imageContainer.addEventListener('touchend', () => {
            initialDistance = 0;
        });
        
        // Кнопка "Поделиться"
        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            shareImage(image.src, getMonthFromUrl(), currentPhotoIndex + 1);
        });
        
        // Кнопка "Сохранить"
        downloadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            downloadImage(image.src);
        });
        
        // Кнопка "Полный экран" - ФИКС ДЛЯ МОБИЛЬНЫХ
        fullscreenBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileFullscreen(imageContainer);
        });
        
        // Обработчик для выхода из полноэкранного режима
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        
        function handleFullscreenChange() {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                // Выход из полноэкранного режима
                imageContainer.style.width = '';
                imageContainer.style.height = '';
            }
        }
        
        // Сохраняем функцию закрытия для удаления
        lightbox.closeFunction = closeLightbox;
    }
    
    function navigatePhoto(direction, lightbox) {
        currentPhotoIndex += direction;
        
        if (currentPhotoIndex < 0) currentPhotoIndex = allPhotos.length - 1;
        if (currentPhotoIndex >= allPhotos.length) currentPhotoIndex = 0;
        
        scale = 1;
        translateX = 0;
        translateY = 0;
        
        const newSrc = allPhotos[currentPhotoIndex].src;
        const image = lightbox.querySelector('.lightbox-image');
        const photoInfo = lightbox.querySelector('.photo-info');
        
        image.style.opacity = '0.5';
        image.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            image.src = newSrc;
            image.style.opacity = '1';
            image.style.transform = 'scale(1)';
            updateImageTransform(image);
            
            if (photoInfo) {
                photoInfo.textContent = `${currentPhotoIndex + 1} / ${allPhotos.length}`;
            }
        }, 200);
    }
    
    function zoomImage(factor, image) {
        scale *= factor;
        scale = Math.max(0.5, Math.min(scale, 5));
        
        if (scale <= 1) {
            translateX = 0;
            translateY = 0;
        }
        
        updateImageTransform(image);
    }
    
    function resetZoom(image) {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateImageTransform(image);
    }
    
    function updateImageTransform(image) {
        if (image) {
            image.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        }
    }
    
    function downloadImage(src) {
        try {
            const link = document.createElement('a');
            link.href = src;
            link.download = `family-photo-${currentPhotoIndex + 1}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            alert('Не удалось скачать фото');
        }
    }
    
    // Полноэкранный режим для мобильных
    function toggleMobileFullscreen(element) {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            // Вход в полноэкранный режим
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        } else {
            // Выход из полноэкранного режима
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
}

// Остальные вспомогательные функции (без изменений)
function getMonthFromUrl() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop();
    return fileName.replace('.html', '');
}

function getCurrentMonthName() {
    const englishMonth = getMonthFromUrl();
    return getRussianMonthName(englishMonth);
}

function getRussianMonthName(englishMonth) {
    const monthsMap = {
        'january': 'Январь', 'february': 'Февраль', 'march': 'Март',
        'april': 'Апрель', 'may': 'Май', 'june': 'Июнь',
        'july': 'Июль', 'august': 'Август', 'september': 'Сентябрь',
        'october': 'Октябрь', 'november': 'Ноябрь', 'december': 'Декабрь'
    };
    return monthsMap[englishMonth] || englishMonth;
}

async function shareImage(src, monthEnglish, photoNumber) {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?photo=${photoNumber}`;
    const monthName = getRussianMonthName(monthEnglish);
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: `Семейное фото - ${monthName} 2025`,
                text: `Посмотрите наше фото за ${monthName}!`,
                url: shareUrl
            });
        } catch (err) {
            console.log('Поделиться отменено');
        }
    } else {
        navigator.clipboard.writeText(shareUrl)
            .then(() => alert('Ссылка скопирована в буфер обмена!'))
            .catch(() => prompt('Скопируйте ссылку:', shareUrl));
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Снежинки
    const snowflakesContainer = document.querySelector('.snowflakes');
    if (snowflakesContainer) {
        for (let i = 0; i < 20; i++) { // Меньше снежинок для мобильных
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            
            snowflake.style.cssText = `
                position: absolute;
                width: ${Math.random() * 6 + 4}px;
                height: ${Math.random() * 6 + 4}px;
                background: white;
                border-radius: 50%;
                filter: blur(1px);
                left: ${Math.random() * 100}vw;
                top: -20px;
                opacity: ${Math.random() * 0.7 + 0.3};
                animation: fall ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: ${Math.random() * 10}s;
            `;
            
            snowflakesContainer.appendChild(snowflake);
        }
    }
    
    // Загружаем данные о месяце
    loadMonthData();
    
    // Инициализируем лайтбокс
    initPhotoLightbox();
    
    // Кнопка "Назад"
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
});