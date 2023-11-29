/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/ChatWidget.js":
/*!******************************!*\
  !*** ./src/js/ChatWidget.js ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ChatWidget; }
/* harmony export */ });
/* harmony import */ var _CreationElements__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreationElements */ "./src/js/CreationElements.js");

class ChatWidget {
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
    array.forEach(el => {
      this.addUserToList(el);
    });
  }
  createUserElement(obj) {
    const user = _CreationElements__WEBPACK_IMPORTED_MODULE_0__["default"].createElement('li', ['user']);
    user.dataset.id = obj.id;
    const circle = _CreationElements__WEBPACK_IMPORTED_MODULE_0__["default"].createElement('div', ['circle']);
    const nickname = _CreationElements__WEBPACK_IMPORTED_MODULE_0__["default"].createElement('span', ['nickname']);
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
    [...this.userList.childNodes].find(child => child.dataset.id === obj.id).remove();
  }
  renderingMessage(obj) {
    const {
      chat
    } = obj;
    chat.forEach(m => this.addMessageToList(m));
  }
  addMessageToList(messageObj) {
    const message = this.createMessageElement(messageObj);
    this.messageList.append(message);
  }
  createMessageElement(messageInf) {
    const message = _CreationElements__WEBPACK_IMPORTED_MODULE_0__["default"].createElement('li', ['message']);
    message.dataset.id = messageInf.id;
    const info = _CreationElements__WEBPACK_IMPORTED_MODULE_0__["default"].createElement('div', ['message_info']);
    const author = _CreationElements__WEBPACK_IMPORTED_MODULE_0__["default"].createElement('span', ['message_author']);
    if (messageInf.id === this.mineId) {
      message.classList.add('mine_message');
      info.classList.add('mine');
      author.textContent = 'You';
    } else {
      author.textContent = messageInf.nickname;
    }
    const date = _CreationElements__WEBPACK_IMPORTED_MODULE_0__["default"].createElement('span', ['message_date']);
    date.textContent = messageInf.date;
    info.append(author);
    info.append(date);
    const text = _CreationElements__WEBPACK_IMPORTED_MODULE_0__["default"].createElement('span', ['message_text']);
    text.textContent = messageInf.text;
    message.append(info);
    message.append(text);
    return message;
  }
  getLastMessage() {
    return this.messageList.childNodes[this.messageList.childNodes.length - 1];
  }
}

/***/ }),

/***/ "./src/js/CommunicationServer.js":
/*!***************************************!*\
  !*** ./src/js/CommunicationServer.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ CommunicationServer; }
/* harmony export */ });
class CommunicationServer {
  constructor(port, portWs) {
    this.port = port;
    this.portWs = portWs;
    this.ws = null;
  }
  async sendNickname(nickname) {
    const url = `${this.port}/nickname`;
    const response = fetch(url, {
      method: 'POST',
      body: nickname
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

/***/ }),

/***/ "./src/js/ControlChat.js":
/*!*******************************!*\
  !*** ./src/js/ControlChat.js ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ControlChat; }
/* harmony export */ });
/* harmony import */ var _GetDate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GetDate */ "./src/js/GetDate.js");

class ControlChat {
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
      this.communicator.sendNickname(new FormData(this.widget.formRegistration)).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Не удалось проверить имя');
      }).then(data => {
        if (data) {
          if (data.status === 'free') {
            this.widget.mineId = data.user.id;
            return this.showChat();
          }
          if (data.status === 'busy') {
            return this.toolTip.showToolTip(this.widget.enterNickname, 'Имя уже используется');
          }
        }
        throw new Error('Не удалось обработать ответ сервера');
      }).catch(err => {
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
    this.communicator.streaming(this.widget.mineId, this.streamingErr, this.readServerMessage);
    this.communicator.messaging(this.messagingOpened, this.messagingClosed, this.messagingError, this.readMessage);
    this.communicator.getUserList().then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Не удалось загрузить список участников');
    }).then(data => {
      if (data) {
        return this.widget.renderingUserList(data);
      }
      throw new Error('Не удалось обработать ответ сервера');
    }).catch(err => {
      this.showErrorMessage.showMessage(err.message);
    });
  }
  streamingErr() {
    this.showErrorMessage.showMessage('Ошибка подключения');
  }
  readServerMessage(e) {
    const {
      status,
      ...user
    } = JSON.parse(e.data);
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
        message.date = _GetDate__WEBPACK_IMPORTED_MODULE_0__["default"].getFormatDate();
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
        behavior: 'smooth'
      });
    }
  }
}

/***/ }),

/***/ "./src/js/CreationElements.js":
/*!************************************!*\
  !*** ./src/js/CreationElements.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ CreationElements; }
/* harmony export */ });
class CreationElements {
  static createElement(tag, classes, attributes) {
    const element = document.createElement(tag);
    if (classes) element.classList.add(...classes);
    if (attributes) {
      for (let i = 0; i < attributes.length; i += 1) {
        element.setAttribute(attributes[i].name, attributes[i].value);
      }
    }
    return element;
  }
}

/***/ }),

/***/ "./src/js/Curtain.js":
/*!***************************!*\
  !*** ./src/js/Curtain.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Curtain; }
/* harmony export */ });
class Curtain {
  constructor(element) {
    this.element = element;
  }
  showCurtain(zIndex, color) {
    if (zIndex) this.element.style.zIndex = zIndex;
    if (color) this.element.style.backgroundColor = color;
    this.element.classList.remove('hidden');
  }
  hideCurtain() {
    if (this.element.style) this.element.removeAttribute('style');
    this.element.classList.add('hidden');
  }
}

/***/ }),

/***/ "./src/js/GetDate.js":
/*!***************************!*\
  !*** ./src/js/GetDate.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ GetDate; }
/* harmony export */ });
class GetDate {
  static getFormatDate() {
    const date = new Date();
    const dd = GetDate.getDay(date);
    const mm = GetDate.getMonth(date);
    const yy = GetDate.getYear(date);
    const fullDate = `${dd}.${mm}.${yy}`;
    const time = date.toTimeString().slice(0, 5);
    const result = `${time} ${fullDate}`;
    return result;
  }
  static getDay(date) {
    let dd = date.getDate();
    if (dd.length === 1) dd = `0${dd}`;
    return dd;
  }
  static getMonth(date) {
    let mm = date.getMonth() + 1;
    if (mm.length === 1) mm = `0${mm}`;
    return mm;
  }
  static getYear(date) {
    const result = `${date.getUTCFullYear()}`;
    return result;
  }
}

/***/ }),

/***/ "./src/js/ShowErrorMessage.js":
/*!************************************!*\
  !*** ./src/js/ShowErrorMessage.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ShowErrorMessage; }
/* harmony export */ });
class ShowErrorMessage {
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

/***/ }),

/***/ "./src/js/ToolTip.js":
/*!***************************!*\
  !*** ./src/js/ToolTip.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ToolTip; }
/* harmony export */ });
class ToolTip {
  constructor(classNameTooltip) {
    this.classNameTooltip = classNameTooltip;
    this.toolTipsBox = [];
  }
  showToolTip(element, message) {
    const toolTip = document.createElement('div');
    toolTip.classList.add(this.classNameTooltip);
    toolTip.textContent = message;
    toolTip.dataset.name = element.name;
    this.toolTipsBox.push(toolTip);
    document.body.append(toolTip);
    const {
      top,
      left
    } = element.getBoundingClientRect();
    const offsetHorizont = (toolTip.offsetWidth - element.offsetWidth) / 2;
    toolTip.style.left = `${left - offsetHorizont}px`;
    toolTip.style.top = `${top - toolTip.offsetHeight - 10}px`;
  }
  hideAllToolTips() {
    for (let i = 0; i < this.toolTipsBox.length; i += 1) {
      this.toolTipsBox[i].remove();
    }
    this.toolTipsBox = [];
  }
  hideToolTip(name) {
    const hideToolTip = this.toolTipsBox.find(t => t.dataset.name === name);
    hideToolTip.remove();
    this.toolTipsBox = this.toolTipsBox.filter(t => t !== hideToolTip);
  }
  isToolTip() {
    if (this.toolTipsBox.length !== 0) return true;
    return false;
  }
}

/***/ }),

/***/ "./src/js/app.js":
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ChatWidget__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ChatWidget */ "./src/js/ChatWidget.js");
/* harmony import */ var _CommunicationServer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CommunicationServer */ "./src/js/CommunicationServer.js");
/* harmony import */ var _ControlChat__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ControlChat */ "./src/js/ControlChat.js");
/* harmony import */ var _ToolTip__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ToolTip */ "./src/js/ToolTip.js");
/* harmony import */ var _ShowErrorMessage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ShowErrorMessage */ "./src/js/ShowErrorMessage.js");
/* harmony import */ var _Curtain__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Curtain */ "./src/js/Curtain.js");






const container = document.querySelector('.container');
const curtainEl = document.querySelector('.curtain');
const port = 'https://ahj-task-8-chat.onrender.com';
const portWs = 'wss://ahj-task-8-chat.onrender.com';
const widget = new _ChatWidget__WEBPACK_IMPORTED_MODULE_0__["default"](container);
const toolTip = new _ToolTip__WEBPACK_IMPORTED_MODULE_3__["default"]('tooltip');
const communicator = new _CommunicationServer__WEBPACK_IMPORTED_MODULE_1__["default"](port, portWs);
const curtain = new _Curtain__WEBPACK_IMPORTED_MODULE_5__["default"](curtainEl);
const showErrorMessage = new _ShowErrorMessage__WEBPACK_IMPORTED_MODULE_4__["default"](container, 'error-message_box', 'error-message_text', 'error-message_ok', 'hidden', curtain);
const controler = new _ControlChat__WEBPACK_IMPORTED_MODULE_2__["default"](widget, toolTip, communicator, showErrorMessage);
controler.activation();

/***/ }),

/***/ "./src/index.html":
/*!************************!*\
  !*** ./src/index.html ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// Module
var code = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">\n    <title>Чат</title>\n</head>\n<body>\n    <div class=\"container\">\n        <form class=\"registration_form\" name=\"registration\">\n            <h4 class=\"registration_title\">Выберите псевдоним</h3>\n            <input type=\"text\" class=\"enter_nickname\" name=\"nickname\" placeholder=\"Minimum 3 characters\">\n            <button type=\"submit\" class=\"send_nickname\">Продолжить</button>\n        </form>\n        <div class=\"chat_box hidden\">\n            <div class=\"users_box\">\n                <ul class=\"users_list\"></div>\n            <div class=\"messages_box\">\n                <ul class=\"messages_list\"></ul>\n                <form class=\"send-message\" name=\"message\">\n                    <input type=\"text\" class=\"enter_message\" name=\"enter\" placeholder=\"Type your message here\">\n                </form>\n            </div>\n        </div>\n        <div class=\"error-message_box hidden\">\n            <h3 class=\"error-message_title\">Произошла ошибка</h3>\n            <span class=\"error-message_text\"></span>\n            <button type=\"button\" class=\"error-message_ok\">Ok</button>\n        </div>\n        <div class=\"curtain hidden\"></div>\n    </div>\n</body>\n</html>\n";
// Exports
/* harmony default export */ __webpack_exports__["default"] = (code);

/***/ }),

/***/ "./src/css/style.css":
/*!***************************!*\
  !*** ./src/css/style.css ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/licenses.txt":
/*!**************************!*\
  !*** ./src/licenses.txt ***!
  \**************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__.p + "licenses.txt";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/app */ "./src/js/app.js");
/* harmony import */ var _index_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.html */ "./src/index.html");
/* harmony import */ var _css_style_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./css/style.css */ "./src/css/style.css");
/* harmony import */ var _licenses_txt__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./licenses.txt */ "./src/licenses.txt");




}();
/******/ })()
;
//# sourceMappingURL=main.js.map