// Данные для статистики по годам
const statisticsData = {
    2025: {
        winners: [
            { name: "Имя", score: 0, place: 1, details: "Победил в ? из 7", medal: "👑" },
            { name: "Имя", score: 0, place: 2, details: "Победил в ? из 7", medal: "⭐" },
            { name: "Имя", score: 0, place: 3, details: "Победил в ? из 7", medal: "🌟" }
        ],
        quizzes: [
            { title: "Дополнительная викторина", date: "1 января 2025", theme: "Мультфильмы", winner: "Имя", score: 0 },
            { title: "Дополнительная викторина", date: "1 января 2025", theme: "Эпоха 80-х", winner: "Имя", score: 0 },
            { title: "Дополнительная викторина", date: "1 января 2025", theme: "?", winner: "Имя", score: 0 },
        ],
        participants: [
            { name: "Папа", totalScore: 1450, wins: 8, bestScore: 120, bestQuiz: "Новогодняя викторина" },
            { name: "Мама", totalScore: 1320, wins: 3, bestScore: 118, bestQuiz: "Кулинарный поединок" },
            { name: "Сын", totalScore: 1280, wins: 1, bestScore: 125, bestQuiz: "Технологический квиз" },
            { name: "Дочь", totalScore: 0, wins: 0, bestScore: , bestQuiz: "Название (score)" },
            { name: "Дедушка", totalScore: 0, wins: 0, bestScore: 108, bestQuiz: "Исторический квиз" }
        ]
    },
    2026: {
        winners: [
            { name: "Мама", score: 1500, place: 1, details: "Абсолютный чемпион года", medal: "👑" },
            { name: "Сын", score: 1420, place: 2, details: "Улучшил результат на 10%", medal: "⭐" },
            { name: "Папа", score: 1400, place: 3, details: "Стабильные результаты", medal: "🌟" }
        ],
        quizzes: [],
        participants: []
    }
    // Добавьте данные для 2027, 2028 и т.д.
};

// Определяем текущий год из URL
function getCurrentYear() {
    const path = window.location.pathname;
    const match = path.match(/\/(\d{4})\.html$/);
    return match ? parseInt(match[1]) : new Date().getFullYear();
}

// Загружаем данные для текущего года
function loadStatisticsData() {
    const year = getCurrentYear();
    const data = statisticsData[year];
    
    if (!data) {
        console.warn(`Данные для ${year} года не найдены`);
        return;
    }
    
    updateWinnersPodium(data.winners);
    updateQuizzesGrid(data.quizzes);
    updateResultsTable(data.participants);
    updateYearNavigation(year);
}

// Обновляем пьедестал победителей
function updateWinnersPodium(winners) {
    const podiumSteps = document.querySelectorAll('.podium-step');
    
    winners.forEach(winner => {
        const step = document.querySelector(`.podium-step:nth-child(${winner.place})`);
        if (!step) return;
        
        step.querySelector('.winner-name').textContent = winner.name;
        step.querySelector('.winner-score').textContent = `${winner.score} очков`;
        step.querySelector('.winner-details').textContent = winner.details;
        step.querySelector('.winner-medal').textContent = winner.medal;
    });
}

// Обновляем сетку викторин
function updateQuizzesGrid(quizzes) {
    const grid = document.querySelector('.quizzes-grid');
    if (!grid) return;
    
    // Очищаем старые карточки (кроме первых трех примеров)
    const existingCards = grid.querySelectorAll('.quiz-card');
    for (let i = 3; i < existingCards.length; i++) {
        existingCards[i].remove();
    }
    
    // Добавляем новые карточки
    quizzes.slice(3).forEach(quiz => {
        const card = document.createElement('div');
        card.className = 'quiz-card';
        card.innerHTML = `
            <h3 class="quiz-title">
                <i class="fas fa-question-circle"></i> ${quiz.title}
            </h3>
            <p><strong>Дата:</strong> ${quiz.date}</p>
            <p><strong>Тема:</strong> ${quiz.theme}</p>
            
            <div class="quiz-winner">
                <div class="winner-icon ${getPlaceClass(quiz.winner)}">${getPlaceNumber(quiz.winner)}</div>
                <div class="winner-info">
                    <h4>${quiz.winner}</h4>
                    <p>${quiz.score} очков</p>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Обновляем таблицу результатов
function updateResultsTable(participants) {
    const tableBody = document.querySelector('.results-table tbody');
    if (!tableBody) return;
    
    // Очищаем старые строки
    const existingRows = tableBody.querySelectorAll('tr');
    for (let i = 3; i < existingRows.length; i++) {
        existingRows[i].remove();
    }
    
    // Добавляем новых участников (начиная с 4 места)
    participants.slice(3).forEach((participant, index) => {
        const row = document.createElement('tr');
        const place = index + 4; // начинаем с 4 места
        
        row.innerHTML = `
            <td>${place}</td>
            <td>${participant.name}</td>
            <td>${participant.totalScore}</td>
            <td>${participant.wins}</td>
            <td>${participant.bestQuiz} (${participant.bestScore})</td>
        `;
        tableBody.appendChild(row);
    });
}

// Обновляем навигацию по годам
function updateYearNavigation(currentYear) {
    const yearLinks = document.querySelectorAll('.year-link, .dropdown-content a');
    
    yearLinks.forEach(link => {
        const year = parseInt(link.textContent);
        if (year === currentYear) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
        
        // Обновляем ссылки
        if (link.tagName === 'A') {
            link.href = `${year}.html`;
        }
    });
}

// Вспомогательные функции
function getPlaceClass(winnerName) {
    // Здесь должна быть логика определения места по имени победителя
    // Пока возвращаем класс по умолчанию
    return 'first-place-icon';
}

function getPlaceNumber(winnerName) {
    // Здесь должна быть логика определения номера места
    return '1';
}

// Анимация пьедестала
function animatePodium() {
    const podiumSteps = document.querySelectorAll('.podium-step');
    
    podiumSteps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            step.style.transition = 'all 0.6s ease';
            step.style.opacity = '1';
            step.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    loadStatisticsData();
    animatePodium();
    
    // Добавляем интерактивность карточкам
    const quizCards = document.querySelectorAll('.quiz-card');
    quizCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });
});

// Экспортируем функции для использования в других файлах
window.Statistics = {
    getCurrentYear,
    loadStatisticsData,
    statisticsData
};