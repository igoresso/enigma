import {RotorOption, ReflectorOption, Alphabet} from './data';
import Rotors from './rotors';
import Lampboard from './lampboard';
import Keyboard from './keyboard';
import Plugboard from './plugboard';
import Settings from './settings';
import Message from './message';
import Enigma from './enigma';

class App {
  constructor(rotorSet, rotorSetNotch, reflector) {
    this.rotorSet = rotorSet;
    this.rotorSetNotch = rotorSetNotch;
    this.reflector = reflector;
  }

  init() {
    Keyboard.init();
    Plugboard.init();
    Rotors.init();
    Settings.init();
    Message.init();

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
    Rotors.reset();
    Lampboard.reset();
    Plugboard.reset();
  }

  changeRotor(rotor, notch, rotorIndex) {
    this.rotorSet[rotorIndex] = rotor;
    this.rotorSetNotch[rotorIndex] = notch;
  }

  changeReflector(reflector) {
    this.reflector = reflector;
  }

  inputAction(letter) {
    if (letter in Plugboard.connections) {
      letter = Plugboard.connections[letter];
    }

    const rotorsToStep = [0];

    for (let i = 0; i < this.rotorSet.length - 1; i++) {
      const currentValue = Alphabet[Rotors.valueIndex[i]];
      if (currentValue == this.rotorSetNotch[i]) {
        rotorsToStep.push(i + 1);
      } else {
        break;
      }
    }

    rotorsToStep.forEach((item) => {
      Rotors.stepRotor(item);
    });

    let result = Enigma.encrypt(letter, this.rotorSet, Rotors.valueIndex, this.reflector);

    if (result in Plugboard.connections) {
      result = Plugboard.connections[result];
    }

    Lampboard.newOutput(result);

    return result;
  }
}

const app = new App([RotorOption.III.alphabet, RotorOption.II.alphabet, RotorOption.I.alphabet], [RotorOption.III.notch, RotorOption.II.notch, RotorOption.I.notch], ReflectorOption.B);
app.init();

Keyboard.inputAction = (letter) => {
  app.inputAction(letter);
};

Settings.changeReflector = (value) => {
  app.reflector = ReflectorOption[value];
  app.reset();
};

Settings.changeRotor = (rotor, value) => {
  app.rotorSet[rotor] = RotorOption[value]['alphabet'];
  app.rotorSetNotch[rotor] = RotorOption[value]['notch'];
  app.reset();
};

Message.encryptText = (text) => {
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
