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

    const decrementButton = createCountButton('decrement');
    defaultValue < 1 ? decrementButton.classList.add('dropdown__option_disabled') : null;

    const counter = document.createElement('div');
    counter.className = 'dropdown__option__counter';
    counter.innerText = defaultValue;

    const incrementButton = createCountButton('increment');

    incrementButton.addEventListener('click', function(){
        if (Number.parseInt(counter.innerText) === 0){
            decrementButton.classList.remove('dropdown__option_disabled');
        }
        counter.innerText = Number.parseInt(counter.innerText) + 1;
        
        handleOptionSelected();
    })

    decrementButton.addEventListener('click', function(){
        if(Number.parseInt(counter.innerText) === 1){
            decrementButton.classList.add('dropdown__option_disabled');
        }
        if(Number.parseInt(counter.innerText) > 0){
            counter.innerText= Number.parseInt(counter.innerText) - 1;
        }

        handleOptionSelected();
    })

    controls.append(decrementButton, counter, incrementButton);
    return(controls);
}

function handleOptionSelected() {	

	const id = e.target.id;
    const newValue = e.target.textContent + ' ';
    

	const titleElem = document.querySelector('.dropdown__title');
	const icon = document.querySelector('.dropdown__arrow');


	titleElem.textContent = newValue;
	titleElem.appendChild(icon);
	

	setTimeout(() => toggleClass(icon,'dark',0));
}

//get elements
const dropdownTitle = document.querySelector('.dropdown__title');
const dropdownOptions = document.querySelectorAll('.dropdown__option');

//bind listeners to these elements
dropdownTitle.addEventListener('click', toggleMenuDisplay);
dropdownOptions.forEach(option => option.append(
    addControls(option.hasAttribute('default') ? option.getAttribute('default') : 0)));

