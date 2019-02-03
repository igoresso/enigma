class Keyboard {
  constructor(classAttribute) {
    this.keys = document.querySelectorAll(classAttribute);
  }

  inputAction(letter) {
    return letter;
  }

  bind() {
    for (let key of this.keys) {
      key.onclick = () => {
        this.inputAction(key.innerText.toUpperCase());
      };
    }
  }

  init() {
    this.bind();
  }
}

const keyboard = new Keyboard('.keyboard__btn');
export default keyboard;
