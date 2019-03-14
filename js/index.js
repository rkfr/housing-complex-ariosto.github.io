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
			checkedFlatId: 3
		}

		this.renderCards();
		this.changeCardsHandler();
	}

	renderCards() {
		const {container, data, checkedFlatId} = this.props,
			currentCardsList = data[checkedFlatId].flatData;

		container.innerText = '';

		currentCardsList.forEach(cardData => {
			container.append(this.renderCard(cardData));
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
			this.renderCards();
		});
	}
}

const roomCardsContainer = $.get('.flats-preview__flat-cards');

const roomCards = new RoomOptions(roomCardsContainer, flatsData);

// end options script