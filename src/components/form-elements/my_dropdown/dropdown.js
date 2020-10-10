function toggleClass(elem, className) {
    if (elem.className.indexOf(className) !== -1) elem.classList.remove(className);
    else elem.classList.add(className);

    return elem;
}

function toggleMenuDisplay(e) {
    const dropdown = e.currentTarget.parentNode;
    const menu = dropdown.querySelector('.dropdown__menu');
    const icon = dropdown.querySelector('.dropdown__arrow');

    toggleClass(menu,'dropdown__menu_hide');
    toggleClass(icon,'dropdown__arrow_dark');
}

function createCountButton(type) {
    const button = document.createElement('button');
    button.className = 'dropdown__option__controls__' + type;
    button.innerHTML = `<i class="icon-` + type + `"></i>`;

    return button;
}

function addControls(defaultValue) {
    const controls = document.createElement('div');
    controls.className = 'dropdown__option__controls';

    const counter = document.createElement('div');
    counter.className = 'dropdown__option__counter';
    counter.innerText = defaultValue;
    updateTitleByCounters();

    const decrementButton = createCountButton('decrement');
    defaultValue < 1 ? decrementButton.classList.add('dropdown__option_disabled') : null;

    const incrementButton = createCountButton('increment');

    controls.append(decrementButton, counter, incrementButton);
    return(controls);
}

function handleDecremenClick(e) {
    const counter = e.currentTarget.nextSibling;
    if(counter.innerText > 0){
        counter.innerText--;
    };

    if(Number.parseInt(counter.innerText) === 0) {
        e.currentTarget.classList.add('dropdown__option_disabled');
    };

    updateTitleByCounters();
}

function handleIncremenClick(e) {
    const counter = e.currentTarget.previousSibling;
    counter.innerText++;

    const decrementButton = e.currentTarget.previousSibling.previousSibling;
    if (Number.parseInt(counter.innerText) === 1){
        decrementButton.classList.remove('dropdown__option_disabled');
    };
    
    updateTitleByCounters();
}

function updateTitleByCounters() {
    const dropdownTitle = document.querySelector('.dropdown__title');
    const counters = document.querySelectorAll('.dropdown__option__counter');
    let sum = 0;
    counters.forEach(counter => {
        sum += (Number.parseInt(counter.innerText));
    });

    if (sum != 0) {
        dropdownTitle.innerText = sum;
        return;
    };

    if (dropdownTitle.hasAttribute("default")) {
        dropdownTitle.innerText = dropdownTitle.getAttribute("default");
    } else {
        dropdownTitle.innerText = sum;
    };

}

const dropdownTitle = document.querySelector('.dropdown__title');
const dropdownOptions = document.querySelectorAll('.dropdown__option');

dropdownTitle.addEventListener('click', toggleMenuDisplay);
dropdownOptions.forEach(option => option.append(
    addControls(option.hasAttribute('default') ? option.getAttribute('default') : 0)));

const decrementButton = document.querySelectorAll('.dropdown__option__controls__decrement');
const incrementButton = document.querySelectorAll('.dropdown__option__controls__increment');

decrementButton.forEach(decrement => decrement.addEventListener('click', handleDecremenClick));
incrementButton.forEach(increment => increment.addEventListener('click', handleIncremenClick));

