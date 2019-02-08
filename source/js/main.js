import {RotorOption, ReflectorOption, Alphabet} from './data';
import Rotors from './rotors';
import Lampboard from './lampboard';
import Keyboard from './keyboard';
import Plugboard from './plugboard';
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
  }
}

const app = new App([RotorOption.iii.letter, RotorOption.ii.letter, RotorOption.i.letter], [RotorOption.iii.notch, RotorOption.ii.notch, RotorOption.i.notch], ReflectorOption.B);
app.init();

Keyboard.inputAction = (letter) => {
  app.inputAction(letter);
};
