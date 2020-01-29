import { listener } from './listener';

const ZOOM_SCROLL_SCALE_FACTOR = 1 / 120;
const ZOOM_EVENT_SCALE_FACTOR = 1 / 3;
const ZOOM_TOUCH_SCALE_FACTOR = 0.5;

export type ZoomFunction = (delta: number, ox: number, oy: number, type: 'touch' | 'wheel' | 'doubleclick') => void;

export type ZoomTouch = { cx: number, cy: number, distance: number };

export class Zoom {
	element: HTMLElement;
	intensity: number;
	onZoom: ZoomFunction;
	previous: ZoomTouch | null = null;
	pointers = new Map<number, PointerEvent>();
	destroy: () => void;

	constructor (container: HTMLElement, element: HTMLElement, intensity: number, onZoom: ZoomFunction) {
		this.element = element;
		this.intensity = intensity;
		this.onZoom = onZoom;

		container.addEventListener('wheel', this.wheel.bind(this));
		container.addEventListener('pointerdown', this.down.bind(this));
		container.addEventListener('doubleclick', this.doubleclick.bind(this));

		const cleanup = [
			listener('pointermove', this.move.bind(this)),
			listener('pointerup', this.end.bind(this)),
			listener('pointercancel', this.end.bind(this))
		];

		this.destroy = () => cleanup.forEach(callback => callback());
	}

	get isMultitouched () {
		return this.pointers.size >= 2;
	}

	wheel (event: WheelEvent) {
		event.preventDefault();
		const { clientX, clientY } = event;
		const { left, top } = this.element.getBoundingClientRect();
		// TO DO: see if you can simplify by removing wheelDelta
		const wheelDelta = (event as any).wheelDelta as number;
		const delta = (wheelDelta ? wheelDelta * ZOOM_SCROLL_SCALE_FACTOR : - event.deltaY * ZOOM_EVENT_SCALE_FACTOR) * this.intensity;
		const ox = (left - clientX) * delta;
		const oy = (top - clientY) * delta;
		this.onZoom(delta, ox, oy, 'wheel');
	}

	touches (): ZoomTouch {
		const [ { clientX: x1, clientY: y1 }, { clientX: x2, clientY: y2 } ] = this.pointers.values();
		const deltaX = x1 - x2;
		const deltaY = y1 - y2;
		const distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));

		return {
			cx: (x1 + x2) * ZOOM_TOUCH_SCALE_FACTOR,
			cy: (y1 + y2) * ZOOM_TOUCH_SCALE_FACTOR,
			distance,
		};
	}

	down (event: PointerEvent) {
		this.pointers.set(event.pointerId, event);
	}

	move (event: PointerEvent) {
		for (const key of this.pointers.keys()) {
			const pointer = this.pointers.get(key)!;

			if (pointer.pointerId === event.pointerId) {
				this.pointers.set(key, event);
			}
		}

		if (!this.isMultitouched) {
			return;
		}

		const { left, top } = this.element.getBoundingClientRect();
		const touches = this.touches();
		const { cx, cy, distance } = touches;

		if (this.previous !== null) {
			const delta = distance / this.previous.distance - 1;
			const ox = ((left - cx) * delta) - (this.previous.cx - cx);
			const oy = ((top - cy) * delta) - (this.previous.cy - cy);
			this.onZoom(delta, ox, oy, 'touch');
		}

		this.previous = touches;
	}

	end (event: PointerEvent) {
		this.previous = null;
		this.pointers.delete(event.pointerId);
	}

	doubleclick (event: MouseEvent) {
		event.preventDefault();
		const { clientX, clientY } = event;
		const { left, top } = this.element.getBoundingClientRect();
		const delta = 4 * this.intensity;
		const ox = (left - clientX) * delta;
		const oy = (top - clientY) * delta;
		this.onZoom(delta, ox, oy, 'doubleclick');
	}
}