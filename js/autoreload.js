// Создайте файл js/autoreload.js
if (window.location.hostname === 'localhost') {
  const socket = new WebSocket('ws://localhost:5500'); // порт Live Server
  
  socket.onmessage = function(event) {
    if (event.data === 'reload') {
      window.location.reload();
    }
  };
}