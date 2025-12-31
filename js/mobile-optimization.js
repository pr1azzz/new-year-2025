// Оптимизации для мобильных устройств

// Проверяем мобильное устройство
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Проверяем тач-устройство
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Оптимизация для мобильных
function optimizeForMobile() {
    if (!isMobileDevice()) return;
    
    console.log('Оптимизация для мобильных устройств...');
    
    // 1. Уменьшаем количество снежинок на мобильных
    const snowflakes = document.querySelector('.snowflakes');
    if (snowflakes) {
        const flakes = snowflakes.querySelectorAll('.snowflake');
        const maxFlakes = isMobileDevice() ? 20 : 50;
        
        if (flakes.length > maxFlakes) {
            for (let i = maxFlakes; i < flakes.length; i++) {
                flakes[i].remove();
            }
        }
    }
    
    // 2. Ленивая загрузка изображений
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // 3. Добавляем класс для тач-устройств
    if (isTouchDevice()) {
        document.documentElement.classList.add('touch-device');
    }
    
    // 4. Фикс для 100vh на iOS
    fixVHForiOS();
    
    // 5. Улучшаем производительность анимаций
    reduceAnimationsForMobile();
}

// Фикс для 100vh на iOS
function fixVHForiOS() {
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
    }
}

// Уменьшаем анимации для мобильных
function reduceAnimationsForMobile() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('reduced-motion');
    }
}

// Добавляем свайпы для навигации (опционально)
function addSwipeNavigation() {
    if (!isTouchDevice()) return;
    
    let startX, startY;
    
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Если горизонтальный свайп
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Свайп влево
                navigateNext();
            } else {
                // Свайп вправо
                navigatePrev();
            }
        }
    });
}

// Навигация по годам свайпами
function navigateNext() {
    const currentYear = window.location.pathname.match(/\/(\d{4})\.html$/);
    if (currentYear) {
        const year = parseInt(currentYear[1]);
        const nextYear = year + 1;
        const nextPage = `../statistics/${nextYear}.html`;
        
        // Проверяем существование страницы
        fetch(nextPage, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    window.location.href = nextPage;
                }
            })
            .catch(() => {
                // Страница не существует
                console.log(`Страница ${nextYear} не найдена`);
            });
    }
}

function navigatePrev() {
    const currentYear = window.location.pathname.match(/\/(\d{4})\.html$/);
    if (currentYear) {
        const year = parseInt(currentYear[1]);
        const prevYear = year - 1;
        const prevPage = `../statistics/${prevYear}.html`;
        
        if (prevYear >= 2025) {
            window.location.href = prevPage;
        }
    }
}

// Добавляем кнопку "Наверх" для мобильных
function addBackToTopButton() {
    if (!isMobileDevice()) return;
    
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'mobile-back-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(45deg, #0fa, #0af);
        color: #0a2e38;
        border: 2px solid #0fa;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0, 255, 170, 0.3);
        display: none;
        align-items: center;
        justify-content: center;
    `;
    
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(button);
    
    // Показываем кнопку при прокрутке
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.style.display = 'flex';
        } else {
            button.style.display = 'none';
        }
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    optimizeForMobile();
    addSwipeNavigation();
    addBackToTopButton();
    
    // Добавляем обработчик для улучшения производительности
    if (isMobileDevice()) {
        // Откладываем неважные операции
        setTimeout(() => {
            // Ленивая загрузка дополнительных ресурсов
            loadAdditionalResources();
        }, 1000);
    }
});

function loadAdditionalResources() {
    // Здесь можно загружать дополнительные ресурсы
    // которые не критичны для первоначальной загрузки
}

// Экспортируем функции
window.MobileOptimization = {
    isMobileDevice,
    isTouchDevice,
    optimizeForMobile
};