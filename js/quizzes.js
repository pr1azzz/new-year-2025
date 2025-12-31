// Скрипт для страницы викторин

// Данные викторин (можно расширить)
const quizzesData = {
    main: [
        {
            id: 1,
            title: "Новогодняя викторина",
            description: "Традиции, обычаи и праздники",
            questions: 15,
            time: 10,
            color: "#ff9a9e",
            url: "https://myquiz.ru/ЗАМЕНИТЕ_ЭТУ_ССЫЛКУ"
        },
        {
            id: 2,
            title: "Киновикторина",
            description: "Фильмы, актеры и режиссеры",
            questions: 20,
            time: 15,
            color: "#a1c4fd",
            url: "https://myquiz.ru/ЗАМЕНИТЕ_ЭТУ_ССЫЛКУ"
        },
        {
            id: 3,
            title: "Музыкальный батл",
            description: "Песни, исполнители и альбомы",
            questions: 18,
            time: 12,
            color: "#ffd700",
            url: "https://myquiz.ru/ЗАМЕНИТЕ_ЭТУ_ССЫЛКУ"
        },
        {
            id: 4,
            title: "Литературная викторина",
            description: "Книги, писатели и персонажи",
            questions: 16,
            time: 12,
            color: "#0fa",
            url: "https://myquiz.ru/ЗАМЕНИТЕ_ЭТУ_ССЫЛКУ"
        },
        {
            id: 5,
            title: "Исторический квиз",
            description: "События, даты и личности",
            questions: 20,
            time: 15,
            color: "#9b59b6",
            url: "https://myquiz.ru/ЗАМЕНИТЕ_ЭТУ_ССЫЛКУ"
        },
        {
            id: 6,
            title: "Географический турнир",
            description: "Страны, города и достопримечательности",
            questions: 17,
            time: 13,
            color: "#e74c3c",
            url: "https://myquiz.ru/ЗАМЕНИТЕ_ЭТУ_ССЫЛКУ"
        },
        {
            id: 7,
            title: "Кулинарный поединок",
            description: "Блюда, продукты и кухни мира",
            questions: 14,
            time: 10,
            color: "#1abc9c",
            url: "https://myquiz.ru/ЗАМЕНИТЕ_ЭТУ_ССЫЛКУ"
        }
    ],
    extra: [
        {
            id: 8,
            title: "Технологический вызов",
            description: "Гаджеты, программы и IT-новинки",
            questions: 22,
            time: 18,
            color: "#3498db",
            url: "https://myquiz.ru/ЗАМЕНИТЕ_ЭТУ_ССЫЛКУ"
        },
        {
            id: 9,
            title: "Спортивный марафон",
            description: "Виды спорта, чемпионы и рекорды",
            questions: 19,
            time: 14,
            color: "#f1c40f",
            url: "https://myquiz.ru/ЗАМЕНИТЕ_ЭТУ_ССЫЛКУ"
        },
        {
            id: 10,
            title: "Семейная энциклопедия",
            description: "Наши традиции, истории и факты",
            questions: 25,
            time: 20,
            color: "#e84393",
            url: "https://myquiz.ru/ЗАМЕНИТЕ_ЭТУ_ССЫЛКУ"
        }
    ]
};

// Инициализация страницы
function initQuizzesPage() {
    // Можно добавить динамическую загрузку данных
    console.log("Страница викторин загружена");
    
    // Добавляем анимации
    addHoverEffects();
    addClickAnimations();
    trackQuizClicks();
}

// Эффекты при наведении
function addHoverEffects() {
    const quizCards = document.querySelectorAll('.quiz-number-card');
    
    quizCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const number = this.querySelector('.number');
            number.style.transform = 'scale(1.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            const number = this.querySelector('.number');
            number.style.transform = 'scale(1)';
        });
    });
}

// Анимации при клике
function addClickAnimations() {
    const quizCards = document.querySelectorAll('.quiz-number-card');
    
    quizCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Не прерываем переход по ссылке, только добавляем анимацию
            const numberCircle = this.querySelector('.number-circle');
            numberCircle.style.transform = 'scale(0.9)';
            
            // Добавляем звуковой эффект (опционально)
            playClickSound();
            
            // Сохраняем информацию о клике
            const quizNumber = this.dataset.number;
            saveQuizClick(quizNumber);
            
            setTimeout(() => {
                numberCircle.style.transform = '';
            }, 150);
        });
    });
}

// Отслеживание кликов по викторинам
function trackQuizClick(quizNumber) {
    // Можно сохранять в localStorage
    const stats = JSON.parse(localStorage.getItem('quizStats') || '{}');
    stats[quizNumber] = (stats[quizNumber] || 0) + 1;
    stats.lastPlayed = new Date().toISOString();
    localStorage.setItem('quizStats', JSON.stringify(stats));
    
    console.log(`Викторина №${quizNumber} выбрана`);
}

// Воспроизведение звука (опционально)
function playClickSound() {
    // Можно добавить звук клика
    try {
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3');
        audio.volume = 0.3;
        audio.play().catch(e => console.log("Звук не воспроизведен:", e));
    } catch (e) {
        console.log("Ошибка воспроизведения звука:", e);
    }
}

// Показ статистики
function showQuizStats() {
    const stats = JSON.parse(localStorage.getItem('quizStats') || '{}');
    console.log("Статистика викторин:", stats);
    
    // Можно показывать популярные викторины
    const popularQuizzes = Object.entries(stats)
        .filter(([key]) => key !== 'lastPlayed')
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);
    
    if (popularQuizzes.length > 0) {
        console.log("Самые популярные викторины:", popularQuizzes);
    }
}

// Генератор случайных фактов о викторинах
function showRandomFact() {
    const facts = [
        "Самая популярная викторина - №3",
        "Среднее время прохождения: 12 минут",
        "Лучший результат: 95% правильных ответов",
        "Всего сыграно: 47 раз",
        "Самая сложная викторина - №10"
    ];
    
    const fact = facts[Math.floor(Math.random() * facts.length)];
    console.log("Интересный факт:", fact);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initQuizzesPage();
    
    // Показываем статистику через 2 секунды
    setTimeout(showQuizStats, 2000);
    
    // Показываем случайный факт через 5 секунд
    setTimeout(showRandomFact, 5000);
});

// Экспортируем функции для использования
window.Quizzes = {
    quizzesData,
    initQuizzesPage,
    trackQuizClick,
    showQuizStats
};