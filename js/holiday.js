// Общие новогодние эффекты для всех страниц
(function() {
    'use strict';
    
    // Ждем загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChristmas);
    } else {
        initChristmas();
    }
    
    function initChristmas() {
        // Создаем снежинки и гирлянды
        createSnowAndLights();
        
        // Добавляем праздничные стили
        addHolidayStyles();
        
        // Обновляем при изменении размера окна
        window.addEventListener('resize', debounce(createSnowAndLights, 250));
    }
    
    function createSnowAndLights() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        // Удаляем старые эффекты
        const oldSnow = header.querySelector('.christmas-snow');
        const oldLights = header.querySelector('.christmas-lights');
        if (oldSnow) oldSnow.remove();
        if (oldLights) oldLights.remove();
        
        // Снежинки
        const snowContainer = document.createElement('div');
        snowContainer.className = 'christmas-snow';
        snowContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        
        const snowflakeCount = window.innerWidth <= 768 ? 25 : 40;
        for (let i = 0; i < snowflakeCount; i++) {
            const flake = document.createElement('div');
            flake.className = 'snowflake';
            const size = Math.random() * 8 + 4;
            const duration = Math.random() * 10 + 10;
            
            flake.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 50%;
                filter: blur(1px);
                left: ${Math.random() * 100}vw;
                top: -20px;
                opacity: ${Math.random() * 0.7 + 0.3};
                animation: snowFall ${duration}s linear infinite;
                animation-delay: ${Math.random() * 10}s;
            `;
            snowContainer.appendChild(flake);
        }
        
        // Гирлянда
        const lightsContainer = document.createElement('div');
        lightsContainer.className = 'christmas-lights';
        lightsContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 30px;
            z-index: 2;
            overflow: hidden;
        `;
        
        const colors = ['#ff0000', '#00ff00', '#ffff00', '#00ffff', '#ff00ff'];
        const lightCount = window.innerWidth <= 768 ? 15 : 20;
        
        for (let i = 0; i < lightCount; i++) {
            const light = document.createElement('div');
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
                animation: lightBlink ${Math.random() * 0.5 + 0.5}s infinite alternate;
            `;
            lightsContainer.appendChild(light);
        }
        
        header.appendChild(snowContainer);
        header.appendChild(lightsContainer);
    }
    
    function addHolidayStyles() {
        if (document.querySelector('#holiday-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'holiday-styles';
        style.textContent = `
            @keyframes snowFall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0.8;
                }
                100% {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
            
            @keyframes lightBlink {
                0% { opacity: 0.3; transform: scale(0.8); }
                100% { opacity: 1; transform: scale(1); }
            }
            
            /* Адаптивность для мобильных */
            @media (max-width: 768px) {
                .christmas-lights {
                    height: 20px;
                }
                
                .christmas-lights div {
                    width: 10px;
                    height: 10px;
                    top: 5px;
                }
            }
            
            /* Для экономии заряда батареи */
            @media (prefers-reduced-motion: reduce) {
                .snowflake,
                .christmas-lights div {
                    animation: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
})();