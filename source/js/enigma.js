import { Alphabet } from './data';

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
        result = Alphabet.indexOf(
          rotors[i][this.sumValues(result, this.subValues(rotorPositions[i], rotorPositions[i - 1]))],
        );
      }
    }

    result = rotors[numberOfRotors - 1].indexOf(
      Alphabet[
        this.sumValues(
          Alphabet.indexOf(reflector[this.subValues(result, rotorPositions[numberOfRotors - 1])]),
          rotorPositions[numberOfRotors - 1],
        )
      ],
    );

    for (let i = numberOfRotors - 1; i >= 0; i--) {
      if (i == 0) {
        result = this.subValues(result, rotorPositions[0]);
      } else {
        result = rotors[i - 1].indexOf(
          Alphabet[this.subValues(result, this.subValues(rotorPositions[i], rotorPositions[i - 1]))],
        );
      }
    }

    result = Alphabet[result];

    return result;
  }
}

const enigma = new Enigma();
export default enigma;
