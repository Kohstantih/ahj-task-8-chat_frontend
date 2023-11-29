import CreationElements from './CreationElements';

export default class ChatWidget {
  constructor(container) {
    this.container = container;
    this.formRegistration = document.forms.registration;
    this.enterNickname = this.formRegistration.elements.nickname;
    this.errorBtnOK = this.container.querySelector('.error-message_ok');
    this.userList = this.container.querySelector('.users_list');

    this.chatBox = this.container.querySelector('.chat_box');
    this.messageList = this.chatBox.querySelector('.messages_list');
    this.formSendMessage = document.forms.message;
    this.enterMessage = this.formSendMessage.elements.enter;

    this.mineId = null;
  }

  hidingFormRegistration() {
    this.formRegistration.classList.add('hidden');
  }

  showChatBox() {
    this.chatBox.classList.remove('hidden');
  }

  renderingUserList(array) {
    array.forEach((el) => {
      this.addUserToList(el);
    });
  }

  createUserElement(obj) {
    const user = CreationElements.createElement('li', ['user']);
    user.dataset.id = obj.id;
    const circle = CreationElements.createElement('div', ['circle']);
    const nickname = CreationElements.createElement('span', ['nickname']);
    if (obj.id === this.mineId) {
      nickname.textContent = 'You';
      nickname.classList.add('mine');
    } else {
      nickname.textContent = obj.nickname;
    }

    user.append(circle);
    user.append(nickname);
    return user;
  }

  addUserToList(obj) {
    const user = this.createUserElement(obj);
    this.userList.append(user);
  }

  delUserFromList(obj) {
    [...this.userList.childNodes].find((child) => child.dataset.id === obj.id).remove();
  }

  renderingMessage(obj) {
    const { chat } = obj;
    chat.forEach((m) => this.addMessageToList(m));
  }

  addMessageToList(messageObj) {
    const message = this.createMessageElement(messageObj);
    this.messageList.append(message);
  }

  createMessageElement(messageInf) {
    const message = CreationElements.createElement('li', ['message']);
    message.dataset.id = messageInf.id;

    const info = CreationElements.createElement('div', ['message_info']);
    const author = CreationElements.createElement('span', ['message_author']);

    if (messageInf.id === this.mineId) {
      message.classList.add('mine_message');
      info.classList.add('mine');
      author.textContent = 'You';
    } else {
      author.textContent = messageInf.nickname;
    }

    const date = CreationElements.createElement('span', ['message_date']);
    date.textContent = messageInf.date;

    info.append(author);
    info.append(date);

    const text = CreationElements.createElement('span', ['message_text']);
    text.textContent = messageInf.text;

    message.append(info);
    message.append(text);

    return message;
  }

  getLastMessage() {
    return this.messageList.childNodes[this.messageList.childNodes.length - 1];
  }
}
