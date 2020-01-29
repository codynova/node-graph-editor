import { Emitter, Node, Component, IO, Control } from 'node-graph-engine';
import { DefaultEditorEvents } from '../events';
import { SocketView } from './socket';
import { ControlView } from './control';
import { Drag } from './drag';
import { EditorError } from '../errors';

export class NodeView extends Emitter<DefaultEditorEvents> {
	node: Node;
	component: Component;
	sockets = new Map<IO, SocketView>();
	controls = new Map<Control, ControlView>();
	element: HTMLElement;
	private startPosition: [number, number];
	private drag: Drag;

	constructor (node: Node, component: Component, emitter: Emitter<DefaultEditorEvents>) {
		super(emitter);
		
		this.node = node;
		this.component = component;		
		this.element = document.createElement('div');
		this.element.style.position = 'absolute';
		this.element.addEventListener('contextmenu', event => this.trigger('contextmenu', { event, node: this.node }));
		this.drag = new Drag(this.element, this.onTranslate.bind(this), this.onSelect.bind(this), () => this.trigger('nodedragged', node));

		this.trigger('rendernode', {
			element: this.element,
			node,
			component: component.data,
			bindSocket: this.bindSocket.bind(this),
			bindControl: this.bindControl.bind(this),
		});

		this.update();
	}

	update () {
		this.element.style.transform = `translate(${this.node.position[0]}px, ${this.node.position[1]}px, 0px)`;
	}

	clearSockets () {
		// TO DO: try to improve this...
		const nodeIOs: IO[] = [ ...this.node.inputs.values(), ...this.node.outputs.values() ];
		this.sockets.forEach(socket => !nodeIOs.includes(socket.io) && this.sockets.delete(socket.io));
	}

	bindSocket (element: HTMLElement, type: 'input' | 'output', io: IO) {
		this.clearSockets();
		this.sockets.set(io, new SocketView(element, type, io, this.node, this));
	}

	bindControl (element: HTMLElement, control: Control) {
		this.controls.set(control, new ControlView(element, control, this));
	}

	getSocketPosition (io: IO) {
		const socket = this.sockets.get(io);

		if (!socket) {
			throw new Error(EditorError.SocketNotFound + `${io.name}, ${io.key}`);
		}

		return socket.getPosition(this.node);
	}

	onStart () {
		this.startPosition = this.node.position.slice() as [number, number];
	}

	onSelect (event: MouseEvent) {
		const payload = { node: this.node, accumulate: event.ctrlKey, event };
		this.onStart();
		this.trigger('multiselectnode', payload);
		this.trigger('selectnode', payload);
	}

	onTranslate (dx: number, dy: number) {
		this.trigger('translatenode', { node: this.node, dx, dy });
	}

	translate (x: number, y: number) {
		const params = { node: this.node, x, y };

		if (!this.trigger('nodetranslate', params)) {
			return;
		}

		const prev = this.node.position;
		this.node.position[0] = params.x;
		this.node.position[1] = params.y;
		this.update();
		this.trigger('nodetranslated', { node: this.node, prev });
	}

	onDrag (dx: number, dy: number) {
		const x = this.startPosition[0] + dx;
		const y = this.startPosition[1] + dy;
		this.translate(x, y);
	}

	remove () {}

	destroy () {
		this.drag.destroy();
	}
}