export default class CommunicationServer {
  constructor(port, portWs) {
    this.port = port;
    this.portWs = portWs;

    this.ws = null;
  }

  async sendNickname(nickname) {
    const url = `${this.port}/nickname`;

    const response = fetch(url, {
      method: 'POST',
      body: nickname,
    });

    return response;
  }

  streaming(id, callbackErr, callbackMessage) {
    const eventSource = new EventSource(`${this.port}/sse/${id}`);

    eventSource.addEventListener('error', callbackErr);

    eventSource.addEventListener('message', callbackMessage);
  }

  getUserList() {
    const url = `${this.port}/nickname`;

    const response = fetch(url);

    return response;
  }

  messaging(callbackOpen, callbackClose, callbackError, callbackMessage) {
    this.ws = new WebSocket(`${this.portWs}/ws`);

    this.ws.addEventListener('open', callbackOpen);

    this.ws.addEventListener('close', callbackClose);

    this.ws.addEventListener('error', callbackError);

    this.ws.addEventListener('message', callbackMessage);
  }

  sendMessage(message) {
    this.ws.send(JSON.stringify(message));
  }
}
