//Classes
class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
        this.src = src;
        this.alt = alt;
        this.title = title;
        this.descr = descr;
        this.price = price;
        this.classes = classes;
        this.parent = document.querySelector(parentSelector);
        this.transfer = 27;
        this.changeToUAH();
    }
    changeToUAH() {
        this.price = this.price * this.transfer;
    }
    render() {
        const element = document.createElement('div');
        if (this.classes.length === 0) {
            this.classes = "menu__item";
            element.classList.add(this.classes);
        } else {
            this.classes.forEach(className => element.classList.add(className));
        }
        element.innerHTML = `
            <img src=${this.src} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
        `;
        this.parent.append(element);
    }
}
//Variables
const tabs = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent'),
    tabsParent = document.querySelector('.tabheader__items'), 
    modalTrigger = document.querySelectorAll('[data-modal]'),
    modal = document.querySelector('.modal'),
    deadline = '2022-04-13',
    forms = document.querySelectorAll('form'),
    message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };
let modalTimerId = null;
//Fuctions
//Tabs
function hideTabContent() {
    tabsContent.forEach(item => {
        item.classList.add('hide');
        item.classList.remove('show', 'fade');
    });
    tabs.forEach(item => {
        item.classList.remove('tabheader__item_active');
    });
}
function showTabContent(i = 0) {
    tabsContent[i].classList.add('show', 'fade');
    tabsContent[i].classList.remove('hide');
    tabs[i].classList.add('tabheader__item_active');
}
//Timer
function getTimeRemaining() {
    const t = Date.parse(deadline) - Date.parse(new Date()),
        days = Math.floor((t / (1000 * 60 * 60 * 24))),
        seconds = Math.floor((t / 1000) % 60),
        minutes = Math.floor((t / 1000 / 60) % 60),
        hours = Math.floor((t / (1000 * 60 * 60) % 24));
    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}
function getZero(num) {
    if (num >= 0 && num <= 9) {
        return '0' + num;
    } else {
        return num;
    }
}
function setClock() {
    const timer = document.querySelector('.timer'),
        days = timer.querySelector("#days"),
        hours = timer.querySelector('#hours'),
        minutes = timer.querySelector('#minutes'),
        seconds = timer.querySelector('#seconds'),
        timeInterval = setInterval(() => {
            const t = getTimeRemaining();
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);
            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }, 1000);
}
//Modal
function closeModal() {
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}
function openModal() {
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId);
}
function showModalByScroll() {
    if (window.pageYOffset + document.documentElement.clientHeight >= 
                                    document.documentElement.scrollHeight) {
        openModal();
        window.removeEventListener('scroll', showModalByScroll);
    }
}
function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');
    prevModalDialog.classList.add('hide');
    openModal();
    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>×</div>
            <div class="modal__title">${message}</div>
        </div>
    `;
    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
        thanksModal.remove();
        prevModalDialog.classList.add('show');
        prevModalDialog.classList.remove('hide');
        closeModal();
    }, 4000);
}
//Server
function postData(form) {
    form.addEventListener('submit', (e) => { 
        e.preventDefault();
        let statusMessage = document.createElement('img');
        statusMessage.src = message.loading;
        statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
        `;
        form.insertAdjacentElement('afterend', statusMessage);
        const object = {};
        new FormData(form).forEach(function (value, key) {
            object[key] = value;
        });
        fetch('server.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
        }).then(data => {
            console.log(data);
            showThanksModal(message.success);
            statusMessage.remove();
        }).catch(() => {
            showThanksModal(message.failure);
        }).finally(() => {
            form.reset();
        });
    });
}
//EventListners
tabsParent.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('tabheader__item')) {
        tabs.forEach((item, i) => {
            if (event.target == item) {
                hideTabContent();
                showTabContent(i);
            }
        });
    }
});
modalTrigger.forEach(btn => {
    btn.addEventListener('click', openModal);
});
modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') == "") {
        closeModal();
    }
});
document.addEventListener('keydown', (e) => {
    if (e.code === "Escape" && modal.classList.contains('show')) {
        closeModal();
    }
});
//Main flow
hideTabContent();
showTabContent();
setClock('.timer', deadline);
modalTimerId = setTimeout(openModal, 5000);
window.addEventListener('scroll', showModalByScroll);
new MenuCard(
    "img/tabs/vegy.jpg",
    "vegy",
    'Меню "Фитнес"',
    'Меню "Фитнес" - это новый подход к приготовлению блюд: ',
    //больше свежих овощей и фруктов. Продукт активных и здоровых людей.
    //Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    9,
    ".menu .container"
).render();
new MenuCard(
    "img/tabs/post.jpg",
    "post",
    'Меню "Постное"',
    'Меню “Постное” - это тщательный подбор ингредиентов: ',
    //полное отсутствие продуктов животного происхождения, молоко из миндаля,
    // овса, кокоса или гречки, правильное количество белков за счет тофу и 
    //импортных вегетарианских стейков.',
    14,
    ".menu .container"
).render();
new MenuCard(
    "img/tabs/elite.jpg",
    "elite",
    'Меню “Премиум”',
    'В меню “Премиум” мы используем не только красивый дизайн',
    // упаковки, но и качественное исполнение блюд. Красная рыба, 
    //морепродукты, фрукты - ресторанное меню без похода в ресторан!',
    21,
    ".menu .container"
).render();
forms.forEach(item => {
    postData(item);
});