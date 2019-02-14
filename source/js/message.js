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

    if(dd < 10) {
      dd = '0' + dd;
    }

    mm += 1;

    if(mm < 10) {
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

    content.onclick = (evt) => {
      evt.stopPropagation();
    };

    input.onkeyup = (evt) => {
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
export default message;
