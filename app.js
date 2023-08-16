const CLASS_PREFIX = 'spotlight-adhd';
const STARTING_OPACITY = 10;	// 0 - 16

class Spotlight {

	constructor () {
		this._onMouseDown = this.onMouseDown.bind(this);
		this._onMouseUp = this.onMouseUp.bind(this);
		this._onMouseMove = this.onMouseMove.bind(this);
		this._onKeyDown = this.onKeyDown.bind(this);

		this.div = document.querySelector('.' + CLASS_PREFIX);
		if (this.div) this.remove();
		else this.create();
	}


	create () {
		this.position = { startX: 0, startY: 0 };
		this.opacity = STARTING_OPACITY;
		this.div = document.createElement('DIV');
		this.div.className = CLASS_PREFIX;
		this.div.innerHTML = `<div tabindex="0" class="${CLASS_PREFIX}-inner"></div>`;
		document.body.appendChild(this.div);
		const inner = this.div.querySelector(`.${CLASS_PREFIX}-inner`);
		inner.addEventListener('mousedown', this._onMouseDown);
		inner.addEventListener('keydown', this._onKeyDown);
		inner.focus();
	}


	remove () {
		this.div.remove();
		this.div = null;
		document.documentElement.classList.remove(CLASS_PREFIX + '-dragging');
	}


	onKeyDown (e) {
		const evtKeys = ['Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '=', '-'];
		if (!evtKeys.includes(e.key)) return;

		e.stopPropagation();
		e.preventDefault();

		if (e.key === 'Escape') return this.remove();
		if (e.key === '=') return this.darken();
		if (e.key === '-') return this.lighten();

		if (e.key.startsWith('Arrow')) {
			const dir = e.key.replace('Arrow', '').toLowerCase();
			if (e.altKey) return this.resize(dir, e.shiftKey);
			return this.nudge(dir, e.shiftKey);
		}
	}

	darken () {
		this.opacity = Math.min(16, this.opacity + 1);
		this.div.style.boxShadow = '0 0 0 10000px #000' + this.opacity.toString(16);
	}

	lighten () {
		this.opacity = Math.max(0, this.opacity - 1);
		this.div.style.boxShadow = '0 0 0 10000px #000' + this.opacity.toString(16);
	}


	resize (where, fine) {
		const distance = fine ? 1 : 10;
		console.log('resize', where, fine, distance);
		const divBox = this.div.getBoundingClientRect();
		if (where === 'left') this.div.style.width = (divBox.width - distance) + 'px';
		else if (where === 'right') this.div.style.width = (divBox.width + distance) + 'px';
		else if (where === 'up') this.div.style.height = (divBox.height - distance) + 'px';
		else if (where === 'down') this.div.style.height = (divBox.height + distance) + 'px';
	}


	nudge (where, fine) {
		const distance = fine ? 1 : 10;
		const divBox = this.div.getBoundingClientRect();
		if (where === 'left') this.div.style.left = (divBox.left - distance) + 'px';
		else if (where === 'right') this.div.style.left = (divBox.left + distance) + 'px';
		else if (where === 'up') this.div.style.top = (divBox.top - distance) + 'px';
		else if (where === 'down') this.div.style.top = (divBox.top + distance) + 'px';
	}


	onMouseDown (e) {
		const divBox = this.div.getBoundingClientRect();
		this.position.startX = e.clientX - divBox.left;
		this.position.startY = e.clientY - divBox.top;

		document.addEventListener('mousemove', this._onMouseMove);
		document.addEventListener('mouseup', this._onMouseUp);
		document.documentElement.classList.add(CLASS_PREFIX + '-dragging');
	}


	onMouseMove (e) {
		this.div.style.left = (e.clientX - this.position.startX) + 'px';
		this.div.style.top = (e.clientY - this.position.startY) + 'px';
	}


	onMouseUp () {
		document.documentElement.classList.remove(CLASS_PREFIX + '-dragging');
		document.removeEventListener('mousemove', this._onMouseMove);
		document.removeEventListener('mouseup', this._onMouseUp);
	}

}


chrome.runtime.onMessage.addListener((message) => {
	if (message.action === 'toggle') new Spotlight();
});

'bye';	// this is for chrome to feel happy and not throw up errors :-)
