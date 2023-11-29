export default class Curtain {
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
