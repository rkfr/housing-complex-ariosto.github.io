'use strict'

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