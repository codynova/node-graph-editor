import { listener } from './listener';

export class Drag {
	element: HTMLElement;
	pointerStart: Map<0 | 1, number> | null = null;
	destroy: () => void;
	private onTranslate: (x: number, y: number, event: PointerEvent) => void;
	private onStart: (event: PointerEvent) => void;
	private onDrag: (event: PointerEvent) => void;

	constructor (
		element: HTMLElement,
		onTranslate = (x: number, y: number, event: PointerEvent) => {},
		onStart = (event: PointerEvent) => {},
		onDrag = (event: PointerEvent) => {},
	) {
		this.element = element;
		this.onTranslate = onTranslate;
		this.onStart = onStart;
		this.onDrag = onDrag;
		this.element.style.touchAction = 'none';
		this.element.addEventListener('pointerdown', this.down.bind(this));

		const cleanup = [
			listener('pointermove', this.move.bind(this)),
			listener('pointerup', this.up.bind(this)),
		];

		this.destroy = () => cleanup.forEach(callback => callback());
	}

	down (event: PointerEvent) {
		if (event.pointerType === 'mouse' && event.button !== 0) {
			return;
		}

		event.stopPropagation();
		this.pointerStart = new Map([[ 0, event.pageX ], [ 1, event.pageY ]]);
		this.onStart(event);
	}

	move (event: PointerEvent) {
		if (!this.pointerStart) {
			return;
		}

		event.preventDefault();
		const deltaX = event.pageX - this.pointerStart.get(0)!;
		const deltaY = event.pageY - this.pointerStart.get(1)!;
		const scale = this.element.getBoundingClientRect().width / this.element.offsetWidth;
		const zoomX = deltaX / scale;
		const zoomY = deltaY / scale
		this.onTranslate(zoomX, zoomY, event);
	}

	up (event: PointerEvent) {
		if (!this.pointerStart) {
			return;
		}

		this.pointerStart = null;
		this.onDrag(event);
	}
}