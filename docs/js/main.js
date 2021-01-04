(function () {
  'use strict';

  const Alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const Layout = ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'P', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', 'L'];
  const RotorOption = {
    'I': {
      'alphabet': ['E', 'K', 'M', 'F', 'L', 'G', 'D', 'Q', 'V', 'Z', 'N', 'T', 'O', 'W', 'Y', 'H', 'X', 'U', 'S', 'P', 'A', 'I', 'B', 'R', 'C', 'J'],
      'notch': 'Q'
    },
    'II': {
      'alphabet': ['A', 'J', 'D', 'K', 'S', 'I', 'R', 'U', 'X', 'B', 'L', 'H', 'W', 'T', 'M', 'C', 'Q', 'G', 'Z', 'N', 'P', 'Y', 'F', 'V', 'O', 'E'],
      'notch': 'E'
    },
    'III': {
      'alphabet': ['B', 'D', 'F', 'H', 'J', 'L', 'C', 'P', 'R', 'T', 'X', 'V', 'Z', 'N', 'Y', 'E', 'I', 'W', 'G', 'A', 'K', 'M', 'U', 'S', 'Q', 'O'],
      'notch': 'V'
    },
    'IV': {
      'alphabet': ['E', 'S', 'O', 'V', 'P', 'Z', 'J', 'A', 'Y', 'Q', 'U', 'I', 'R', 'H', 'X', 'L', 'N', 'F', 'T', 'G', 'K', 'D', 'C', 'M', 'W', 'B'],
      'notch': 'J'
    },
    'V': {
      'alphabet': ['V', 'Z', 'B', 'R', 'G', 'I', 'T', 'Y', 'U', 'P', 'S', 'D', 'N', 'H', 'L', 'X', 'A', 'W', 'M', 'J', 'Q', 'O', 'F', 'E', 'C', 'K'],
      'notch': 'Z'
    }
  };
  const ReflectorOption = {
    'A': ['E', 'J', 'M', 'Z', 'A', 'L', 'Y', 'X', 'V', 'B', 'W', 'F', 'C', 'R', 'Q', 'U', 'O', 'N', 'T', 'S', 'P', 'I', 'K', 'H', 'G', 'D'],
    'B': ['Y', 'R', 'U', 'H', 'Q', 'S', 'L', 'D', 'P', 'X', 'N', 'G', 'O', 'K', 'M', 'I', 'E', 'B', 'F', 'Z', 'C', 'W', 'V', 'J', 'A', 'T'],
    'C': ['F', 'V', 'P', 'J', 'I', 'A', 'O', 'Y', 'E', 'D', 'R', 'Z', 'X', 'W', 'G', 'C', 'T', 'K', 'U', 'Q', 'S', 'B', 'N', 'M', 'H', 'L']
  };

  class Rotors {
    constructor(classAttribute) {
      this.rotors = Array.from(document.querySelectorAll(classAttribute)).reverse();
      this.valueIndex = [];
    }

    setValue(rotorIndex, value) {
      const rotor = this.rotors[rotorIndex];
      const valueIndex = Alphabet.indexOf(value);
      const mainWindow = rotor.querySelector('.rotors__window--active');
      const firstNextWindow = mainWindow.previousElementSibling;
      const secondNextWindow = firstNextWindow.previousElementSibling;
      const firstPrevWindow = mainWindow.nextElementSibling;
      const secondPrevWindow = firstPrevWindow.nextElementSibling;
      const wheel = rotor.querySelector('.rotors__wheel');
      const firstNextValueIndex = valueIndex + 1 > 25 ? 0 : valueIndex + 1;
      const secondNextValueIndex = valueIndex + 2 > 25 ? valueIndex - 26 + 2 : valueIndex + 2;
      const firstPrevValueIndex = valueIndex - 1 < 0 ? 25 : valueIndex - 1;
      const secondPrevValueIndex = valueIndex - 2 < 0 ? valueIndex + 26 - 2 : valueIndex - 2;
      mainWindow.value = Alphabet[valueIndex];
      firstNextWindow.innerText = Alphabet[firstNextValueIndex];
      secondNextWindow.innerText = Alphabet[secondNextValueIndex];
      firstPrevWindow.innerText = Alphabet[firstPrevValueIndex];
      secondPrevWindow.innerText = Alphabet[secondPrevValueIndex];
      wheel.style.backgroundPositionY = valueIndex * 100 / 26 * 7 + '%';
      this.valueIndex[rotorIndex] = valueIndex;
    }

    stepRotor(rotorIndex) {
      const newValueIndex = this.valueIndex[rotorIndex] + 1 > 25 ? 0 : this.valueIndex[rotorIndex] + 1;
      const newValue = Alphabet[newValueIndex];
      this.setValue(rotorIndex, newValue);
    }

    getCurrentState() {
      return this.valueIndex;
    }

    bind() {
      for (let [index, rotor] of this.rotors.entries()) {
        const btnNext = rotor.querySelector('.rotors__btn--next');
        const btnPrev = rotor.querySelector('.rotors__btn--prev');
        const input = rotor.querySelector('input');

        btnNext.onclick = () => {
          const currentValueIndex = this.valueIndex[index];
          const newValueIndex = currentValueIndex + 1 > 25 ? 0 : currentValueIndex + 1;
          this.setValue(index, Alphabet[newValueIndex]);
        };

        btnPrev.onclick = () => {
          const currentValueIndex = this.valueIndex[index];
          const newValueIndex = currentValueIndex - 1 < 0 ? 25 : currentValueIndex - 1;
          this.setValue(index, Alphabet[newValueIndex]);
        };

        input.onkeypress = e => {
          e.stopPropagation();
        };

        input.onchange = () => {
          if (input.validity.valid && input.value.length > 0) {
            input.value = input.value.toUpperCase();
            this.setValue(index, input.value);
          } else {
            this.setValue(index, Alphabet[this.valueIndex[index]]);
          }
        };
      }
    }

    reset() {
      for (let i = 0; i < this.rotors.length; i++) {
        this.setValue(i, 'A');
      }
    }

    init() {
      this.reset();
      this.bind();
    }

  }

  const rotors = new Rotors('.rotors__item');

  class Lampboard {
    constructor(classAttribute) {
      this.lamps = document.querySelectorAll(classAttribute);
      this.lastIndex = null;
    }

    newOutput(letter) {
      const newIndex = Layout.indexOf(letter);
      this.reset();
      this.lamps[newIndex].classList.add('lampboard__lamp--active');
      this.lastIndex = newIndex;
    }

    reset() {
      const currentIndex = this.lastIndex || 0;
      this.lamps[currentIndex].classList.remove('lampboard__lamp--active');
      this.lastIndex = null;
    }

  }

  const lampboard = new Lampboard('.lampboard__lamp');

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

  class Plugboard {
    constructor(classAttribute) {
      this.sockets = document.querySelectorAll(classAttribute);
      this.connections = {};
      this.prevSocket = null;
    }

    createPlug(pairLetter) {
      const plug = document.createElement('div');
      plug.classList.add('plugboard__plug');
      plug.tabIndex = 0;
      plug.setAttribute('role', 'button');
      plug.innerText = pairLetter.toUpperCase();
      return plug;
    }

    disconnectSockets(plug1, plug2, letter1, letter2) {
      plug1.remove();
      plug2.remove();
      delete this.connections[letter1];
      delete this.connections[letter2];
    }

    connectSockets(socket1, socket2) {
      const letter1 = socket2.querySelector('span').innerText;
      const letter2 = socket1.querySelector('span').innerText;
      const plug1 = this.createPlug(letter1);
      const plug2 = this.createPlug(letter2);

      plug1.onclick = evt => {
        evt.stopPropagation();
        this.disconnectSockets(plug1, plug2, letter1, letter2);
      };

      plug2.onclick = evt => {
        evt.stopPropagation();
        this.disconnectSockets(plug1, plug2, letter1, letter2);
      };

      socket1.appendChild(plug1);
      socket2.appendChild(plug2);
      this.connections[letter1] = letter2;
      this.connections[letter2] = letter1;
    }

    reset() {
      for (let socket of this.sockets) {
        const plug = socket.querySelector('.plugboard__plug');

        if (!plug) {
          continue;
        }

        plug.remove();
      }

      this.connections = {};
    }

    bind() {
      for (let socket of this.sockets) {
        socket.onclick = () => {
          if (this.prevSocket && this.prevSocket !== socket) {
            this.connectSockets(socket, this.prevSocket);
            socket.blur();
            this.prevSocket = null;
          } else {
            this.prevSocket = socket;
          }
        };
      }
    }

    init() {
      this.bind();
    }

  }

  const plugboard = new Plugboard('.plugboard__socket');

  class Settings {
    constructor(classDialogue, classToggle, classSelect) {
      this.dialogueClass = classDialogue;
      this.toggleClass = classToggle;
      this.selectClass = classSelect;
    }

    changeRotor(rotor, value) {
      return [rotor, value];
    }

    changeReflector(value) {
      return value;
    }

    createOption(value) {
      const option = document.createElement('option');
      option.value = value;
      option.innerText = value;
      return option;
    }

    bind() {
      const dialogue = document.querySelector(`.${this.dialogueClass}`);
      const toggle = document.querySelector(`.${this.toggleClass}`);
      const selects = Array.from(document.querySelectorAll(`.${this.selectClass}`));
      const reflectors = Object.keys(ReflectorOption);
      const rotors = Object.keys(RotorOption);

      toggle.onclick = () => {
        toggle.classList.toggle(`${this.toggleClass}--active`);
        dialogue.classList.toggle(`${this.dialogueClass}--active`);
      };

      reflectors.forEach(item => {
        selects[0].appendChild(this.createOption(item));
      });

      selects[0].onchange = () => {
        this.changeReflector(selects[0].value);
        selects[0].blur();
      };

      for (let i = 1; i < selects.length; i++) {
        rotors.forEach(item => {
          selects[i].appendChild(this.createOption(item));
        });

        selects[i].onchange = () => {
          this.changeRotor(3 - i, selects[i].value);
          selects[i].blur();
        };
      }
    }

    init() {
      this.bind();
      this.reset();
    }

    reset() {
      const selects = Array.from(document.querySelectorAll(`.${this.selectClass}`));
      selects[0].value = 'B';
      selects[1].value = 'I';
      selects[2].value = 'II';
      selects[3].value = 'III';
    }

  }

  const settings = new Settings('settings__dialogue', 'settings__toggle', 'settings__select');

  class Message {
    constructor(classModal, classToggle, idDate, idTime, classInput, idCheckbox, classSubmit, classOutput) {
      this.modalClass = classModal;
      this.toggleClass = classToggle;
      this.dateID = idDate;
      this.timeID = idTime;
      this.inputClass = classInput;
      this.checkboxID = idCheckbox;
      this.submitClass = classSubmit;
      this.outputClass = classOutput;
      this.month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    }

    setTime() {
      const dateArea = document.getElementById(this.dateID);
      const timeArea = document.getElementById(this.timeID);
      let today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth();
      let yyyy = today.getFullYear();
      let hours = today.getHours();
      let minutes = today.getMinutes();
      dateArea.innerText = `${dd} ${this.month[mm]} ${yyyy}`;

      if (dd < 10) {
        dd = '0' + dd;
      }

      mm += 1;

      if (mm < 10) {
        mm = '0' + mm;
      }

      dateArea.dateTime = `${yyyy}-${mm}-${dd}`;
      timeArea.innerText = `${hours}:${minutes}`;
      timeArea.dateTime = `${hours}:${minutes}`;
    }

    encryptText(text) {
      return text;
    }

    bind() {
      const modal = document.querySelector(`.${this.modalClass}`);
      const toggle = document.querySelector(`.${this.toggleClass}`);
      const content = modal.querySelector(`.${this.modalClass}__content`);
      const input = document.querySelector(`.${this.inputClass}`);
      const checkbox = document.getElementById(this.checkboxID);
      const submit = document.querySelector(`.${this.submitClass}`);
      const output = document.querySelector(`.${this.outputClass}`);

      toggle.onclick = () => {
        modal.classList.add(`${this.modalClass}--active`);
        this.setTime();
      };

      modal.onclick = () => {
        modal.classList.remove(`${this.modalClass}--active`);
      };

      content.onclick = evt => {
        evt.stopPropagation();
      };

      input.onkeyup = evt => {
        evt.stopPropagation();
        const re = /[^A-Za-z\s]/g;
        input.value = input.value.replace(re, '');
        input.value = input.value.toUpperCase();
      };

      submit.onclick = () => {
        let text = input.value;

        if (!checkbox.checked) {
          text = text.replace(/ /g, '').match(/.{1,5}/g).join(' ');
        }

        output.innerText = this.encryptText(text);
      };
    }

    init() {
      this.bind();
    }

  }

  const message = new Message('modal', 'modal__toggle', 'date', 'time', 'message__input', 'keep-formatting', 'message__btn', 'message__output');

  class Enigma {
    constructor() {}

    sumValues(a, b) {
      return a + b > 25 ? a - 26 + b : a + b;
    }

    subValues(a, b) {
      return a - b < 0 ? a + 26 - b : a - b;
    }

    encrypt(letter, rotors, rotorPositions, reflector) {
      let result;
      const letterIndex = Alphabet.indexOf(letter);
      const numberOfRotors = rotorPositions.length;

      for (let i = 0; i < numberOfRotors; i++) {
        if (i == 0) {
          result = Alphabet.indexOf(rotors[i][this.sumValues(rotorPositions[i], letterIndex)]);
        } else {
          result = Alphabet.indexOf(rotors[i][this.sumValues(result, this.subValues(rotorPositions[i], rotorPositions[i - 1]))]);
        }
      }

      result = rotors[numberOfRotors - 1].indexOf(Alphabet[this.sumValues(Alphabet.indexOf(reflector[this.subValues(result, rotorPositions[numberOfRotors - 1])]), rotorPositions[numberOfRotors - 1])]);

      for (let i = numberOfRotors - 1; i >= 0; i--) {
        if (i == 0) {
          result = this.subValues(result, rotorPositions[0]);
        } else {
          result = rotors[i - 1].indexOf(Alphabet[this.subValues(result, this.subValues(rotorPositions[i], rotorPositions[i - 1]))]);
        }
      }

      result = Alphabet[result];
      return result;
    }

  }

  const enigma = new Enigma();

  class App {
    constructor(rotorSet, rotorSetNotch, reflector) {
      this.rotorSet = rotorSet;
      this.rotorSetNotch = rotorSetNotch;
      this.reflector = reflector;
    }

    init() {
      keyboard.init();
      plugboard.init();
      rotors.init();
      settings.init();
      message.init();
      const resetButton = document.querySelector('.reset');

      resetButton.onclick = () => {
        resetButton.disabled = true;
        resetButton.style.transitionDuration = '0.5s';
        resetButton.style.transform = 'rotate(360deg)';
        this.reset();
        setTimeout(() => {
          resetButton.disabled = false;
          resetButton.style.transitionDuration = '0s';
          resetButton.style.transform = '';
        }, 500);
      };
    }

    reset() {
      rotors.reset();
      lampboard.reset();
      plugboard.reset();
    }

    changeRotor(rotor, notch, rotorIndex) {
      this.rotorSet[rotorIndex] = rotor;
      this.rotorSetNotch[rotorIndex] = notch;
    }

    changeReflector(reflector) {
      this.reflector = reflector;
    }

    inputAction(letter) {
      if (letter in plugboard.connections) {
        letter = plugboard.connections[letter];
      }

      const rotorsToStep = [0];

      for (let i = 0; i < this.rotorSet.length - 1; i++) {
        const currentValue = Alphabet[rotors.valueIndex[i]];

        if (currentValue == this.rotorSetNotch[i]) {
          rotorsToStep.push(i + 1);
        } else {
          break;
        }
      }

      rotorsToStep.forEach(item => {
        rotors.stepRotor(item);
      });
      let result = enigma.encrypt(letter, this.rotorSet, rotors.valueIndex, this.reflector);

      if (result in plugboard.connections) {
        result = plugboard.connections[result];
      }

      lampboard.newOutput(result);
      return result;
    }

  }

  const app = new App([RotorOption.III.alphabet, RotorOption.II.alphabet, RotorOption.I.alphabet], [RotorOption.III.notch, RotorOption.II.notch, RotorOption.I.notch], ReflectorOption.B);
  app.init();

  keyboard.inputAction = letter => {
    app.inputAction(letter);
  };

  settings.changeReflector = value => {
    app.reflector = ReflectorOption[value];
    app.reset();
  };

  settings.changeRotor = (rotor, value) => {
    app.rotorSet[rotor] = RotorOption[value]['alphabet'];
    app.rotorSetNotch[rotor] = RotorOption[value]['notch'];
    app.reset();
  };

  message.encryptText = text => {
    let output = '';

    for (let i = 0; i < text.length; i++) {
      if (text[i] == ' ') {
        output += text[i];
      } else {
        output += app.inputAction(text[i]);
      }
    }

    return output;
  };

}());

//# sourceMappingURL=main.js.map
