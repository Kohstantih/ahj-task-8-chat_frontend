export default class ShowErrorMessage {
  constructor(container, classNameBox, classNameMessage, classNameBtn, classNameHide, curtain) {
    this.container = container;
    this.classNameBox = classNameBox;
    this.classNameMessage = classNameMessage;
    this.classNameHide = classNameHide;
    this.classNameBtn = classNameBtn;

    this.curtain = curtain;

    this.errorMessageBox = this.container.querySelector(`.${this.classNameBox}`);
    this.errorMessage = this.errorMessageBox.querySelector(`.${this.classNameMessage}`);
    this.errorBtnOK = this.errorMessageBox.querySelector(`.${classNameBtn}`);

    this.hideMessage = this.hideMessage.bind(this);
  }

  showMessage(message) {
    if (message) this.errorMessage.textContent = message;

    this.curtain.showCurtain('9999', 'red');
    this.errorMessageBox.classList.remove(this.classNameHide);

    this.errorMessageBox.style.left = `${this.container.offsetWidth / 2 - this.errorMessageBox.offsetWidth / 2}px`;
    this.errorMessageBox.style.top = `${this.container.offsetHeight / 2 - this.errorMessageBox.offsetHeight / 2}px`;

    this.errorBtnOK.addEventListener('click', this.hideMessage);
  }

  hideMessage() {
    this.errorMessage.textContent = '';

    this.curtain.hideCurtain();
    this.errorMessageBox.classList.add(this.classNameHide);

    this.errorBtnOK.removeEventListener('click', this.hideMessage);
  }
}
