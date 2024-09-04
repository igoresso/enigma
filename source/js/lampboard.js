import { Layout } from './data';

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
export default lampboard;
