(function () {
  'use strict';

  const Alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

  const Layout = ['Q','W','E','R','T','Z','U','I','O','A','S','D','F','G','H','J','K','P','Y','X','C','V','B','N','M','L'];

  const RotorOption = {
    'i': {
      'letter': ['E','K','M','F','L','G','D','Q','V','Z','N','T','O','W','Y','H','X','U','S','P','A','I','B','R','C','J'],
      'notch': 'Q'
    },
    'ii': {
      'letter': ['A','J','D','K','S','I','R','U','X','B','L','H','W','T','M','C','Q','G','Z','N','P','Y','F','V','O','E'],
      'notch': 'E'
    },
    'iii': {
      'letter': ['B','D','F','H','J','L','C','P','R','T','X','V','Z','N','Y','E','I','W','G','A','K','M','U','S','Q','O'],
      'notch': 'V'
    }
  };

  const ReflectorOption = {
    'B': ['Y','R','U','H','Q','S','L','D','P','X','N','G','O','K','M','I','E','B','F','Z','C','W','V','J','A','T']
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

      const firstNextValueIndex = (valueIndex + 1 > 25) ? 0 : valueIndex + 1;
      const secondNextValueIndex = (valueIndex + 2 > 25) ? valueIndex - 26 + 2 : valueIndex + 2;
      const firstPrevValueIndex = (valueIndex - 1 < 0) ? 25 : valueIndex - 1;
      const secondPrevValueIndex = (valueIndex - 2 < 0) ? valueIndex + 26 - 2 : valueIndex - 2;

      mainWindow.value = Alphabet[valueIndex];
      firstNextWindow.innerText = Alphabet[firstNextValueIndex];
      secondNextWindow.innerText = Alphabet[secondNextValueIndex];
      firstPrevWindow.innerText = Alphabet[firstPrevValueIndex];
      secondPrevWindow.innerText = Alphabet[secondPrevValueIndex];

      wheel.style.backgroundPositionY = (valueIndex * 100 / 26) * 7 + '%';
      this.valueIndex[rotorIndex] = valueIndex;
    }

    stepRotor(rotorIndex) {
      const newValueIndex = (this.valueIndex[rotorIndex] + 1 > 25) ? 0 : (this.valueIndex[rotorIndex] + 1);
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
          const newValueIndex = (currentValueIndex + 1 > 25) ? 0 : currentValueIndex + 1;
          this.setValue(index, Alphabet[newValueIndex]);
        };

        btnPrev.onclick = () => {
          const currentValueIndex = this.valueIndex[index];
          const newValueIndex = (currentValueIndex - 1 < 0) ? 25 : currentValueIndex - 1;
          this.setValue(index, Alphabet[newValueIndex]);
        };

        input.onchange = () => {
          if (input.validity.valid) {
            input.value = input.value.toUpperCase();
            this.setValue(index, input.value);
          } else {
            input.value = '';
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

  class Plugboard {
    constructor(classAttribute) {
      this.sockets = document.querySelectorAll(classAttribute);
      this.connections = {};
      this.prevSocket = null;
    }

    createPlug(pairLetter) {
      const plug = document.createElement('div');
      plug.classList.add('plugboard__plug');
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
      const letter1 = socket2.getAttribute('letter');
      const letter2 = socket1.getAttribute('letter');
      const plug1 = this.createPlug(letter1);
      const plug2 = this.createPlug(letter2);

      plug1.onclick = (evt) => {
        evt.stopPropagation();
        this.disconnectSockets(plug1, plug2, letter1, letter2);
      };

      plug2.onclick = (evt) => {
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
        const plug = socket.querySelector('.plugboard__socket');
        plug.remove;
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

  class Enigma {
    constructor() {

    }

    sumValues(a, b) {
      return (a + b > 25) ? (a - 26 + b) : (a + b);
    }

    subValues(a, b) {
      return (a - b < 0) ? (a + 26 - b) : (a - b);
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

      rotorsToStep.forEach((item) => {
        rotors.stepRotor(item);
      });

      let result = enigma.encrypt(letter, this.rotorSet, rotors.valueIndex, this.reflector);

      if (result in plugboard.connections) {
        result = plugboard.connections[result];
      }

      lampboard.newOutput(result);
    }
  }

  const app = new App([RotorOption.iii.letter, RotorOption.ii.letter, RotorOption.i.letter], [RotorOption.iii.notch, RotorOption.ii.notch, RotorOption.i.notch], ReflectorOption.B);
  app.init();

  keyboard.inputAction = (letter) => {
    app.inputAction(letter);
  };

}());

//# sourceMappingURL=main.js.map
