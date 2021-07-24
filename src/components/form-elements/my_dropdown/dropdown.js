class Dropdown {
    constructor(selector) {
        this.el = selector;
        this.sum = undefined;

        this.init();
    }
    init() {
        this.el.firstElementChild.addEventListener('click', this.toggleMenuDisplay.bind(this));
        this.addCounters();
        this.updateTitle();
    }
    addCounters() {
        this.sum = 0;

        const dropdownItems = this.el.querySelectorAll('.dropdown__item');

        dropdownItems.forEach((item) => {
            const control = new Controls(item, this.updateSum.bind(this));

            item.append(control.groupControls());
            
            this.sum += +control.value;
        });

        return dropdownItems;
    }
    updateSum(oldVal, newVal) {
        this.sum += parseInt(newVal) - parseInt(oldVal);
        this.updateTitle();
    }
    updateTitle() {
        const title = this.el.firstElementChild;
        const wordForms = title.getAttribute("wordforms").split(' ');

        if (this.sum > 0) {
            title.innerText = this.sum + " " + this.declOfNum(this.sum, wordForms);
            return;
        };

        if (title.hasAttribute("default")) {
            title.innerText = title.getAttribute("default");
        } else {
            title.innerText = this.sum + " " + this.declOfNum(this.sum, wordForms);
        };
    }
    // Choose correct word form
    // @see https://realadmin.ru/coding/sklonenie-na-javascript.html
    declOfNum(n, textForms) {  
        n = Math.abs(n) % 100; 
        const n1 = n % 10;
        if (n > 10 && n < 20) return textForms[2];
        if (n1 > 1 && n1 < 5) return textForms[1];
        if (n1 == 1) return textForms[0];
        return textForms[2];
    }
    toggleClass(elem, className) {
        if (elem.className.indexOf(className) !== -1) elem.classList.remove(className);
        else elem.classList.add(className);
    
        return elem;
    }
    toggleMenuDisplay() {
        const dropdown = this.el;
        const menu = dropdown.querySelector('.dropdown__list');
        //const icon = dropdown.querySelector('.dropdown__arrow');
    
        this.toggleClass(menu, 'close');
        //this.toggleClass(icon,'dropdown__arrow_dark');
    }
}


class Controls {
    constructor(selector, updateCallback) {
        this.value = selector.hasAttribute('default') ? selector.getAttribute('default') : 0,
        this.decrementButton = this.createCountButton('decrement');
        this.incrementButton = this.createCountButton('increment');
        this.counter = this.createCounter();
        this.minValue = 0;
        this.maxValue = 5;

        this.update = updateCallback;
        this.init();
    }
    init() {
        this.decrementButton.addEventListener('click', this.handleDecrementClick.bind(this));
        this.incrementButton.addEventListener('click', this.handleIncrementClick.bind(this));
    }
    groupControls() {
        const controls = document.createElement('div');
        controls.className = 'dropdown__item__controls';
        controls.append(this.decrementButton, this.counter, this.incrementButton);

        return controls;
    }
    createCounter() {
        const counter = document.createElement('div');
        counter.className = 'dropdown__item__counter';
        counter.innerText = this.value;

        return counter;
    }
    createCountButton(type) {
        const button = document.createElement('button');
        button.className = 'dropdown__item__' + type;
        button.innerHTML = `<i class="icon-` + type + `"></i>`;
    
        return button;
    }
    handleDecrementClick(e) {
        e.preventDefault();

        const counter = e.currentTarget.nextSibling;
        const oldValue = this.value;

        if (counter.innerText > this.minValue) {
            this.value = --counter.innerText;
        };

        if (+counter.innerText === this.minValue) {
            e.currentTarget.classList.add('disabled');
        };

        if (+counter.innerText === this.maxValue - 1) {
            const incrementButton = e.currentTarget.nextSibling.nextSibling;
            incrementButton.classList.remove('disabled');
        };

        this.update(oldValue, this.value)
    }
    handleIncrementClick(e) {
        e.preventDefault();

        const counter = e.currentTarget.previousSibling;
        const oldValue = this.value;

        if (counter.innerText < this.maxValue) {
            this.value = ++counter.innerText;
        };

        if (+counter.innerText === this.maxValue) {
            e.currentTarget.classList.add('disabled');
        };

        if (+counter.innerText === this.minValue + 1) {
            const decrementButton = e.currentTarget.previousSibling.previousSibling;
            decrementButton.classList.remove('disabled');
        };

        this.update(oldValue, this.value)
    }
}

const dropdown = document.querySelector('.dropdown');
const tmp = new Dropdown(dropdown);
