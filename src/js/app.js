import ChatWidget from './ChatWidget';
import CommunicationServer from './CommunicationServer';
import ControlChat from './ControlChat';
import ToolTip from './ToolTip';
import ShowErrorMessage from './ShowErrorMessage';
import Curtain from './Curtain';

const container = document.querySelector('.container');
const curtainEl = document.querySelector('.curtain');

const port = 'https://ahj-task-8-chat.onrender.com';
const portWs = 'wss://ahj-task-8-chat.onrender.com';

const widget = new ChatWidget(container);
const toolTip = new ToolTip('tooltip');
const communicator = new CommunicationServer(port, portWs);
const curtain = new Curtain(curtainEl);
const showErrorMessage = new ShowErrorMessage(container, 'error-message_box', 'error-message_text', 'error-message_ok', 'hidden', curtain);

const controler = new ControlChat(widget, toolTip, communicator, showErrorMessage);

controler.activation();
