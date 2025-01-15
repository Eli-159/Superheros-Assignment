class PopupMsg {
    constructor() {
        this.overlay = document.createElement('div');
        this.overlay.classList.add('overlay');
        this.popup = document.createElement('div');
        this.popup.classList.add('popup');
        this.overlay.appendChild(this.popup);
        document.getElementsByTagName('body')[0].appendChild(this.overlay);
    }

    insertContents = (content) => {
        this.popup.textContent = '';
        if (content.heading) {
            const newH2 = document.createElement('p');
            newH2.textContent = content.heading;
            this.popup.appendChild(newH2);
        }
        if (content.msg) {
            const newP = document.createElement('p');
            newP.textContent = content.msg;
            this.popup.appendChild(newP);
        }
        if (content.btns) {
            for (let i = 0; i < content.btns.length; i++) {
                const newBtn = document.createElement('input');
                newBtn.type = 'button';
                newBtn.classList.add('btn');
                newBtn.value = content.btns[i].value;
                newBtn.addEventListener('click', content.btns[i].action);
                this.popup.appendChild(newBtn);
            }
        }
    }

    show = () => {
        this.overlay.classList.add('active');
    }

    hide = () => {
        this.overlay.classList.remove('active');
    }
}