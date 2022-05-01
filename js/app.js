const containers = document.querySelectorAll('.input-container'),
	form = document.querySelector('.main-form')

//Line
const start =
	'M0 0.999512C0 0.999512 60.5 0.999512 150 0.999512C239.5 0.999512 300 0.999512 300 0.999512' // Ровная svg линиия

const end = 'M1 0.999512C1 0.999512 61.5 7.5 151 7.5C240.5 7.5 301 0.999512 301 0.999512' // Еластично изогнутая вниз svg линия

//Elastic Effect
containers.forEach((container) => {
	const input = container.querySelector('.main-form__input'),
		line = container.querySelector('.elastic-line'),
		placeholder = container.querySelector('.main-form__placeholder')

	input.addEventListener('focus', (e) => {
		const tl = gsap.timeline({ defaults: { duration: 1 } })

		if (!input.value) {
			//Анимация изгиба линии вниз
			tl.fromTo(
				line,
				{ attr: { d: start } }, //Установка атрибута d со значением start елементу line
				{ attr: { d: end }, ease: 'Power2.easeOut', duration: 0.75 },
			)

			//Анимация возврата линии в начальное положение
			tl.to(line, { attr: { d: start }, ease: 'elastic.out(3,0.5)' }, '<70%')

			//Анимация прыжка подписи инпута
			tl.to(
				placeholder,
				{ top: -15, left: 0, scale: 0.7, duration: 0.5, ease: 'Power2.easeOut' },
				'<15%',
			)
		}
	})

	input.addEventListener('input', (e) => {
		let target = e.target
		let inputText = target.value
		const trueColor = '#6391E8',
			errorColor = '#FE8C99'

		//Name validation
		if (target.type === 'text') {
			if (inputText.length > 2) {
				colorizeInput(trueColor, line, placeholder)
			} else {
				colorizeInput(errorColor, line, placeholder)
			}
		}

		//Email validation
		if (target.type === 'email') {
			if (validateEmail(inputText)) {
				colorizeInput(trueColor, line, placeholder)
			} else {
				colorizeInput(errorColor, line, placeholder)
			}
		}

		//Phone validation
		if (target.type === 'tel') {
			if (validatePhone(inputText)) {
				colorizeInput(trueColor, line, placeholder)
			} else {
				colorizeInput(errorColor, line, placeholder)
			}
		}
	})
})

// Анимация ухода с инпута
form.addEventListener('click', () => {
	containers.forEach((container) => {
		const input = container.querySelector('.main-form__input'),
			line = container.querySelector('.elastic-line'),
			placeholder = container.querySelector('.main-form__placeholder')

		if (document.activeElement !== input) {
			if (!input.value) {
				gsap.to(placeholder, { top: 0, left: 0, scale: 1, duration: 0.5, ease: 'Power2.easeOut' })
			}
		}
	})
})

//Animate Checkbox
const checkbox = document.querySelector('.checkbox'),
	tl2 = gsap.timeline({ defaults: { duration: 0.5, ease: 'Power2.easeOut' } }),
	tickMarkPath = document.querySelector('.tick-mark path'),
	pathLength = tickMarkPath.getTotalLength()

gsap.set(tickMarkPath, { strokeDashoffset: pathLength, strokeDasharray: pathLength })

checkbox.addEventListener('click', () => {
	checkbox.classList.toggle('checked')
	if (checkbox.classList.contains('checked')) {
		tl2.to('.checkbox-fill', { top: '0%' })
		tl2.fromTo(tickMarkPath, { strokeDashoffset: pathLength }, { strokeDashoffset: 0 }, '<70%')
		tl2.to('.checkbox-label', { color: '#6391E8 ' }, '<')
	} else {
		tl2.to('.checkbox-fill', { top: '100%' })
		tl2.fromTo(tickMarkPath, { strokeDashoffset: 0 }, { strokeDashoffset: pathLength }, '<50%')
		tl2.to('.checkbox-label', { color: '#c5c5c5' }, '<')
	}
})

//Animate Character
gsap.set('#eye', { transformOrigin: 'center ' })
gsap.fromTo(
	'#eye',
	{ scaleY: 1 },
	{ scaleY: 0.3, repeat: -1, yoyo: true, repeatDelay: 0.5, ease: 'Power2.easeOut' },
)
gsap.fromTo(
	'#eyebrow',
	{ y: 0 },
	{ y: 0.7, repeat: -1, yoyo: true, repeatDelay: 0.5, ease: 'Power2.easeOut' },
)

//Animate Submiting
const subBtn = document.querySelector('.main-form__btn'),
	tl3 = gsap.timeline({ defaults: { duration: 0.75, ease: 'Power2.easeOut' } })

subBtn.addEventListener('click', (e) => {
	e.preventDefault()
	tl3.to('.main-form__left-content, .main-form__right-content', {
		y: 30,
		opacity: 0,
		pointerEvents: 'none',
	})
	tl3.to('.main-form', { scale: 0.8 }, '<')
	tl3.fromTo('.main-form__submited', { opacity: 0, y: 30 }, { opacity: 1, y: 0 })
	//Hand wave
	gsap.set('#hand', { transformOrigin: 'bottom left' })
	gsap
		.timeline({ repeat: -1, repeatDelay: 2.5, delay: 1 })
		.fromTo(
			'#hand',
			{ rotation: 0, y: 0 },
			{
				rotation: -20,
				y: -10,
				ease: 'Power2.easeOut',
				duration: 0.4,
				repeat: 1,
				yoyo: true,
				repeatDelay: 0.2,
			},
		)
		.fromTo(
			'#hand',
			{ rotation: 0, y: 0 },
			{
				rotation: -20,
				y: -10,
				ease: 'Power2.easeOut',
				duration: 0.4,
				repeat: 1,
				yoyo: true,
				repeatDelay: 0.2,
			},
		)
})

/**
 * Функция валидации email
 * @param {*} email - email
 * @returns - true or false
 */
function validateEmail(email) {
	let re = /\S+@\S+\.\S+/
	return re.test(email)
}

/**
 * Функция валидации phone
 * @param {*} phone - phone
 * @returns - true or false
 */
function validatePhone(phone) {
	let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
	return re.test(phone)
}

function colorizeInput(color, line, placeholder) {
	gsap.to(line, { stroke: color, duration: 0.75 })
	gsap.to(placeholder, { color: color, duration: 0.75 })
}
