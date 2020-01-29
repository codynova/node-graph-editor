import { Emitter } from 'node-graph-engine';
import { DefaultEditorEvents } from '../events';
import { Drag } from './drag';
import { Zoom, ZoomSource } from './zoom';

export type MouseData = { x: number, y: number };
export type TransformData = { x: number, y: number, scale: number };

export class Area extends Emitter<DefaultEditorEvents> {
	container: HTMLElement;
	element: HTMLElement;
	transform: TransformData = { x: 0, y: 0, scale: 1 };
	mouse: MouseData = { x: 0, y: 0 };
	private startPosition: TransformData | null = null;
	private drag: Drag;
	private zoom: Zoom;
	
	constructor (container: HTMLElement, emitter: Emitter<DefaultEditorEvents>) {
		super(emitter);

		this.container = container;
		this.element = document.createElement('div');
		this.element.style.transformOrigin = '0 0';
		this.zoom = new Zoom(container, this.element, 0.1, this.onZoom.bind(this));
		this.drag = new Drag(container, this.onTranslate.bind(this), this.onStart.bind(this));
	
		emitter.on('destroy', () => {
			this.zoom.destroy();
			this.drag.destroy();
		});

		this.container.addEventListener('pointermove', this.pointermove.bind(this));
		this.update();
	}

	update () {
		this.element.style.transform = `translate(${this.transform.x}px, ${this.transform.y}px, 0px) scale(${this.transform.scale})`;
	}

	pointermove (event: PointerEvent) {
		const { clientX, clientY } = event;
		const { left, top } = this.element.getBoundingClientRect();
		const x = clientX - left;
		const y = clientY - top;
		const scale = this.transform.scale;
		this.mouse = { x: x / scale, y: y / scale };
		this.trigger('mousemove', { ...this.mouse });
	}

	onStart () {
		this.startPosition = { ...this.transform };
	}

	doTranslate (x: number, y: number) {
		const params = { transform: this.transform, x, y };

		if (!this.trigger('translate', params)) {
			return;
		}

		this.transform.x = params.x;
		this.transform.y = params.y;
		this.update();
		this.trigger('translated');
	}

	onTranslate (dx: number, dy: number) {
		if (this.zoom.isMultitouched) {
			return;
		}

		if (this.startPosition) {
			this.doTranslate(this.startPosition.x + dx, this.startPosition.y + dy);
		}
	}

	// TO DO: do the default values for ox and oy do anything at all?
	// seems they're never used...
	doZoom (zoom: number, ox = 0, oy = 0, source: ZoomSource) {
		const params = { transform: this.transform, zoom, source };

		if (!this.trigger('zoom', params)) {
			return;
		}
		
		const scale = this.transform.scale;
		const scaleFactor = (scale - params.zoom) / ((scale - zoom) || 1);
		this.transform.scale = params.zoom || 1;
		this.transform.x += ox * scaleFactor;
		this.transform.y += oy * scaleFactor;
		this.update();
		this.trigger('zoomed', { source });
	}

	onZoom (delta: number, ox: number, oy: number, source: ZoomSource) {
		this.doZoom(this.transform.scale * (1 + delta), ox, oy, source);
		
		// TO DO: does this update do anything? we're already updating in zoom()
		this.update();
	}

	appendChild (element: HTMLElement) {
		this.element.appendChild(element);
	}

	removeChild (element: HTMLElement) {
		this.element.removeChild(element);
	}
}