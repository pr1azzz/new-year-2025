// sw.js - Service Worker для семейного календаря

const CACHE_NAME = 'family-calendar-v1';
const STATIC_FILES = [
  '/',
  '/index.html',
  '/family-chat.html',
  '/css/style.css',
  '/css/chat-fixes.css',
  '/js/family-chat-frontend.js',
  '/favicon.ico',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&family=Playfair+Display:wght@700&display=swap',
  'https://cdn.socket.io/4.5.4/socket.io.min.js'
];

// Устанавливаем Service Worker
self.addEventListener('install', (event) => {
  console.log('📦 Установка Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Кэшируем статические файлы');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => self.skipWaiting())
  );
});

// Активируем Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker активирован');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`🗑️ Удаляем старый кэш: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Обрабатываем запросы
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // НЕ кэшируем:
  // 1. POST запросы (отправка сообщений)
  // 2. Запросы к API сервера
  // 3. Socket.io соединения
  // 4. Динамические данные
  
  if (event.request.method === 'POST' || 
      url.pathname.startsWith('/api/') ||
      url.pathname.includes('socket.io') ||
      url.hostname === 'localhost:3000' && url.pathname !== '/') {
    console.log(`🔁 Пропускаем кэширование для: ${event.request.url}`);
    return; // Пропускаем, не кэшируем
  }
  
  // Для GET запросов к статическим файлам - стратегия Cache First
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          // Возвращаем из кэша если есть
          if (cachedResponse) {
            console.log(`📂 Из кэша: ${url.pathname}`);
            return cachedResponse;
          }
          
          // Иначе загружаем из сети
          console.log(`🌐 Загружаем из сети: ${url.pathname}`);
          return fetch(event.request)
            .then((response) => {
              // Кэшируем только успешные ответы
              if (response && response.status === 200) {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    // НЕ кэшируем данные API чата
                    if (!url.pathname.startsWith('/api/')) {
                      cache.put(event.request, responseToCache);
                    }
                  });
              }
              return response;
            })
            .catch(() => {
              // Оффлайн-страница для HTML
              if (event.request.headers.get('accept').includes('text/html')) {
                return caches.match('/index.html');
              }
              
              // Для других файлов возвращаем ошибку
              return new Response('Оффлайн режим', {
                status: 503,
                statusText: 'Нет подключения к интернету'
              });
            });
        })
    );
  }
});

// Фоновая синхронизация (для будущих функций)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-messages') {
    console.log('🔄 Фоновая синхронизация сообщений');
    // Можно добавить синхронизацию оффлайн-сообщений
  }
});

// Получение push-уведомлений (для будущих функций)
self.addEventListener('push', (event) => {
  const title = 'Семейный чат';
  const options = {
    body: event.data ? event.data.text() : 'Новое сообщение!',
    icon: '/favicon.ico',
    badge: '/favicon.ico'
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/family-chat.html');
        }
      })
  );
});