import { RotorOption, ReflectorOption } from './data';

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
export default settings;
