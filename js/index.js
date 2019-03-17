'use strict'

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
		src: `img/street.jpg`
	},
	{
		id: 1,
		alt: `street2`,
		src: `https://gdevkievezhithorosho.com/wp-content/uploads/2018/10/ZhK-Campus-vizualizacija.jpg`
	}, 
	{
		id: 2,
		alt: `none`,
		src: `https://cdn.spbguru.ru/uploads/flats/886/kvartry-v-zhk-oblaka-na-lesnoj-1519123363.6997_.jpg`
	},
	{
		id: 3,
		alt: 'zhk-4',
		src: `https://img.avaho.ru/rsz/upload/objects_photo/915681_c834fddbb0ef64199d19e3e1305caa8d.[w-850_h-550_strict-1_q-75].jpg`
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
				image.style.transform = 'translateY(-20px)';
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
const destinationDate = '6.04.2019'; // time will be set at 00:00:00

const manageTimer = function(destDate){

	let destinationDate = destDate.split('.');
	destinationDate = new Date(+destinationDate[2], +destinationDate[1] - 1, +destinationDate[0]);

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

	setInterval(() => {
		const {
				secondsToshow: sec,
				minutesToshow: min,
				hoursToshow: hour,
				daysToshow: day
			} = manageTimer(destinationDate);
		
		dd.innerText = (day < 10) ? `0${day}` : day;
		hh.innerText = (hour < 10) ? `0${hour}` : hour;
		mm.innerText = (min < 10) ? `0${min}` : min;
		ss.innerText = (sec < 10) ? `0${sec}` : sec;
	}, 1000)
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
					alt: 'flat',
					src: 'https://hiphousegirl.files.wordpress.com/2010/02/lr-1-chaise-1.jpg'
				},
				title: 'С сауной',
				subtitle: 'от 40 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'flat',
					src: 'https://hiphousegirl.files.wordpress.com/2010/02/lr-1-chaise-1.jpg'
				},
				title: '2 санузла',
				subtitle: 'от 40 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'flat',
					src: 'https://hiphousegirl.files.wordpress.com/2010/02/lr-1-chaise-1.jpg'
				},
				title: 'С Терасой',
				subtitle: 'от 40 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'flat',
					src: 'https://hiphousegirl.files.wordpress.com/2010/02/lr-1-chaise-1.jpg'
				},
				title: 'Кабинет',
				subtitle: 'от 40 м<sup>2</sup>'
			}
		]
	},
	{
		flatId: 1,
		flatData: [
			{
				image: {
					alt: 'flat',
					src: 'http://warmvalleylodgewy.com/wp-content/uploads/Two-Bedroom-Floor-Plan-Master-800.png'
				},
				title: 'С сауной 2-room',
				subtitle: 'от 40 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'flat',
					src: 'http://warmvalleylodgewy.com/wp-content/uploads/Two-Bedroom-Floor-Plan-Master-800.png'
				},
				title: '2 санузла 2-room',
				subtitle: 'от 40 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'flat',
					src: 'http://warmvalleylodgewy.com/wp-content/uploads/Two-Bedroom-Floor-Plan-Master-800.png'
				},
				title: 'С Терасой 2-room',
				subtitle: 'от 40 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'flat',
					src: 'http://warmvalleylodgewy.com/wp-content/uploads/Two-Bedroom-Floor-Plan-Master-800.png'
				},
				title: 'Кабинет 2-room',
				subtitle: 'от 40 м<sup>2</sup>'
			}
		]
	},
	{
		flatId: 2,
		flatData: [
			{
				image: {
					alt: 'flat',
					src: 'https://jacksonsquareliving.com/wp-content/uploads/2015/06/Jackson-Square-Floor-Plan-A-800-705x705.jpg'
				},
				title: 'С сауной 2-room-euro',
				subtitle: 'от 40 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'flat',
					src: 'https://jacksonsquareliving.com/wp-content/uploads/2015/06/Jackson-Square-Floor-Plan-A-800-705x705.jpg'
				},
				title: '2 санузла 2-room-euro',
				subtitle: 'от 40 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'flat',
					src: 'https://jacksonsquareliving.com/wp-content/uploads/2015/06/Jackson-Square-Floor-Plan-A-800-705x705.jpg'
				},
				title: 'С Терасой 2-room-euro',
				subtitle: 'от 40 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'flat',
					src: 'https://jacksonsquareliving.com/wp-content/uploads/2015/06/Jackson-Square-Floor-Plan-A-800-705x705.jpg'
				},
				title: 'Кабинет 2-room-euro',
				subtitle: 'от 40 м<sup>2</sup>'
			}
		]
	},
	{
		flatId: 3,
		flatData: [
			{
				image: {
					alt: 'flat',
					src: 'img/room-example.jpg'
				},
				title: 'С сауной 3-room',
				subtitle: 'от 40 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'flat',
					src: 'img/room-example.jpg'
				},
				title: '2 санузла 3-room',
				subtitle: 'от 40 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'flat',
					src: 'img/room-example.jpg'
				},
				title: 'С Терасой 3-room',
				subtitle: 'от 40 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'flat',
					src: 'img/room-example.jpg'
				},
				title: 'Кабинет 3-room',
				subtitle: 'от 40 м<sup>2</sup>'
			}
		]
	},
	{
		flatId: 4,
		flatData: [
			{
				image: {
					alt: 'flat',
					src: 'http://www.ktimatoemporiki.gr/new/properties_images/cat_28/NP-306/plans/NP-306_6.4Plan.jpg'
				},
				title: 'С сауной 3-room euro',
				subtitle: 'от 40 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'flat',
					src: 'http://www.ktimatoemporiki.gr/new/properties_images/cat_28/NP-306/plans/NP-306_6.4Plan.jpg'
				},
				title: '2 санузла 3-room euro',
				subtitle: 'от 40 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'flat',
					src: 'http://www.ktimatoemporiki.gr/new/properties_images/cat_28/NP-306/plans/NP-306_6.4Plan.jpg'
				},
				title: 'С Терасой 3-room euro',
				subtitle: 'от 40 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'flat',
					src: 'http://www.ktimatoemporiki.gr/new/properties_images/cat_28/NP-306/plans/NP-306_6.4Plan.jpg'
				},
				title: 'Кабинет 3-room euro',
				subtitle: 'от 40 м<sup>2</sup>'
			}
		]
	},
	{
		flatId: 5,
		flatData: [
			{
				image: {
					alt: 'flat',
					src: 'https://i.pinimg.com/originals/97/73/ae/9773aeb849b1fdaae6f8578a87b5cd81.jpg'
				},
				title: 'С сауной studio',
				subtitle: 'от 40 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'flat',
					src: 'https://i.pinimg.com/originals/97/73/ae/9773aeb849b1fdaae6f8578a87b5cd81.jpg'
				},
				title: '2 санузла studio',
				subtitle: 'от 40 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'flat',
					src: 'https://i.pinimg.com/originals/97/73/ae/9773aeb849b1fdaae6f8578a87b5cd81.jpg'
				},
				title: 'С Терасой studio',
				subtitle: 'от 40 м<sup>2</sup>'
			},
			{
				image: {
					alt: 'flat',
					src: 'https://i.pinimg.com/originals/97/73/ae/9773aeb849b1fdaae6f8578a87b5cd81.jpg'
				},
				title: 'Кабинет studio',
				subtitle: 'от 40 м<sup>2</sup>'
			}
		]
	}
];

const $ = new ElementsConstructor();

class RoomOptions {
	constructor(container, data) {
		this.props = {
			data: [...data],
			container: container,
			checkedFlatId: 3,
			currentCard: 3,
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

		const cardContainer = $.create('div', 'flat-cards__card-wrapper'), 
			leftButton = $.create('button', 'options__arr options__arr_left'),
			rightButton = $.create('button', 'options__arr options__arr_right');
	
		cardContainer.append(this.renderCard(currentCard));
		container.append(leftButton, cardContainer, rightButton);
		this.cardChangehandler(currentCardsList);
	}

	cardChangehandler(data) {
		const container = $.get('.flat-cards__card').parentNode,
			left = $.get('.options__arr_left'),
			right = $.get('.options__arr_right');
		
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
		const card = $.create('div', 'flat-cards__card'),
			cardImage = $.create('img', 'flat-cards__image', data.image),
			title = $.create('h3', 'flat-cards__title'),
			subtitle = $.create('p', 'flat-cards__info'),
			form = $.create('form', 'flat-cards__form js-form',
				{
					'data-id': 'popupResult',
					'action': 'success.php'
				}),
			label = $.create('label'),
			input = $.create('input', 'flat-cards__get-number', 
				{
					'type': 'text',
					'name': 'name',
					'placeholder': 'Введите номер',
					'required': true
				}),
			button = $.create('button', 'flat-cards__button btn', {'data-submit': ''});

		title.innerText = data.title;
		subtitle.innerHTML = data.subtitle;
		button.innerText = 'Узнать подробнее';

		label.append(input);
		form.append(label);
		card.append(cardImage, title, subtitle, form, button);

		return card;
	}

	changeCardsHandler() {
		const buttons = $.getAll('.flats-preview__item'),
			buttonsContainer = $.get('.flats-preview__list');

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
}

const roomCardsContainer = $.get('.flats-preview__flat-cards');

const roomCards = new RoomOptions(roomCardsContainer, flatsData);

// end options script

// start Quiz

class Quiz {
	constructor(container, data) {
		this.props = {
			form: {...data.form},
			questions: [...data.questions],
			container: container,
			result: [],
			currentAnswer: '',
			currentQuestionId: 0
		}
	}

	startQuiz(startButton) {
		startButton.addEventListener('click', () => {
			this.renderQuiz();
		});
	}

	formateResult() {
		const {result} = this.props;
		let formated = '';

		result.forEach(str => {
			for (let data in str) {
				formated += `${data} ${str[data]} <br>`;
			}
		});
		return formated;
	}

	renderQuiz() {
		const {questions, container, currentQuestionId: id} = this.props,
			currentQuestionCard = questions[id],
			{answers} = currentQuestionCard;

		$.setStyle(container, {
			'padding': '500px 84px 90px 130px',
			'position': 'relative'
		});

		const title = $.create('h3', 'quiz__question'),
			answersWrapper = $.create('div', 'quiz__answers'),
			buttons = $.create('div', 'quiz__buttons'),
			nextButton = $.create('button', 'quiz__button quiz__buttom_next btn'),
			prevButton = $.create('button', 'quiz__button quiz__buttom_prev btn'),
			questionNumber = $.create('span', 'quiz__question-number');

		answers.forEach(answer => {
			answersWrapper.append(this.renderAnswer(answer));
		});

		questionNumber.innerText = id + 1;

		title.innerText = currentQuestionCard.question;
		nextButton.innerText = 'Далее';
		prevButton.innerText = 'Назад';

		container.innerText = '';
		buttons.append(prevButton, nextButton)
		container.append(title, answersWrapper, buttons, questionNumber);

		this.setCheckedByDefault();
		this.quizHandler();
	}

	setCheckedByDefault() {
		$.get('.quiz__answer-input').setAttribute('checked', true);
	}

	renderAnswer(data) {
		const input = $.create('input', 'quiz__answer-input', {
			'type': 'radio',
			'value': data,
			'name': 'quiz-answer'
		}),
		wrapper = $.create('label', 'quiz__answer');

		wrapper.innerText = data;
		wrapper.append(input);
		return wrapper;
	}

	quizHandler() {
		const {questions, result} = this.props,
			nextButton = $.get('.quiz__buttom_next'),
			prevButton = $.get('.quiz__buttom_prev'),
			currentQuestion = $.get('.quiz__question').innerText;

		this.checkAnswerHandler();

		prevButton.addEventListener('click', () => {
			this.props.currentQuestionId -= 1;
			if (this.props.currentQuestionId < 0)
				this.props.currentQuestionId = 0;
			this.renderQuiz();
			result.splice(result.length - 1, 1);
			console.log(this.props.result);
		});

		nextButton.addEventListener('click', () => {
			this.props.currentQuestionId += 1;
			if (this.props.currentQuestionId > questions.length - 1) {
				this.renderForm();
				result.push({[currentQuestion]: this.props.currentAnswer});
				return;
			}
			this.renderQuiz();
			result.push({[currentQuestion]: this.props.currentAnswer});
			console.log(this.props.result);
		});

	}

	checkAnswerHandler() {

		const answers = $.getAll('.quiz__answer-input');

		for (let answer of answers) {
			answer.addEventListener('change', e => {
				const {value} = e.target;
				this.props.currentAnswer = value;
			});
		}
	}

	renderForm() {
		const {form, container} = this.props,
			title = $.get('.quiz__question'),
			body = $.get('.quiz__answers'),
			button = $.get('.quiz__buttom_next');

		title.innerText = form.title;
		button.innerText = 'Отправить';
		body.innerText = '';

		const subtitle = $.create('p', 'quiz__form--form__subtitle'),
			formToSend = $.create('form', 'quiz__form--form js-form', {
				mhetod: 'POST',
				action: 'success.php',
				'data-id': 'popupResult'
			}),
			label = $.create('label', 'quiz__form--form__label'),
			input = $.create('input', 'quiz__form--form__input', {
				type: 'text',
				name: 'quiz-form-number',
				placeholder: 'Введите свой телефон'
			}),
			hiddenLabel = $.create('label', 'quiz__form--form__label_hidden'),
			hiddenInput = $.create('input', 'quiz__form--form__input_hidden', {
				type: 'text',
				name: 'quiz-form-number_hidden'
			});

		$.setStyle(title, {
			marginBottom: '16px'
		});

		container.insertBefore(subtitle, body);
		subtitle.innerText = form.subtitle;
		hiddenInput.value = this.formateResult();
		hiddenLabel.append(hiddenInput);
		label.append(input);
		formToSend.append(label, hiddenLabel);
		body.append(formToSend);

		const quizNumber = $.get('.quiz__question-number');
		quizNumber.innerText = +quizNumber.innerText + 1;
		
		setTimeout(() => {
			this.renderThanks();
		}, 500)
		
	}

	renderThanks() {
		const {container} = this.props,
			title = $.create('h3', 'quiz__thanks--thanks__title'),
			subtitle = $.create('p', 'quiz__thanks--thanks__subtitle'),
			button = $.get('.quiz__buttom_next');

		(button && button.addEventListener('click', () => {
			title.innerText = 'Спасибо, что прошли тест!'
			subtitle.innerText = 'Мы уже начали работу и наш менеджер свяжется с вами в ближайшее время';
			container.innerText = '';
			container.append(title, subtitle);
		}));	
	}
}

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

const manageQuizContainer = $.get('.manage__test'),
	manageQuiz = new Quiz(manageQuizContainer, manageQuizData);
manageQuiz.startQuiz($.get('.start-manage-quiz'));

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

const excursionQuizContainer = $.get('.excursion__test'),
	excursionQuiz = new Quiz(excursionQuizContainer, excursionQuizData);
excursionQuiz.startQuiz($.get('.start-esxursion-test'));

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
			e.preventDefault();
			const {target} = e,
				className = this.props.container.className.split(' ');

			if (target.className === this.props.target.className) {
				if (this.props.className)
					this.props.container.classList.toggle(this.props.className);
				else
					this.props.container.style.display = 'flex';
			}
			else if (!target.closest(`.${className[0]}`)) {
				this.props.container.style.display = 'none';
				if (target === this.props.target)
					this.props.container.style.display = 'none';
			}
		}
	}
}

const headerForm = new ModalWindow();
headerForm.setProps($.get('.header__form'), $.get('.header__btn'));

const conditionsForm = new ModalWindow();
conditionsForm.setProps($.get('.conditions__form'), $.get('.conditions__btn'));

const mobileMenu = new ModalWindow();
mobileMenu.setProps($.get('.menu'), $.get('.mobile-menu'), {className: 'menu__open'});