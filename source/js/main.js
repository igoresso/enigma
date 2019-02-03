import Rotors from './rotors';
import Lampboard from './lampboard';
import Keyboard from './keyboard';
import Plugboard from './plugboard';

Keyboard.init();
Plugboard.init();
Rotors.init();

Keyboard.inputAction = (letter) => {
  Lampboard.newOutput(letter);
};
