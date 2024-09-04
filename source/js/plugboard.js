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

    plug1.onclick = e => {
      e.stopPropagation();
      this.disconnectSockets(plug1, plug2, letter1, letter2);
    };

    plug2.onclick = e => {
      e.stopPropagation();
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
export default plugboard;
