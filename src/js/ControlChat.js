import GetDate from './GetDate';

export default class ControlChat {
  constructor(widget, toolTip, communicator, showErrorMessage) {
    this.widget = widget;
    this.toolTip = toolTip;
    this.communicator = communicator;
    this.showErrorMessage = showErrorMessage;

    this.messagingStatus = false;

    this.regNickname = this.regNickname.bind(this);
    this.changeEnterNickname = this.changeEnterNickname.bind(this);
    this.hideError = this.hideError.bind(this);
    this.streamingErr = this.streamingErr.bind(this);
    this.readServerMessage = this.readServerMessage.bind(this);
    this.messagingOpened = this.messagingOpened.bind(this);
    this.messagingClosed = this.messagingClosed.bind(this);
    this.messagingError = this.messagingError.bind(this);
    this.createMessage = this.createMessage.bind(this);
    this.readMessage = this.readMessage.bind(this);
  }

  activation() {
    this.widget.formRegistration.addEventListener('submit', this.regNickname);
    this.widget.enterNickname.addEventListener('input', this.changeEnterNickname);
  }

  regNickname(e) {
    e.preventDefault();

    const nickname = this.widget.enterNickname.value;
    if (nickname.length > 2) {
      this.communicator.sendNickname(new FormData(this.widget.formRegistration))
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Не удалось проверить имя');
        }).then((data) => {
          if (data) {
            if (data.status === 'free') {
              this.widget.mineId = data.user.id;
              return this.showChat();
            } if (data.status === 'busy') {
              return this.toolTip.showToolTip(this.widget.enterNickname, 'Имя уже используется');
            }
          }
          throw new Error('Не удалось обработать ответ сервера');
        }).catch((err) => {
          this.showErrorMessage.showMessage(err.message);
        });
    } else {
      this.toolTip.showToolTip(this.widget.enterNickname, 'Слишком короткий псевдоним');
    }
  }

  changeEnterNickname(e) {
    if (this.toolTip.isToolTip()) this.toolTip.hideToolTip(e.target.name);
  }

  hideError(e) {
    e.preventDefault();

    this.showErrorMessage.hideMessage();
  }

  showChat() {
    this.widget.hidingFormRegistration();
    this.widget.showChatBox();

    this.communicator
      .streaming(this.widget.mineId, this.streamingErr, this.readServerMessage);

    this.communicator
      .messaging(this.messagingOpened, this.messagingClosed, this.messagingError, this.readMessage);

    this.communicator.getUserList()
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Не удалось загрузить список участников');
      }).then((data) => {
        if (data) {
          return this.widget.renderingUserList(data);
        }
        throw new Error('Не удалось обработать ответ сервера');
      }).catch((err) => {
        this.showErrorMessage.showMessage(err.message);
      });
  }

  streamingErr() {
    this.showErrorMessage.showMessage('Ошибка подключения');
  }

  readServerMessage(e) {
    const { status, ...user } = JSON.parse(e.data);
    if (status === 'add') {
      this.widget.addUserToList(user);
    } else if (status === 'del') {
      this.widget.delUserFromList(user);
    }
  }

  messagingOpened() {
    this.messagingStatus = true;
    this.widget.formSendMessage.addEventListener('submit', this.createMessage);
  }

  messagingClosed() {
    this.messagingStatus = false;
  }

  messagingError() {
    this.showErrorMessage.showMessage('Ошибка подключения');
  }

  createMessage(e) {
    e.preventDefault();
    if (this.messagingStatus) {
      const text = this.widget.enterMessage.value;
      if (text) {
        const message = {};
        message.id = this.widget.mineId;
        message.text = text;
        message.date = GetDate.getFormatDate();

        this.communicator.sendMessage(message);
        this.widget.enterMessage.value = '';
      }
    } else {
      this.showErrorMessage.showMessage('Не удалось подключиться к серверу');
    }
  }

  readMessage(e) {
    const data = JSON.parse(e.data);

    this.widget.renderingMessage(data);

    this.scrollToLastMessage();
  }

  scrollToLastMessage() {
    const lastMessage = this.widget.getLastMessage();
    if (lastMessage) {
      lastMessage.scrollIntoView({
        block: 'end',
        behavior: 'smooth',
      });
    }
  }
}
