// js/family-chat-frontend.js

class FamilyChat {
    constructor() {
        this.socket = null;
        this.currentUser = 'Гость';
        this.userAvatar = '👤';
        this.isConnected = false;
        
        this.init();
    }
    
    init() {
        // Загружаем интерфейс чата
        this.loadChatInterface();
        
        // Подключаемся к серверу
        this.connectToServer();
        
        // Настраиваем обработчики событий
        this.setupEventListeners();
    }
    
    loadChatInterface() {
        const chatApp = document.getElementById('chatApp');
        
        chatApp.innerHTML = `
            <div class="chat-wrapper-real">
                <!-- Сайдбар -->
                <div class="chat-sidebar-real">
                    <div class="user-profile">
                        <h3><i class="fas fa-user-circle"></i> Ваш профиль</h3>
                        <div class="profile-form">
                            <div class="input-group">
                                <label for="userNameInput">Ваше имя:</label>
                                <input type="text" id="userNameInput" placeholder="Введите ваше имя" value="${this.currentUser}">
                            </div>
                            <div class="input-group">
                                <label>Или выберите:</label>
                                <div class="family-members-select">
                                    <button class="member-option" data-name="Папа" data-avatar="👨">👨 Папа</button>
                                    <button class="member-option" data-name="Мама" data-avatar="👩">👩 Мама</button>
                                    <button class="member-option" data-name="Дочь" data-avatar="👧">👧 Дочь</button>
                                    <button class="member-option" data-name="Сын" data-avatar="👦">👦 Сын</button>
                                    <button class="member-option" data-name="Бабушка" data-avatar="👵">👵 Бабушка</button>
                                    <button class="member-option" data-name="Дедушка" data-avatar="👴">👴 Дедушка</button>
                                </div>
                            </div>
                            <button id="saveProfileBtn" class="save-profile-btn">
                                <i class="fas fa-check"></i> Сохранить профиль
                            </button>
                        </div>
                    </div>
                    
                    <div class="online-users">
                        <h4><i class="fas fa-users"></i> Сейчас онлайн <span id="onlineCount">0</span></h4>
                        <div class="users-list" id="usersList">
                            <div class="empty-users">Загрузка...</div>
                        </div>
                    </div>
                    
                    <div class="chat-controls">
                        <button id="clearChatBtn" class="control-btn danger">
                            <i class="fas fa-trash"></i> Очистить чат
                        </button>
                        <button id="exportChatBtn" class="control-btn">
                            <i class="fas fa-download"></i> Экспорт
                        </button>
                    </div>
                </div>
                
                <!-- Основная область -->
                <div class="chat-main-real">
                    <div class="chat-messages-real" id="chatMessages">
                        <div class="loading-messages">
                            <i class="fas fa-spinner fa-spin"></i> Загрузка сообщений...
                        </div>
                    </div>
                    
                    <div class="message-input-area-real">
                        <div class="input-wrapper">
                            <textarea 
                                id="messageInput" 
                                placeholder="Напишите сообщение..." 
                                rows="2"
                                maxlength="500"
                                disabled
                            ></textarea>
                            <div class="input-actions">
                                <button id="emojiBtn" class="action-btn" title="Смайлик">
                                    <i class="far fa-smile"></i>
                                </button>
                                <button id="sendMessageBtn" class="send-btn" disabled>
                                    <i class="fas fa-paper-plane"></i> Отправить
                                </button>
                            </div>
                        </div>
                        <div class="input-hint">
                            Нажмите Enter для отправки, Shift+Enter для новой строки
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    connectToServer() {
        // Подключаемся к серверу Socket.io
        const serverUrl = 'http://localhost:3000';
        this.socket = io(serverUrl);
        
        // Обработчики событий Socket.io
        this.socket.on('connect', () => {
            console.log('✅ Подключено к серверу чата');
            this.isConnected = true;
            this.updateConnectionStatus(true);
            
            // Регистрируем пользователя после подключения
            this.registerUser();
        });
        
        this.socket.on('disconnect', () => {
            console.log('❌ Отключено от сервера');
            this.isConnected = false;
            this.updateConnectionStatus(false);
        });
        
        this.socket.on('connect_error', (error) => {
            console.error('Ошибка подключения:', error);
            this.showError('Не удалось подключиться к серверу чата. Убедитесь, что сервер запущен.');
        });
        
        // Получение истории сообщений
        this.socket.on('message_history', (messages) => {
            this.displayMessages(messages);
        });
        
        // Новое сообщение
        this.socket.on('new_message', (message) => {
            this.addMessage(message);
            this.playSound('message');
            this.showNotification(`${message.sender}: ${message.text.substring(0, 30)}...`);
        });
        
        // Обновление лайков
        this.socket.on('message_liked', (data) => {
            this.updateMessageLikes(data.messageId, data.likes);
        });
        
        // Удаление сообщения
        this.socket.on('message_deleted', (messageId) => {
            this.removeMessage(messageId);
        });
        
        // Обновление списка онлайн пользователей
        this.socket.on('online_users_update', (users) => {
            this.updateOnlineUsers(users);
        });
        
        // Чат очищен
        this.socket.on('chat_cleared', () => {
            document.getElementById('chatMessages').innerHTML = 
                '<div class="empty-chat"><i class="fas fa-comments"></i><p>Чат очищен</p></div>';
            this.showNotification('🗑️ Чат был очищен администратором');
        });
    }
    
    registerUser() {
        if (!this.socket || !this.isConnected) return;
        
        this.socket.emit('register_user', {
            username: this.currentUser,
            avatar: this.userAvatar
        });
    }
    
    setupEventListeners() {
        // Сохранение профиля
        document.getElementById('saveProfileBtn')?.addEventListener('click', () => {
            this.saveProfile();
        });
        
        // Выбор члена семьи
        document.querySelectorAll('.member-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.dataset.name;
                const avatar = e.target.dataset.avatar;
                
                document.getElementById('userNameInput').value = name;
                this.currentUser = name;
                this.userAvatar = avatar;
                
                // Подсветка выбранного
                document.querySelectorAll('.member-option').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                
                // Перерегистрируемся с новым именем
                if (this.isConnected) {
                    this.registerUser();
                }
            });
        });
        
        // Отправка сообщения
        const sendBtn = document.getElementById('sendMessageBtn');
        const messageInput = document.getElementById('messageInput');
        
        sendBtn?.addEventListener('click', () => {
            this.sendMessage();
        });
        
        messageInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
            
            // Авто-рост textarea
            setTimeout(() => {
                e.target.style.height = 'auto';
                e.target.style.height = (e.target.scrollHeight) + 'px';
            }, 0);
        });
        
        // Включение поля ввода при вводе имени
        document.getElementById('userNameInput')?.addEventListener('input', (e) => {
            this.currentUser = e.target.value.trim() || 'Гость';
            const isNameEntered = this.currentUser.length > 0;
            
            messageInput.disabled = !isNameEntered;
            sendBtn.disabled = !isNameEntered;
        });
        
        // Очистка чата
        document.getElementById('clearChatBtn')?.addEventListener('click', () => {
            if (confirm('Очистить весь чат? Это действие могут выполнять только администраторы.')) {
                const password = prompt('Введите пароль администратора:');
                if (password) {
                    this.clearChat(password);
                }
            }
        });
        
        // Экспорт чата
        document.getElementById('exportChatBtn')?.addEventListener('click', () => {
            this.exportChat();
        });
        
        // Эмодзи
        document.getElementById('emojiBtn')?.addEventListener('click', () => {
            this.toggleEmojiPicker();
        });
    }
    
    saveProfile() {
        const nameInput = document.getElementById('userNameInput');
        this.currentUser = nameInput.value.trim() || 'Гость';
        this.userAvatar = this.getAvatarForName(this.currentUser);
        
        if (this.currentUser === 'Гость') {
            this.showError('Пожалуйста, введите ваше имя');
            return;
        }
        
        // Перерегистрируемся с новым именем
        if (this.isConnected) {
            this.registerUser();
        }
        
        // Включаем поле ввода сообщений
        document.getElementById('messageInput').disabled = false;
        document.getElementById('sendMessageBtn').disabled = false;
        
        this.showSuccess(`Профиль сохранен: ${this.currentUser} ${this.userAvatar}`);
    }
    
    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const text = messageInput.value.trim();
        
        if (!text || !this.isConnected) {
            this.showError('Не удалось отправить сообщение');
            return;
        }
        
        if (this.currentUser === 'Гость') {
            this.showError('Пожалуйста, выберите или введите ваше имя');
            return;
        }
        
        // Отправляем на сервер
        this.socket.emit('send_message', {
            sender: this.currentUser,
            text: text,
            avatar: this.userAvatar
        });
        
        // Очищаем поле ввода
        messageInput.value = '';
        messageInput.style.height = 'auto';
        messageInput.focus();
    }
    
    displayMessages(messages) {
        const chatMessages = document.getElementById('chatMessages');
        
        if (!messages || messages.length === 0) {
            chatMessages.innerHTML = `
                <div class="empty-chat">
                    <i class="fas fa-comments fa-3x"></i>
                    <h4>Чат пуст</h4>
                    <p>Напишите первое сообщение!</p>
                </div>
            `;
            return;
        }
        
        chatMessages.innerHTML = messages.map(msg => this.createMessageElement(msg)).join('');
        this.scrollToBottom();
    }
    
    addMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        
        // Убираем сообщение "чат пуст"
        if (chatMessages.querySelector('.empty-chat')) {
            chatMessages.innerHTML = '';
        }
        
        // Добавляем новое сообщение
        chatMessages.innerHTML += this.createMessageElement(message);
        this.scrollToBottom();
    }
    
    createMessageElement(message) {
        const isOwnMessage = message.sender === this.currentUser;
        const messageClass = isOwnMessage ? 'message own' : 'message other';
        const time = new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        return `
            <div class="${messageClass}" data-id="${message.id}">
                <div class="message-header">
                    <div class="message-avatar">${message.avatar || this.getAvatarForName(message.sender)}</div>
                    <div class="message-info">
                        <div class="message-sender">${message.sender}</div>
                        <div class="message-time">${time}</div>
                    </div>
                </div>
                <div class="message-text">${this.escapeHtml(message.text)}</div>
                <div class="message-actions">
                    <button class="action-btn like-btn" onclick="familyChat.likeMessage(${message.id})">
                        <i class="far fa-heart"></i> <span class="like-count">${message.likes || 0}</span>
                    </button>
                    ${isOwnMessage ? `
                        <button class="action-btn delete-btn" onclick="familyChat.deleteMessage(${message.id})">
                            <i class="far fa-trash-alt"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    updateMessageLikes(messageId, likes) {
        const messageElement = document.querySelector(`.message[data-id="${messageId}"]`);
        if (messageElement) {
            const likeCount = messageElement.querySelector('.like-count');
            if (likeCount) {
                likeCount.textContent = likes;
            }
        }
    }
    
    removeMessage(messageId) {
        const messageElement = document.querySelector(`.message[data-id="${messageId}"]`);
        if (messageElement) {
            messageElement.remove();
        }
    }
    
    likeMessage(messageId) {
        if (this.isConnected) {
            this.socket.emit('like_message', messageId);
            this.playSound('like');
        }
    }
    
    deleteMessage(messageId) {
        if (confirm('Удалить это сообщение?')) {
            if (this.isConnected) {
                this.socket.emit('delete_message', messageId);
            }
        }
    }
    
    updateOnlineUsers(users) {
        const usersList = document.getElementById('usersList');
        const onlineCount = document.getElementById('onlineCount');
        
        onlineCount.textContent = users.length;
        
        if (users.length === 0) {
            usersList.innerHTML = '<div class="empty-users">Нет активных пользователей</div>';
            return;
        }
        
        usersList.innerHTML = users.map(user => `
            <div class="user-item">
                <div class="user-avatar">${user.avatar}</div>
                <div class="user-info">
                    <div class="user-name">${user.username}</div>
                    <div class="user-status">online</div>
                </div>
            </div>
        `).join('');
    }
    
    clearChat(password) {
        fetch(`http://localhost:3000/api/clear-chat?password=${encodeURIComponent(password)}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.showSuccess('Чат очищен');
            } else {
                this.showError(data.error || 'Не удалось очистить чат');
            }
        })
        .catch(error => {
            this.showError('Ошибка соединения');
        });
    }
    
    exportChat() {
        fetch('http://localhost:3000/api/messages')
            .then(response => response.json())
            .then(messages => {
                const chatText = messages.map(msg => {
                    const date = new Date(msg.timestamp).toLocaleString();
                    return `[${date}] ${msg.sender}: ${msg.text}`;
                }).join('\n');
                
                const blob = new Blob([chatText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                
                const date = new Date().toISOString().split('T')[0];
                a.href = url;
                a.download = `семейный-чат-${date}.txt`;
                a.click();
                
                URL.revokeObjectURL(url);
                this.showSuccess('Чат экспортирован!');
            })
            .catch(error => {
                this.showError('Не удалось экспортировать чат');
            });
    }
    
    // Вспомогательные методы
    updateConnectionStatus(connected) {
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendMessageBtn');
        
        if (connected) {
            messageInput.placeholder = 'Напишите сообщение...';
            if (this.currentUser !== 'Гость') {
                messageInput.disabled = false;
                sendBtn.disabled = false;
            }
        } else {
            messageInput.placeholder = 'Подключение к серверу...';
            messageInput.disabled = true;
            sendBtn.disabled = true;
        }
    }
    
    getAvatarForName(name) {
        const avatars = {
            'Папа': '👨', 'Мама': '👩', 'Дочь': '👧', 'Сын': '👦',
            'Бабушка': '👵', 'Дедушка': '👴', 'Гость': '👤'
        };
        return avatars[name] || '👤';
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    playSound(type) {
        // Простые звуки через Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (type === 'message') {
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            } else if (type === 'like') {
                oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
            }
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            // Игнорируем ошибки звука
        }
    }
    
    showNotification(text) {
        // Проверяем, активна ли страница
        if (document.hidden) {
            // Показываем browser notification
            if ("Notification" in window && Notification.permission === "granted") {
                new Notification("Семейный чат", {
                    body: text,
                    icon: "/favicon.ico"
                });
            }
        }
    }
    
    showError(message) {
        this.showNotification(`❌ ${message}`);
    }
    
    showSuccess(message) {
        this.showNotification(`✅ ${message}`);
    }
    
    toggleEmojiPicker() {
        const emojis = ['😀', '😂', '🥰', '😎', '👍', '🎉', '❤️', '🔥', '✨', '🌟'];
        const picker = document.createElement('div');
        picker.className = 'emoji-picker';
        
        picker.innerHTML = emojis.map(emoji => `
            <button class="emoji-option" onclick="document.getElementById('messageInput').value += '${emoji}'">
                ${emoji}
            </button>
        `).join('');
        
        // Позиционируем возле кнопки
        const emojiBtn = document.getElementById('emojiBtn');
        const rect = emojiBtn.getBoundingClientRect();
        
        picker.style.position = 'absolute';
        picker.style.top = `${rect.top - 200}px`;
        picker.style.left = `${rect.left}px`;
        picker.style.zIndex = '1000';
        
        document.body.appendChild(picker);
        
        // Закрываем при клике вне
        setTimeout(() => {
            const closePicker = (e) => {
                if (!picker.contains(e.target) && e.target !== emojiBtn) {
                    picker.remove();
                    document.removeEventListener('click', closePicker);
                }
            };
            document.addEventListener('click', closePicker);
        }, 0);
    }
}

// Создаем глобальный экземпляр чата
let familyChat;

// Запускаем чат при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    familyChat = new FamilyChat();
});