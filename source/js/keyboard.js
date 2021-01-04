class Keyboard {
  constructor(classAttribute) {
    this.keys = document.querySelectorAll(classAttribute);
  }

  inputAction(letter) {
    return letter;
  }

  bind() {
    for (let key of this.keys) {
      const letter = key.innerText.toUpperCase();

      key.onclick = () => {
        this.inputAction(letter);
      };
    }

    document.onkeypress = e => {
      const re = /^[A-Z]{1}/;
      const key = e.key.toUpperCase();

      if (re.test(key)) {
        this.inputAction(key);
      }
    };
  }

  init() {
    this.bind();
  }
}

const keyboard = new Keyboard('.keyboard__btn');
export default keyboard;
