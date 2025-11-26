class WebSocketService {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.listeners = new Set();
    this.connected = false;
    this.reconnectInterval = 2000;
  }

  connect() {
    if (this.ws) return;
    try {
      this.ws = new WebSocket(this.url);
    } catch (err) {
      console.error('WebSocket connect error', err);
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.connected = true;
      console.info('WS connected', this.url);
    };

    this.ws.onmessage = (ev) => {
      let data = ev.data;
      try { data = JSON.parse(ev.data); } catch (e) { }
      this.listeners.forEach((cb) => cb(data));
    };

    this.ws.onclose = () => {
      this.connected = false;
      this.ws = null;
      console.warn('WS closed, scheduling reconnect');
      this.scheduleReconnect();
    };

    this.ws.onerror = (err) => {
      console.error('WS error', err);
      try { this.ws.close(); } catch (e) {}
    };
  }

  scheduleReconnect() {
    setTimeout(() => {
      if (!this.ws) this.connect();
    }, this.reconnectInterval);
  }

  send(obj) {
    const payload = typeof obj === 'string' ? obj : JSON.stringify(obj);
    if (this.connected && this.ws) this.ws.send(payload);
  }

  addListener(cb) { this.listeners.add(cb); }
  removeListener(cb) { this.listeners.delete(cb); }

  close() { if (this.ws) { this.ws.close(); this.ws = null; } }
}

let defaultInstance = null;
export function getWebSocket(url = (process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws')) {
  if (!defaultInstance) defaultInstance = new WebSocketService(url);
  return defaultInstance;
}
