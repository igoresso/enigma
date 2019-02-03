import {Alphabet} from './data';

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
export default rotors;
