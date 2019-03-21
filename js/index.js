'use strict'

// ***********************

		// all scripts created by rkfr 
		 						// 21.03.2019
		 	// contacts
		// https://github.com/rkfr
		// xvid2y@gmail.com

// ***********************


// ***practical dom lib

class ElementsConstructor {
	constructor(){}

	create(tag, classList, ...attributes) {
		const element = document.createElement(tag);

		(classList && 
			(element.className = classList)
		);

		(arguments.length > 2 && (
			attributes.forEach(obj => {
				for(let attr in obj) {
					element.setAttribute(attr, obj[attr])
				}
			})
		));
		
		return element;
	}

	get(selector) {
		const element = document.querySelector(selector);
		return element;
	}

	getAll(selector) {
		const elements = document.querySelectorAll(selector);
		return elements;
	}

	setStyle(element, ...style) {
		if (arguments.length < 2)
			element.style = '';

		style.forEach(obj => {
			for(let spec in obj) {
				element.style[spec] = obj[spec];
			}
		});
	}
}


// gallery start

const photoGalleryData = [
	{
		id: 0,
		alt: `street`,
		src: `img/galery-1.jpg`
	},
	{
		id: 1,
		alt: `street2`,
		src: `img/galery-2.jpg`
	}, 
	{
		id: 2,
		alt: `none`,
		src: `img/galery-3.jpg`
	},
	{
		id: 3,
		alt: 'zhk-4',
		src: `img/galery-4.jpg`
	},
	{
		id: 4,
		alt: 'zhk-5',
		src: `img/galery-5.jpg`
	}
];

class PhotoGallery {
	constructor(container, data) {
		this.props = {
			data: [...data],
			container: container,
			currentPhoto: 0
		}

		this.renderGallery();
		this.buttonsHandler();
		this.imageClickHandler();
		this.selectImageHandler();
	}
	//create all the gallery
	renderGallery() {
		const {data, container, currentPhoto} = this.props,
			imageWrapper = this.createElement('div', 'gallery__general-image'),
			image = this.createElement('img', 'gallery__photo');
		container.innerText = '';

		imageWrapper.append(image);
		container.append(imageWrapper, this.renderPhotoList());
		this.changeGeneralPhoto(currentPhoto);
	}
	// create mini-photo-list
	renderPhotoList() {
		const {data} = this.props,
			container = this.createElement('div', 'gallery__photo-list d-flex');
		data.forEach(image => {
			container.append(this.renderPhoto(image));
		});

		return container;
	}
	// create one photo in list
	renderPhoto(data) {
		const image = this.createElement('img', 'gallery__photo-item');
		image.setAttribute('alt', data.alt);
		image.setAttribute('src', data.src);
		image.setAttribute('data-image-min-id', data.id);
		return image;
	}
	// set attribute to image
	changeGeneralPhoto(id) {
		const {data} = this.props,
			image = document.querySelector('.gallery__photo');

		image.style.animation = 'fading-in .6s ease';
		setTimeout(() => {
			this.clickGandler(false);
			image.setAttribute('alt', data[id].alt);
			image.setAttribute('data-image-min-id', data[id].id);
			image.setAttribute('src', data[id].src);
			image.style.animation = 'fading-out .6s ease';
			setTimeout(()=> {
				image.style.animation = '';
				this.clickGandler(true);
			}, 600);
		}, 500);
	}
	// lock/unlock click
	clickGandler(status) {
		const area = document.querySelector('.gallery__photos');

		if (!status) {
			area.style.pointerEvents = 'none';
		}
		else {
			area.style.pointerEvents = 'auto';
		}
	}
	// change image by click on button
	buttonsHandler() {
		const {data} = this.props,
			leftButton = document.querySelector('.gallery__button_left'),
			rightButton = document.querySelector('.gallery__button_right');

		leftButton.addEventListener('click', () => {
			this.props.currentPhoto -= 1;
			if (this.props.currentPhoto < 0) {
				this.props.currentPhoto = data.length - 1;
			}
			this.changeGeneralPhoto(this.props.currentPhoto);
			this.selectImageHandler();
		});

		rightButton.addEventListener('click', () => {
			this.props.currentPhoto += 1;
			if (this.props.currentPhoto > data.length - 1) {
				this.props.currentPhoto = 0;
			}
			this.changeGeneralPhoto(this.props.currentPhoto);
			this.selectImageHandler();
		});
	}
	// change image by click on image
	imageClickHandler() {
		const {data} = this.props,
			listOfPhotos = document.querySelector('.gallery__photo-list');

		listOfPhotos.addEventListener('click', e => {
			const {target} = e,
				{imageMinId: id} = target.dataset;

			if (target.tagName !== 'IMG') return;
			this.props.currentPhoto = +id;
			this.changeGeneralPhoto(+id);
			this.selectImageHandler();
		});
	}
	// put up the selected image
	selectImageHandler() {
		const {data, currentPhoto} = this.props,
			images = document.querySelectorAll('.gallery__photo-item');

		for (let image of images) {
			const id = +image.dataset.imageMinId;

			if (id === currentPhoto) {
				image.style.transform = 'translateY(-10px)';
			}
			else {
				image.style.transform = '';
			}
		}
	}

	createElement(tagName, className) {
		const element = document.createElement(tagName),
			classList = className.split(' ');
		if (classList.length >= 1) {
			classList.forEach(cl => {
				element.classList.add(cl);
			});
		}

		return element;
	}
	
}

const photoGalleryContainer = document.querySelector('.gallery__photos');
const photoGallery = new PhotoGallery(photoGalleryContainer, photoGalleryData);

// gallery end

// timer start

// ############!!! at the line below you can set your destination date
const currentDate = new Date(),
	currentDay = currentDate.getDate(),
	currentMonth = currentDate.getMonth(),
	currentYear = currentDate.getFullYear();

let targetDate = [currentDay, currentMonth + 1, currentYear],
	targetUserDate = [];


if (!localStorage.getItem('userTime')) {
	localStorage.setItem('userTime', JSON.stringify(targetDate));
}


targetUserDate = JSON.parse(localStorage.getItem('userTime'));

const manageTimer = function(destDate){

	const destinationDate = new Date(destDate[2], destDate[1], destDate[0]);

	let today = new Date();
	const seconds = Math.floor((destinationDate - today) / 1000);

	const minutes = Math.floor(seconds / 60),
		hours = Math.floor(minutes / 60),
		days =  Math.floor(hours / 24);
	return {
		secondsToshow: seconds % 60,
		minutesToshow: minutes % 60,
		hoursToshow: hours % 24,
		daysToshow: days
	}
};

function showTime() {
	const date = document.querySelectorAll('.timer__unit'),
		dd = date[0],
		hh = date[1],
		mm = date[2],
		ss = date[3];

	const timer = setInterval(() => {
		const {
				secondsToshow: sec,
				minutesToshow: min,
				hoursToshow: hour,
				daysToshow: day
			} = manageTimer(targetUserDate);
		
		if (day < 0) {
			clearInterval(timer);
			return;
		}

		dd.innerText = (day < 10) ? `0${day}` : day;
		hh.innerText = (hour < 10) ? `0${hour}` : hour;
		mm.innerText = (min < 10) ? `0${min}` : min;
		ss.innerText = (sec < 10) ? `0${sec}` : sec;
	}, 1000);
}
showTime();

// timer end

// start options script

const flatsData = [

	{
		flatId: 0,
		flatData: [
			{
				image: {
					alt: 'Однокомнатная квартира',
					src: 'img/one-room.png'
				},
				title: 'Однокомнатная квартира',
				subtitle: '48.22 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'Однокомнатная квартира',
					src: 'img/one-room-1.png'
				},
				title: 'Однокомнатная квартира',
				subtitle: '41.81 м<sup>2</sup>'
			}
		]
	},
	{
		flatId: 1,
		flatData: [
			{
				image: {
					alt: 'Двухкомнатная квартира',
					src: 'img/two-rooms-1.png'
				},
				title: 'Двухкомнатная квартира',
				subtitle: '61.36 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'Двухкомнатная квартира',
					src: 'img/two-rooms.png'
				},
				title: 'Двухкомнатная квартира',
				subtitle: '76.46 м<sup>2</sup>'
			}
		]
	},
	{
		flatId: 2,
		flatData: [
			{
				image: {
					alt: 'студия',
					src: 'img/studio.png'
				},
				title: 'студия',
				subtitle: '28.31 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'студия',
					src: 'img/studio-1.png'
				},
				title: 'студия',
				subtitle: '35.26 м<sup>2</sup>'
			}
		]
	}
];

const dom = new ElementsConstructor();

class RoomOptions {
	constructor(container, data) {
		this.props = {
			data: [...data],
			container: container,
			checkedFlatId: 2,
			currentCard: 0,
			screenWidth: ''
		}

		this.firstScreenHandler();
		this.renderCards();
		this.changeCardsHandler();
	}

	renderCards() {
		const {container, data, checkedFlatId} = this.props,
			currentCardsList = data[checkedFlatId].flatData,
			media = window.matchMedia('screen and (max-width: 1200px');

		// container.innerText = '';

		media.addListener(() => {
			if (!media.matches) {
				container.innerText = '';
				currentCardsList.forEach(cardData => {
					container.append(this.renderCard(cardData));
				});
			}
			else {
				container.innerText = '';
				this.renderSlider();
			}
		});

		if (this.props.screenWidth > 1200) {
			container.innerText = '';
			currentCardsList.forEach(cardData => {
					container.append(this.renderCard(cardData));
				});
		}
		else {
			container.innerText = '';
			this.renderSlider();
		}

		this.showLagePhoto();
	}

	firstScreenHandler() {
		let width = document.body.clientWidth;

		this.props.screenWidth = document.body.clientWidth;;
		setTimeout(()=> {
			width = document.body.clientWidth;
		}, 500);
	}

	renderSlider() {
		const {container, data, checkedFlatId, currentCard: cardId} = this.props,
			currentCardsList = data[checkedFlatId].flatData,
			currentCard = currentCardsList[cardId];

		const cardContainer = dom.create('div', 'flat-cards__card-wrapper'), 
			leftButton = dom.create('button', 'options__arr options__arr_left'),
			rightButton = dom.create('button', 'options__arr options__arr_right');
	
		cardContainer.append(this.renderCard(currentCard));
		container.append(leftButton, cardContainer, rightButton);
		this.cardChangehandler(currentCardsList);
	}

	cardChangehandler(data) {
		const container = dom.get('.flat-cards__card').parentNode,
			left = dom.get('.options__arr_left'),
			right = dom.get('.options__arr_right');
		
		left.addEventListener('click', () => {
			container.innerText = '';
			this.props.currentCard -= 1;
			if (this.props.currentCard < 0)
				this.props.currentCard = data.length - 1;
			container.append(this.renderCard(data[this.props.currentCard]));
		});

		right.addEventListener('click', () => {
			container.innerText = '';
			this.props.currentCard += 1;
			if (this.props.currentCard > data.length - 1)
				this.props.currentCard = 0;
			container.append(this.renderCard(data[this.props.currentCard]));
		});
	}

	renderCard(data) {
		const card = dom.create('div', 'flat-cards__card'),
			cardImage = dom.create('img', 'flat-cards__image', data.image),
			title = dom.create('h3', 'flat-cards__title'),
			subtitle = dom.create('p', 'flat-cards__info'),
			form = dom.create('form', 'flat-cards__form js-form',
				{
					'data-id': 'popupResult',
					'action': 'success.php'
				}),
			label = dom.create('label'),
			hiddenInput = dom.create('input', '', {
				'type': 'text',
				'name': 'id-form',
				'hidden': true,
				'value': data.title
			}),
			input = dom.create('input', 'flat-cards__get-number', 
				{
					'type': 'text',
					'name': 'tel',
					'placeholder': 'Введите номер',
					'required': true
				}),
			button = dom.create('button', 'flat-cards__button btn', {'data-submit': ''});

		title.innerText = data.title;
		subtitle.innerHTML = data.subtitle;
		button.innerText = 'Узнать подробнее';

		label.append(input);
		form.append(label, button, hiddenInput);
		card.append(cardImage, title, subtitle, form);

		return card;
	}

	changeCardsHandler() {
		const buttons = dom.getAll('.flats-preview__item'),
			buttonsContainer = dom.get('.flats-preview__list');

		buttonsContainer.addEventListener('click', e => {
			const {target} = e,
				{flatId: id} = target.dataset;

			if (target.tagName !== 'LI') return;

			for (let button of buttons) {
				if (button.classList.contains('flats-preview__checked')){
					button.classList.remove('flats-preview__checked');
				}
			}

			target.classList.add('flats-preview__checked');
			this.props.checkedFlatId = +id;
			this.firstScreenHandler();
			this.renderCards();
		});
	}

	showLagePhoto() {
		const photo = dom.get('.flat-cards__image'),
			blockClassName = 'options__large-image-wrapper';


		window.addEventListener('click', (e) => {
			const {target} = e;
			if (target.className !== photo.className) {
				if (dom.get(`.${blockClassName}`))
					dom.get(`.${blockClassName}`).remove();
				return;
			};
			if (dom.get(`.${blockClassName}`))
					dom.get(`.${blockClassName}`).remove();
			const imageData = {
				src: target.src,
				alt: target.alt
			};
			document.body.append(this.renderModalWindowPhoto(imageData, blockClassName));
		});
	}

	renderModalWindowPhoto(data, className) {

		const block = dom.create('div', className),
			image = dom.create('img', 'layout-options__large-image', data);

		block.append(image);
		return block;
	}
}

const roomCardsContainer = dom.get('.flats-preview__flat-cards');

const roomCards = new RoomOptions(roomCardsContainer, flatsData);

// end options script

function isValideNumber(data) {
	const rule = '^([\+]+)*[0-9\x20\x28\x29\-]{5,20}$';
	return !!(data.match(rule));
}

// start Quiz

class QuizRender {
	constructor() {}

	renderAnswer(data) { // data must be a string
		const label = dom.create('label', 'quiz__label'),
			span = dom.create('span', 'quiz__span'),
			input = dom.create('input', 'quiz__input', 
				{
					'type': 'radio',
					'name': 'quiz-answer',
					'data-value': data
				});

		span.innerText = data;
		label.append(input, span);
		return label;
	}

	renderAnswers(data) { // data must be an array
		if (dom.get('.quiz__answers-list')){  // if there is
			const div = dom.get('.quiz__answers-list');
			div.innerText = '';
			data.forEach(text => {
				div.append(this.renderAnswer(text));
			});
		}
		else { // else create
			const div = dom.create('div', 'quiz__answers-list');
			data.forEach(text => {
				div.append(this.renderAnswer(text));
			});
			return div;
		}
	}

	renderQuestion(data) { // data must be a sting
		if (dom.get('.quiz__question'))
			dom.get('.quiz__question').innerText = data;
		else {
			const h3 = dom.create('h3', 'quiz__question');
			h3.innerText = data;
			return h3;
		}
	}

	renderButtons() {
		const buttonsComponent = dom.create('div', 'quiz__buttons-wrapper'),
			leftButton = dom.create('button', 'quiz__buttons btn quiz__buttons_left'),
			rightButton = dom.create('button', 'quiz__buttons btn quiz__buttons_right');
		leftButton.innerText = 'Назад';
		rightButton.innerText = 'Далее';

		buttonsComponent.append(leftButton, rightButton);
		return buttonsComponent;
	}

	renderQuiz(data, container) {
		container.innerText = '';
		const {question, answers} = data,
		currentQuestion = this.renderQuestion(question),
			answersList = this.renderAnswers(answers),
			buttons = this.renderButtons();

		container.append(currentQuestion, answersList, buttons);
	}

	// form

	renderQuizForm(data) { // string
		const form = dom.create('form', 'quiz-form', {
				method: 'POST',
				action: 'test.php'
			});

		const formTitle = dom.create('p', 'quiz-form__subtitle'),
			formInput = this.renderFormInput(),
			buttons = this.renderFormButtons();

		formTitle.innerText = data;
		form.append(formTitle, formInput, buttons);		
		return form;
	}

	renderFormInput() { // string
		const label = dom.create('label', 'quiz-form__label'),
			input = dom.create('input', 'quiz-form__input', {
				type: 'tel',
				name: 'quiz-form-number',
				// required: ''
				placeholder: 'Введите свой телефон'
			});
		label.append(input);
		return label;
	}

	renderFormButtons() {
		const wrapper = dom.create('div', 'quiz-form__buttons-wrapper'),
			prevButton = dom.create('button', 'quiz__buttons quiz-form__prev-button  btn'),
			submit = dom.create('input', 'quiz__buttons btn quiz-form__submit-button', {
				type: 'submit',
				value: 'Отправить'
			});

		prevButton.innerText = 'Назад';
		wrapper.append(prevButton, submit);
		return wrapper;
	}

	renderQuizThanks(container) {

		container.innerText = '';

		const title = dom.create('h3', 'quiz-thanks__title'),
			text = dom.create('p', 'quiz-thanks__text');

		title.innerText = 'Спасибо, что прошли тест!';
		text.innerText = 'Мы уже начали работу и на менеджер свяжется с вами в ближайшее время';

		container.append(title, text);
	}

	// number
	renderNumber(data) {
		if (dom.get('.quiz__number'))
			dom.get('.quiz__number').innerText = data;
		else {
			const number = dom.create('span', 'quiz__number');
			number.innerText = data;
			return number;
		}
	}
}

class QuizHandler extends QuizRender{
	constructor(container){
		super();

		this.data = {
			questions: [],
			form: {},
			currentData: {},
			allData: []
		}

		this.props = {
			container: container,
			questionId: 0
		}
	}

	startHandler(button) {
		button.addEventListener('click', () => {
			this.startQuiz();
		});
	}

	setQuestions(data){
		this.data.questions = [...data];
	}

	setForm(data){
		this.data.form = {...data};
	}

	startQuiz() {
		const {container, questionId} = this.props,
			{questions} = this.data;

		super.renderQuiz(questions[questionId], container);

		this.dataHandler();
		this.changeQuestionsHandler();
		container.append(super.renderNumber(questionId + 1));
	}

	dataHandler() {
		const radioButtons = dom.getAll('.quiz__input'),
			question = dom.get('.quiz__question');

		for (let button of radioButtons) {
			button.addEventListener('change', (e) => {
				const {value} = e.target.dataset;
				this.data.currentData = {
					question: question.textContent,
					answer: value
				};
			});
		}
	}

	changeQuestionsHandler() {
		const leftButton = dom.get('.quiz__buttons_left'),
			rightButton = dom.get('.quiz__buttons_right');

		rightButton.addEventListener('click', ()=> {
			this.props.questionId++;
			if (this.props.questionId > this.data.questions.length - 1) {
				this.data.allData.push(this.data.currentData);
				this.createQuizForm();
			}
			else 
				this.nextButtonHandler();
		});
		leftButton.addEventListener('click', ()=> {
			this.props.questionId--;
			(this.props.questionId < 0) ? 
				(
					this.props.questionId = 0,
					this.data.allData.splice(0, 1)
				) : 
				this.prevButtonHandler();
		});
	}

	nextButtonHandler() {
		const {questionId} = this.props,
			{questions, allData} = this.data,
			currentQuizQuestion = questions[questionId];
		
		super.renderQuestion(currentQuizQuestion.question);
		super.renderAnswers(currentQuizQuestion.answers);
		super.renderNumber(questionId + 1);

		allData.push(this.data.currentData);
		this.dataHandler();
	}

	prevButtonHandler() {
		const {questionId} = this.props,
			{questions, allData} = this.data,
			currentQuestion = questions[questionId];
		
		super.renderQuestion(currentQuestion.question);
		super.renderAnswers(currentQuestion.answers);
		super.renderNumber(questionId + 1);

		allData.splice(allData.length - 1, 1);
		this.dataHandler();
	}

	createQuizForm() {
		const {form, questions} = this.data,
			{container} = this.props;
			
		container.innerText = '';

		container.append(super.renderQuestion(form.title))
		container.append(super.renderQuizForm(form.subtitle));
		container.append(super.renderNumber(this.props.questionId + 1));

		const submitButton = dom.get('.quiz-form__submit-button'),
			prevButton = dom.get('.quiz-form__prev-button'),
			input = dom.get('.quiz-form__input');

		prevButton.addEventListener('click', () => {
			this.props.questionId = 0;
			this.data.allData.splice(0, this.data.allData.length);
			this.startQuiz();
		});

		submitButton.addEventListener('click', (e) => {

			if (!isValideNumber(input.value)) {
				e.preventDefault();
				this.errorMessage(input);
			}
			else {
				this.sendQuizForm();
			}
		});
	}

	errorMessage(el) {

		const parentEl = el.parentNode;

		if (parentEl.contains(dom.get('.quiz__error-message'))) return;

		const message = dom.create('span', 'quiz__error-message');
		message.innerText = 'Поле обязательно для заполнения';
		parentEl.insertBefore(message, el.nextSibling);

		setTimeout(() => {
			if (dom.get('.quiz__error-message'))
				dom.get('.quiz__error-message').remove();
		}, 3000);
	}

	sendQuizForm() {
		const {container} = this.props;
		const form = dom.get('.quiz-form'),
			input = dom.get('.quiz-form__input').value,
			answersData = JSON.stringify(this.data.allData);

		form.addEventListener('submit', (e) => {
			e.preventDefault();
		});

		const request = new XMLHttpRequest();

		request.addEventListener('load', () => {
			console.log(request.response);
		});

		const url = 'quiz-form-number=' + encodeURIComponent(input) + '&quiz-form-hidden-data=' + encodeURIComponent(answersData);

		request.open('POST', 'test.php', true);
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send(url);

		setTimeout(() => {
			super.renderQuizThanks(container);
		}, 100);
	}
}

// const excursionQuizContainer = dom.get('.excursion__test'),
// 	excursionQuiz = new QuizHandler(excursionQuizContainer),
// 	excursionButtonToStart = dom.get('.start-esxursion-test')



// excursionQuiz.setQuestions(excursionQuizData.questions);
// excursionQuiz.setForm(excursionQuizData.form);
// excursionQuiz.startHandler(excursionButtonToStart);

// end Quiz

// start manage quiz

const manageQuizData = {
	questions: 
	[
		{
			id: 0,
			question: 'С какой целью вы планируете приобрести квартиру?',
			answers: [
				'Для проживания',
				'Для инвестиций',
				'Детям (на будущее)',
				'Не определился'
			]
		},
		{
			id: 1,
			question: 'Какое количество комнат вам необходимо',
			answers: [
				'1-комнатная',
				'2-комнатная',
				'3-комнатная',
				'Евро 2-комнатная',
				'Евро 3-комнатная',
				'Больше 3х комнат'
			]
		},
		{
			id: 2,
			question: 'Какая форма оплаты вам будет удобна?',
			answers: [
				'Удиновременная оплата',
				'Рассрочка',
				'Ипотека',
				'Субсидия',
				'Не определился'
			]
		},
		{
			id: 3,
			question: 'Вы хотели бы встречать рассвет или провожать закат?',
			answers: [
				'Рассвет',
				'Закат'
			]
		},
		{
			id: 4,
			question: 'Выберите тип отделки?',
			answers: [
				'Без отделки',
				'Подготовка под отделку',
				'Чистовая'
			]
		},
		{
			id: 5,
			question: 'Когда вы планируете отделку?',
			answers: [
				'В ближайшее время',
				'Через 6-8 месяцев',
				'Не раньше, чем через год',
				'Не определился',
				'Сразу, если квартира понравится'
			]
		},
		{
			id: 6,
			question: 'Какие дополнительные параметры для вас важны?',
			answers: [
				'Гардеробная или кладовая',
				'Кухня-гостиная',
				'Прачечная',
				'Широкий балкон',
				'Обеденная зона',
				'Не определился'
			]
		},
		{
			id: 7,
			question: 'Рассчитываете ли вы на определенный ценовой сегмент?',
			answers: [
				'До 6 млн. Р',
				'От 7 млн. Р до 9 млн. Р',
				'От 9 млн. Р до 11 млн. Р',
				'Не определился'
			]
		}
	],
	form: {
		id: 8,
		title: 'Отлично! Остался последний шаг!',
		subtitle: 'Укажите ваш номер телефона и мы сообщим вам результаты теста.'
	}
}

const manageQuizContainer = dom.get('.manage__test'),
	manageQuiz = new QuizHandler(manageQuizContainer),
	manageButtonToStart = dom.get('.start-manage-quiz');



manageQuiz.setQuestions(manageQuizData.questions);
manageQuiz.setForm(manageQuizData.form);
manageQuiz.startHandler(manageButtonToStart);

// end manage quiz

// start excursion quiz

const excursionQuizData =
{
	questions: 
	[
		{
			id: 0,
			question: 'Работаете ли вы официально?',
			answers: [
				'Да, работаю официально и белая зарплата',
				'Да, но большая часть зарплаты серая',
				'Работаю, но не официально',
				'Я моряк (военный)',
				'Пенсионер',
				'У меня своя компания (юридическое лицо или ИП)',
				'Не работаю'
			]
		},
		{
			id: 1,
			question: 'Как долго вы работаете на последнем месте?',
			answers: [
				'От 1 года',
				'От 1 года до 5 лет',
				'Свыше 5 лет'
			]
		},
		{
			id: 2,
			question: 'Какой первый взнос вы хотите сделать (в % от стоимости квартиры)',
			answers: [
				'От 0% до 20%',
				'От 20% до 50%',
				'От 50%'
			]
		},
		{
			id: 3,
			question: 'На какой срок вы хотели бы взять ипотеку?',
			answers: [
				'До 5 лет',
				'5 - 10 лет',
				'10 - 15 лет',
				'От 15 лет'
			]
		},
		{
			id: 4,
			question: 'Какой ежемесячный платеж был бы вам комфортен?',
			answers: [
				'До 40 000р',
				'От 40 000р до 50 000р',
				'От 50 000р'
			]
		},
	],
	form: {
		id: 5,
		title: 'Отлично! Остался последний шаг!',
		subtitle: 'Укажите ваш номер телефона и мы сообщим вам результаты теста.'
	}
};

const excursionQuizContainer = dom.get('.excursion__test'),
	excursionQuiz = new QuizHandler(excursionQuizContainer),
	excursionButtonToStart = dom.get('.start-esxursion-test')



excursionQuiz.setQuestions(excursionQuizData.questions);
excursionQuiz.setForm(excursionQuizData.form);
excursionQuiz.startHandler(excursionButtonToStart);

// end excursion quiz

// modal handler

class ModalWindow {
	constructor() {
		this.props = {
			container: '',
			target: '',
			className: ''
		}
		window.addEventListener('click', this.modalHandler());
	}

	setProps(container, target, param) {
		this.props.container = container;
		this.props.target = target;
		
		if (arguments.length > 2) {
			this.props.className = param.className;
		}
	}

	modalHandler() {

		return (e) => {
			const {target} = e,
				className = this.props.container.className.split(' ');

			if (target.className === this.props.target.className) {
				if (this.props.className)
					this.props.container.classList.toggle(this.props.className);
				else
					this.props.container.style.display = 'flex';
			}
			else if (!target.closest(`.${className[0]}`)) {
				if (!this.props.className) {
					this.props.container.style.display = 'none';
					if (target === this.props.target)
						this.props.container.style.display = 'none';
				}
			}
		}
	}
}

const headerForm = new ModalWindow();
headerForm.setProps(dom.get('.header__form'), dom.get('.header__callback'));

const conditionsForm = new ModalWindow();
conditionsForm.setProps(dom.get('.conditions__form'), dom.get('.conditions__btn'));

const getDemoForm = new ModalWindow();
getDemoForm.setProps(dom.get('.get-demo__form'), dom.get('.get-demo__button'));

const mobileMenu = new ModalWindow();
mobileMenu.setProps(dom.get('.menu'), dom.get('.mobile-menu'), {className: 'menu__open'});


// little window

const offerWindowData = [
	`Пользователь из Дубровки только что забронировал квартиру`,
	`Пользователь из Низино только что забронировал квартиру`,
	`Пользователь из Санкт-Петербурга только что забронировал квартиру`,
	`Пользователь из Санкт-Петербурга только что записался на просмотр квартиры`

];

function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
 }

function offerWindow(data, id) { // data = array
	const offer = dom.create('div', 'offer-window'),
		message = dom.create('div', 'offer-window__message'),
		image = dom.create('div', 'offer-window__image'),
		cancelButton = dom.create('div', 'offer-window__cancel-button');

	cancelButton.innerText = '×';
	message.innerText = data[id];

	offer.append(image, message, cancelButton);

	cancelButton.addEventListener('click', ()=> {
		offer.remove();
	});

	return offer;
}

window.onload = function() {
	
	setTimeout(() => {
		const randomRange = randomInteger(0, offerWindowData.length - 1);
		document.body.append(offerWindow(offerWindowData, randomRange));
	}, 30000);
 
	
	setInterval(() => {
		if (!dom.get('.offer-window')) {
			const randomRange = randomInteger(0, offerWindowData.length - 1);
			document.body.append(offerWindow(offerWindowData, randomRange));
		}
	}, 300000);
};