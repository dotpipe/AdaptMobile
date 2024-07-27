// mobile/AdaptMobile/AdaptMobile/src/services/WebSocketService.js
import io from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = io('https://api.adaptmobile.com');
    this.listeners = {};
  }

  connect() {
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('adUpdate', (data) => {
      if (this.listeners['adUpdate']) {
        this.listeners['adUpdate'].forEach(callback => callback(data));
      }
    });
  }

  subscribe(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  unsubscribe(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }
}

export default new WebSocketService();